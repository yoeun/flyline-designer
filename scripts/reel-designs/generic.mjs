// The generic reel: a plain three-spoke frame and a five-spoke spool, for reels without their own drawing.
// Drag side: the frame is a rim, the foot, three wide spokes (one up to the foot, two down) and a hub round the drag
// knob. Through it shows the spool's cage, which turns: its 12 windows, the same as the spool side's, without the
// handle (the wound line hides it).
import { P, circle, f, foot, knob, knurl, rad, recessed, ring, slots, spoke, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 116;

// The spool's 12 windows, shared by both sides.
const RIM = { n: 12, rIn: 116, rOut: 182, bar: 16, corner: 7, off: -60 };

export const drag = svg({
  cage: [ring(186, 106) + slots(RIM)],
  body: [ring(200, 184), foot(120), spoke(-90, 0, 192, 40, 34), spoke(30, 0, 192, 36, 28), spoke(150, 0, 192, 36, 28), circle(56)],
  details: `<path d="${knurl(44, 2, 24)}" fill="#2b2e31"/><circle r="34" fill="#3a3e42"/><circle r="12" fill="#2b2e31"/>`,
});

export const spool = svg({
  // Foot sits behind the spool on this side.
  foot: recessed(foot(120)),
  handles: [[...P(146, rad(-60)), 24]],
  body: [ring(200, 106) + slots(RIM), circle(36), ...[0, 72, 144, 216, 288].map((a) => spoke(a - 54, 0, 110, 18, 12))],
  details: `<circle cx="${f(P(146, rad(-60))[0])}" cy="${f(P(146, rad(-60))[1])}" r="24" fill="currentColor"/>${knob(...P(146, rad(-60)), 17)}<circle r="22" fill="#000" fill-opacity=".14"/><circle r="5" fill="#000" fill-opacity=".3"/>`,
});
