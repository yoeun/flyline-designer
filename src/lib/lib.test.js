import { describe, expect, it } from 'vitest';
import { DEMO_RACK } from '../data/demoRack.js';
import {
  DEFAULT_SETUP,
  LEGACY_PRESET_IDS,
  LINE_COLORS,
  LINE_PRESETS,
  LINE_TYPES,
  MAKER_LINE_COLORS,
  REELS,
  REEL_COLORS,
  REEL_MODELS,
  findById,
  lineColorway,
  lineMenu,
  lineSwatches,
  menuId,
  presetForLine,
  makerGroups,
  nearestSize,
  productSizes,
  switchLine,
  reelAccent,
  reelColors,
  reelTrim,
  reelMenu,
  reelSizeLabel,
  reelSizes,
  switchReelModel,
  withReelModel,
} from '../data/catalog.js';
import { makerProduct, zones } from '../data/lines/product.js';
import BEFORE_PRODUCTS from './fixtures/presets-before-products.json';
import { rackConflicts, backingContrast, conflictsFor } from './checks.js';
import { deltaE } from './color.js';
import { ARBOR_RATIO, backingYardsForFill, lineDiameters, reelArbor, spoolLayout, totalLength, zoneRanges } from './geometry.js';
import { FRAMES, SIDES, frameArbor, frameMarkup } from './reelFrames.js';
import { decodeSetup, encodeSetup, queryToState, stateToQuery } from './share.js';
import { parseTheme, resolveTheme } from './theme.js';
import {
  clampSelection,
  editorScale,
  handleHalfWidths,
  formatFeet,
  moveTaperBoundary,
  moveZoneBoundary,
  removeZone,
  setTaperLength,
  setZoneLength,
  snap,
  splitZone,
  zoneName,
} from './lineEdit.js';
import { STYLES, changedSections, copyOf, displayName, isDirty, loadEntries, normalizeEntry } from './rack.js';
import { filterRack, landingPage, matchesSearch, rackWeights, resolveView } from './rackView.js';

const setup = (patch = {}) => ({ ...structuredClone(DEFAULT_SETUP), ...patch });

describe('geometry', () => {
  it('last zone takes the rest of the line', () => {
    const zones = zoneRanges(DEFAULT_SETUP.line);
    expect(zones.map((z) => z.length)).toEqual([20, 17, 53]);
    expect(zones.at(-1).end).toBe(totalLength(DEFAULT_SETUP.line));
  });

  it('finds the backing that fills the spool to a given share', () => {
    const yards = backingYardsForFill(DEFAULT_SETUP, 0.85);
    const at = (y) => spoolLayout({ ...DEFAULT_SETUP, backing: { ...DEFAULT_SETUP.backing, yards: y } }).fill;
    expect(yards % 10).toBe(0);
    expect(at(yards)).toBeLessThanOrEqual(0.85);
    expect(at(yards + 10)).toBeGreaterThan(0.85);
  });

  it('rings grow outward from the arbor with no gaps', () => {
    const { rings, arborR } = spoolLayout(DEFAULT_SETUP);
    expect(rings[0].inner).toBe(arborR);
    for (let i = 1; i < rings.length; i++) expect(rings[i].inner).toBeCloseTo(rings[i - 1].outer, 10);
    expect(rings[0].kind).toBe('backing');
    expect(rings.at(-1).color).toBe('chartreuse'); // the tip is the outermost layer
  });

  it('a WF5 with 100 yd of 20 lb backing fits a 5–6 wt reel', () => {
    const layout = spoolLayout(DEFAULT_SETUP);
    expect(layout.fits).toBe(true);
    expect(layout.fill).toBeGreaterThan(0.75);
    expect(layout.fill).toBeLessThan(0.95);
  });

  it('doubling backing does not double the ring width, and 250 yd overflows', () => {
    const w100 = spoolLayout(DEFAULT_SETUP).rings[0];
    const w200 = spoolLayout(setup({ backing: { ...DEFAULT_SETUP.backing, yards: 200 } })).rings[0];
    expect(w200.outer - w200.inner).toBeLessThan(2 * (w100.outer - w100.inner));
    expect(spoolLayout(setup({ backing: { ...DEFAULT_SETUP.backing, yards: 250 } })).fits).toBe(false);
  });

  it('30 lb backing takes more room than 20 lb', () => {
    const b30 = spoolLayout(setup({ backing: { ...DEFAULT_SETUP.backing, pounds: 30 } }));
    expect(b30.fill).toBeGreaterThan(spoolLayout(DEFAULT_SETUP).fill);
  });
});

describe('arbor size', () => {
  const generic = (id) => findById(LINE_PRESETS, id).line;
  const reel = { rim: 3.6, spool: 3.36, width: 0.78 };

  it('uses the reel arbor when given', () => {
    expect(reelArbor({ ...reel, arbor: 1.95 })).toBe(1.95);
  });

  it('solves the arbor so the rated capacity fills the spool exactly', () => {
    const rated = { weight: 5, yards: 100, pounds: 20 };
    const arbor = reelArbor({ ...reel, rated });
    expect(arbor).toBeGreaterThan(1.5);
    expect(arbor).toBeLessThan(2.5);
    // More rated backing means a smaller arbor.
    expect(reelArbor({ ...reel, rated: { ...rated, yards: 150 } })).toBeLessThan(arbor);
  });

  it('falls back to a fixed ratio of the spool', () => {
    expect(reelArbor(reel)).toBeCloseTo(3.36 * ARBOR_RATIO, 10);
  });

  it.each(REELS.filter((r) => r.rated).map((r) => [r.id, r]))('%s holds its rated capacity at 100%% fill', (_, reel) => {
    const line = { ...generic('generic-wf5f'), weight: reel.rated.weight };
    const { fill } = spoolLayout(setup({ reel: { model: reel.id, color: 'silver' }, line, backing: { yards: reel.rated.yards, pounds: reel.rated.pounds, color: 'blue' } }));
    expect(fill).toBeCloseTo(1, 6);
  });

  it('never solves to an implausibly small arbor', () => {
    expect(reelArbor({ ...reel, rated: { weight: 5, yards: 1000, pounds: 30 } })).toBeCloseTo(3.36 * 0.3, 10);
  });
});

describe('generic line presets', () => {
  const generic = (id) => findById(LINE_PRESETS, id).line;

  it('sink tip has a sinking head on a floating running line', () => {
    const tip = lineDiameters(generic('generic-wf8-sinktip'));
    const floating = lineDiameters({ ...generic('generic-wf8-sinktip'), type: 'floating' });
    expect(tip.body).toBeCloseTo(floating.body * 0.82, 10);
    expect(tip.running).toBeCloseTo(floating.running, 10);
  });

  it('sink head on intermediate has a sinking head on an intermediate running line', () => {
    const line = generic('generic-wf8-sinktip');
    const head = lineDiameters({ ...line, type: 'sinkhead-int' });
    const sinking = lineDiameters({ ...line, type: 'sink5' });
    const intermediate = lineDiameters({ ...line, type: 'intermediate' });
    expect(head.tip).toBeCloseTo(sinking.tip, 10);
    expect(head.body).toBeCloseTo(sinking.body, 10);
    expect(head.running).toBeCloseTo(intermediate.running, 10);
  });

  it('hover draws between floating and intermediate, head and running line alike', () => {
    const line = generic('generic-wf5f');
    const [floating, hover, intermediate] = ['floating', 'hover', 'intermediate'].map((type) => lineDiameters({ ...line, type }));
    for (const part of ['tip', 'body', 'running']) {
      expect(hover[part]).toBeCloseTo(floating[part] * 0.95, 10);
      expect(hover[part]).toBeLessThan(floating[part]);
      expect(hover[part]).toBeGreaterThan(intermediate[part]);
    }
  });

  it.each([
    ['generic-wf5f', 'g56', 90],
    ['generic-wf7i', 'g78', 90],
    ['generic-wf8-sinktip', 'g78', 100],
  ])('%s is %i ft and fits a %s reel with 100 yd of backing', (id, model, length) => {
    const line = generic(id);
    expect(totalLength(line)).toBe(length);
    expect(spoolLayout(setup({ reel: { model, color: 'silver' }, line })).fits).toBe(true);
  });
});

describe('real line presets', () => {
  const real = LINE_PRESETS.filter((p) => p.maker);
  const known = (id) => [...LINE_COLORS, ...MAKER_LINE_COLORS].some((c) => c.id === id);

  it.each([
    ['rio-premier-gold-wf5f', 47, 90],
    ['rio-premier-gold-wf8f', 50, 90],
    ['rio-premier-aqualux-wf8i', 30, 100],
    ['rio-technical-euro-nymph-2-5', 1.5, 94],
    ['rio-premier-fathom-wf8s7', 35, 105],
    ['sa-amplitude-smooth-infinity-wf6f', 50, 90],
    ['sa-amplitude-bass-bug-wf8f', 43, 90],
    ['sa-sonar-stillwater-clear-camo-wf6i', 45, 100],
    ['sa-frequency-full-sink-wf6s3', 36, 85],
    ['sa-frequency-sink-tip-wf6', 45, 85],
    ['sa-sonar-titan-intermediate-wf8i', 33.5, 105],
    ['sa-sonar-sink-25-cold-250-s6', 25, 105],
    ['sa-mastery-euro-tactical-nymph-mono-level', 1.5, 80],
    ['airflo-ridge-universal-taper-wf5f', 39, 90],
    ['airflo-streamer-max-short-wf8-s7', 27, 100],
    ['airflo-sixth-sense-wf7-di5', 46, 105],
    ['airflo-stillwater-intermediate-wf6', 46, 105],
    ['cortland-444-peach-wf5f', 32, 90],
    ['cortland-streamer-sink-tip-15-wf7', 31, 100],
  ])('%s has a %s ft head on a %i ft line', (id, head, length) => {
    const { taper } = findById(LINE_PRESETS, id).line;
    expect(taper.front + taper.body + taper.back).toBe(head);
    expect(totalLength(findById(LINE_PRESETS, id).line)).toBe(length);
  });

  it.each(real.map((p) => [p.id, p]))('%s starts in its first colorway, in known colors that fit the line', (_, preset) => {
    expect(preset.line.zones).toEqual(preset.colorways[0].zones);
    expect(lineColorway(preset, preset.line)).toBe(preset.colorways[0]);
    for (const cw of preset.colorways) {
      expect(cw.zones.every((z) => known(z.color))).toBe(true);
      expect(cw.zones.at(-1).length).toBe(0);
      expect(cw.zones.reduce((sum, z) => sum + z.length, 0)).toBeLessThan(totalLength(preset.line));
    }
    expect(new Set(preset.colorways.map((cw) => cw.id)).size).toBe(preset.colorways.length);
  });

  it('generic presets use only the base palette and have no colorways', () => {
    for (const p of LINE_PRESETS.filter((x) => !x.maker)) {
      expect(p.colorways).toBeUndefined();
      expect(p.line.zones.every((z) => LINE_COLORS.some((c) => c.id === z.color))).toBe(true);
    }
  });

  it('every maker color is used by some preset', () => {
    const used = new Set(real.flatMap((p) => p.colorways.flatMap((cw) => cw.zones.map((z) => z.color))));
    expect(MAKER_LINE_COLORS.filter((c) => !used.has(c.id))).toEqual([]);
  });

  it('covers floating, intermediate, sinking and sink tip lines', () => {
    expect(new Set(real.map((p) => p.line.type))).toEqual(new Set(LINE_TYPES.map((t) => t.id)));
  });

  it('a recolored line no longer matches a colorway', () => {
    const preset = findById(LINE_PRESETS, 'rio-premier-gold-wf5f');
    const line = { ...preset.line, zones: preset.line.zones.map((z) => ({ ...z, color: 'orange' })) };
    expect(lineColorway(preset, line)).toBeUndefined();
    expect(lineColorway(preset, { ...preset.line, zones: preset.colorways[1].zones })).toBe(preset.colorways[1]);
  });

  it('swatches add the maker colors a line uses to the base palette', () => {
    const { line } = findById(LINE_PRESETS, 'rio-premier-gold-wf5f');
    expect(lineSwatches(line).map((c) => c.id)).toEqual([...LINE_COLORS.map((c) => c.id), 'rio-moss', 'rio-gold']);
    expect(lineSwatches(findById(LINE_PRESETS, 'generic-wf5f').line)).toEqual(LINE_COLORS);
  });
});

describe('color checks', () => {
  it('identical colors have zero distance', () => {
    expect(deltaE('#ee8728', '#ee8728')).toBe(0);
  });

  it('flags backing that matches the running line', () => {
    expect(backingContrast(setup({ backing: { ...DEFAULT_SETUP.backing, color: 'orange' } })).similar).toBe(true);
    expect(backingContrast(DEFAULT_SETUP).similar).toBe(false);
  });

  it('flags look-alike backing only across different line types', () => {
    const floating = { ...setup(), id: 'a', name: 'A', backing: { ...DEFAULT_SETUP.backing, color: 'blue' } };
    const sinking = { ...setup(), id: 'b', name: 'B', line: { ...DEFAULT_SETUP.line, type: 'sink5' }, backing: { ...DEFAULT_SETUP.backing, color: 'blue' } };
    const floating2 = { ...floating, id: 'c', name: 'C' };
    expect(rackConflicts([floating, sinking]).some((c) => c.ids.length === 2)).toBe(true);
    expect(rackConflicts([floating, floating2]).some((c) => c.ids.length === 2)).toBe(false);
  });
});

describe('share links', () => {
  it('round-trips a setup', () => {
    expect(decodeSetup(encodeSetup(DEFAULT_SETUP))).toEqual(DEFAULT_SETUP);
  });

  it('rejects garbage', () => {
    expect(decodeSetup('not-a-setup')).toBeNull();
  });
});

describe('url state', () => {
  const state = (over = {}) => ({ setup: structuredClone(DEFAULT_SETUP), presetId: LINE_PRESETS[0].id, side: 'drag', mode: 'reel', ...over });
  const roundTrip = (s) => {
    const { editingId, page, demo, hasSetup, ...rest } = queryToState(stateToQuery(s));
    return rest;
  };

  it('round-trips the default design', () => {
    expect(roundTrip(state())).toEqual(state());
  });

  it('writes catalog picks as readable params', () => {
    const q = new URLSearchParams(stateToQuery(state({ side: 'spool', mode: 'see-through' })));
    expect(q.get('reel')).toBe('g56');
    expect(q.get('line')).toBe(LINE_PRESETS[0].id);
    expect(q.get('side')).toBe('spool');
    expect(q.get('view')).toBe('see-through');
    expect(q.has('l')).toBe(false);
    expect(q.has('title')).toBe(false);
    expect(q.has('styles')).toBe(false);
    expect(q.has('notes')).toBe(false);
  });

  it('round-trips a preset in a non-default colorway', () => {
    const preset = LINE_PRESETS.find((p) => p.colorways?.length > 1);
    const s = state({ presetId: preset.id });
    s.setup.line = { ...structuredClone(preset.line), zones: structuredClone(preset.colorways[1].zones) };
    expect(new URLSearchParams(stateToQuery(s)).get('colorway')).toBe(preset.colorways[1].id);
    expect(roundTrip(s)).toEqual(s);
  });

  it('round-trips a custom line, reel, name and backing', () => {
    const s = state({ presetId: 'custom', side: 'spool', mode: 'line-only' });
    s.setup.title = 'My trout line';
    s.setup.reel = { model: 'lamson-liquid-s-5', color: 'day-break' };
    s.setup.line.zones[0] = { length: 12, color: 'red' };
    s.setup.backing = { yards: 150, pounds: 30, color: 'white' };
    expect(roundTrip(s)).toEqual(s);
  });

  it('keeps a title on a preset line', () => {
    const s = state();
    s.setup.title = 'Renamed';
    expect(roundTrip(s)).toEqual(s);
  });

  it('falls back to defaults for unknown values', () => {
    const { editingId, page, demo, hasSetup, ...r } = queryToState('reel=nope&line=nope&side=up&view=x&yards=-7&lb=1&backing=plaid&l=garbage');
    expect(r).toEqual(state());
  });

  it('falls back to a reel color the model comes in', () => {
    expect(queryToState('reel=lamson-liquid-s-5&color=silver').setup.reel.color).toBe('smoke');
  });

  it('still loads old hash links', () => {
    const { title, styles, notes, ...rest } = structuredClone(DEFAULT_SETUP);
    const loaded = queryToState('', `#${encodeSetup({ ...rest, name: 'Old link' })}`);
    expect(loaded.setup).toEqual({ ...rest, title: 'Old link', styles: [], notes: '' });
    expect(loaded.setup).not.toHaveProperty('name');
    expect(loaded.presetId).toBe('custom');
  });
});

describe('url state: details, edit marker, pages', () => {
  const setup = (over = {}) => ({ ...structuredClone(DEFAULT_SETUP), ...over });
  const args = (over = {}) => ({ setup: setup(), presetId: LINE_PRESETS[0].id, side: 'drag', mode: 'reel', ...over });

  it('round-trips title, styles and notes', () => {
    const s = setup({ title: 'Spring creek', styles: ['nymph', 'dry'], notes: 'Line one\nLine two & more' });
    const back = queryToState(`?${stateToQuery({ setup: s, presetId: 'custom', side: 'drag', mode: 'reel' })}`).setup;
    expect(back).toMatchObject({ title: 'Spring creek', styles: ['dry', 'nymph'], notes: 'Line one\nLine two & more' });
  });
  it('keeps the editing marker in the app url', () => {
    const a = args({ editingId: 'abc', demo: true });
    expect(queryToState(`?${stateToQuery(a)}`)).toMatchObject({ editingId: 'abc', demo: true, page: 'designer' });
  });
  it('rack page url has no setup params', () => {
    const q = new URLSearchParams(stateToQuery(args({ page: 'rack' })));
    expect(q.get('page')).toBe('rack');
    expect(q.has('reel')).toBe(false);
    expect(queryToState(`?${q}`)).toMatchObject({ page: 'rack', hasSetup: false });
  });
  it('no params leaves the page to landing', () => {
    expect(queryToState('')).toMatchObject({ page: null, hasSetup: false, editingId: null, demo: false });
    expect(queryToState('?demo=1')).toMatchObject({ page: null, demo: true });
  });
  it('an old name param becomes the title', () => {
    const custom = setup({ line: { ...structuredClone(DEFAULT_SETUP.line), zones: [{ length: 90, color: 'red' }] } });
    const q = new URLSearchParams(stateToQuery({ setup: custom, presetId: 'custom', side: 'drag', mode: 'reel' }));
    q.set('name', 'Creek');
    expect(queryToState(`?${q}`).setup.title).toBe('Creek');
    q.set('name', 'Generic WF5 Floating Two-Tone');
    expect(queryToState(`?${q}`).setup.title).toBe('');
  });
});

describe('theme', () => {
  it('system follows the OS setting', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('an explicit choice overrides the OS setting', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('unknown or missing stored values fall back to system', () => {
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme(null)).toBe('system');
    expect(parseTheme('sepia')).toBe('system');
  });
});

describe('line editing', () => {
  // Generic WF5 Floating Two-Tone: taper 4 / 28.5 / 4.5 / 53 = 90 ft; zones chartreuse 20, green 17, orange rest.
  const line = () => structuredClone(DEFAULT_SETUP.line);
  const lengths = (l) => zoneRanges(l).map((z) => z.length);

  it('formats feet with inches', () => {
    expect(formatFeet(90)).toBe('90′');
    expect(formatFeet(4.5)).toBe('4′6″');
    expect(formatFeet(28.25)).toBe('28′3″');
  });

  it('snaps to half feet', () => {
    expect(snap(6.2)).toBe(6);
    expect(snap(6.3)).toBe(6.5);
  });

  it('names zones from the tip back', () => {
    expect([0, 1, 2].map((i) => zoneName(i, 3))).toEqual(['Tip', 'Zone 2', 'Rest']);
    expect(zoneName(0, 1)).toBe('Whole line');
  });

  it('keeps a selection that fits the line', () => {
    expect(clampSelection(null, line())).toBe(null);
    expect(clampSelection({ kind: 'taper', key: 'nope' }, line())).toBe(null);
    expect(clampSelection({ kind: 'zone', index: 7 }, line())).toEqual({ kind: 'zone', index: 2 });
    expect(clampSelection({ kind: 'taper', key: 'body' }, line())).toEqual({ kind: 'taper', key: 'body' });
  });

  it('dragging a taper boundary trades length between neighbors', () => {
    const l = moveTaperBoundary(line(), 1, 6.2);
    expect(l.taper).toEqual({ front: 6, body: 26.5, back: 4.5, running: 53 });
    expect(totalLength(l)).toBe(90);
    const back = moveTaperBoundary(line(), 3, 40);
    expect(back.taper.back).toBe(7.5);
    expect(back.taper.running).toBe(50);
  });

  it('a zone boundary drag leaves the line alone when zones outrun the line', () => {
    const l = line();
    l.taper = { front: 4, body: 3, back: 2, running: 1 };
    const moved = moveZoneBoundary(l, 1, 5);
    expect(moved).toEqual(l);
    expect(moved.zones.every((z) => z.length >= 0)).toBe(true);
  });

  it('a taper boundary cannot squeeze a section below half a foot', () => {
    expect(moveTaperBoundary(line(), 1, -5).taper.front).toBe(0.5);
    const far = moveTaperBoundary(line(), 1, 100);
    expect(far.taper.body).toBe(0.5);
    expect(far.taper.front).toBe(32);
  });

  it('dragging a zone boundary trades length with the next zone', () => {
    expect(lengths(moveZoneBoundary(line(), 0, 25))).toEqual([25, 12, 53]);
    expect(lengths(moveZoneBoundary(line(), 0, 0))).toEqual([0.5, 36.5, 53]);
  });

  it('the zone before the rest changes alone; the rest takes what is left', () => {
    expect(lengths(moveZoneBoundary(line(), 1, 50))).toEqual([20, 30, 40]);
    expect(lengths(moveZoneBoundary(line(), 1, 500))).toEqual([20, 69.5, 0.5]);
  });

  it('typing a length changes only that piece', () => {
    const l = setTaperLength(line(), 'body', 30);
    expect(l.taper.body).toBe(30);
    expect(totalLength(l)).toBe(91.5);
    expect(setTaperLength(line(), 'front', -3).taper.front).toBe(0.5);
    expect(lengths(setZoneLength(line(), 0, 25))).toEqual([25, 17, 48]);
    expect(setZoneLength(line(), 2, 10)).toEqual(line());
  });

  it('split cuts a zone in half and keeps its color', () => {
    const tip = splitZone(line(), 0);
    expect(lengths(tip)).toEqual([10, 10, 17, 53]);
    expect(tip.zones.map((z) => z.color)).toEqual(['chartreuse', 'chartreuse', 'green', 'orange']);
    expect(lengths(splitZone(line(), 2))).toEqual([20, 17, 26.5, 26.5]);
  });

  it('remove gives the zone to the next one toward the rest', () => {
    const tip = removeZone(line(), 0);
    expect(lengths(tip)).toEqual([37, 53]);
    expect(tip.zones[0].color).toBe('green');
    const rest = removeZone(line(), 2);
    expect(lengths(rest)).toEqual([20, 70]);
    expect(rest.zones.at(-1).color).toBe('green');
    const single = { ...line(), zones: [{ length: 0, color: 'green' }] };
    expect(removeZone(single, 0)).toEqual(single);
  });

  it('editor scale keeps short tapers clickable and still spans the width', () => {
    const s = editorScale(line(), 480, 28);
    expect(s.edges[0].x0).toBe(480);
    expect(s.edges[3].x1).toBeCloseTo(0, 6);
    expect(s.edges[0].x0 - s.edges[0].x1).toBe(28); // front taper is 21 px at true scale
    for (const ft of [0, 2, 4, 20, 37, 60, 90]) expect(s.ft(s.x(ft))).toBeCloseTo(ft, 6);
  });

  it('editor scale is proportional when every section is wide enough', () => {
    const even = { ...line(), taper: { front: 30, body: 30, back: 30, running: 30 } };
    const s = editorScale(even, 400, 28);
    expect(s.x(30)).toBe(300);
    expect(s.x(120)).toBe(0);
  });
});

describe('catalog', () => {
  it('groups line presets by maker, generic last, keeping every preset once', () => {
    const groups = makerGroups(LINE_PRESETS, 'Generic');
    expect(groups.map(([label]) => label)).toEqual(['Airflo', 'Cortland', 'Orvis', 'RIO', 'Royal Wulff', 'Scientific Anglers', 'Generic']);
    expect(groups.flatMap(([, presets]) => presets.map((p) => p.id)).sort()).toEqual(LINE_PRESETS.map((p) => p.id).sort());
  });

  it.each(REELS.map((r) => [r.id, r]))('%s offers only known colors', (_, reel) => {
    for (const c of reelColors(reel)) expect(REEL_COLORS).toContain(c);
  });

  it('keeps the reel color when the new model comes in it, otherwise takes its first', () => {
    const reel = { model: 'redington-behemoth-56', color: 'gunmetal' };
    expect(withReelModel(reel, 'redington-behemoth-78').color).toBe('gunmetal');
    expect(withReelModel(reel, 'redington-run-56').color).toBe('black');
    expect(withReelModel({ model: 'g56', color: 'silver' }, 'lamson-liquid-s-5').color).toBe('smoke');
  });

  it('groups reels by maker, generic last', () => {
    const groups = makerGroups(REELS, 'Generic');
    const makers = [...new Set(REELS.map((r) => r.maker).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    expect(groups.map(([label]) => label)).toEqual([...makers, 'Generic']);
    expect(groups.flatMap(([, reels]) => reels.map((r) => r.id)).sort()).toEqual(REELS.map((r) => r.id).sort());
  });

  it('keeps a finish accent from the reel files', () => {
    expect(findById(REEL_COLORS, 'lamson-ember').accent).toBe('#e2581f');
    expect(findById(REEL_COLORS, 'lamson-battleship').accent).toBeUndefined();
  });

  it('takes a model accent over the finish accent', () => {
    const clearwater = findById(REELS, 'orvis-clearwater-3');
    expect(reelAccent(clearwater, 'dark-pine')).toBe('#b4a984');
    expect(reelAccent(findById(REELS, 'lamson-speedster-s-5'), 'lamson-ember')).toBe('#e2581f');
    expect(reelAccent(findById(REELS, 'g56'), 'black')).toBeNull();
  });

  it('gives a model a trim color only for the finishes it lists', () => {
    const evo = findById(REELS, 'ross-evolution-r-56');
    expect(reelTrim(evo, 'ross-matte-olive')).toBe('#222426');
    expect(reelTrim(evo, 'black')).toBeNull();
    expect(reelAccent(evo, 'black')).toBeNull();
  });

  it('defines each reel color once, across maker files', () => {
    expect(new Set(REEL_COLORS.map((c) => c.id)).size).toBe(REEL_COLORS.length);
  });

  it('gives every reel size a unique id and sizes each model small to large', () => {
    expect(new Set(REELS.map((r) => r.id)).size).toBe(REELS.length);
    expect(new Set(REEL_MODELS.map((m) => m.id)).size).toBe(REEL_MODELS.length);
    for (const m of REEL_MODELS) {
      const rims = reelSizes(m.id).map((s) => s.rim);
      expect(rims).toEqual([...rims].sort((a, b) => a - b));
    }
  });

  it.each(REELS.map((r) => [r.id, r]))('%s has a size label, weights and diameters', (_, reel) => {
    expect(reel.size).toBeTruthy();
    expect(reel.weights[0]).toBeLessThanOrEqual(reel.weights[1]);
    expect(reel.rim).toBeGreaterThan(reel.spool);
    expect(reel.width).toBeGreaterThan(0);
  });

  it('names a size after its model unless it gives its own name', () => {
    expect(findById(REELS, 'lamson-liquid-s-5').name).toBe('Lamson Liquid S -5+');
    expect(findById(REELS, 'orvis-hydros-2026-3').name).toBe('Orvis Hydros III (2026)');
    expect(findById(REELS, 'g56').name).toBe('Generic 5–6 wt');
  });

  it('labels a size by its weights first, then the maker label when it differs', () => {
    expect(reelSizeLabel(findById(REELS, 'lamson-liquid-s-7'))).toBe('6/7/8 wt (-7+)');
    expect(reelSizeLabel(findById(REELS, 'orvis-hydros-3'))).toBe('5/6/7 wt (III)');
    expect(reelSizeLabel(findById(REELS, 'redington-behemoth-78'))).toBe('7/8 wt');
    expect(reelSizeLabel(findById(REELS, 'g34'))).toBe('3/4 wt');
  });

  it('switches model to the size that suits the line weight', () => {
    expect(switchReelModel({ model: 'g56', color: 'silver' }, 'lamson-liquid-s', 8)).toEqual({ model: 'lamson-liquid-s-7', color: 'smoke' });
    expect(switchReelModel({ model: 'g34', color: 'black' }, 'redington-behemoth', 5).model).toBe('redington-behemoth-45');
  });

  it('switches model to the nearest size when none suits the line weight', () => {
    // Run tops out at 7/8; a 9 wt on a 4.4" reel lands on the largest.
    expect(switchReelModel({ model: 'g910', color: 'black' }, 'redington-run', 9).model).toBe('redington-run-78');
    // Liquid S -3+ (3.35") is nearest a 3.2" reel for a 2 wt.
    expect(switchReelModel({ model: 'g34', color: 'black' }, 'lamson-liquid-s', 2).model).toBe('lamson-liquid-s-3');
  });

  it('lists discontinued reel models last, labelled', () => {
    const menu = reelMenu([{ id: 'a', name: 'A', discontinued: true }, { id: 'b', name: 'B' }]);
    expect(menu.map((m) => [m.id, m.name])).toEqual([['b', 'B'], ['a', 'A (discontinued)']]);
  });

  it('leaves the reel alone for an unknown model', () => {
    const reel = { model: 'g56', color: 'silver' };
    expect(switchReelModel(reel, 'nope', 5)).toBe(reel);
  });
});

describe('reel frames', () => {
  it.each(REELS.map((r) => [r.id, r]))('%s has a drawing for each side', (_, reel) => {
    for (const [side] of SIDES) expect(FRAMES[reel.design]?.[side]).toContain('<svg');
  });

  it('reads the radius a design draws its arbor at, if it gives one', () => {
    expect(frameArbor('liquid-s')).toBe(126);
    expect(frameArbor('behemoth')).toBeUndefined();
    expect(frameArbor('nope')).toBeUndefined();
  });

  it('inlines a frame without its outer svg and with page-unique ids', () => {
    const markup = frameMarkup('run', 'drag', 'r1');
    expect(markup).not.toMatch(/<\/?svg/);
    expect(markup).toContain('id="sheen-r1"');
    expect(markup).toContain('url(#sheen-r1)');
    expect(markup).toContain('href="#body-r1"');
    expect(markup).not.toMatch(/(id="|url\(#|href="#)(sheen|body|back|body-mask)"/);
  });

  it('falls back to the generic frame for an unknown design', () => {
    expect(frameMarkup('nope', 'spool', 'x')).toBe(frameMarkup('generic', 'spool', 'x'));
  });

  it.each(Object.keys(FRAMES))('%s spool side puts its handles in a cage that turns, apart from the foot', (design) => {
    const markup = frameMarkup(design, 'spool', 'x', { handles: true });
    const cage = markup.slice(markup.indexOf('<g data-cage="">'));
    expect(markup.indexOf('<g data-cage="">')).toBeGreaterThan(markup.indexOf('</defs>'));
    expect(cage.match(/<circle data-handle=""/g)?.length).toBeGreaterThan(0);
    expect(cage).toMatch(/<\/g>\s*$/);
  });

  it('adds handles only when asked, and only to the spool side', () => {
    expect(frameMarkup('run', 'spool', 'x')).not.toContain('data-handle=');
    expect(frameMarkup('run', 'drag', 'x', { handles: true })).not.toContain('data-handle=');
    expect(frameMarkup('run', 'spool', 'x', { handles: true }).match(/data-handle=""/g)).toHaveLength(2);
  });

  it('gives a small handle a bigger circle to click', () => {
    expect(frameMarkup('liquid-s', 'spool', 'x', { handles: true })).toMatch(/data-handle="" cx="[-\d.]+" cy="[-\d.]+" r="26"/);
    expect(frameMarkup('animas', 'spool', 'x', { handles: true })).toMatch(/data-handle="" cx="[-\d.]+" cy="[-\d.]+" r="30"/);
  });
});

describe('setup records', () => {
  it('default setup has empty details and no name', () => {
    expect(DEFAULT_SETUP).toMatchObject({ title: '', styles: [], notes: '' });
    expect(DEFAULT_SETUP).not.toHaveProperty('name');
  });
  it('old entries get empty styles and notes', () => {
    const old = { id: 'a', name: 'My creek setup', reel: DEFAULT_SETUP.reel, line: DEFAULT_SETUP.line, backing: DEFAULT_SETUP.backing };
    expect(normalizeEntry(old)).toMatchObject({ id: 'a', title: 'My creek setup', styles: [], notes: '' });
    expect(normalizeEntry(old)).not.toHaveProperty('name');
  });
  it('an old name that is just the preset or default name is dropped', () => {
    const preset = LINE_PRESETS.find((p) => p.id === 'rio-premier-gold-wf5f');
    const old = { id: 'a', name: preset.name, reel: DEFAULT_SETUP.reel, line: structuredClone(preset.line), backing: DEFAULT_SETUP.backing };
    expect(normalizeEntry(old).title).toBe('');
    expect(normalizeEntry({ ...old, name: 'Generic WF5 Floating Two-Tone' }).title).toBe('');
  });
  it('unknown styles are dropped', () => {
    expect(normalizeEntry({ ...setup(), id: 'a', styles: ['dry', 'bass'] }).styles).toEqual(['dry']);
  });
  it('drops unusable entries and survives garbage', () => {
    expect(loadEntries('nope')).toEqual([]);
    expect(loadEntries([{ id: 'x' }, { ...setup(), id: 'ok' }]).map((s) => s.id)).toEqual(['ok']);
  });
  it('display name: title, then preset name, then a custom description', () => {
    const preset = LINE_PRESETS.find((p) => p.id === 'rio-premier-gold-wf5f');
    expect(displayName(setup({ title: '  Spring creek ' }))).toBe('Spring creek');
    expect(displayName(setup({ line: structuredClone(preset.line) }))).toBe(preset.name);
    expect(displayName(setup({ line: { ...structuredClone(DEFAULT_SETUP.line), zones: [{ length: 90, color: 'red' }] } }))).toBe('Custom Floating 5 wt');
  });
});

describe('change tracking', () => {
  const base = { ...setup(), id: 'a', styles: ['dry', 'nymph'] };
  it('nothing changed', () => {
    expect(isDirty(structuredClone(base), base)).toBe(false);
  });
  it('flags only the section that changed', () => {
    expect(changedSections({ ...base, backing: { ...base.backing, color: 'red' } }, base)).toEqual({ reel: false, line: false, backing: true, details: false });
  });
  it('details: notes, title and styles; style order and title whitespace do not count', () => {
    expect(changedSections({ ...base, notes: 'x' }, base).details).toBe(true);
    expect(changedSections({ ...base, styles: ['nymph', 'dry'], title: ' ' }, base).details).toBe(false);
  });
  it('ignores the rack id', () => {
    expect(isDirty({ ...base, id: 'other' }, base)).toBe(false);
  });
});

// Maker sizes that draw exactly like an earlier one, so a saved line reads back as that one (id →
// the preset it matches). RIO's OutBound Short Int/3/5 and Int/5/7 have the same taper and colors;
// SA's Textured MPX, Textured Grand Slam, Textured Bonefish and Magnitude Textured Grand Slam Clear
// Float, and Orvis's PRO Trout Textured, are the Smooth lines' tapers and colors with a texture.
// Royal Wulff's Midstream TT Floating is the Triangle Taper Classic Float in Ivory.
// Airflo's Superflo Max Smooth Universal and Superflo Max Ridge 2.0 Power Taper are the other
// coating's tapers and colors.
// SA's Amplitude Textured Trout GP is the Smooth Trout GP's taper and colors with a texture.
// SA's Amplitude Textured Trout Expert is the Smooth Trout Expert's taper and colors with a texture.
// SA's Amplitude Textured Infinity Salt is the Smooth Infinity Salt's taper and colors with a texture;
// the Smooth Bonefish Plus is the (earlier-listed) Textured Bonefish Plus's without one.
// Cortland's 333 Salmon is sold on the 333 Trout All Purpose's chart and color.
// SA's Magnitude Smooth Balance Clear Float is the (earlier-listed) Textured Balance's taper and
// colors without a texture.
// SA's Amplitude Textured Tropical/Jungle Titan and Magnitude Textured Bonefish Plus and Trout Expert
// Clear Tip Floats, and the Magnitude Smooth Infinity Salt Clear Float, are the earlier-listed other
// coating's tapers and colors.
// SA's Magnitude Smooth Tarpon Clear Float and Textured Infinity Clear Float are the earlier-listed
// other coating's tapers and colors.
// Cortland's 50+ Heavy Sink, Pike Musky Sink 4 and Pike Musky Sink 8 each sell two sizes at 12 wt on one chart.
const LOOKALIKES = new Map([
  ...[6, 7, 8, 9, 10].map((w) => [`rio-premier-outbound-short-wf${w}-int-5-7`, `rio-premier-outbound-short-wf${w}-int-3-5`]),
  ...[3, 4, 5, 6, 7, 8].map((w) => [`sa-amplitude-textured-mpx-wf${w}f`, `sa-amplitude-smooth-mpx-wf${w}f`]),
  ...[7, 8, 9, 10, 11, 12].map((w) => [`sa-amplitude-grand-slam-wf${w}f`, `sa-amplitude-smooth-grand-slam-wf${w}f`]),
  ...[7, 8, 9].map((w) => [`sa-amplitude-bonefish-wf${w}f`, `sa-amplitude-smooth-bonefish-wf${w}f`]),
  ...[6, 7, 8, 9, 10, 11, 12].map((w) => [`sa-magnitude-textured-grand-slam-clear-float-wf${w}f`, `sa-magnitude-smooth-grand-slam-clear-tip-wf${w}f`]),
  ...[3, 4, 5, 6].map((w) => [`orvis-pro-trout-textured-wf${w}f`, `orvis-pro-trout-smooth-wf${w}f`]),
  ...[2, 3, 4, 5, 6, 7, 8, 9].map((w) => [`royal-wulff-midstream-tt-floating-wf${w}f`, `royal-wulff-triangle-taper-classic-wf${w}f`]),
  ...[3, 4, 5, 6, 7, 8].map((w) => [`airflo-superflo-max-smooth-universal-wf${w}f`, `airflo-superflo-max-ridge-universal-wf${w}f`]),
  ...[3, 4, 5, 6, 7, 8, 9].map((w) => [`airflo-superflo-max-ridge-power-wf${w}f`, `airflo-superflo-max-smooth-power-wf${w}f`]),
  ...[3, 4, 5, 6, 7, 8].map((w) => [`sa-amplitude-textured-trout-gp-wf${w}f`, `sa-amplitude-smooth-trout-gp-wf${w}f`]),
  ['cortland-50-plus-cannon-500gr', 'cortland-50-plus-cannon-450gr'],
  ...[5, 6, 7, 8].map((w) => [`cortland-streamer-sink-tip-10-t3-wf${w}`, `cortland-streamer-sink-tip-10-wf${w}`]),
  ...[2, 3, 4, 5, 6, 7].map((w) => [`sa-amplitude-textured-trout-expert-wf${w}f`, `sa-amplitude-smooth-trout-expert-wf${w}f`]),
  ...[7, 8, 9].map((w) => [`sa-amplitude-smooth-bonefish-plus-wf${w}f`, `sa-amplitude-textured-bonefish-plus-wf${w}f`]),
  ...[7, 8, 9, 10, 11].map((w) => [`sa-amplitude-textured-infinity-salt-wf${w}f`, `sa-amplitude-smooth-infinity-salt-wf${w}f`]),
  ...[8, 9, 10].map((w) => [`cortland-333-salmon-wf${w}f`, `cortland-333-trout-all-purpose-wf${w}f`]),
  ...[6, 7].map((w) => [`rio-ambassador-series-phil-rowley-lake-wf${w}f`, `rio-elite-stillwater-floater-wf${w}f`]),
  ...[6, 7].map((w) => [`rio-ambassador-series-phil-rowley-lake-wf${w}i`, `rio-premier-aqualux-wf${w}i`]),
  ...[10, 11, 12].map((w) => [`sa-amplitude-textured-tarpon-wf${w}f`, `sa-amplitude-smooth-tarpon-wf${w}f`]),
  ...[3, 4, 5].map((w) => [`sa-amplitude-textured-double-taper-dt${w}f`, `sa-amplitude-smooth-double-taper-dt${w}f`]),
  ...[7, 8, 9, 10, 11, 12].map((w) => [`sa-magnitude-smooth-balance-clear-float-wf${w}f`, `sa-magnitude-textured-balance-clear-float-wf${w}f`]),
  ...[8, 9, 10].map((w) => [`sa-amplitude-tropical-titan-wf${w}f`, `sa-amplitude-smooth-tropical-jungle-titan-wf${w}f`]),
  ...[7, 8, 9, 10, 11, 12].map((w) => [`sa-magnitude-smooth-infinity-salt-clear-tip-wf${w}f`, `sa-magnitude-textured-infinity-salt-clear-tip-wf${w}f`]),
  ...[6, 7, 8, 9].map((w) => [`sa-magnitude-textured-bonefish-plus-clear-float-wf${w}f`, `sa-magnitude-smooth-bonefish-plus-clear-tip-wf${w}f`]),
  ...[4, 5, 6].map((w) => [`sa-magnitude-textured-trout-expert-clear-tip-float-wf${w}f`, `sa-magnitude-smooth-trout-expert-clear-tip-float-wf${w}f`]),
  ...[10, 11, 12].map((w) => [`sa-magnitude-smooth-tarpon-clear-tip-wf${w}f`, `sa-magnitude-textured-tarpon-clear-float-wf${w}f`]),
  ...[3, 4, 5, 6, 7, 8].map((w) => [`sa-magnitude-textured-infinity-clear-float-wf${w}f`, `sa-magnitude-smooth-infinity-clear-float-wf${w}f`]),
  ['cortland-50-plus-heavy-sink-500gr', 'cortland-50-plus-heavy-sink-450gr'],
  ['cortland-specialty-pike-musky-sink-4-wf12s4-plus', 'cortland-specialty-pike-musky-sink-4-wf12s4'],
  ['cortland-specialty-pike-musky-sink-8-wf12s8-plus', 'cortland-specialty-pike-musky-sink-8-wf12s8'],
]);

describe('presetForLine', () => {
  it('finds the preset a line was loaded from', () => {
    for (const preset of LINE_PRESETS.filter((p) => !LOOKALIKES.has(p.id))) expect(presetForLine(structuredClone(preset.line))).toBe(preset.id);
    for (const [id, twin] of LOOKALIKES) expect(presetForLine(structuredClone(findById(LINE_PRESETS, id).line))).toBe(twin);
  });

  it('finds a maker line in any of its colorways', () => {
    const preset = LINE_PRESETS.find((p) => p.colorways?.length > 1);
    const line = { ...structuredClone(preset.line), zones: structuredClone(preset.colorways.at(-1).zones) };
    expect(presetForLine(line)).toBe(preset.id);
  });

  it('calls an edited line custom', () => {
    const line = structuredClone(LINE_PRESETS[0].line);
    line.taper.front += 1;
    expect(presetForLine(line)).toBe('custom');
    expect(presetForLine({ ...structuredClone(LINE_PRESETS[0].line), weight: 9 })).toBe('custom');
  });
});

describe('rack view', () => {
  const at = (weight, model, styles = []) => ({ ...setup({ styles }), id: `${model}-${weight}-${styles}`, reel: { model, color: 'smoke' }, line: { ...structuredClone(DEFAULT_SETUP.line), weight } });
  const rack = [at(6, 'lamson-liquid-s-5', ['dry']), at(5, 'orvis-hydros-3'), at(5, 'lamson-liquid-s-5', ['nymph']), at(4, 'lamson-liquid-s-3', ['dry']), at(8, 'lamson-liquid-s-7')];
  it('lists the weights present', () => expect(rackWeights(rack)).toEqual([4, 5, 6, 8]));
  it('exact weight first, then one weight either side', () => {
    const { exact, near } = filterRack(rack, { weight: 5, style: null });
    expect(exact.map((s) => s.line.weight)).toEqual([5, 5]);
    expect(near.map((s) => s.line.weight).sort()).toEqual([4, 6]);
  });
  it('sorts identical reels together, in catalog order', () => {
    expect(filterRack(rack, { weight: 5, style: null }).exact.map((s) => s.reel.model)).toEqual(['lamson-liquid-s-5', 'orvis-hydros-3']);
  });
  it('style narrows both groups', () => {
    const { exact, near } = filterRack(rack, { weight: 5, style: 'dry' });
    expect(exact).toEqual([]);
    expect(near.map((s) => s.line.weight).sort()).toEqual([4, 6]);
  });
  it('all weights: everything in one group', () => {
    expect(filterRack(rack, { weight: null, style: null })).toMatchObject({ near: [] });
    expect(filterRack(rack, { weight: null, style: null }).exact).toHaveLength(5);
  });
  it('landing', () => {
    expect(landingPage({ page: null, hasSetup: false }, 3)).toBe('rack');
    expect(landingPage({ page: null, hasSetup: false }, 0)).toBe('designer');
    expect(landingPage({ page: 'designer', hasSetup: true }, 3)).toBe('designer');
    expect(landingPage({ page: 'rack', hasSetup: false }, 0)).toBe('rack');
  });
});

describe('copyOf', () => {
  const rack = loadEntries(DEMO_RACK);
  it('drops the id and keeps the rest', () => {
    const entry = rack.find((s) => s.id === 'demo-2');
    const copy = copyOf(entry);
    expect(copy).not.toHaveProperty('id');
    expect({ ...copy, title: entry.title }).toEqual((({ id, ...rest }) => rest)(entry));
  });
  it('titles the copy after the setup, preset name when untitled', () => {
    expect(copyOf(rack.find((s) => s.id === 'demo-10')).title).toBe('Custom (copy)');
    const untitled = rack.find((s) => s.id === 'demo-4');
    expect(copyOf(untitled).title).toBe(`${displayName(untitled)} (copy)`);
  });
  it('is a deep copy', () => {
    const entry = rack.find((s) => s.id === 'demo-4');
    copyOf(entry).line.zones[0].color = 'nope';
    expect(entry.line.zones[0].color).not.toBe('nope');
  });
});

describe('rack search', () => {
  const rack = loadEntries(DEMO_RACK);
  const ids = (query) => rack.filter((s) => matchesSearch(s, query)).map((s) => s.id);
  const byId = (id) => rack.find((s) => s.id === id);
  it('an empty query matches everything', () => {
    expect(ids('')).toHaveLength(rack.length);
    expect(ids('   ')).toHaveLength(rack.length);
  });
  it('matches the reel make and name, ignoring case', () => {
    expect(ids('LAMSON')).toEqual(expect.arrayContaining(['demo-1', 'demo-5', 'demo-9']));
    expect(ids('liquid s -7+')).toEqual(['demo-7', 'demo-8', 'demo-9']);
  });
  it('matches the line name, even under a title', () => {
    expect(ids('euro nymph')).toEqual(expect.arrayContaining(['demo-1', 'demo-3']));
    expect(matchesSearch({ ...byId('demo-4'), title: 'Home water' }, 'two-tone')).toBe(true);
  });
  it('matches title, notes and style names', () => {
    expect(ids('competition')).toEqual(['demo-2']);
    expect(ids('custom')).toContain('demo-10');
    expect(ids('streamer')).toEqual(expect.arrayContaining(['demo-7', 'demo-8', 'demo-9', 'demo-12']));
  });
  it('every word has to match', () => {
    expect(ids('liquid streamer')).toEqual(['demo-7', 'demo-8', 'demo-9']);
    expect(ids('liquid hydros')).toEqual([]);
  });
  it('a weight matches as "5", "5wt" or "5 wt", and not 15', () => {
    const fives = rack.filter((s) => s.line.weight === 5).map((s) => s.id);
    expect(ids('5 wt')).toEqual(fives);
    expect(ids('5wt')).toEqual(fives);
    expect(ids('5')).toEqual(expect.arrayContaining(fives));
    expect(matchesSearch({ ...byId('demo-4'), line: { ...byId('demo-4').line, weight: 15 } }, '5 wt')).toBe(false);
  });
  it('colors are not searched', () => expect(ids('chartreuse')).toEqual([]));
  it('filterRack applies the query alongside weight and style', () => {
    const { exact, near } = filterRack(rack, { weight: 5, style: 'dry', query: 'liquid' });
    expect(exact.map((s) => s.id).sort()).toEqual(['demo-4', 'demo-5', 'demo-6']);
    expect(near).toEqual([]);
  });
});

describe('resolveView', () => {
  const entry = { ...setup({ title: 'Trout' }), id: 'abc' };
  const rack = [entry];
  it('honors an edit marker for an entry in the rack', () => {
    const view = resolveView(queryToState(`?edit=abc&${stateToQuery({ setup: entry, presetId: 'custom', side: 'drag', mode: 'reel' })}`), rack);
    expect(view).toMatchObject({ editingId: 'abc', page: 'designer' });
    expect(view.setup.title).toBe('Trout');
  });
  it('drops a marker for an entry not in the rack', () => {
    expect(resolveView(queryToState('?edit=gone&reel=generic'), rack)).toMatchObject({ editingId: null, page: 'designer' });
    expect(resolveView(queryToState('?edit=gone'), rack)).toMatchObject({ editingId: null, page: 'rack' });
  });
  it('a marker alone loads the entry on the designer', () => {
    const view = resolveView(queryToState('?edit=abc'), rack);
    expect(view).toMatchObject({ editingId: 'abc', page: 'designer', presetId: presetForLine(entry.line) });
    expect(view.setup).not.toHaveProperty('id');
    expect(view.setup.title).toBe('Trout');
  });
  it('lands like landingPage otherwise', () => {
    expect(resolveView(queryToState('?demo=1'), rack).page).toBe('rack');
    expect(resolveView(queryToState(''), []).page).toBe('designer');
    expect(resolveView(queryToState('?page=rack'), []).page).toBe('rack');
  });
});

describe('demo rack', () => {
  it('every entry survives the URL round trip unchanged', () => {
    const entries = loadEntries(DEMO_RACK);
    for (const s of entries) {
      const { id, ...rest } = s;
      const q = stateToQuery({ setup: rest, presetId: presetForLine(s.line), side: 'drag', mode: 'reel', editingId: id });
      const view = resolveView(queryToState(`?${q}`), entries);
      expect(view.editingId, id).toBe(id);
      expect(changedSections(view.setup, s), id).toEqual({ reel: false, line: false, backing: false, details: false });
    }
  });
  it('keeps custom backing lengths and ignores nonsense', () => {
    const s = setup({ backing: { ...DEFAULT_SETUP.backing, yards: 125 } });
    const q = stateToQuery({ setup: s, presetId: 'custom', side: 'drag', mode: 'reel' });
    expect(queryToState(`?${q}`).setup.backing.yards).toBe(125);
    expect(queryToState(`?${q.replace('yards=125', 'yards=-5')}`).setup.backing.yards).toBe(DEFAULT_SETUP.backing.yards);
  });
  it('tells identical-named setups apart in conflict titles', () => {
    const a = { ...setup({ title: 'Trout' }), id: 'a', line: { ...setup().line, type: 'floating' }, backing: { ...setup().backing, color: 'orange' } };
    const b = { ...a, id: 'b', line: { ...a.line, type: 'sinking' } };
    const pair = rackConflicts([a, b]).filter((c) => c.ids.length === 2);
    expect(pair).toHaveLength(1);
    expect(pair[0].title).toMatch(/\(.*backing\).*\(.*backing\)/);
  });
  it('words conflicts per card, naming the other setup', () => {
    const a = { ...setup({ title: 'Trout' }), id: 'a', line: { ...setup().line, type: 'floating' }, backing: { ...setup().backing, color: 'orange' } };
    const b = { ...setup({ title: 'Bass' }), id: 'b', line: { ...a.line, type: 'sinking' }, backing: { ...a.backing } };
    const all = rackConflicts([a, b]).filter((c) => c.ids.length === 2);
    expect(all).toHaveLength(1);
    expect(conflictsFor('a', all, [a, b]).some((c) => c.text.includes(displayName(b)))).toBe(true);
    expect(conflictsFor('b', all, [a, b]).some((c) => c.text.includes(displayName(a)))).toBe(true);
    expect(conflictsFor('zzz', all, [a, b])).toEqual([]);
  });
  it('shows a one-setup conflict detail as is', () => {
    const s = { ...setup(), id: 's', backing: { ...setup().backing, color: 'white' } };
    s.line = { ...s.line, zones: s.line.zones.map((z) => ({ ...z, color: 'white' })) };
    const one = rackConflicts([s]).filter((c) => c.ids.length === 1);
    expect(one).toHaveLength(1);
    expect(conflictsFor('s', one, [s])).toEqual([{ text: one[0].detail }]);
  });
  it('trims whitespace-only notes in change tracking', () => {
    expect(changedSections(setup({ notes: '  ' }), setup()).details).toBe(false);
  });

  const rack = loadEntries(DEMO_RACK);
  it('every entry loads', () => expect(rack).toHaveLength(DEMO_RACK.length));
  it('nine Liquid S: three each of -3+, -5+, -7+ on 3, 5, 7 wt lines', () => {
    const ls = rack.filter((s) => s.reel.model.startsWith('lamson-liquid-s'));
    expect(ls).toHaveLength(9);
    for (const [model, wt] of [['lamson-liquid-s-3', 3], ['lamson-liquid-s-5', 5], ['lamson-liquid-s-7', 7]]) {
      expect(ls.filter((s) => s.reel.model === model && s.line.weight === wt)).toHaveLength(3);
    }
    expect(new Set(ls.map((s) => s.reel.color))).toEqual(new Set(['smoke', 'day-break']));
  });
  it('one of every other reel family, and only the 7/8 Behemoth', () => {
    const models = rack.map((s) => s.reel.model);
    for (const family of [/^g\d+$/, /^orvis-hydros-2026-\d$/, /^orvis-hydros-\d$/, /^orvis-clearwater-/, /^redington-run-/]) {
      expect(models.filter((m) => family.test(m))).toHaveLength(1);
    }
    expect(models.filter((m) => m.startsWith('redington-behemoth'))).toEqual(['redington-behemoth-78']);
  });
  it('shows every reel model at least once', () => {
    const shown = new Set(rack.map((s) => findById(REELS, s.reel.model).product));
    expect(REEL_MODELS.map((m) => m.id).filter((id) => !shown.has(id))).toEqual([]);
  });
  it('covers every style, a multi-style and a no-style entry', () => {
    for (const { id } of STYLES) expect(rack.some((s) => s.styles.includes(id))).toBe(true);
    expect(rack.some((s) => s.styles.length > 1)).toBe(true);
    expect(rack.some((s) => s.styles.length === 0)).toBe(true);
  });
  it('has a custom title, a long note and an old-format entry', () => {
    expect(rack.some((s) => s.title)).toBe(true);
    expect(rack.some((s) => s.notes.length > 300)).toBe(true);
    expect(DEMO_RACK.some((s) => 'name' in s && !('styles' in s))).toBe(true);
  });
  it('uses real presets, except exactly one line titled Custom', () => {
    const custom = rack.filter((s) => presetForLine(s.line) === 'custom');
    expect(custom).toHaveLength(1);
    expect(custom[0].title).toBe('Custom');
  });
  it('every entry fits its spool', () => {
    for (const s of rack) expect(spoolLayout(s).fits, s.id).toBe(true);
  });
  it('migrates the old-format name to a title', () => {
    const old = DEMO_RACK.find((s) => 'name' in s && !('styles' in s));
    expect(rack.find((s) => s.id === old.id).title).toBe(old.name);
  });
  it('shows both kinds of rack conflict', () => {
    const conflicts = rackConflicts(rack);
    expect(conflicts.some((c) => c.ids.length === 1)).toBe(true);
    expect(conflicts.some((c) => c.ids.length === 2)).toBe(true);
  });
});

describe('maker lines beyond RIO', () => {
  // Published head and total length per size: [product, size id, head, total].
  const PUBLISHED = [
    ...[[3, 47], [4, 48], [5, 49], [6, 50], [7, 51], [8, 52]].map(([w, h]) => ['sa-amplitude-smooth-infinity', `wf${w}f`, h, 90]),
    ...['sa-amplitude-smooth-mpx', 'sa-mastery-mpx'].flatMap((id) =>
      [[3, 32], [4, 34], [5, 36], [6, 38], [7, 40], [8, 42]].map(([w, h]) => [id, `wf${w}f`, h, 90]),
    ),
    ...[[3, 49.5], [4, 49.5], [5, 50.5], [6, 51], [7, 52], [8, 53]].map(([w, h]) => ['sa-amplitude-smooth-trout-gp', `wf${w}f`, h, 90]),
    ...[[2, 65], [3, 65], [4, 67], [5, 69], [6, 71], [7, 73]].map(([w, h]) => ['sa-amplitude-smooth-trout-expert', `wf${w}f`, h, 90]),
    ...[[2, 21.5], [3, 22], [4, 23], [5, 24], [6, 25]].map(([w, h]) => ['sa-amplitude-smooth-creek-trout', `wf${w}f`, h, 90]),
    ['sa-amplitude-smooth-trout', 'wf5f', 69, 90],
    ...[6, 7, 8].map((w) => ['sa-amplitude-bass-bug', `wf${w}f`, 43, 90]),
    ...[5, 6, 7, 8].map((w) => ['sa-sonar-stillwater-clear-camo', `wf${w}i`, 45, 100]),
    ...[[5, 34], [6, 36], [7, 36], [8, 38]].flatMap(([w, h]) => [3, 6].map((r) => ['sa-frequency-full-sink', `wf${w}s${r}`, h, 85])),
    ...[5, 6, 7, 8].map((w) => ['sa-frequency-sink-tip', `wf${w}`, 45, 85]),
    ...[6, 7, 8, 9, 10, 11, 12].map((w) => ['sa-sonar-titan-intermediate', `wf${w}i`, 33.5, 105]),
    ...['wf6-i23', 'wf6-i35', 'wf8-357', 'wf10-i23', 'wf12-357'].map((id) => ['sa-sonar-titan-3d', id, 33.5, 105]),
    ...[150, 200, 250, 300, 350].flatMap((g) => [3, 6].map((r) => ['sa-sonar-sink-25-cold', `${g}-s${r}`, 25, 105])),
    ...[[3, 37, 82], [4, 38, 90], [5, 39, 90], [6, 39, 90], [7, 40, 90], [8, 40, 90]].flatMap(([w, h, t]) => [
      ['airflo-superflo-max-ridge-universal', `wf${w}f`, h, t],
      ['airflo-ridge-universal-taper', `wf${w}f`, h, t],
    ]),
    ['airflo-ridge-universal-taper', 'wf9f', 40, 90],
    ...[[5, 22], [6, 24], [7, 24], [8, 27], [9, 27]].flatMap(([w, h]) => [3, 5, 7].map((r) => ['airflo-streamer-max-short', `wf${w}-s${r}`, h, 100])),
    ...['wf6-di3', 'wf7-di7', 'wf8-di5', 'wf9-di3'].map((id) => ['airflo-sixth-sense', id, 46, 105]),
    ...[5, 6, 7, 8].map((w) => ['airflo-stillwater-intermediate', `wf${w}`, 46, 105]),
    ...[2, 3, 4, 5, 6, 7, 8, 9].map((w) => ['cortland-444-peach', `wf${w}f`, 32, 90]),
    ...[2, 3, 4, 5, 6, 7, 8].map((w) => ['cortland-444-sylk', `wf${w}f`, 37, 90]),
    ...[4, 5, 6, 7, 8, 9, 10].map((w) => ['cortland-444-clear-camo', `wf${w}i`, 41, 90]),
    ...[4, 5, 6, 7, 8].map((w) => ['cortland-444-full-sinking-type-3', `wf${w}s3`, 32, 90]),
    ...[5, 6, 7, 8].map((w) => ['cortland-444-full-sinking-type-6', `wf${w}s6`, 32, 90]),
    ...[5, 6, 7, 8].map((w) => ['cortland-streamer-sink-tip-15', `wf${w}`, 31, 100]),
    ...[[3, 50, 90], [4, 50, 90], [5, 50.5, 90.5], [6, 52, 90], [7, 52.5, 90.5], [8, 54.5, 90.5]].map(([w, h, t]) => ['orvis-pro-trout-smooth', `wf${w}f`, h, t]),
    ...[[3, 45.5], [4, 46.5], [5, 47.5], [6, 48.5], [7, 49.5], [8, 50.5]].map(([w, h]) => ['orvis-hydros-trout', `wf${w}f`, h, 90]),
    ...[2, 3, 4, 5, 6, 7, 8, 9].map((w) => ['royal-wulff-triangle-taper-classic', `wf${w}f`, w <= 5 ? 36 : 40, 90]),
  ];

  it.each(PUBLISHED)('%s %s has the published %s ft head on a %i ft line', (product, size, head, total) => {
    const preset = findById(LINE_PRESETS, `${product}-${size}`);
    expect(preset.product).toBe(product);
    const { taper } = preset.line;
    expect(taper.front + taper.body + taper.back).toBe(head);
    expect(totalLength(preset.line)).toBe(total);
  });

  it('the size each diagram is drawn for is not estimated; scaled sizes are', () => {
    const estimated = (id) => findById(LINE_PRESETS, id).estimated;
    expect(estimated('sa-amplitude-smooth-mpx-wf5f')).toBe(false);
    expect(estimated('sa-amplitude-smooth-mpx-wf8f')).toBe(true);
    expect(estimated('sa-amplitude-smooth-infinity-wf6f')).toBe(false);
    expect(estimated('sa-amplitude-smooth-infinity-wf5f')).toBe(true);
    expect(estimated('airflo-superflo-max-ridge-universal-wf5f')).toBe(false);
    expect(estimated('airflo-superflo-max-ridge-universal-wf7f')).toBe(true);
    // Maker tables per size, or one chart whose head every size shares.
    for (const product of ['orvis-pro-trout-smooth', 'orvis-hydros-trout', 'royal-wulff-triangle-taper-classic', 'cortland-444-clear-camo', 'sa-sonar-titan-3d']) {
      expect(productSizes(product).every((p) => !p.estimated), product).toBe(true);
    }
  });

  it('marks the lines makers no longer sell as discontinued', () => {
    const discontinued = new Set(LINE_PRESETS.filter((p) => p.discontinued).map((p) => p.product));
    for (const id of ['sa-amplitude-smooth-trout', 'airflo-ridge-universal-taper']) expect(discontinued).toContain(id);
    for (const id of ['sa-amplitude-bass-bug', 'sa-amplitude-smooth-trout-gp', 'airflo-superflo-max-ridge-universal']) expect(discontinued).not.toContain(id);
  });

  it('Mastery Competition Nymph links load Mastery Euro Tactical Nymph Mono', () => {
    for (const old of ['sa-mastery-competition-nymph', 'sa-mastery-competition-nymph-level']) {
      expect(queryToState(`?line=${old}`).presetId).toBe('sa-mastery-euro-tactical-nymph-mono-level');
    }
    expect(findById(LINE_PRESETS, 'sa-mastery-euro-tactical-nymph-mono-level').productName).toBe('SA Mastery Euro Tactical Nymph Mono');
  });

  it('every size and colorway is told apart when a saved line is matched back to its preset', () => {
    // Lookalikes draw exactly like another size (see LOOKALIKES), so they are left out.
    for (const preset of LINE_PRESETS.filter((p) => p.maker && !LOOKALIKES.has(p.id))) {
      for (const cw of preset.colorways) {
        expect(presetForLine({ ...structuredClone(preset.line), zones: structuredClone(cw.zones) }), `${preset.id} ${cw.id}`).toBe(preset.id);
      }
    }
  });
});

describe('maker products', () => {
  const gold = (id) => findById(LINE_PRESETS, `rio-premier-gold-${id}`);

  it('makerProduct expands a product into one preset per size', () => {
    const colorways = [{ id: 'red', name: 'Red', zones: zones([0, 'red']) }];
    const presets = makerProduct({
      id: 'acme-trout',
      maker: 'Acme',
      name: 'Acme Trout',
      sizes: [
        { id: 'wf4f', label: 'WF4F', type: 'floating', weight: 4, taper: [5, 20, 10, 55], colorways },
        { id: 'wf5f', label: 'WF5F', type: 'floating', weight: 5, taper: [6, 20, 10, 54], estimated: true, colorways },
      ],
    });
    expect(presets).toEqual([
      {
        id: 'acme-trout-wf4f',
        product: 'acme-trout',
        maker: 'Acme',
        name: 'Acme Trout WF4F',
        productName: 'Acme Trout',
        sizeLabel: 'WF4F',
        discontinued: false,
        estimated: false,
        colorways,
        line: { type: 'floating', weight: 4, taper: { front: 5, body: 20, back: 10, running: 55 }, zones: colorways[0].zones },
      },
      expect.objectContaining({ id: 'acme-trout-wf5f', name: 'Acme Trout WF5F', estimated: true, line: expect.objectContaining({ weight: 5 }) }),
    ]);
    expect(makerProduct({ id: 'x', maker: 'Acme', name: 'X', discontinued: true, sizes: [{ id: 'a', label: 'A', type: 'floating', weight: 5, taper: [1, 1, 1, 1], colorways }] })[0].discontinued).toBe(true);
  });

  it('every preset from before products still loads the same line, by its id or a legacy mapping', () => {
    for (const { id, line, colorways } of BEFORE_PRODUCTS) {
      const preset = findById(LINE_PRESETS, LEGACY_PRESET_IDS[id] ?? id);
      expect(preset, id).toBeDefined();
      expect(preset.line, id).toEqual(line);
      // Sizes may have gained colorways since; the old ones still come first, in order.
      expect(colorways ? preset.colorways.slice(0, colorways.length) : preset.colorways, id).toEqual(colorways);
    }
  });

  it('legacy ids point at presets and are not presets themselves', () => {
    for (const [old, id] of Object.entries(LEGACY_PRESET_IDS)) {
      expect(findById(LINE_PRESETS, old)).toBeUndefined();
      expect(findById(LINE_PRESETS, id)).toBeDefined();
    }
  });

  it('an old share link with a legacy id loads the new preset', () => {
    const [old, id] = Object.entries(LEGACY_PRESET_IDS)[0];
    expect(queryToState(`?line=${old}`)).toMatchObject({ presetId: id, setup: { line: findById(LINE_PRESETS, id).line } });
    expect(queryToState('?line=rio-premier-gold-wf8f').presetId).toBe('rio-premier-gold-wf8f');
  });

  it('old share links to the one 444 Full Sinking product load the size of its type (#82)', () => {
    for (const [w, type, sink, color] of [...[4, 5, 6, 7, 8].map((w) => [w, 3, 'sink3', 'cortland-dark-brown']), ...[5, 6, 7, 8].map((w) => [w, 6, 'sink7', 'cortland-black'])]) {
      const id = `cortland-444-full-sinking-type-${type}-wf${w}s${type}`;
      const state = queryToState(`?line=cortland-444-full-sink-wf${w}s${type}&colorway=${type === 3 ? 'dark-brown' : 'black'}`);
      expect(state.presetId).toBe(id);
      expect(findById(LINE_PRESETS, id)).toMatchObject({ sizeLabel: `WF${w}S`, name: `Cortland 444 Full Sinking Type ${type} WF${w}S` });
      expect(state.setup.line).toMatchObject({ type: sink, weight: w, taper: { front: 6, body: 20, back: 6, running: 58 }, zones: [{ color }] });
    }
  });

  it('ids are unique and product ids never collide with preset ids', () => {
    const ids = LINE_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of LINE_PRESETS.filter((x) => x.product)) expect(ids).not.toContain(p.product);
  });

  it('merges per-weight entries into one product', () => {
    expect(productSizes('rio-premier-gold').map((p) => p.sizeLabel)).toEqual(['WF2F', 'WF3F', 'WF4F', 'WF5F', 'WF6F', 'WF7F', 'WF8F', 'WF9F']);
    expect(productSizes('rio-premier-fathom').map((p) => p.sizeLabel)).toEqual([
      'WF5 Sink 3', 'WF5 Sink 5', 'WF5 Sink 6',
      'WF6 Sink 3', 'WF6 Sink 5', 'WF6 Sink 6', 'WF6 Sink 7',
      'WF7 Sink 3', 'WF7 Sink 5', 'WF7 Sink 6', 'WF7 Sink 7',
      'WF8 Sink 3', 'WF8 Sink 5', 'WF8 Sink 6', 'WF8 Sink 7',
    ]);
    expect(productSizes('airflo-streamer-max-short')).toHaveLength(15);
    expect(productSizes('airflo-sixth-sense').map((p) => p.sizeLabel)).toEqual([
      'WF5/6 Di3', 'WF5/6 Di5', 'WF6/7 Di3', 'WF6/7 Di5', 'WF6/7 Di7', 'WF7/8 Di3', 'WF7/8 Di5', 'WF7/8 Di7', 'WF8/9 Di3', 'WF8/9 Di5', 'WF8/9 Di7',
    ]);
    expect(productSizes('generic-wf5f')).toEqual([]);
  });

  it.each([
    ['wf2f', 2, 44, 80],
    ['wf3f', 3, 45, 80],
    ['wf4f', 4, 46, 90],
    ['wf5f', 5, 47, 90],
    ['wf6f', 6, 48, 90],
    ['wf7f', 7, 49, 90],
    ['wf8f', 8, 50, 90],
    ['wf9f', 9, 50, 90],
  ])('Premier Gold %s is a %i wt with RIO\'s %i ft head on a %i ft line', (size, weight, head, length) => {
    const { line } = gold(size);
    expect(line.weight).toBe(weight);
    expect(line.taper.front + line.taper.body + line.taper.back).toBe(head);
    expect(totalLength(line)).toBe(length);
    expect(gold(size).estimated).toBe(size !== 'wf5f');
    expect(line.zones).toEqual(zones([head, 'rio-moss'], [0, 'rio-gold']));
  });

  it('Premier Gold comes in Melon/Gray Dun only in WF4–6', () => {
    const melon = productSizes('rio-premier-gold').filter((p) => p.colorways.some((cw) => cw.id === 'melon-gray-dun'));
    expect(melon.map((p) => p.sizeLabel)).toEqual(['WF4F', 'WF5F', 'WF6F']);
    expect(gold('wf4f').colorways[1].zones).toEqual(zones([46, 'rio-melon'], [0, 'rio-gray-dun']));
  });

  it('the nearest size takes the first at the weight, else the closest, ties lighter', () => {
    const sizes = [
      { id: 'a4', line: { weight: 4 } },
      { id: 'b6', line: { weight: 6 } },
      { id: 'c6', line: { weight: 6 } },
      { id: 'd8', line: { weight: 8 } },
    ];
    expect(nearestSize(sizes, 6).id).toBe('b6');
    expect(nearestSize(sizes, 5).id).toBe('a4');
    expect(nearestSize(sizes, 7).id).toBe('b6');
    expect(nearestSize(sizes, 12).id).toBe('d8');
    expect(nearestSize(sizes, 1).id).toBe('a4');
  });

  it('switching product keeps the weight, or lands on the nearest', () => {
    const line = findById(LINE_PRESETS, 'generic-wf7i').line;
    expect(switchLine('rio-premier-gold', line, 'generic-wf7i').presetId).toBe('rio-premier-gold-wf7f');
    expect(switchLine('rio-premier-fathom', line, 'generic-wf7i').presetId).toBe('rio-premier-fathom-wf7s3');
    expect(switchLine('rio-elite-flats-pro', line, 'generic-wf7i').presetId).toBe('rio-elite-flats-pro-wf7f');
    const two = gold('wf2f').line;
    expect(switchLine('sa-amplitude-bass-bug', two, 'rio-premier-gold-wf2f')).toMatchObject({ presetId: 'sa-amplitude-bass-bug-wf6f', line: findById(LINE_PRESETS, 'sa-amplitude-bass-bug-wf6f').line });
  });

  it('switching to a generic preset or a size loads its line', () => {
    const { line } = gold('wf5f');
    expect(switchLine('generic-wf5f', line, 'rio-premier-gold-wf5f')).toEqual({ presetId: 'generic-wf5f', line: findById(LINE_PRESETS, 'generic-wf5f').line });
    expect(switchLine('rio-premier-gold-wf8f', line, 'rio-premier-gold-wf5f')).toEqual({ presetId: 'rio-premier-gold-wf8f', line: gold('wf8f').line });
    expect(switchLine('nope', line, 'rio-premier-gold-wf5f')).toBeNull();
  });

  it('switching size keeps the colorway when the new size comes in it', () => {
    const melon = { ...structuredClone(gold('wf5f').line), zones: gold('wf5f').colorways[1].zones };
    const six = switchLine('rio-premier-gold-wf6f', melon, 'rio-premier-gold-wf5f');
    expect(lineColorway(gold('wf6f'), six.line).id).toBe('melon-gray-dun');
    const eight = switchLine('rio-premier-gold-wf8f', melon, 'rio-premier-gold-wf5f');
    expect(lineColorway(gold('wf8f'), eight.line).id).toBe('moss-gold');
    // Through the product too: picking Premier Gold again at 5 wt keeps Melon.
    expect(lineColorway(gold('wf5f'), switchLine('rio-premier-gold', melon, 'rio-premier-gold-wf5f').line).id).toBe('melon-gray-dun');
  });

  it('switched lines are copies, not the catalog\'s own objects', () => {
    const { line } = switchLine('rio-premier-gold-wf8f', gold('wf5f').line, 'rio-premier-gold-wf5f');
    expect(line).not.toBe(gold('wf8f').line);
    expect(line.zones).not.toBe(gold('wf8f').line.zones);
  });

  it('the menu has one entry per product, discontinued ones last within their maker', () => {
    const menu = lineMenu(LINE_PRESETS);
    const ids = menu.map((m) => m.id);
    expect(ids.filter((id) => id === 'rio-premier-gold')).toHaveLength(1);
    expect(ids).not.toContain('rio-premier-gold-wf5f');
    expect(ids).toContain('generic-wf5f');
    expect(menu.find((m) => m.id === 'rio-premier-gold')).toMatchObject({ maker: 'RIO', name: 'RIO Premier Gold' });

    const colorways = [{ id: 'red', name: 'Red', zones: zones([0, 'red']) }];
    const size = { id: 'wf5f', label: 'WF5F', type: 'floating', weight: 5, taper: [1, 1, 1, 1], colorways };
    const fake = [
      ...makerProduct({ id: 'acme-old', maker: 'Acme', name: 'Acme Old', discontinued: true, sizes: [size] }),
      ...makerProduct({ id: 'acme-new', maker: 'Acme', name: 'Acme New', sizes: [size] }),
    ];
    expect(lineMenu(fake).map((m) => [m.id, m.name])).toEqual([
      ['acme-new', 'Acme New'],
      ['acme-old', 'Acme Old (discontinued)'],
    ]);
  });

  it('the menu entry for a preset is its product, or the preset itself', () => {
    expect(menuId('rio-premier-gold-wf8f')).toBe('rio-premier-gold');
    expect(menuId('generic-wf5f')).toBe('generic-wf5f');
    expect(menuId('custom')).toBe('custom');
  });

  it('a saved line still finds its size', () => {
    for (const id of ['rio-premier-gold-wf3f', 'rio-premier-gold-wf8f', 'airflo-sixth-sense-wf7-di7', 'sa-sonar-sink-25-cold-250-s6']) {
      expect(presetForLine(structuredClone(findById(LINE_PRESETS, id).line))).toBe(id);
    }
    const melon = { ...structuredClone(gold('wf6f').line), zones: structuredClone(gold('wf6f').colorways[1].zones) };
    expect(presetForLine(melon)).toBe('rio-premier-gold-wf6f');
  });
});

describe('RIO lines', () => {
  // RIO's spec table per product: weight → [head, total] in feet.
  const table = (rows) => Object.fromEntries(rows.map(([w, head, total]) => [w, [head, total]]));
  const SPECS = {
    'rio-premier-gold': table([[2, 44, 80], [3, 45, 80], [4, 46, 90], [5, 47, 90], [6, 48, 90], [7, 49, 90], [8, 50, 90], [9, 50, 90]]),
    'rio-premier-outbound-short': table([5, 6, 7, 8, 9, 10, 11, 12].map((w) => [w, 30, 100])),
    'rio-elite-gold': table([[4, 46, 90], [5, 47, 90], [6, 48, 90], [7, 49, 100], [8, 50, 100]]),
    'rio-elite-flats-pro': table([[6, 48, 100], [7, 49, 100], [8, 49, 100], [9, 50, 100], [10, 50, 100], [11, 50, 100], [12, 50, 100]]),
    'rio-elite-predator': table([[5, 36, 100], [6, 36, 100], [7, 34, 100], [8, 34, 100], [9, 34, 100], [10, 32, 100], [11, 32, 100]]),
    'rio-elite-tropical-outbound-short': table([8, 9, 10, 11, 12].map((w) => [w, 30, 100])),
    'rio-premier-streamertip': table([5, 6, 7, 8].map((w) => [w, 30, 100])),
    // RIO lists the 24 ft tip; its diagram puts the head at 34 ft.
    'rio-premier-24ft-sink-tip': table([5, 6, 7, 8, 9, 10].map((w) => [w, 34, 100])),
    'rio-elite-gold-xp': table([[3, 40, 80], [4, 41, 90], [5, 42, 90], [6, 43, 90], [7, 44, 100], [8, 45, 100]]),
    'rio-elite-bonefish': table([[6, 46.5, 90], [7, 48.5, 100], [8, 49.5, 100], [9, 49.5, 100]]),
    // Floating and intermediate WF8–10 have a 30 ft head; the grain-weight sinking lines (listed at
    // the lower of their two rod weights, 7–11) have 35 ft. Checked by size below.
    'rio-premier-striper': table([[8, 30, 100], [9, 30, 100], [10, 30, 100]]),
    'rio-premier-creek': table([[0, 30, 65], [1, 30, 65], [2, 30, 65], [3, 30, 75], [4, 30, 75], [5, 30, 80]]),
    'rio-elite-technical-trout': table([[3, 45, 80], [4, 49, 90], [5, 52, 90], [6, 54, 90]]),
    // RIO's 33 ft leaves out the 16 ft back taper drawn on its diagram.
    'rio-elite-xtreme-indicator': table([[5, 49, 90], [6, 49, 90], [7, 49, 100], [8, 49, 100], [9, 49, 100]]),
    'rio-premier-fathom': table([5, 6, 7, 8].map((w) => [w, 35, 105])),
    'rio-elite-warmwater-predator': table([[6, 36, 100], [7, 34, 100], [8, 34, 100], [9, 34, 100], [10, 32, 100]]),
    'rio-premier-gold-xp': table([[3, 40, 80], [4, 41, 90], [5, 42, 90], [6, 43, 90], [7, 44, 90], [8, 45, 90]]),
    'rio-elite-single-handed-spey': table([[3, 33, 80], ...[4, 5, 6, 7, 8].map((w) => [w, 33, 90])]),
    'rio-elite-indicator': table([[4, 48, 90], [5, 50, 90], [6, 52, 90], [7, 54, 100], [8, 56, 100]]),
    'rio-mainstream-trout-wf': table([[3, 36, 80], [4, 37, 80], [5, 38, 80], [6, 39, 80], [7, 40, 80], [8, 41, 80]]),
    'rio-elite-gold-max': table([[4, 36, 90], [5, 37, 90], [6, 38, 90], [7, 39, 100], [8, 40, 100], [9, 41, 100]]),
    'rio-premier-gold-max': table([[4, 36, 90], [5, 37, 90], [6, 38, 90], [7, 39, 90], [8, 40, 90], [9, 41, 90]]),
    'rio-premier-technical-trout-wf': table([[3, 45, 80], [4, 49, 90], [5, 52, 90], [6, 54, 90]]),
    'rio-premier-aqualux': table([[4, 30, 90], [5, 30, 90], [6, 30, 100], [7, 30, 100], [8, 30, 100]]),
    'rio-premier-bank-robber': table([[5, 45, 90], [6, 45, 90]]),
    'rio-avid-trout-gold': table([[3, 45, 70], [4, 46, 80], [5, 47, 80], [6, 48, 80], [7, 49, 80]]),
    // RIO's diagram draws the WF5F head at 43 ft; its table says 42.
    'rio-premier-lightline': table([[2, 40, 70], [3, 41, 70], [4, 41, 80], [5, 42, 80]]),
    // Double tapers are all head.
    'rio-premier-technical-trout-dt': table([[3, 80, 80], [4, 80, 80], [5, 90, 90], [6, 90, 90]]),
    'rio-premier-lightline-double-taper': table([[0, 70, 70], [1, 70, 70], [2, 70, 70], [3, 70, 70], [4, 80, 80], [5, 80, 80]]),
    'rio-elite-permit': table([[8, 46, 100], [9, 48, 100], [10, 50, 100]]),
    'rio-elite-tarpon': table([[8, 38, 100], [9, 39.5, 100], [10, 40.5, 100], [11, 40.5, 100], [12, 40.5, 100]]),
    // RIO lists the 26 ft sinking tip (listed at the lower of its two rod weights); its diagram puts the head at 34 ft.
    'rio-elite-leviathan': table([7, 8, 9, 10, 12].map((w) => [w, 34, 100])),
    'rio-premier-tarpon-clear-tip-floater': table([10, 11, 12].map((w) => [w, 40.5, 100])),
    'rio-premier-flats-clear-floater': table([[7, 49, 100], [8, 49, 100], [9, 50, 100], [10, 50, 100], [11, 50, 100], [12, 50, 100]]),
    // RIO's diagram draws the WF8F head at 35 ft; its table says 35.5.
    'rio-premier-bonefish-quickshooter': table([[5, 34.5, 90], [6, 34.5, 90], [7, 35.5, 90], [8, 35.5, 100], [9, 35.5, 100]]),
    'rio-elite-gt': table([10, 11, 12].map((w) => [w, 36, 100])),
    'rio-elite-salmon-steelhead': table([6, 7, 8, 9, 10].map((w) => [w, 52, 100])),
    'rio-premier-redfish': table([[7, 36, 90], [8, 37, 100], [9, 37, 100]]),
    'rio-premier-redfish-xp': table([8, 9, 10].map((w) => [w, 35, 100])),
    'rio-elite-smallmouth-bass': table([[6, 35.5, 90], [7, 37, 100], [8, 38, 100]]),
    // RIO's diagram draws the WF9I head at 32 ft; its table says 33.
    'rio-premier-coastal-quickshooter-xp': table([[8, 32, 100], [9, 33, 100], [10, 33, 100]]),
    'rio-elite-sub-surface-camolux': table([[4, 30, 90], [5, 30, 90], [6, 30, 100], [7, 30, 100], [8, 30, 100]]),
    'rio-ambassador-series-lake-chucker': table([6, 7, 8].map((w) => [w, 35, 100])),
    // RIO's diagram draws the WF6F head at 50 ft; its table says 49.5.
    'rio-elite-stillwater-floater': table([[5, 49, 90], [6, 49.5, 90], [7, 50, 100], [8, 50.5, 100]]),
    'rio-premier-tarpon-quickshooter': table([10, 11, 12].map((w) => [w, 30, 100])),
    'rio-avid-trout-grand': table([[5, 37, 80], [6, 39, 80], [7, 40, 80], [8, 41, 80]]),
    'rio-premier-midge-tip': table([[5, 40, 90], [6, 40, 90], [7, 42, 100], [8, 44, 100]]),
    // RIO's diagram draws the WF8F head at 50 ft; its table says 49.5.
    'rio-premier-bonefish': table([[6, 46.5, 90], [7, 48.5, 90], [8, 49.5, 100], [9, 49.5, 100]]),
    // RIO lists the 24 ft tip (listed at the lower of its two rod weights); its diagram puts the head at 33 ft.
    'rio-avid-24ft-sink-tip': table([5, 6, 7, 8, 9].map((w) => [w, 33, 80])),
    // RIO's diagram draws the WF8F head at 36 ft; its table says 37.
    'rio-avid-saltwater': table([[7, 36, 80], [8, 37, 80], [9, 37, 80], [10, 38, 80]]),
    'rio-avid-bass': table([6, 7, 8].map((w) => [w, 33, 80])),
    'rio-mainstream-striper': table([6, 7, 8, 9, 10].map((w) => [w, 30, 80])),
    'rio-premier-dog-days-gold': table([[4, 46, 90], [5, 47, 90], [6, 48, 90]]),
    // RIO gives no overall length except on the WF5F diagram, so only the WF5F is drawn.
    'rio-premier-glacial-gold': table([[5, 47, 90]]),
    'rio-premier-midge-tip-long': table([[5, 40, 90], [6, 40, 90], [7, 42, 100], [8, 44, 100]]),
    'rio-avid-bonefish': table([[7, 48.5, 80], [8, 49.5, 80], [9, 49.5, 80]]),
    'rio-avid-tarpon': table([10, 11, 12].map((w) => [w, 40, 80])),
    // The floating sizes are the Stillwater Floater (whose diagram draws the WF6F head at 50 ft; the
    // table says 49.5); the intermediate sizes are the AquaLux, with a 30 ft head. Checked by size below.
    'rio-ambassador-series-phil-rowley-lake': table([[6, 49.5, 90], [7, 50, 100]]),
  };
  const rio = LINE_PRESETS.filter((p) => p.maker === 'RIO');
  const head = ({ taper }) => taper.front + taper.body + taper.back;
  const spec = (p) => {
    if (/-wf\d+s7$/.test(p.id) && p.product === 'rio-premier-outbound-short') return [30, 110];
    if (p.product === 'rio-premier-striper' && /gr$/.test(p.id)) return [35, 100];
    if (p.product === 'rio-ambassador-series-phil-rowley-lake' && p.line.type === 'intermediate') return [30, 100];
    return SPECS[p.product]?.[p.line.weight];
  };

  it('has a spec for every product except the Euro nymph line', () => {
    const products = new Set(rio.map((p) => p.product));
    products.delete('rio-technical-euro-nymph');
    expect([...products].sort()).toEqual(Object.keys(SPECS).sort());
  });

  it.each(rio.filter((p) => p.product !== 'rio-technical-euro-nymph').map((p) => [p.id, p]))('%s has RIO\'s head and total length', (_, p) => {
    const [h, total] = spec(p);
    expect(head(p.line)).toBe(h);
    expect(totalLength(p.line)).toBe(total);
    // A double taper has no running line.
    for (const k of ['front', 'body', 'back', 'running']) if (k !== 'running' || h < total) expect(p.line.taper[k]).toBeGreaterThan(0);
  });

  it('ids are unique kebab-case', () => {
    const ids = rio.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^rio(-[a-z0-9]+)+$/);
    for (const p of rio) expect(new Set(p.colorways.map((cw) => cw.id)).size).toBe(p.colorways.length);
  });

  it('every zone color is a known color', () => {
    const known = new Set([...LINE_COLORS, ...MAKER_LINE_COLORS].map((c) => c.id));
    for (const p of rio) for (const cw of p.colorways) for (const z of cw.zones) expect(known.has(z.color), `${p.id} ${z.color}`).toBe(true);
  });

  it('only sizes drawn on a RIO diagram are exact', () => {
    const exact = rio.filter((p) => !p.estimated && p.product !== 'rio-technical-euro-nymph').map((p) => p.id);
    expect(exact).toEqual([
      'rio-premier-gold-wf5f',
      'rio-premier-outbound-short-wf8f',
      'rio-elite-gold-wf5f',
      'rio-elite-flats-pro-wf10f',
      'rio-elite-flats-pro-wf10-f-i-6-ft',
      'rio-elite-flats-pro-wf10-f-i-15-ft',
      'rio-elite-flats-pro-wf10i',
      'rio-elite-predator-wf8f',
      'rio-elite-predator-wf8-f-h-i',
      'rio-elite-tropical-outbound-short-wf8f',
      'rio-premier-streamertip-wf7-f-i',
      'rio-premier-24ft-sink-tip-wf5-f-s4',
      'rio-elite-gold-xp-wf5f',
      'rio-elite-bonefish-wf8f',
      'rio-premier-striper-wf9f',
      'rio-premier-striper-wf9i',
      'rio-premier-creek-wf3f',
      'rio-elite-technical-trout-wf5f',
      'rio-elite-xtreme-indicator-wf6f',
      'rio-premier-fathom-wf7s6',
      'rio-elite-warmwater-predator-wf8f',
      'rio-elite-warmwater-predator-wf8-f-h-i',
      'rio-elite-warmwater-predator-wf8-f-s5-s7',
      'rio-premier-gold-xp-wf5f',
      'rio-elite-single-handed-spey-wf5-f-h-i',
      'rio-elite-indicator-wf6f',
      'rio-elite-gold-max-wf5f',
      'rio-premier-gold-max-wf5f',
      'rio-premier-technical-trout-wf-wf5f',
      'rio-premier-aqualux-wf6i',
      'rio-premier-bank-robber-wf5f',
      'rio-avid-trout-gold-wf5f',
      'rio-premier-technical-trout-dt-dt5f',
      'rio-premier-lightline-double-taper-dt5f',
      'rio-elite-permit-wf9f',
      'rio-elite-leviathan-500gr',
      'rio-premier-tarpon-clear-tip-floater-wf11f',
      'rio-premier-flats-clear-floater-wf10f',
      'rio-elite-gt-wf12f',
      'rio-elite-salmon-steelhead-wf8f',
      'rio-premier-redfish-wf8f',
      'rio-premier-redfish-xp-wf8f',
      'rio-elite-smallmouth-bass-wf8f',
      'rio-elite-sub-surface-camolux-wf6i',
      'rio-ambassador-series-lake-chucker-wf7f',
      'rio-premier-tarpon-quickshooter-wf12f',
      'rio-avid-trout-grand-wf6f',
      'rio-premier-midge-tip-wf6-f-i',
      'rio-avid-24ft-sink-tip-6-7wt-f-s5',
      'rio-avid-bass-wf8f',
      'rio-mainstream-striper-wf9i',
      'rio-premier-dog-days-gold-wf5f',
      'rio-premier-glacial-gold-wf5f',
      'rio-premier-midge-tip-long-wf6-f-i',
      'rio-avid-bonefish-wf8f',
      'rio-avid-tarpon-wf11f',
      'rio-ambassador-series-phil-rowley-lake-wf6i',
    ]);
  });

  it.each([
    ['rio-premier-outbound-short-wf8f', [6, 19, 5, 70]],
    ['rio-elite-flats-pro-wf10f', [6, 20, 24, 50]],
    ['rio-elite-predator-wf8f', [16, 15, 3, 66]],
    ['rio-elite-bonefish-wf8f', [6.5, 31, 12, 50.5]],
    ['rio-premier-fathom-wf7s6', [6, 21, 8, 70]],
    ['rio-premier-aqualux-wf6i', [6, 22, 2, 70]],
    ['rio-premier-bank-robber-wf5f', [15, 20, 10, 45]],
    ['rio-avid-trout-gold-wf5f', [5, 24, 18, 33]],
    ['rio-premier-technical-trout-dt-dt5f', [9, 72, 9, 0]],
    ['rio-premier-lightline-double-taper-dt5f', [13, 54, 13, 0]],
    ['rio-elite-permit-wf9f', [6, 29, 13, 52]],
    ['rio-elite-leviathan-500gr', [4, 27, 3, 66]],
    ['rio-premier-tarpon-clear-tip-floater-wf11f', [6, 22.5, 12, 59.5]],
    ['rio-premier-flats-clear-floater-wf10f', [6, 20, 24, 50]],
    ['rio-elite-gt-wf12f', [3, 27, 6, 64]],
    ['rio-elite-salmon-steelhead-wf8f', [6.5, 32, 13.5, 48]],
    ['rio-premier-redfish-wf8f', [6, 24, 7, 63]],
    ['rio-premier-redfish-xp-wf8f', [3, 24, 8, 65]],
    ['rio-elite-smallmouth-bass-wf8f', [7, 24, 7, 62]],
    ['rio-elite-sub-surface-camolux-wf6i', [6, 22, 2, 70]],
    ['rio-ambassador-series-lake-chucker-wf7f', [2, 32, 1, 65]],
    ['rio-premier-tarpon-quickshooter-wf12f', [7, 22, 1, 70]],
    ['rio-avid-trout-grand-wf6f', [7, 25, 7, 41]],
    ['rio-premier-midge-tip-wf6-f-i', [7, 28, 5, 50]],
    ['rio-avid-24ft-sink-tip-6-7wt-f-s5', [4, 25, 4, 47]],
    ['rio-avid-bass-wf8f', [5, 10, 18, 47]],
    ['rio-mainstream-striper-wf9i', [16, 11, 3, 50]],
    ['rio-premier-dog-days-gold-wf5f', [6, 22, 19, 43]],
    ['rio-premier-glacial-gold-wf5f', [5, 23, 19, 43]],
    ['rio-premier-midge-tip-long-wf6-f-i', [6, 29, 5, 50]],
    ['rio-avid-bonefish-wf8f', [7, 24, 18.5, 30.5]],
    ['rio-avid-tarpon-wf11f', [6, 22, 12, 40]],
    ['rio-ambassador-series-phil-rowley-lake-wf6i', [6, 22, 2, 70]],
  ])('%s has the taper on RIO\'s diagram', (id, [front, body, back, running]) => {
    expect(findById(LINE_PRESETS, id).line.taper).toEqual({ front, body, back, running });
  });

  it('Fathom draws each sink rate as the nearest sinking type and colors its running line by rate', () => {
    const types = productSizes('rio-premier-fathom').filter((p) => p.line.weight === 7).map((p) => [p.sizeLabel, p.line.type, p.line.zones.at(-1).color]);
    expect(types).toEqual([
      ['WF7 Sink 3', 'sink3', 'rio-deep-blue'],
      ['WF7 Sink 5', 'sink5', 'rio-maroon'],
      ['WF7 Sink 6', 'sink5', 'rio-sage'],
      ['WF7 Sink 7', 'sink7', 'rio-grey'],
    ]);
  });

  it('colorways made only in some weights are listed only on those sizes', () => {
    const camo = productSizes('rio-elite-gold-max').filter((p) => p.colorways.some((cw) => cw.id === 'camo'));
    expect(camo.map((p) => p.sizeLabel)).toEqual(['WF4F', 'WF5F', 'WF6F', 'WF7F', 'WF8F']);
  });
});

describe('handleHalfWidths', () => {
  it('gives each handle the wanted width when there is room', () => {
    expect(handleHalfWidths([100, 300], 40)).toEqual([40, 40]);
  });

  it('stops short of halfway to a close neighbor, but never under the minimum', () => {
    expect(handleHalfWidths([100, 150, 400], 40)).toEqual([24, 24, 40]);
    expect(handleHalfWidths([100, 104], 40)).toEqual([10, 10]);
  });
});
