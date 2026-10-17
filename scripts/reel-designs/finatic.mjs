// Hatch Finatic Gen 2.
// Spool side from angled photos (shot with the foot to the left), turned upright and read straight-on.
// No drag-side photo was found: the Finatic and Iconic frames are closely related, so the drag side reuses
// the Iconic's swirl of arms with the Finatic's smaller drag cap — inferred, not checked against a photo.
import { f } from './lib.mjs';
import { hatchSpool, iconicDrag } from './iconic.mjs';

// The Finatic's counterweight: a silver collar around a hex-socket screw.
const hexCounterweight = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#c9c6bd"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="url(#sheen)"/>` +
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.6}" fill="#9a978f"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.25}" fill="#3a3c3e"/>`;

export const drag = iconicDrag({ hub: 64, cap: 54 });

// Thirteen long tapered bars swept back between rim and inner ring; seven curved spokes around a smaller hub.
export const spool = hatchSpool({
  inner: 126,
  bars: 13,
  barSweep: -30,
  barBend: -8,
  barWidth: 24,
  spokes: 7,
  spokeSweep: 20,
  spokeBend: 8,
  hub: 50,
  cap: 40,
  handle: -55,
  counter: hexCounterweight,
});
