// Frame drawings per reel design and side. Each SVG uses the preview's coordinates
// (centered, rim radius 200) and paints its metal in currentColor.
// Every <design>-<side>.svg in src/assets/reels (drawn by scripts/gen-reel-frames.mjs), as { design: { drag, spool } }.
const FILES = import.meta.glob('../assets/reels/*.svg', { query: '?raw', import: 'default', eager: true });
export const FRAMES = {};
for (const [path, svg] of Object.entries(FILES)) {
  const [, design, side] = path.match(/([\w-]+)-(drag|spool)\.svg$/);
  (FRAMES[design] ??= {})[side] = svg;
}

// The radius (rim = 200) a design draws its spool's arbor at, or undefined if it doesn't say.
export function frameArbor(design) {
  const arbor = FRAMES[design]?.drag?.match(/<svg[^>]*\sdata-arbor="([\d.]+)"/)?.[1];
  return arbor ? Number(arbor) : undefined;
}

export const SIDES = [
  ['drag', 'Drag'],
  ['spool', 'Spool'],
];

// The SVG's contents without the outer <svg>, ids suffixed so several previews can share a page.
export function frameMarkup(design, side, suffix) {
  const svg = (FRAMES[design] ?? FRAMES.generic)[side] ?? FRAMES.generic.drag;
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/(id="|url\(#|href="#)([\w-]+)/g, `$1$2-${suffix}`);
}
