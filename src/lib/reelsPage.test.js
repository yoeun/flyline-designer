import { describe, expect, it } from 'vitest';
import { DEFAULT_SETUP, LINE_PRESETS, REELS, REEL_MODELS, findById } from '../data/catalog.js';
import { spoolLayout } from './geometry.js';
import { NO_REELS_FILTER, PREVIEW_FILL, capacityText, photosByModel, previewSetup, previewWeight, reelsFilterFromQuery, reelsFilterParams, scrollToFit, setupForReel } from './reelsPage.js';

describe('setupForReel', () => {
  it('starts from the defaults on the chosen reel and finish', () => {
    const { setup, presetId } = setupForReel({ model: 'lamson-liquid-s-5', color: 'day-break' });
    expect(setup.reel).toEqual({ model: 'lamson-liquid-s-5', color: 'day-break' });
    expect(setup.backing).toEqual(DEFAULT_SETUP.backing);
    expect(setup.title).toBe('');
    expect(presetId).toBe(LINE_PRESETS[0].id);
  });
  it('puts the line at the weight the page draws the size with', () => {
    const reel = findById(REELS, 'lamson-liquid-s-7');
    const { setup } = setupForReel({ model: reel.id, color: 'smoke' });
    const [lo, hi] = reel.weights;
    expect(setup.line.weight).toBeGreaterThanOrEqual(lo);
    expect(setup.line.weight).toBeLessThanOrEqual(hi);
    expect(setup.line.weight).toBe(previewWeight(reel));
  });
});

describe('reels page', () => {
  it('draws each size with a line at the middle of its weights, rounded up', () => {
    expect(previewWeight({ weights: [6, 8] })).toBe(7);
    expect(previewWeight({ weights: [4, 5] })).toBe(5);
  });

  it('colors the backing, head and running line, and keeps a finish the size comes in', () => {
    const size = findById(REELS, 'lamson-liquid-s-7');
    const setup = previewSetup(size, 'day-break', { backing: 'orange', head: 'red', running: 'white' });
    expect(setup.reel).toEqual({ model: size.id, color: 'day-break' });
    expect(setup.backing.color).toBe('orange');
    expect(setup.line.zones.map((z) => z.color)).toEqual(['red', 'white']);
    expect(previewSetup(size, 'gunmetal').reel.color).toBe('smoke');
  });

  it('draws at least 100 yd of backing, and more where a bigger reel needs it to look full', () => {
    const small = previewSetup(findById(REELS, 'lamson-liquid-s-3'), 'smoke');
    expect(small.backing.yards).toBe(100);
    const big = findById(REELS, 'lamson-liquid-s-9');
    const setup = previewSetup(big, 'smoke');
    expect(setup.backing.yards).toBeGreaterThan(100);
    expect(setup.backing.pounds).toBe(big.rated.pounds);
    expect(spoolLayout(setup).fill).toBeGreaterThan(PREVIEW_FILL - 0.05);
    expect(spoolLayout(setup).fill).toBeLessThanOrEqual(PREVIEW_FILL);
  });

  it('describes capacity as rated, or by arbor', () => {
    expect(capacityText(findById(REELS, 'lamson-liquid-s-5'))).toBe('WF6 + 100 yd of 20 lb');
    expect(capacityText(findById(REELS, 'g56'))).toBe('arbor 1.95″');
  });

  it('matches photos to the model with the longest matching id', () => {
    const models = [{ id: 'sage-spectrum' }, { id: 'sage-spectrum-c' }];
    const photos = ['sage-spectrum-c-both-grey.jpg', 'sage-spectrum-drag-black.jpg', 'other.jpg'].map((file) => ({ file }));
    expect(photosByModel(models, photos)).toEqual({
      'sage-spectrum-c': [{ file: 'sage-spectrum-c-both-grey.jpg' }],
      'sage-spectrum': [{ file: 'sage-spectrum-drag-black.jpg' }],
    });
    expect(Object.keys(photosByModel(REEL_MODELS, []))).toEqual([]);
  });
});

describe('scrollToFit', () => {
  it('leaves a card that already fits', () => {
    expect(scrollToFit({ top: 200, bottom: 600 }, 150, 800)).toBe(0);
  });
  it('scrolls up to a card cut off at the top', () => {
    expect(scrollToFit({ top: 100, bottom: 500 }, 150, 800)).toBe(-62);
  });
  it('scrolls down to a card cut off at the bottom', () => {
    expect(scrollToFit({ top: 500, bottom: 900 }, 150, 800)).toBe(112);
  });
  it('lines up the top of a card taller than the band', () => {
    expect(scrollToFit({ top: 300, bottom: 1200 }, 150, 800)).toBe(138);
    expect(scrollToFit({ top: -400, bottom: 500 }, 150, 800)).toBe(-562);
    expect(scrollToFit({ top: 100, bottom: 1200 }, 150, 800)).toBe(-62);
  });
});

describe('reels page url filters', () => {
  const parse = (search) => reelsFilterFromQuery(new URLSearchParams(search));

  it('reads a brand whatever its case', () => {
    expect(parse('brand=sage')).toEqual({ ...NO_REELS_FILTER, brand: 'Sage' });
    expect(parse('brand=nobody')).toEqual(NO_REELS_FILTER);
  });

  it('reads one model with the size, finish and side its card shows', () => {
    expect(parse('model=sage-arbor-xl&size=sage-arbor-xl-678&color=sage-slate&side=spool')).toEqual({
      ...NO_REELS_FILTER,
      models: ['sage-arbor-xl'],
      size: 'sage-arbor-xl-678',
      color: 'sage-slate',
      side: 'spool',
    });
  });

  it('takes a size id as its model at that size', () => {
    expect(parse('model=sage-arbor-xl-678')).toMatchObject({ models: ['sage-arbor-xl'], size: 'sage-arbor-xl-678' });
  });

  it('drops unknown models, and sizes, finishes and sides that do not fit', () => {
    expect(parse('model=sage-arbor-xl,nope&size=sage-spectrum-34&color=smoke&side=up')).toEqual({ ...NO_REELS_FILTER, models: ['sage-arbor-xl'] });
  });

  it('keeps a size, finish and side only for a single model', () => {
    expect(parse('model=sage-arbor-xl,sage-spectrum&size=sage-arbor-xl-678&side=spool')).toEqual({ ...NO_REELS_FILTER, models: ['sage-arbor-xl', 'sage-spectrum'] });
  });

  it('writes back what it reads', () => {
    const filter = parse('brand=Sage&model=sage-arbor-xl&size=sage-arbor-xl-678&side=spool');
    expect(parse(new URLSearchParams(reelsFilterParams(filter)).toString())).toEqual(filter);
    expect(reelsFilterParams(NO_REELS_FILTER)).toEqual([]);
  });
});
