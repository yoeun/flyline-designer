// Hatch Finatic Gen 2.
// The spool side is the Iconic's.
// No drag-side photo was found: the Finatic and Iconic frames are closely related, so the drag side reuses
// the Iconic's swirl of arms with the Finatic's smaller drag cap — inferred, not checked against a photo.
import { f } from './lib.mjs';
import { hatchSpool, iconicDrag } from './iconic.mjs';

// The Finatic's counterweight: a silver collar around a hex-socket screw.
const hexCounterweight = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#c9c6bd"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="url(#sheen)"/>` +
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.6}" fill="#9a978f"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.25}" fill="#3a3c3e"/>`;

export const drag = iconicDrag({ hub: 64, cap: 54 });

// The spool is the Iconic's: its outer cage, base ring and eight straight spokes, with the Finatic's own
// counterweight.
export const spool = hatchSpool({ straight: 8, hub: 48, cap: 40, counter: hexCounterweight });
