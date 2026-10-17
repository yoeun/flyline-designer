import { describe, expect, it } from 'vitest';
import { DEFAULT_SETUP, LINE_PRESETS, REELS, findById } from '../data/catalog.js';
import { rackConflicts, backingContrast } from './checks.js';
import { deltaE } from './color.js';
import { ARBOR_RATIO, lineDiameters, reelArbor, spoolLayout, totalLength, zoneRanges } from './geometry.js';
import { decodeSetup, encodeSetup } from './share.js';
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
  it.each([
    ['rio-premier-gold-wf5f', 47, 90],
    ['rio-premier-gold-wf8f', 50, 90],
    ['airflo-streamer-max-short-wf8-bbc', 27, 100],
    ['airflo-streamer-max-short-wf8-bro', 27, 100],
  ])('%s has a %i ft head on a %i ft line', (id, head, length) => {
    const { taper } = findById(LINE_PRESETS, id).line;
    expect(taper.front + taper.body + taper.back).toBe(head);
    expect(totalLength(findById(LINE_PRESETS, id).line)).toBe(length);
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
  // Two-tone WF5F: taper 4 / 28.5 / 4.5 / 53 = 90 ft; zones chartreuse 20, green 17, orange rest.
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
    expect(clampSelection(null, line())).toEqual({ kind: 'zone', index: 0 });
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
