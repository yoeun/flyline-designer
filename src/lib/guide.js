// The line guide's logic: filters, the heaviness label, the taper chart's points and the guide → designer link.
// Maker data is src/data/guide/<maker>.json, written by scripts/gen-line-guide.mjs.

// What a line is built for; the research lineups use these category ids.
export const CATEGORIES = [
  { id: 'trout', name: 'Trout dry & all-round' },
  { id: 'nymph', name: 'Indicator & euro' },
  { id: 'streamer', name: 'Streamer & sinking' },
  { id: 'lake', name: 'Lakes' },
  { id: 'bass', name: 'Bass & predator' },
  { id: 'salt', name: 'Saltwater' },
];

const DENSITY_NAMES = { floating: 'Floating', intermediate: 'Intermediate', hover: 'Hover', sinktip: 'Sink tip', multi: 'Multi-density' };
export const densityName = (size) => size.densityLabel || DENSITY_NAMES[size.density] || (/^sink(\d)$/.test(size.density ?? '') ? `Sink ${size.density.slice(4)}` : size.density ?? '—');

// AFFTA's 30 ft standard: the center grain weight of the first 30 ft of line for each line weight.
export const AFFTA_GRAINS = { 1: 60, 2: 80, 3: 100, 4: 120, 5: 140, 6: 160, 7: 185, 8: 210, 9: 240, 10: 280, 11: 330, 12: 380, 13: 450, 14: 500, 15: 550 };
const AFFTA_STEPS = Object.keys(AFFTA_GRAINS).map(Number);

// The line weight a 30 ft grain weight matches on the AFFTA scale, between whole sizes as needed.
export function equivalentWeight(grains) {
  // The AFFTA step at or above the grains, past either end of the scale extended from the end step.
  let i = AFFTA_STEPS.findIndex((w) => AFFTA_GRAINS[w] >= grains);
  if (i === -1) i = AFFTA_STEPS.length - 1;
  if (i === 0) i = 1;
  const a = AFFTA_STEPS[i - 1], b = AFFTA_STEPS[i];
  return a + (grains - AFFTA_GRAINS[a]) / (AFFTA_GRAINS[b] - AFFTA_GRAINS[a]);
}

const half = (n) => (n % 1 ? `${Math.floor(n) || ''}½` : String(n));

// "True to weight", "½ size heavy", "1½ sizes light" … from an offset in line sizes. Within about a third of a
// size counts as true to weight (AFFTA's tolerance, ±6 gr at 5 wt); past it, the nearest half size, at least ½.
export function heavinessLabel(offset) {
  if (Math.abs(offset) < 0.35) return 'True to weight';
  const n = Math.max(0.5, Math.round(Math.abs(offset) * 2) / 2);
  return `${half(n)} ${n > 1 ? 'sizes' : 'size'} ${offset > 0 ? 'heavy' : 'light'}`;
}

// How heavy a product runs against the AFFTA standard: the average over its single-weight sizes with a published 30 ft weight.
export function heaviness(product) {
  const offsets = product.sizes
    .filter((s) => s.weights?.length === 1 && s.weights[0] in AFFTA_GRAINS && Number.isFinite(s.grains30))
    .map((s) => equivalentWeight(s.grains30) - s.weights[0]);
  if (!offsets.length) return null;
  const offset = offsets.reduce((a, b) => a + b, 0) / offsets.length;
  return { offset, label: heavinessLabel(offset), count: offsets.length };
}

const range = (values) => (values.length ? [Math.min(...values), Math.max(...values)] : null);
export const formatRange = (r, unit = '') => (r ? (r[0] === r[1] ? `${r[0]}${unit}` : `${r[0]}–${r[1]}${unit}`) : '—');

// The rod weights, densities and head lengths a product comes in.
export function productFacts(product) {
  const weights = [...new Set(product.sizes.flatMap((s) => s.weights ?? []))].sort((a, b) => a - b);
  const densities = [...new Set(product.sizes.map(densityName))];
  return { weights, densities, head: range(product.sizes.map((s) => s.head).filter(Number.isFinite)) };
}

const searchText = (maker, p) => [maker.maker, p.name, p.series, p.summary, p.primaryUse, p.secondaryUse, p.weightLabel].filter(Boolean).join(' ').toLowerCase();

// The products to show, maker by maker in the given order: each maker's lines by popularity, discontinued last.
// Filters: maker id (null = all), series name, category id, rod weight, search words (all must match), discontinued shown or not.
export function filterProducts(makers, { maker = null, series = null, category = null, weight = null, search = '', discontinued = false } = {}) {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);
  return makers
    .filter((m) => !maker || m.id === maker)
    .map((m) => ({
      maker: m,
      products: m.products
        .filter(
          (p) =>
            (discontinued || !p.discontinued) &&
            (!series || p.series === series) &&
            (!category || p.category === category) &&
            (weight === null || p.sizes.some((s) => s.weights?.includes(weight))) &&
            words.every((w) => searchText(m, p).includes(w)),
        )
        .sort((a, b) => Number(a.discontinued) - Number(b.discontinued) || (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.name.localeCompare(b.name)),
    }));
}

// A product name as comparable words: no maker, no "line"/"fly", no punctuation ("RIO Premier Technical Euro Nymph" → "premier technical euro nymph").
const nameWords = (name, maker) => {
  const drop = new Set(['fly', 'line', ...maker.toLowerCase().split(/\s+/), maker === 'Scientific Anglers' ? 'sa' : '']);
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, ' ')
    .split(' ')
    .filter((w) => w && !drop.has(w));
};

// Which designer sizes each guide product has, from the data: a catalog product links to the guide product
// with its id, else the one with its name, else the only one of its maker whose name has all its words
// ("Sonar Stillwater Clear Camo" → "Sonar Stillwater Clear Camo Intermediate"). Returns guide id → presets.
export function linkProducts(makers, presets) {
  const catalog = new Map();
  for (const p of presets) if (p.product) catalog.set(p.product, [...(catalog.get(p.product) ?? []), p]);
  const guide = makers.flatMap((m) => m.products.map((p) => ({ id: p.id, maker: m.maker, words: nameWords(p.name, m.maker) })));
  const links = new Map();
  for (const [id, sizes] of catalog) {
    const { maker, productName } = sizes[0];
    const words = nameWords(productName, maker);
    const mine = guide.filter((g) => g.maker === maker && !links.has(g.id));
    const contains = mine.filter((g) => words.every((w) => g.words.includes(w)));
    const match =
      mine.find((g) => g.id === id) ?? mine.find((g) => g.words.join(' ') === words.join(' ')) ?? (contains.length === 1 ? contains[0] : null);
    if (match) links.set(match.id, sizes);
  }
  return links;
}

// A maker's series, best-selling first (by each series' best-ranked line), then by name.
const bestRank = (products) => Math.min(...products.map((p) => p.rank ?? Infinity));
export const makerSeries = (maker) => groupBySeries(maker.products).map((g) => g.series).filter(Boolean);

// Products under their series headings, in makerSeries order; lines with no series come last.
export function groupBySeries(products) {
  const groups = new Map();
  for (const p of products) {
    if (!groups.has(p.series ?? null)) groups.set(p.series ?? null, []);
    groups.get(p.series ?? null).push(p);
  }
  return [...groups.entries()]
    .map(([series, list]) => ({ series, products: list }))
    .sort((a, b) => (a.series === null) - (b.series === null) || bestRank(a.products) - bestRank(b.products) || String(a.series).localeCompare(String(b.series)));
}

// A product's name without its series ("Amplitude Smooth MPX" → "MPX"); series like "Air Cel / Wet Cel" match either part.
export function taperName(product) {
  const prefixes = product.series ? [product.series, ...product.series.split(/\s*\/\s*/)] : [];
  const prefix = prefixes.find((s) => product.name.startsWith(`${s} `));
  return prefix ? product.name.slice(prefix.length + 1) : product.name;
}

// One label for products sharing a taper: the taper names, then the series that sell it —
// "Gold (Elite/Premier)", or "MPX / Boost (4 series)" when there are more than two.
export function taperLabel(products) {
  if (products.length === 1) return products[0].name;
  const names = [...new Set(products.map(taperName))];
  const series = [...new Set(products.map((p) => p.series).filter(Boolean))].sort();
  if (series.length < 2) return products.map((p) => p.name).join(' / ');
  return `${names.join(' / ')} (${series.length > 2 ? `${series.length} series` : series.join('/')})`;
}

// The taper chart: a maker's floating trout lines at 5 wt, one point per distinct taper (head length and 30 ft grains).
export function chartPoints(makers, { maker = null, discontinued = false, weight = 5 } = {}) {
  const groups = new Map();
  for (const m of makers) {
    if (maker && m.id !== maker) continue;
    for (const p of m.products) {
      if (p.category !== 'trout' || (p.discontinued && !discontinued)) continue;
      const size = p.sizes.find((s) => s.weights?.length === 1 && s.weights[0] === weight && s.density === 'floating' && Number.isFinite(s.head) && Number.isFinite(s.grains30));
      if (!size) continue;
      const key = `${m.id}|${size.head}|${size.grains30}`;
      if (!groups.has(key)) groups.set(key, { key, makerId: m.id, maker: m.maker, head: size.head, grains: size.grains30, products: [] });
      groups.get(key).products.push(p);
    }
  }
  return [...groups.values()].map((g) => ({ ...g, label: taperLabel(g.products), series: [...new Set(g.products.map((p) => p.series).filter(Boolean))], heaviness: heavinessLabel(equivalentWeight(g.grains) - weight) }));
}
