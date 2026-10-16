import { describe, expect, it } from 'vitest';
import { DEFAULT_SETUP } from '../data/catalog.js';
import { rackConflicts, backingContrast } from './checks.js';
import { deltaE } from './color.js';
import { spoolLayout, totalLength, zoneRanges } from './geometry.js';
import { decodeSetup, encodeSetup } from './share.js';

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
