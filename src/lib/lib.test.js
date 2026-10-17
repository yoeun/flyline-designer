import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETUP,
  LINE_COLORS,
  LINE_PRESETS,
  LINE_TYPES,
  MAKER_LINE_COLORS,
  REELS,
  REEL_COLORS,
  findById,
  lineColorway,
  lineSwatches,
  makerGroups,
  reelColors,
  withReelModel,
} from '../data/catalog.js';
import { rackConflicts, backingContrast } from './checks.js';
import { deltaE } from './color.js';
import { ARBOR_RATIO, lineDiameters, reelArbor, spoolLayout, totalLength, zoneRanges } from './geometry.js';
import { FRAMES, SIDES, frameMarkup } from './reelFrames.js';
import { decodeSetup, encodeSetup, queryToState, stateToQuery } from './share.js';
import { parseTheme, resolveTheme } from './theme.js';
import {
  clampSelection,
  editorScale,
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

const setup = (patch = {}) => ({ ...structuredClone(DEFAULT_SETUP), ...patch });

describe('geometry', () => {
  it('last zone takes the rest of the line', () => {
    const zones = zoneRanges(DEFAULT_SETUP.line);
    expect(zones.map((z) => z.length)).toEqual([20, 17, 53]);
    expect(zones.at(-1).end).toBe(totalLength(DEFAULT_SETUP.line));
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
    ['rio-technical-euro-nymph', 1.5, 94],
    ['rio-premier-fathom-wf8s7', 35, 105],
    ['sa-amplitude-smooth-infinity-wf6f', 50, 90],
    ['sa-amplitude-bass-bug-wf8f', 43, 90],
    ['sa-sonar-stillwater-clear-camo-wf6i', 45, 100],
    ['sa-frequency-full-sink-wf6s3', 36, 85],
    ['sa-frequency-sink-tip-wf6', 45, 85],
    ['sa-sonar-titan-intermediate-wf8i', 33.5, 105],
    ['sa-sonar-sink-25-cold-250-s6', 25, 105],
    ['sa-mastery-competition-nymph', 1.5, 80],
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
  const roundTrip = (s) => queryToState(stateToQuery(s));

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
    expect(q.has('name')).toBe(false);
  });

  it('round-trips a preset in a non-default colorway', () => {
    const preset = LINE_PRESETS.find((p) => p.colorways?.length > 1);
    const s = state({ presetId: preset.id });
    s.setup.name = preset.name;
    s.setup.line = { ...structuredClone(preset.line), zones: structuredClone(preset.colorways[1].zones) };
    expect(new URLSearchParams(stateToQuery(s)).get('colorway')).toBe(preset.colorways[1].id);
    expect(roundTrip(s)).toEqual(s);
  });

  it('round-trips a custom line, reel, name and backing', () => {
    const s = state({ presetId: 'custom', side: 'spool', mode: 'line-only' });
    s.setup.name = 'My trout line';
    s.setup.reel = { model: 'lamson-liquid-s-5', color: 'day-break' };
    s.setup.line.zones[0] = { length: 12, color: 'red' };
    s.setup.backing = { yards: 150, pounds: 30, color: 'white' };
    expect(roundTrip(s)).toEqual(s);
  });

  it('keeps an edited name on a preset line', () => {
    const s = state();
    s.setup.name = 'Renamed';
    expect(roundTrip(s)).toEqual(s);
  });

  it('falls back to defaults for unknown values', () => {
    const r = queryToState('reel=nope&line=nope&side=up&view=x&yards=7&lb=1&backing=plaid&l=garbage');
    expect(r).toEqual(state());
  });

  it('falls back to a reel color the model comes in', () => {
    expect(queryToState('reel=lamson-liquid-s-5&color=silver').setup.reel.color).toBe('smoke');
  });

  it('still loads old hash links', () => {
    const s = structuredClone(DEFAULT_SETUP);
    s.name = 'Old link';
    expect(queryToState('', `#${encodeSetup(s)}`)).toEqual(state({ setup: s, presetId: 'custom' }));
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
  // Generic WF5 Floating Two-tone: taper 4 / 28.5 / 4.5 / 53 = 90 ft; zones chartreuse 20, green 17, orange rest.
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
    expect(groups.map(([label]) => label)).toEqual(['Airflo', 'Cortland', 'RIO', 'Scientific Anglers', 'Generic']);
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
    expect(groups.map(([label]) => label)).toEqual(['Lamson', 'Orvis', 'Redington', 'Generic']);
    expect(groups.flatMap(([, reels]) => reels.map((r) => r.id)).sort()).toEqual(REELS.map((r) => r.id).sort());
  });
});

describe('reel frames', () => {
  it.each(REELS.map((r) => [r.id, r]))('%s has a drawing for each side', (_, reel) => {
    for (const [side] of SIDES) expect(FRAMES[reel.design]?.[side]).toContain('<svg');
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
});
