// Sage Click.
// A click-and-pawl reel, so the frame side has no drag knob: an X of curved arms, a forked strut up to the
// top post, a thick post down to the bottom, and the round click button just below the hub. The spool's
// gear teeth show inside the window ring. 22 teardrop windows on both sides.
// The spool side is only shown angled (Far Bank): its three curved spokes and the handle at about
// 1 o'clock with a small knob near 6 o'clock are inferred straight-on.
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

export const drag = svg({
  back: [GEAR],
  body: [
    ring(200, 140) + RIM,
    sageFoot(),
    pad(166, -90, 34, 40),
    pad(166, 90, 34, 40),
    // The X: two wide arms curving up to the rim, two thin ones curving down to the window ring.
    arm([-6, 0], [-70, -40], P(192, rad(-130)), 44, 22),
    arm([6, 0], [70, -40], P(192, rad(-50)), 44, 22),
    arm([-6, 10], [-70, 40], P(142, rad(132)), 22, 12),
    arm([6, 10], [70, 40], P(142, rad(48)), 22, 12),
    // A fork of two thin tines up to the top post, and a thick post down to the bottom one.
    strut([-4, -30], [-20, -146], 12, 10),
    strut([4, -30], [20, -146], 12, 10),
    strut([0, 20], [0, 150], 30, 36),
    circle(34),
    circle(24, 0, 48),
  ],
  details:
    frameScrew(0, -166, 8) +
    frameScrew(0, 166, 8) +
    logo(0, -6, 26) +
    `<circle cy="48" r="24" fill="url(#sheen)"/><circle cy="48" r="24" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/><circle cx="0" cy="62" r="1.8" fill="#f2f2ee"/>`,
});

export const spool = svg({
  back: [sageFoot()],
  body: [
    ring(200, 140) + RIM,
    pad(169, -74, 30, 40),
    pad(169, 100, 26, 36),
    arm([0, -20], [12, -90], P(144, rad(-96)), 22, 14),
    arm(P(18, rad(30)), P(80, rad(10)), P(144, rad(24)), 22, 14),
    arm(P(18, rad(150)), P(80, rad(130)), P(144, rad(144)), 22, 14),
    circle(32),
  ],
  details:
    logo(0, 0, 26) +
    rimHandle(169, -74, 18) +
    `<circle cx="${P(169, rad(100))[0].toFixed(1)}" cy="${P(169, rad(100))[1].toFixed(1)}" r="12" fill="#2b2e31"/>`,
});

