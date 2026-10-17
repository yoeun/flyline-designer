// Frame drawings per reel design and side. Each SVG uses the preview's coordinates
// (centered, rim radius 200) and paints its metal in currentColor.
import genericDrag from '../assets/reels/generic-drag.svg?raw';
import genericSpool from '../assets/reels/generic-spool.svg?raw';
import liquidSDrag from '../assets/reels/liquid-s-drag.svg?raw';
import liquidSSpool from '../assets/reels/liquid-s-spool.svg?raw';
import runDrag from '../assets/reels/run-drag.svg?raw';
import runSpool from '../assets/reels/run-spool.svg?raw';

export const FRAMES = {
  generic: { drag: genericDrag, spool: genericSpool },
  'liquid-s': { drag: liquidSDrag, spool: liquidSSpool },
  run: { drag: runDrag, spool: runSpool },
};

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
