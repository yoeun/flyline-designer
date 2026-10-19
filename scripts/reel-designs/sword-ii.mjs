// Piscifun Sword II.
// The same reel as the original Sword (per the user, and Piscifun's Sword II photos bear out the hole pattern), but
// its spool's thick outer rim is drilled with a ring of small holes, 24 of them, one every 15°, each in a
// straight-sided recessed pocket running in to the flange hole in line with it; the groove between rim and cage
// stops at each pocket. Everything else, the drag side included, is the Sword's: see sword.mjs.
import { P, rad } from './lib.mjs';
import { drag, spoolSide } from './sword.mjs';

export { arbor } from './sword.mjs';
export { drag };

const RIM_HOLES = Array.from({ length: 24 }, (_, k) => [...P(191, rad(-90 + k * 15)), 4.5]);
export const spool = spoolSide({ rimHoles: RIM_HOLES, id: 'sword-ii' });
