// Builds the line guide's data, src/data/guide/<maker>.json, from the research files:
//   node scripts/gen-line-guide.mjs --lineups <dir> [--rio <dir>]
// --lineups holds one <maker>.json per maker (the research lineup schema); --rio holds RIO's
// rio.json (raw per-size specs from the RIO store) and data.json (cleaned tags, tiers and ranks).
// Every maker file found is written; re-run it when more lineup files land. Only single-hand lines
// go in: Spey/Skagit/Scandi heads and shooting lines are listed by name under `omitted`.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = new URL('../src/data/guide/', import.meta.url).pathname;
const CATEGORIES = ['trout', 'nymph', 'streamer', 'lake', 'bass', 'salt'];

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : null;
};
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const kebab = (text) =>
  text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const num = (v) => (Number.isFinite(v) ? v : null);

// Rod weights a size label covers: "5wt" → [5], "7/8wt" → [7, 8], "2-5 wt" → [2, 3, 4, 5], "WF6F/H/I" → [6].
// Grain-rated heads ("550gr") and lb/inch ratings have none.
export function sizeWeights(label) {
  const text = String(label ?? '');
  const wt = text.match(/(\d+)\s*(?:[-/]\s*(\d+))?\s*wt/i) ?? text.match(/^(?:WF|DT|ST|LT)?(\d+)(?:\s*[-/]\s*(\d+))?(?=[A-Z]|$|\/)/i);
  if (!wt) return [];
  const a = Number(wt[1]);
  const b = wt[2] ? Number(wt[2]) : a;
  if (!(a >= 0 && b >= a && b <= 16)) return [];
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

// RIO's sink rate text → the lineup schema's density kinds.
function rioDensity(sink) {
  if (!sink || sink === 'Float') return { density: 'floating', densityLabel: 'Floating', sinkIps: null };
  const parts = sink.split('/').map((s) => s.trim());
  const ips = (s) => {
    const m = s.match(/([\d.]+)\s*(?:-\s*([\d.]+))?\s*ips/i);
    return m ? Number(m[2] ?? m[1]) : null;
  };
  const label = sink.replace(/\s*-\s*/g, '–').replace(/\s*ips/gi, ' ips').replace(/\bInt\b/g, 'Intermediate');
  if (parts.length > 1 || /^F\//.test(sink)) {
    const floatingBody = /^(F|Float)$/i.test(parts[0]);
    return { density: floatingBody && parts.length === 2 ? 'sinktip' : 'multi', densityLabel: label, sinkIps: null };
  }
  if (/^(Intermediate|Int|I)$/i.test(sink)) return { density: 'intermediate', densityLabel: 'Intermediate', sinkIps: null };
  const rate = ips(sink);
  if (rate === null) return { density: 'multi', densityLabel: label, sinkIps: null };
  if (rate <= 1) return { density: 'hover', densityLabel: label, sinkIps: rate };
  if (rate <= 2) return { density: 'intermediate', densityLabel: label, sinkIps: rate };
  return { density: `sink${Math.min(8, Math.round(rate))}`, densityLabel: label, sinkIps: rate };
}

// RIO store copy runs the tags, feature bullets and sentences together; keep its first real sentence.
function rioSummary(desc) {
  let text = desc.replace(/^.*?Secondary:\s*/s, '').replace(/^.*?Primary:\s*/s, '');
  const words = text.split(/\s+/);
  let start = words.findIndex((w, i) => /^[A-Z]/.test(w) && /^[a-z]/.test(words[i + 1] ?? ''));
  if (start < 0) return null;
  while (start > 0 && /^[A-Z]{2,}[’']?s?$/.test(words[start - 1])) start--;
  text = words.slice(start).join(' ');
  if (/^[A-Z ,’'\-]{20,}/.test(text)) text = text.replace(/^([A-Z ,’'\-]+)(?=\s[A-Z][a-z])/, (s) => s.charAt(0) + s.slice(1).toLowerCase());
  const sentence = text.split(/(?<=[a-z0-9)])\.\s|(?<=[a-z])\s(?=[A-Z][a-z]+[\s,-]+[a-z])/)[0].trim();
  return sentence.length > 25 ? sentence.replace(/\.$/, '') + '.' : null;
}

// Where the store copy doesn't yield a clean sentence: rewritten from RIO's own use tags and copy.
const RIO_SUMMARIES = {
  'rio-premier-24ft-sink-tip': 'A floating line with a 24 ft sinking tip for streamers in rivers and lakes.',
  'rio-premier-redfish': 'A floating line for quick shots at redfish in warm water.',
  'rio-premier-redfish-xp': 'The Redfish line made heavier, for bigger flies and wind.',
  'rio-premier-tarpon-clear-tip-floater': 'A floating tarpon line with a 10 ft clear tip for stealthy presentations and shorter leaders.',
  'rio-euro-nymph-shorty': 'A short euro-nymphing section that converts a regular fly line for euro nymphing.',
  'rio-ambassador-series-phil-rowley-lake': 'Phil Rowley’s lake lines with an integrated tippet ring, in floating, midge tip, hover and intermediate versions.',
  'rio-elite-single-handed-spey': 'A line for roll and single-handed Spey casts with streamers and soft hackles.',
  'rio-premier-dog-days-gold': 'The Gold taper with a coating made for hot conditions.',
  'rio-premier-glacial-gold': 'A deep-winter trout line with PolarFlex technology that keeps it soft and pliable in the coldest conditions.',
  'rio-elite-musky-outbound': 'An intermediate line with a sink 5 tip for casting huge musky flies.',
  'rio-ambassador-series-flats-passport': 'Oliver White’s signature flats taper.',
  'rio-premier-fathom': 'A full-sinking line with a uniform sink for straight-line contact in lakes and rivers.',
};

const RIO_EXPLAINER = [
  'Most of RIO’s trout and saltwater tapers come in two versions, Elite and Premier, with the same taper. Elite lines add RIO’s low-stretch ConnectCore Plus core for sharper bite detection and hook sets, cost about $130 against about $100 for Premier, run 100 ft long in 7–8 wt, and come in fewer sizes. If you don’t need the extra sensitivity, the Premier version casts the same.',
  'The Gold family is three trout tapers that trade finesse for power. At 5 wt, Gold has a 47 ft head and 146 gr in the first 30 ft (standard weight, built for dries and dry-droppers at medium to long range); Gold XP has a 42 ft head and 150 gr (½ size heavy, for dry-droppers and light indicators); Gold Max has a 37 ft head and 160 gr (a full size heavy, for heavy indicators, big dries and light streamers on fast rods).',
  'Avid ($70–80) and Mainstream ($50) are RIO’s lower-priced lines. Ambassador Series lines are signature tapers designed with named guides and anglers. Spey, Skagit and Scandi lines and shooting lines are left out of this guide.',
];

function buildRio(dir) {
  const raw = readJson(join(dir, 'rio.json'));
  const data = readJson(join(dir, 'data.json'));
  const byHandle = new Map(raw.map((p) => [p.handle, p]));
  const products = data.lines.map((line, i) => {
    const src = byHandle.get(line.handle);
    const name = line.name.replace(/—/g, ' ');
    return {
      id: `rio-${kebab(name)}`,
      name: name.replace(/\s+/g, ' '),
      series: line.tier === 'Other' ? null : line.tier,
      category: line.cat,
      discontinued: false,
      rank: i + 1,
      rankSource: 'RIO store best-seller order, single-hand lines',
      price: num(line.price),
      priceNote: null,
      primaryUse: line.primary || null,
      secondaryUse: line.secondary || null,
      weightLabel: line.power || null,
      summary: RIO_SUMMARIES[`rio-${kebab(name)}`] ?? rioSummary(src.desc),
      url: line.url,
      sizes: src.variants.map((v) => {
        const weights = sizeWeights(v.size);
        const sink = v.sink ?? (line.sinks.length === 1 ? line.sinks[0] : null);
        return {
          label: v.size,
          weights,
          ...(v.sink || line.floatOnly ? rioDensity(v.sink ?? 'Float') : { density: 'multi', densityLabel: sink ?? 'See maker', sinkIps: null }),
          head: num(v.head),
          total: num(v.total),
          grains30: num(v.w30),
          headGrains: num(v.hw),
          colors: v.colors ?? [],
        };
      }),
    };
  });
  return {
    id: 'rio',
    maker: 'RIO',
    retrieved: '2026-10-16',
    sources: ['https://farbank.com/collections/rio-fly-lines'],
    explainer: RIO_EXPLAINER,
    omitted: data.spey,
    products,
  };
}

// Blank-line paragraphs; one long block is broken every few sentences so it reads on a phone.
function paragraphs(text) {
  const blocks = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  if (blocks.length !== 1 || blocks[0].length < 600) return blocks;
  const out = [];
  for (const sentence of blocks[0].split(/(?<=[.!?)])\s+(?=[A-Z])/)) {
    if (out.length && out.at(-1).length < 400) out[out.length - 1] += ` ${sentence}`;
    else out.push(sentence);
  }
  return out;
}

// A research lineup file (scratchpad lineups/SCHEMA.md) in the guide's shape.
function buildLineup(path) {
  const src = readJson(path);
  const id = kebab(src.brand);
  const single = src.products.filter((p) => CATEGORIES.includes(p.category));
  const omitted = [...(src.omitted ?? []), ...src.products.filter((p) => !CATEGORIES.includes(p.category)).map((p) => p.name)];
  return {
    id,
    maker: src.brand,
    retrieved: src.retrieved ?? null,
    sources: src.source_urls ?? [],
    explainer: paragraphs(String(src.how_the_lineup_is_organized ?? '')),
    omitted,
    products: single.map((p) => ({
      id: p.id,
      name: p.name,
      series: p.series ?? null,
      category: p.category,
      discontinued: p.status === 'discontinued',
      rank: num(p.popularity_rank),
      rankSource: p.popularity_source ?? null,
      price: num(p.price_usd),
      priceNote: p.price_note ?? null,
      primaryUse: p.primary_use ?? null,
      secondaryUse: p.secondary_use ?? null,
      weightLabel: p.weight_label ?? null,
      summary: p.summary ?? null,
      url: p.url ?? null,
      sizes: (p.variants ?? []).map((v) => ({
        label: v.label,
        weights: Number.isFinite(v.weight) ? [v.weight] : sizeWeights(v.label),
        density: v.density ?? null,
        densityLabel: null,
        sinkIps: num(v.sink_ips),
        head: num(v.head_ft),
        total: num(v.total_ft),
        grains30: num(v.grains_30ft),
        headGrains: num(v.head_grains),
        colors: v.colors ?? [],
      })),
    })),
  };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const lineups = arg('lineups');
  const rio = arg('rio');
  if (!lineups && !rio) {
    console.error('usage: node scripts/gen-line-guide.mjs --lineups <dir> [--rio <dir>]');
    process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });
  const makers = [];
  if (rio) makers.push(buildRio(rio));
  if (lineups && existsSync(lineups)) {
    for (const file of readdirSync(lineups).filter((f) => f.endsWith('.json')).sort()) {
      const maker = buildLineup(join(lineups, file));
      if (rio && maker.id === 'rio') continue;
      makers.push(maker);
    }
  }
  for (const maker of makers) {
    writeFileSync(join(OUT, `${maker.id}.json`), JSON.stringify(maker, null, 1) + '\n');
    console.log(`${maker.id}.json: ${maker.products.length} products, ${maker.products.reduce((n, p) => n + p.sizes.length, 0)} sizes`);
  }
}
