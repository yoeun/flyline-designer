import { describe, expect, it } from 'vitest';
import { DEFAULT_SETUP, LINE_PRESETS, nearestSize } from '../data/catalog.js';
import rio from '../data/guide/rio.json';
import { chartPoints, equivalentWeight, filterProducts, groupBySeries, heaviness, heavinessLabel, linkProducts, makerSeries, productFacts, taperLabel, taperName } from './guide.js';
import sa from '../data/guide/scientific-anglers.json';
import { landingPage, resolveView } from './rackView.js';
import { queryToState, stateToQuery } from './share.js';
import { sizeWeights } from '../../scripts/gen-line-guide.mjs';

const size = (weight, grains30, over = {}) => ({ label: `${weight}wt`, weights: [weight], density: 'floating', head: 40, total: 90, grains30, ...over });
const product = (over = {}) => ({ id: 'x', name: 'Line', series: null, category: 'trout', discontinued: false, rank: null, sizes: [size(5, 140)], ...over });
const maker = (id, products) => ({ id, maker: id.toUpperCase(), explainer: [], products });

describe('guide heaviness', () => {
  it('reads grains on the AFFTA scale', () => {
    expect(equivalentWeight(140)).toBe(5);
    expect(equivalentWeight(150)).toBe(5.5);
    expect(equivalentWeight(160)).toBe(6);
    expect(equivalentWeight(197.5)).toBe(7.5);
    // Past either end the end step's slope carries on.
    expect(equivalentWeight(40)).toBe(0);
    expect(equivalentWeight(600)).toBe(16);
  });
  it('labels to the nearest half size', () => {
    expect(heavinessLabel(0.1)).toBe('True to weight');
    expect(heavinessLabel(0.3)).toBe('True to weight');
    expect(heavinessLabel(0.4)).toBe('½ size heavy');
    expect(heavinessLabel(1)).toBe('1 size heavy');
    expect(heavinessLabel(1.6)).toBe('1½ sizes heavy');
    expect(heavinessLabel(-0.5)).toBe('½ size light');
    expect(heavinessLabel(2)).toBe('2 sizes heavy');
  });
  it('averages the single-weight sizes with a 30 ft weight', () => {
    const p = product({ sizes: [size(5, 150), size(6, 175), size(7, null), { ...size(2, 999), weights: [2, 3, 4, 5] }] });
    expect(heaviness(p)).toMatchObject({ label: '½ size heavy', count: 2 });
    expect(heaviness(product({ sizes: [size(5, null)] }))).toBeNull();
  });
  it('RIO Gold, XP and Max run as RIO says', () => {
    const byId = (id) => rio.products.find((p) => p.id === id);
    expect(heaviness(byId('rio-premier-gold')).label).toBe('True to weight');
    expect(heaviness(byId('rio-premier-gold-xp')).label).toBe('½ size heavy');
    expect(heaviness(byId('rio-premier-gold-max')).label).toBe('1 size heavy');
  });
});

describe('guide filters', () => {
  const makers = [
    maker('a', [
      product({ id: 'a1', name: 'Dry Line', rank: 2, sizes: [size(4, 120), size(5, 140)] }),
      product({ id: 'a2', name: 'Old Line', rank: 1, discontinued: true }),
      product({ id: 'a3', name: 'Salt Line', category: 'salt', rank: 1, sizes: [size(8, 210)], primaryUse: 'Bonefish' }),
    ]),
    maker('b', [product({ id: 'b1', name: 'Nymph Rig', category: 'nymph', sizes: [{ ...size(2, null), weights: [2, 3, 4, 5] }] })]),
  ];
  const ids = (opts) => filterProducts(makers, opts).flatMap((s) => s.products.map((p) => p.id));

  it('hides discontinued lines unless asked, and lists them last', () => {
    expect(ids({})).toEqual(['a3', 'a1', 'b1']);
    expect(ids({ discontinued: true })).toEqual(['a3', 'a1', 'a2', 'b1']);
  });
  it('filters by maker, use and rod weight', () => {
    expect(ids({ maker: 'b' })).toEqual(['b1']);
    expect(ids({ category: 'salt' })).toEqual(['a3']);
    expect(ids({ weight: 5 })).toEqual(['a1', 'b1']);
    expect(ids({ weight: 8 })).toEqual(['a3']);
  });
  it('search needs every word, across name, maker and uses', () => {
    expect(ids({ search: 'bonefish' })).toEqual(['a3']);
    expect(ids({ search: 'line a' })).toEqual(['a3', 'a1']);
    expect(ids({ search: 'nymph zzz' })).toEqual([]);
  });
  it('filters and groups by series, best-selling series first', () => {
    const m = maker('s', [
      product({ id: 's1', series: 'Basic', rank: 9 }),
      product({ id: 's2', series: 'Pro', rank: 1 }),
      product({ id: 's3', series: 'Basic', rank: 4 }),
      product({ id: 's4', series: null }),
    ]);
    expect(makerSeries(m)).toEqual(['Pro', 'Basic']);
    expect(filterProducts([m], { series: 'Basic' })[0].products.map((p) => p.id)).toEqual(['s3', 's1']);
    expect(groupBySeries(filterProducts([m])[0].products).map((g) => [g.series, g.products.map((p) => p.id)])).toEqual([
      ['Pro', ['s2']],
      ['Basic', ['s3', 's1']],
      [null, ['s4']],
    ]);
  });
  it('sums up sizes, densities and head lengths', () => {
    const p = product({ sizes: [size(6, 160, { head: 42 }), size(4, 120, { head: 38, density: 'sink5' }), { ...size(2, null), weights: [2, 3], head: null, densityLabel: 'Float/1 ips' }] });
    expect(productFacts(p)).toEqual({ weights: [2, 3, 4, 6], densities: ['Floating', 'Sink 5', 'Float/1 ips'], head: [38, 42] });
  });
  it('reads rod weights from size labels', () => {
    expect(sizeWeights('5wt')).toEqual([5]);
    expect(sizeWeights('WF8I')).toEqual([8]);
    expect(sizeWeights('WF6F/H/I')).toEqual([6]);
    expect(sizeWeights('7/8wt')).toEqual([7, 8]);
    expect(sizeWeights('2-5 wt')).toEqual([2, 3, 4, 5]);
    expect(sizeWeights('400gr | 6wt')).toEqual([6]);
    expect(sizeWeights('550gr')).toEqual([]);
  });
});

describe('guide taper chart', () => {
  it('one dot per taper, labelled by what the lines share', () => {
    const makers = [
      maker('rio', [
        product({ id: 'p', name: 'Premier Gold', series: 'Premier', sizes: [size(5, 146, { head: 47 })] }),
        product({ id: 'e', name: 'Elite Gold', series: 'Elite', sizes: [size(5, 146, { head: 47 })] }),
        product({ id: 'x', name: 'Premier Gold XP', series: 'Premier', sizes: [size(5, 150, { head: 42 })] }),
        product({ id: 's', name: 'Sinker', sizes: [size(5, 150, { head: 30, density: 'sink5' })] }),
        product({ id: 'n', name: 'Indicator', category: 'nymph', sizes: [size(5, 185)] }),
        product({ id: 'o', name: 'Old', discontinued: true, sizes: [size(5, 160, { head: 35 })] }),
      ]),
    ];
    const points = chartPoints(makers);
    expect(points.map((p) => [p.label, p.head, p.grains])).toEqual([
      ['Gold (Elite/Premier)', 47, 146],
      ['Premier Gold XP', 42, 150],
    ]);
    expect(points[1].heaviness).toBe('½ size heavy');
    expect(chartPoints(makers, { discontinued: true })).toHaveLength(3);
    expect(chartPoints(makers, { maker: 'other' })).toHaveLength(0);
  });
  it('joins names that differ beyond the series', () => {
    expect(taperLabel([product({ name: 'A' }), product({ name: 'B' })])).toBe('A / B');
  });
  it('names a taper sold in many series once, with the series count', () => {
    const p = (name, series) => product({ name, series });
    expect(taperName(p('Amplitude Smooth MPX', 'Amplitude Smooth'))).toBe('MPX');
    expect(taperName(p('Air Cel Trout', 'Air Cel / Wet Cel'))).toBe('Trout');
    expect(taperLabel([p('Mastery MPX', 'Mastery'), p('Frequency MPX', 'Frequency'), p('Frequency Boost', 'Frequency'), p('Amplitude Smooth MPX', 'Amplitude Smooth')])).toBe(
      'MPX / Boost (3 series)',
    );
  });
  it('the SA chart has one MPX dot across its tiers', () => {
    const mpx = chartPoints([sa]).filter((p) => p.products.some((x) => x.name.endsWith(' MPX')));
    expect(mpx).toHaveLength(1);
    expect(mpx[0]).toMatchObject({ head: 36, grains: 150 });
    expect(mpx[0].series.length).toBeGreaterThan(2);
  });
  it('the RIO chart pairs Elite and Premier Gold', () => {
    const labels = chartPoints([rio]).map((p) => p.label);
    expect(labels).toContain('Gold (Elite/Premier)');
    expect(labels).toContain('Gold Max (Elite/Premier)');
  });
});

describe('guide → designer', () => {
  const size = (product, productName, weight, maker = 'RIO') => ({ id: `${product}-wf${weight}f`, product, productName, maker, line: { weight } });
  const presets = [
    size('rio-premier-gold', 'RIO Premier Gold', 5),
    size('rio-premier-gold', 'RIO Premier Gold', 8),
    size('rio-premier-gold-xp', 'RIO Premier Gold XP', 5),
    size('rio-technical-euro-nymph', 'RIO Premier Technical Euro Nymph', 3),
    size('rio-stillwater', 'RIO Stillwater', 6),
    size('rio-mystery', 'RIO Mystery Line', 6),
    { id: 'generic-wf5f', line: { weight: 5 } },
  ];
  const makers = [
    maker('rio', [
      product({ id: 'rio-premier-gold', name: 'Premier Gold' }),
      product({ id: 'rio-premier-gold-xp', name: 'Premier Gold XP' }),
      product({ id: 'rio-premier-technical-euro-nymph', name: 'Premier Technical Euro Nymph' }),
      product({ id: 'rio-elite-stillwater-floater', name: 'Elite Stillwater Floater' }),
      product({ id: 'rio-elite-gold', name: 'Elite Gold' }),
    ]),
  ];
  const links = linkProducts(makers, presets);

  it('links by product id, then by name', () => {
    expect(links.get('rio-premier-gold').map((p) => p.id)).toEqual(['rio-premier-gold-wf5f', 'rio-premier-gold-wf8f']);
    expect(links.get('rio-premier-gold-xp').map((p) => p.id)).toEqual(['rio-premier-gold-xp-wf5f']);
    expect(links.get('rio-premier-technical-euro-nymph').map((p) => p.id)).toEqual(['rio-technical-euro-nymph-wf3f']);
  });
  it('links a shorter catalog name to the one guide line holding all its words', () => {
    expect(links.get('rio-elite-stillwater-floater').map((p) => p.id)).toEqual(['rio-stillwater-wf6f']);
    expect(links.has('rio-elite-gold')).toBe(false);
    expect([...links.values()].flat().some((p) => p.product === 'rio-mystery')).toBe(false);
  });
  it('tries the size at the chosen weight, else the nearest', () => {
    const gold = links.get('rio-premier-gold');
    expect(nearestSize(gold, 5).id).toBe('rio-premier-gold-wf5f');
    expect(nearestSize(gold, 7).id).toBe('rio-premier-gold-wf8f');
    expect(nearestSize(gold, 6).id).toBe('rio-premier-gold-wf5f');
  });
  it('links the real catalog to the real guide data', () => {
    const real = linkProducts([rio, sa], LINE_PRESETS);
    for (const id of ['rio-premier-gold', 'rio-premier-aqualux', 'rio-premier-fathom', 'rio-premier-technical-euro-nymph', 'sa-sonar-titan-full-intermediate', 'sa-sonar-stillwater-clear-camo-intermediate'])
      expect(real.has(id), id).toBe(true);
    // Every catalog product links at most once.
    const products = [...real.values()].map((sizes) => sizes[0].product);
    expect(new Set(products).size).toBe(products.length);
  });
  it('links every maker line in the menu to a guide card', () => {
    const guides = Object.values(import.meta.glob('../data/guide/*.json', { eager: true, import: 'default' }));
    const linked = new Set([...linkProducts(guides, LINE_PRESETS).values()].map((sizes) => sizes[0].product));
    const unlinked = new Set(LINE_PRESETS.filter((p) => p.product && !linked.has(p.product)).map((p) => p.product));
    expect([...unlinked]).toEqual([]);
  });
});

describe('guide page url', () => {
  const args = { setup: structuredClone(DEFAULT_SETUP), presetId: LINE_PRESETS[0].id, side: 'drag', mode: 'reel' };
  it('has no setup params and comes back as the guide', () => {
    const q = new URLSearchParams(stateToQuery({ ...args, page: 'guide', demo: true }));
    expect(q.get('page')).toBe('guide');
    expect(q.get('demo')).toBe('1');
    expect(q.has('reel')).toBe(false);
    expect(queryToState(`?${q}`)).toMatchObject({ page: 'guide', hasSetup: false, demo: true });
  });
  it('an unknown page falls back to landing', () => {
    expect(queryToState('?page=nope')).toMatchObject({ page: null });
  });
  it('lands on the guide whatever the rack holds', () => {
    expect(landingPage({ page: 'guide', hasSetup: false }, 3)).toBe('guide');
    expect(resolveView(queryToState('?page=guide'), [])).toMatchObject({ page: 'guide', editingId: null });
  });
});
