// Sage Click.
// A click-and-pawl reel, so the frame side has no drag knob. Frame side (from a straight-on photo): three Y spokes,
// two curving up to about 10 and 2 o'clock and one down to 6 o'clock carrying the click button; in photos the
// spool's own spokes show through between them. Spool side: three Y spokes 120° apart, one up to 12. The spool's gear teeth show inside the window ring; 22 teardrop windows on both sides.
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

// A spoke shaped like a Y: two arms that leave the hub together along the spoke and curve smoothly apart to the
// rim, so the stem and fork are one flowing shape.
const ySpoke = (a) => [-1, 1].map((sd) => arm(P(-14, rad(a)), P(118, rad(a)), P(192, rad(a + sd * 15)), 30, 16, 20));
// Fills the hub between spokes (at `angles`, degrees) with smooth inward curves, so they flow into each other.
const web = (angles, r = 52, edge = 18, depth = 16) => {
  const a = [...angles].sort((x, y) => x - y);
  const pt = (deg, rr) => P(rr, rad(deg)).map((v) => v.toFixed(1)).join(' ');
  return (
    a
      .map((deg, i) => {
        const next = i + 1 < a.length ? a[i + 1] : a[0] + 360;
        return `${i ? 'L' : 'M'}${pt(deg + edge, r)}Q${pt((deg + next) / 2, depth)} ${pt(next - edge, r)}`;
      })
      .join('') + 'Z'
  );
};
const spokes = (first) => [0, 1, 2].flatMap((k) => ySpoke(first + k * 120));

// A frame spoke: a Y like ySpoke, its own width and fork.
// Its tips run across the window ring to the outer edge of the cage.
const frameY = (a, w0, w1, spread) => [-1, 1].map((sd) => arm(P(-14, rad(a)), P(118, rad(a)), P(192, rad(a + sd * spread)), w0, w1, 20));

export const drag = svg({
  back: [GEAR],
  body: [
    ring(200, 140) + RIM,
    sageFoot(),
    pad(166, -90, 34, 40),
    pad(166, 90, 34, 40),
    ...frameY(-140, 44, 18, 16),
    ...frameY(-40, 44, 18, 16),
    ...frameY(90, 40, 18, 14),
    web([-140, -40, 90]),
    circle(24, 0, 48),
  ],
  details:
    frameScrew(0, -166, 8) +
    frameScrew(0, 166, 8) +
    logo(0, -6, 26) +
    `<circle cy="48" r="24" fill="url(#sheen)"/><circle cy="48" r="24" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/><circle cx="0" cy="62" r="1.8" fill="#f2f2ee"/>`,
});

// Spool side: the spokes turned over; handle near the rim at 12 o'clock on the upper spoke, a small knob at 6.
export const spool = svg({
  back: [sageFoot()],
  body: [ring(200, 140) + RIM, pad(169, -90, 30, 40), pad(169, 90, 26, 36), ...spokes(-90), web([-90, 30, 150])],
  details:
    logo(0, 0, 26) +
    rimHandle(169, -90, 18) +
    `<circle cx="${P(169, rad(90))[0].toFixed(1)}" cy="${P(169, rad(90))[1].toFixed(1)}" r="12" fill="#2b2e31"/>`,
});
