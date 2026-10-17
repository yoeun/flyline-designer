import { describe, expect, it } from 'vitest';
import { LINE_PRESETS, REELS, allowedWeights, findById, fitLineToReel, lineColorway, lineMenu, nearestSize, reelWeightFit, switchLine, weightMenu } from '../data/catalog.js';
import { makerProduct } from '../data/lines/product.js';
import { weightCheck } from './checks.js';

const reel = (lo, hi) => ({ weights: [lo, hi] });
const preset = (id) => findById(LINE_PRESETS, id);
const lineOf = (id) => structuredClone(preset(id).line);
const orvis3 = findById(REELS, 'orvis-hydros-2026-3'); // 5–7 wt
const lamson3 = findById(REELS, 'lamson-liquid-s-3'); // 2–4 wt

describe('reel weight fit', () => {
  it('takes the range, one under and one over', () => {
    const r = reel(5, 7);
    expect([3, 4, 5, 6, 7, 8, 9].map((w) => reelWeightFit(r, w))).toEqual(['out', 'under', 'in', 'in', 'in', 'over', 'out']);
    expect(allowedWeights(r)).toEqual([4, 5, 6, 7, 8]);
  });
  it('measures from the edges of a one-weight range', () => {
    expect(allowedWeights(reel(6, 6))).toEqual([5, 6, 7]);
  });
  it('over- and underlines only within 2–12 wt, keeping the reel’s own range', () => {
    expect(allowedWeights(reel(2, 4))).toEqual([2, 3, 4, 5]);
    expect(reelWeightFit(reel(2, 4), 1)).toBe('out');
    expect(allowedWeights(reel(11, 13))).toEqual([10, 11, 12, 13]);
    expect(reelWeightFit(reel(11, 12), 13)).toBe('out');
    expect(allowedWeights(reel(0, 2))).toEqual([0, 1, 2, 3]);
  });
  it('lets anything through without a reel', () => {
    expect(reelWeightFit(undefined, 10)).toBe('in');
  });
});

describe('sizes for a reel', () => {
  const sizes = [4, 5, 7, 8].map((w) => ({ id: `s${w}`, line: { weight: w } }));
  it('keeps an allowed weight', () => {
    expect(nearestSize(sizes, 8, reel(5, 7)).id).toBe('s8');
    expect(nearestSize(sizes, 4, reel(5, 7)).id).toBe('s4');
  });
  it('otherwise takes the nearest in range over a nearer over- or underline', () => {
    expect(nearestSize(sizes, 10, reel(5, 7)).id).toBe('s7');
    expect(nearestSize(sizes, 6, reel(6, 7)).id).toBe('s7');
    expect(nearestSize(sizes, 2, reel(5, 7)).id).toBe('s5');
  });
  it('falls back to an over- or underline, and to nothing', () => {
    expect(nearestSize(sizes, 10, reel(9, 10)).id).toBe('s8');
    expect(nearestSize(sizes, 10, reel(11, 12))).toBeNull();
  });
  it('a product picked from the menu lands on an allowed size', () => {
    expect(switchLine('rio-premier-gold', lineOf('generic-wf5f'), 'generic-wf5f', orvis3).presetId).toBe('rio-premier-gold-wf5f');
    expect(switchLine('rio-premier-gold', { ...lineOf('generic-wf5f'), weight: 10 }, 'custom', orvis3).presetId).toBe('rio-premier-gold-wf7f');
    expect(switchLine('rio-premier-gold', { ...lineOf('generic-wf5f'), weight: 10 }, 'custom', lamson3).presetId).toBe('rio-premier-gold-wf4f');
  });
});

describe('fitting the line to a new reel', () => {
  it('leaves an allowed line alone', () => {
    expect(fitLineToReel(lineOf('rio-premier-gold-wf8f'), 'rio-premier-gold-wf8f', orvis3)).toBeNull();
    expect(fitLineToReel(lineOf('generic-wf5f'), 'generic-wf5f', undefined)).toBeNull();
  });
  it('moves a maker line to its nearest size in range, keeping the colorway', () => {
    const gold6 = preset('rio-premier-gold-wf6f');
    const melon = { ...lineOf(gold6.id), zones: structuredClone(gold6.colorways[1].zones) };
    const next = fitLineToReel(melon, gold6.id, lamson3);
    expect(next.presetId).toBe('rio-premier-gold-wf4f');
    expect(lineColorway(preset('rio-premier-gold-wf4f'), next.line).id).toBe('melon-gray-dun');
  });
  it('leaves a product with no allowed size as is', () => {
    expect(fitLineToReel(lineOf('sa-amplitude-bass-bug-wf6f'), 'sa-amplitude-bass-bug-wf6f', findById(REELS, 'sage-click-012'))).toBeNull();
  });
  it('changes a custom line’s weight only', () => {
    const line = { ...lineOf('generic-wf5f'), weight: 11, taper: { front: 3, body: 20, back: 5, running: 60 } };
    expect(fitLineToReel(line, 'custom', orvis3)).toEqual({ presetId: 'custom', line: { ...line, weight: 7 } });
    expect(fitLineToReel({ ...line, weight: 2 }, 'custom', orvis3).line.weight).toBe(5);
  });
  it('a generic preset at a new weight becomes custom', () => {
    expect(fitLineToReel(lineOf('wf8-sink5'), 'wf8-sink5', lamson3)).toEqual({ presetId: 'custom', line: { ...lineOf('wf8-sink5'), weight: 4 } });
  });
});

describe('weight menu', () => {
  it('lists a custom line’s allowed weights, naming over- and underlines', () => {
    expect(weightMenu(orvis3, lineOf('generic-wf5f'), 'custom')).toEqual([
      { value: 4, label: '4 wt · underline' },
      { value: 5, label: '5 wt' },
      { value: 6, label: '6 wt' },
      { value: 7, label: '7 wt' },
      { value: 8, label: '8 wt · overline' },
    ]);
  });
  it('lists a product’s allowed sizes by their own labels', () => {
    expect(weightMenu(orvis3, lineOf('rio-premier-gold-wf5f'), 'rio-premier-gold-wf5f')).toEqual([
      { value: 'rio-premier-gold-wf4f', label: 'WF4F · underline' },
      { value: 'rio-premier-gold-wf5f', label: 'WF5F' },
      { value: 'rio-premier-gold-wf6f', label: 'WF6F' },
      { value: 'rio-premier-gold-wf7f', label: 'WF7F' },
      { value: 'rio-premier-gold-wf8f', label: 'WF8F · overline' },
    ]);
  });
  it('keeps an out-of-range weight it was loaded with', () => {
    expect(weightMenu(lamson3, lineOf('rio-premier-gold-wf8f'), 'rio-premier-gold-wf8f').map((i) => i.label)).toEqual(['WF2F', 'WF3F', 'WF4F', 'WF5F · overline', 'WF8F · out of range']);
    expect(weightMenu(orvis3, { ...lineOf('generic-wf5f'), weight: 10 }, 'custom').at(-1)).toEqual({ value: 10, label: '10 wt · out of range' });
    expect(weightMenu(lamson3, lineOf('wf8-sink5'), 'wf8-sink5').at(-1)).toEqual({ value: 8, label: '8 wt · out of range' });
  });
});

describe('preset menu for a reel', () => {
  const size = (weight) => ({ id: `wf${weight}f`, label: `WF${weight}F`, type: 'floating', weight, taper: [1, 1, 1, 1], colorways: [{ id: 'red', name: 'Red', zones: [{ length: 0, color: 'red' }] }] });
  const fake = [
    ...makerProduct({ id: 'acme-heavy', maker: 'Acme', name: 'Acme Heavy', sizes: [size(10), size(11)] }),
    ...makerProduct({ id: 'acme-old', maker: 'Acme', name: 'Acme Old', discontinued: true, sizes: [size(5)] }),
    ...makerProduct({ id: 'acme-trout', maker: 'Acme', name: 'Acme Trout', sizes: [size(4), size(9)] }),
    { id: 'gen-wf9', name: 'Generic WF9', line: { type: 'floating', weight: 9, taper: {}, zones: [] } },
    { id: 'gen-wf6', name: 'Generic WF6', line: { type: 'floating', weight: 6, taper: {}, zones: [] } },
  ];
  it('disables lines with no allowed size and lists them last', () => {
    expect(lineMenu(fake, reel(5, 7)).map((e) => [e.id, Boolean(e.disabled)])).toEqual([
      ['acme-trout', false],
      ['gen-wf6', false],
      ['acme-old', false],
      ['acme-heavy', true],
      ['gen-wf9', true],
    ]);
  });
  it('disables nothing without a reel', () => {
    expect(lineMenu(fake).some((e) => e.disabled)).toBe(false);
  });
});

describe('weight check', () => {
  const setup = (model, weight) => ({ reel: { model }, line: { ...lineOf('generic-wf5f'), weight } });
  it('passes allowed weights', () => {
    for (const w of [4, 5, 7, 8]) expect(weightCheck(setup('orvis-hydros-2026-3', w))).toBeNull();
  });
  it('words an out-of-range line', () => {
    expect(weightCheck(setup('orvis-hydros-2026-3', 10)).text).toBe('A 10 wt line is out of range for this reel (suits 5–7 wt; 4–8 wt with over/underlining).');
    expect(weightCheck(setup('lamson-liquid-s-3', 8)).text).toBe('An 8 wt line is out of range for this reel (suits 2–4 wt; 2–5 wt with overlining).');
    expect(weightCheck(setup('orvis-mirage-6', 8)).text).toBe('An 8 wt line is out of range for this reel (suits 11–13 wt; 10–13 wt with underlining).');
  });
  it('passes an unknown reel', () => {
    expect(weightCheck(setup('nope', 10))).toBeNull();
  });
});
