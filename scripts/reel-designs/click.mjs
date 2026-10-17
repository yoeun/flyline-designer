// Sage Click.
// A click-and-pawl reel, so the frame side has no drag knob. Both sides have three spokes 120° apart, each a Y: a
// stem from the hub forking into two arms near the rim. On the frame side one spoke points down to 6 o'clock; on
// the spool side the set is turned over, one spoke up to 12. The spool's gear teeth show inside the window ring; 22 teardrop windows on both sides.
import { P, circle, knurl, pad, rad, ring, roundPoly, strut, svg } from './lib.mjs';
import { frameScrew, logo, rimHandle, sageFoot } from './spectrum.mjs';

// n rounded teardrop windows, wIn wide at rIn and wOut wide at rOut, the first bar at -90°.
const ovals = (n, rIn, rOut, wIn, wOut) =>
  Array.from({ length: n }, (_, k) => {
    const a = rad(-90 + ((k + 0.5) * 360) / n), u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]];
    const c = (r, w) => [u[0] * r + v[0] * w, u[1] * r + v[1] * w];
    return roundPoly([c(rIn, -wIn / 2), c(rOut, -wOut / 2), c(rOut, wOut / 2), c(rIn, wIn / 2)], 14);
  }).join('');
const RIM = ovals(22, 146, 190, 22, 36);
const GEAR = knurl(134, 3.5, 44) + circle(124);

// A spoke shaped like a Y: a stem from the hub out to the fork, then two arms spreading to the rim.
const FORK_R = 112;
const ySpoke = (a) => [
  strut(P(20, rad(a)), P(FORK_R, rad(a)), 30, 26),
  ...[-1, 1].map((sd) => strut(P(FORK_R, rad(a)), P(150, rad(a + sd * 14)), 20, 18)),
];
const spokes = (first) => [0, 1, 2].flatMap((k) => ySpoke(first + k * 120));

export const drag = svg({
  back: [GEAR],
  body: [ring(200, 140) + RIM, sageFoot(), pad(166, -90, 34, 40), pad(166, 90, 34, 40), ...spokes(90), circle(34), circle(24, 0, 48)],
  details:
    frameScrew(0, -166, 8) +
    frameScrew(0, 166, 8) +
    logo(0, -6, 26) +
    `<circle cy="48" r="24" fill="url(#sheen)"/><circle cy="48" r="24" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/><circle cx="0" cy="62" r="1.8" fill="#f2f2ee"/>`,
});

// Spool side: the spokes turned over; handle near the rim between two of them, a small knob opposite.
export const spool = svg({
  back: [sageFoot()],
  body: [ring(200, 140) + RIM, pad(169, -30, 30, 40), pad(169, 150, 26, 36), ...spokes(-90), circle(32)],
  details:
    logo(0, 0, 26) +
    rimHandle(169, -30, 18) +
    `<circle cx="${P(169, rad(150))[0].toFixed(1)}" cy="${P(169, rad(150))[1].toFixed(1)}" r="12" fill="#2b2e31"/>`,
});
