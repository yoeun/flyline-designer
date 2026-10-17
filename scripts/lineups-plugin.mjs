// Vite plugin for `import * as LINEUP from 'lineups:<maker>'`: data/lineups/<maker>.json with each
// product as a named export (its id), keeping only what the line menu reads per size. Reach products
// with a literal id (LINEUP['rio-premier-gold']) so the bundle keeps just the ones the menu uses.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../data/lineups/', import.meta.url));
const PREFIX = 'lineups:';

const num = (v) => (Number.isFinite(v) ? v : null);

// A lineup variant as a menu size spec: { product, label, densityLabel?, weight, density, head,
// total, taper? }. `taper` is the maker's own split (front, body, back, running), where it
// publishes one for that size. Sizes are written as (pure) calls to keep the bundle small.
const SIZE = `const size = (product, label, weight, density, head, total, densityLabel, taper) => ({
  product, label, ...(densityLabel ? { densityLabel } : {}), weight, density, head, total, ...(taper ? { taper } : {}),
});`;
const args = (v) => [v.label, num(v.weight), v.density ?? null, num(v.head_ft), num(v.total_ft), v.density_label ?? null, v.taper_ft ?? null];

export function lineupModule(maker) {
  const { products } = JSON.parse(readFileSync(`${DIR}${maker}.json`, 'utf8'));
  const exports = products.map((p, i) => {
    const sizes = p.variants.map((v) => `/* @__PURE__ */ size(id${i}, ${JSON.stringify(args(v)).slice(1, -1)})`);
    return `const id${i} = ${JSON.stringify(p.id)};\nconst p${i} = { id: id${i}, sizes: [${sizes.join(', ')}] };\nexport { p${i} as ${JSON.stringify(p.id)} };`;
  });
  return [SIZE, ...exports].join('\n');
}

export default function lineups() {
  return {
    name: 'lineups',
    resolveId: (id) => (id.startsWith(PREFIX) ? `\0${id}` : null),
    load(id) {
      if (!id.startsWith(`\0${PREFIX}`)) return null;
      const maker = id.slice(PREFIX.length + 1);
      this.addWatchFile(`${DIR}${maker}.json`);
      return lineupModule(maker);
    },
  };
}
