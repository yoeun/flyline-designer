import { describe, expect, it } from 'vitest';
import { DEFAULT_SETUP, LINE_PRESETS, REELS, findById } from '../data/catalog.js';
import { rackConflicts, backingContrast } from './checks.js';
import { deltaE } from './color.js';
import { ARBOR_RATIO, lineDiameters, reelArbor, spoolLayout, totalLength, zoneRanges } from './geometry.js';
import { decodeSetup, encodeSetup } from './share.js';
import { parseTheme, resolveTheme } from './theme.js';

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
