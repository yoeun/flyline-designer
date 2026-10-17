// Draws the reel frame SVGs in src/assets/reels: one per design and side. Each design is a module in
// scripts/reel-designs exporting `drag` and `spool` SVG text, built from the shapes in its lib.mjs.
// Run `npm run reels` after adding or editing a design, and commit the regenerated SVGs with it.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2] ?? new URL('../src/assets/reels', import.meta.url).pathname;
const DESIGNS = new URL('./reel-designs/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const names = readdirSync(DESIGNS)
  .filter((file) => file.endsWith('.mjs') && file !== 'lib.mjs')
  .map((file) => file.replace(/\.mjs$/, ''))
  .sort();
for (const name of names) {
  const design = await import(new URL(`${name}.mjs`, DESIGNS));
  // A module with neither side only shares shapes with other designs.
  if (!design.drag && !design.spool) continue;
  for (const side of ['drag', 'spool']) {
    if (!design[side]) throw new Error(`${name} has no ${side} side`);
    writeFileSync(`${OUT}/${name}-${side}.svg`, design[side]);
  }
}
console.log(names.filter((n) => existsSync(`${OUT}/${n}-drag.svg`)).join(' '));
