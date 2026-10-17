// Builds the line guide's data, src/data/guide/<maker>.json, from the research in data/lineups:
//   node scripts/gen-line-guide.mjs
// data/lineups holds one <maker>.json per maker (schema in data/lineups/SCHEMA.md). Every maker file
// found is written; re-run it when a lineup file changes. Only single-hand lines go in: Spey/Skagit/
// Scandi heads and shooting lines are listed by name under `omitted`.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINEUPS = new URL('../data/lineups/', import.meta.url).pathname;
const OUT = new URL('../src/data/guide/', import.meta.url).pathname;
const CATEGORIES = ['trout', 'nymph', 'streamer', 'lake', 'bass', 'salt'];

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

// A lineup file (data/lineups/SCHEMA.md) in the guide's shape.
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
        densityLabel: v.density_label ?? null,
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
  mkdirSync(OUT, { recursive: true });
  for (const file of readdirSync(LINEUPS).filter((f) => f.endsWith('.json')).sort()) {
    const maker = buildLineup(join(LINEUPS, file));
    writeFileSync(join(OUT, `${maker.id}.json`), JSON.stringify(maker, null, 1) + '\n');
    console.log(`${maker.id}.json: ${maker.products.length} products, ${maker.products.reduce((n, p) => n + p.sizes.length, 0)} sizes`);
  }
}
