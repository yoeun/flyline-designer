// Maxcatch Avid Pro.
// Drag side drawn from Maxcatch's near-frontal shot of the black 5Seven (beside the rose gold one) and the
// three-quarter rose gold shot. The frame is a thin rim, the foot and three broad spokes from a triangular boss —
// one up into the foot with a slot in it, one out to the left with a slot, one down to the right with a small
// hole — and a big silver drag knob, with a screw at the top of the top spoke. Through it shows the spool's cage,
// which turns: the spool side's ring of about eighteen windows round a thin inner ring, open inside it. The handle
// and counterweight pads would show through too, but the wound line hides them.
// Spool side drawn from the three-quarter handle-side shot: the same window ring and inner ring round an open
// center crossed by three spokes from the silver knurled spool cap, the black handle on a pad at about 2 o'clock
// and a silver counterweight across at about 8. That shot is at an angle, so the spool spokes' angles and widths
// and the window count on both sides are approximate.
import { P, circle, f, foot, knob, knurl, pad, rad, recessed, ring, roundPoly, screw, slots, strut, svg } from './lib.mjs';

// Super large arbor: the 5Seven's spool is 56 mm inside a 95 mm rim, so 200 × 56 / 95.
export const arbor = 118;

const SILVER = '#9f9fa0';
// The window ring both sides share: windows between the rim band and a thin inner ring.
const WINDOWS = { n: 18, rIn: 134, rOut: 185, bar: 14, corner: 10, off: -90 };
const spoolRing = () => ring(200, 122) + slots(WINDOWS);

// A slot along a spoke, from r0 to r1 at `deg`, w wide.
const slot = (deg, r0, r1, w) => strut(P(r0, rad(deg)), P(r1, rad(deg)), w);

const FOOT = foot(142, -244, 14, 32);

export const drag = svg({
  cage: [ring(192, 122) + slots(WINDOWS)],
  body: [
    ring(200, 188),
    FOOT,
    // Top spoke into the foot, with a slot.
    strut(P(40, rad(-120)), P(196, rad(-88)), 74, 50) + slot(-90, 98, 124, 18),
    // Left spoke, slanting a little down, with a slot.
    strut(P(40, rad(140)), P(196, rad(168)), 70, 44) + slot(162, 100, 122, 16),
    // Lower right spoke, with a small hole near the rim.
    strut(P(40, rad(10)), P(196, rad(36)), 70, 44) + circle(6, ...P(150, rad(32))),
    circle(84),
  ],
  details:
    `<circle r="188" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    // The silver drag knob: a knurled rim round a flat face.
    `<circle r="72" fill="#000" fill-opacity=".25"/>` +
    `<path d="${knurl(66, 1.5, 54)}" fill="#7d7e7f"/><path d="${knurl(66, 1.5, 54)}" fill="url(#sheen)"/>` +
    `<circle r="58" fill="${SILVER}"/><circle r="58" fill="url(#sheen)"/>` +
    `<circle r="58" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/>` +
    screw(...P(176, rad(-89)), 6),
});

const handle = P(156, rad(-20));
const weight = P(156, rad(160));

export const spool = svg({
  foot: recessed(FOOT),
  handles: [[...handle, 18]],
  body: [
    spoolRing(),
    strut([0, 0], P(126, rad(-20)), 40, 34),
    strut([0, 0], P(126, rad(100)), 34, 26),
    strut([0, 0], P(126, rad(-140)), 34, 26),
    circle(50),
    pad(156, -20, 34, 46),
    pad(156, 160, 34, 46),
  ],
  details:
    `<circle r="122" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="185" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    // Silver knurled spool cap.
    `<path d="${knurl(44, 1.5, 40)}" fill="#7d7e7f"/><circle r="36" fill="${SILVER}"/><circle r="36" fill="url(#sheen)"/>` +
    // Silver counterweight in a black ring, and the black handle.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="18" fill="#1f2123"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="14" fill="${SILVER}"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="14" fill="url(#sheen)"/>` +
    knob(...handle, 18),
});
