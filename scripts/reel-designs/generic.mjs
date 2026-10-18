// The generic reel: a plain three-spoke frame and a five-spoke spool, for reels without their own drawing.
import { P, circle, f, foot, knob, knurl, rad, ring, slots, spoke, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 116;

export const drag = svg({
  back: [ring(186, 108) + slots({ n: 20, rIn: 118, rOut: 176, bar: 11, corner: 6 })],
  body: [ring(200, 184), foot(120), spoke(-90, 0, 192, 40, 34), spoke(30, 0, 192, 36, 28), spoke(150, 0, 192, 36, 28), circle(56)],
  details: `<path d="${knurl(44, 2, 24)}" fill="#2b2e31"/><circle r="34" fill="#3a3e42"/><circle r="12" fill="#2b2e31"/>`,
});

export const spool = svg({
  // Foot sits behind the spool on this side.
  back: [foot(120)],
  body: [ring(200, 106) + slots({ n: 12, rIn: 116, rOut: 182, bar: 16, corner: 7, off: -60 }), circle(36), ...[0, 72, 144, 216, 288].map((a) => spoke(a - 54, 0, 110, 18, 12))],
  details: `<circle cx="${f(P(146, rad(-60))[0])}" cy="${f(P(146, rad(-60))[1])}" r="24" fill="currentColor"/>${knob(...P(146, rad(-60)), 17)}<circle r="22" fill="#000" fill-opacity=".14"/><circle r="5" fill="#000" fill-opacity=".3"/>`,
});
