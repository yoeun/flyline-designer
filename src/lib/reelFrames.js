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

// Handles smaller than this (rim = 200) get a bigger circle to click.
const HANDLE_HIT = 26;

// The SVG's contents without the outer <svg>, ids suffixed so several previews can share a page. With handles,
// a drawing whose spool turns (a [data-cage] group) gets a clear [data-handle] circle over each handle, inside
// the cage so it turns with it.
export function frameMarkup(design, side, suffix, { handles = false } = {}) {
  const svg = (FRAMES[design] ?? FRAMES.generic)[side] ?? FRAMES.generic.drag;
  const hits = handles
    ? (svg.match(/<svg[^>]*\sdata-handles="([^"]+)"/)?.[1] ?? '')
        .split(',')
        .filter(Boolean)
        .map((h) => {
          const [cx, cy, r] = h.split(' ').map(Number);
          return `<circle data-handle="" cx="${cx}" cy="${cy}" r="${Math.max(r, HANDLE_HIT)}" fill="transparent" style="cursor:pointer"/>`;
        })
        .join('')
    : '';
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/(<g data-cage="">[\s\S]*)<\/g>\s*$/, `$1${hits}</g>`)
    .replace(/(id="|url\(#|href="#)([\w-]+)/g, `$1$2-${suffix}`);
}

// Turns a spool's cage one more full turn clockwise, easing out to a stop where it started, so the drawing at
// rest never changes. A click mid-spin carries on from wherever the cage is.
export function spinCage(cage) {
  if (!cage || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const [a, b] = getComputedStyle(cage).transform.match(/-?[\d.e]+/g)?.map(Number) ?? [1, 0];
  const from = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  for (const anim of cage.getAnimations()) anim.cancel();
  Object.assign(cage.style, { transformBox: 'view-box', transformOrigin: '0 0' });
  // At least a full turn: from partway round, on through the next 360.
  const to = from ? 720 : 360;
  cage.animate([{ transform: `rotate(${from}deg)` }, { transform: `rotate(${to}deg)` }], {
    // A gentle ease-out: a sharper one starts so fast that the windows strobe and the spool seems to turn back.
    duration: 1600,
    easing: 'ease-out',
  });
}
