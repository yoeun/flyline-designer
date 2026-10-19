// Piscifun Sword II.
// The same reel as the original Sword (per the user, and Piscifun's Sword II photos bear out the hole pattern), but
// its spool's thick outer rim is drilled with a ring of small holes, 24 of them, one every 15°, each in a
// straight-sided recessed pocket running in to the flange hole in line with it; the groove between rim and cage
// touches the big holes and stops at each pocket. Everything else, the drag side included, is the Sword's: see sword.mjs.
import { P, rad } from './lib.mjs';
import { drag, spoolSide } from './sword.mjs';

export { arbor } from './sword.mjs';
export { drag };

const RIM_HOLES = Array.from({ length: 24 }, (_, k) => [...P(191, rad(-90 + k * 15)), 4.5]);
// The groove between rim and cage runs tangent to the big holes' outer edges (147 + 27).
export const spool = spoolSide({ rimHoles: RIM_HOLES, grooveR: 174, id: 'sword-ii' });
