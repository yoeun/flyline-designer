import { describe, expect, it } from 'vitest';
import { DEFAULT_SETUP, LINE_PRESETS, REELS, REEL_MODELS, findById } from '../data/catalog.js';
import { capacityText, photosByModel, previewSetup, previewWeight, setupForReel } from './reelsPage.js';

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
