// Sage Click.
// A click-and-pawl reel, so the frame side has no drag knob. Both sides are a Y of three spokes: on the frame side
// the stem runs down to 6 o'clock and the arms curve up to the rim either side of the foot; on the spool side the Y
// is upside down. The spool's gear teeth show inside the window ring; 22 teardrop windows on both sides.
import { P, circle, knurl, pad, rad, ring, roundPoly, strut, svg } from './lib.mjs';
import { arm, frameScrew, logo, rimHandle, sageFoot } from './spectrum.mjs';

// n rounded teardrop windows, wIn wide at rIn and wOut wide at rOut, the first bar at -90°.
const ovals = (n, rIn, rOut, wIn, wOut) =>
  Array.from({ length: n }, (_, k) => {
    const a = rad(-90 + ((k + 0.5) * 360) / n), u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]];
    const c = (r, w) => [u[0] * r + v[0] * w, u[1] * r + v[1] * w];
    return roundPoly([c(rIn, -wIn / 2), c(rOut, -wOut / 2), c(rOut, wOut / 2), c(rIn, wIn / 2)], 14);
  }).join('');
const RIM = ovals(22, 146, 190, 22, 36);
const GEAR = knurl(134, 3.5, 44) + circle(124);

// A Y: a thick stem from the hub straight out at `stem` degrees, and two arms curving out to the rim at
// stem ± 140°.
const y = (stem) => [
  strut([0, 0], P(150, rad(stem)), 30, 36),
  ...[-1, 1].map((s) => arm(P(8, rad(stem + s * 90)), P(72, rad(stem + s * 150)), P(192, rad(stem + s * 140)), 44, 22)),
];

export const drag = svg({
  back: [GEAR],
  body: [ring(200, 140) + RIM, sageFoot(), pad(166, -90, 34, 40), pad(166, 90, 34, 40), ...y(90), circle(34), circle(24, 0, 48)],
  details:
    frameScrew(0, -166, 8) +
    frameScrew(0, 166, 8) +
    logo(0, -6, 26) +
    `<circle cy="48" r="24" fill="url(#sheen)"/><circle cy="48" r="24" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/><circle cx="0" cy="62" r="1.8" fill="#f2f2ee"/>`,
});

// Spool side: the same Y upside down; handle near the rim at about 1 o'clock, a small knob opposite.
export const spool = svg({
  back: [sageFoot()],
  body: [ring(200, 140) + RIM, pad(169, -50, 30, 40), pad(169, 130, 26, 36), ...y(-90), circle(32)],
  details:
    logo(0, 0, 26) +
    rimHandle(169, -50, 18) +
    `<circle cx="${P(169, rad(130))[0].toFixed(1)}" cy="${P(169, rad(130))[1].toFixed(1)}" r="12" fill="#2b2e31"/>`,
});
