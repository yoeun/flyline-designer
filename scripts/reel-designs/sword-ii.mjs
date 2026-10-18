// Piscifun Sword II.
// Spool side drawn from Piscifun's near-straight-on spool photos: a wide face drilled with a ring of
// twelve big round holes, small holes between them and near the rim, a solid hub disc with three swept
// windows, the black knurled spool cap, a silver counterweight up top-left and the ribbed handle low-left.
// No straight-on drag-side photo exists: the frame (thin rim, five swept spokes from a central boss,
// body-colored knurled drag knob with a silver screw) is inferred from the angle and exploded shots,
// with the drilled back flange of the spool showing through. Spoke count and sweep are approximate.
import { P, circle, f, foot, knob, knurl, rad, recessed, ring, roundPoly, screw, spoke, svg } from './lib.mjs';

// The wound line starts at the inner edge of the small holes.
export const arbor = 114;

// A spoke curving from (r0, a0) to (r1, a1), w0 wide at the hub and w1 at the rim.
function curvedSpoke(a0, a1, r0, r1, w0, w1, steps = 10) {
  const mid = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    // Ease the angle so the spoke leaves the hub radially and bends towards the rim.
    return P(r0 + (r1 - r0) * t, rad(a0 + (a1 - a0) * t * t));
  });
  const side = (s) =>
    mid.map((p, i) => {
      const q = mid[Math.min(i + 1, steps)], o = mid[Math.max(i - 1, 0)];
      const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy);
      const w = (w0 + (w1 - w0) * (i / steps)) / 2;
      return [p[0] - (dy / l) * w * s, p[1] + (dx / l) * w * s];
    });
  return roundPoly([...side(1), ...side(-1).reverse()], 4);
}

// Drilled spool flange: big holes, small holes between them, tiny holes near the rim.
const BIG = Array.from({ length: 12 }, (_, k) => -90 + 15 + k * 30);
const drilled = (outer, inner) =>
  ring(outer, inner) +
  BIG.map((a) => circle(29, ...P(147, rad(a)))).join('') +
  BIG.map((a) => circle(7, ...P(121, rad(a + 15)))).join('') +
  BIG.map((a) => circle(5, ...P(186, rad(a + 15)))).join('');

const FOOT = foot(132, -244, 14, 30);

export const drag = svg({
  back: [drilled(196, 60)],
  body: [
    ring(200, 186),
    FOOT,
    ...[0, 1, 2, 3, 4].map((k) => curvedSpoke(-100 + k * 72, -100 + k * 72 + 30, 60, 194, 40, 22)),
    circle(80),
    knurl(58, 2, 40),
  ],
  details:
    `<circle r="80" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` +
    `<circle r="50" fill="#fff" fill-opacity=".12"/><circle r="50" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    screw(0, 0, 11) +
    screw(...P(70, rad(128)), 5),
});

// Sword II spool cap: black, knurled rim, flat face.
const CAP = `<path d="${knurl(42, 1.5, 44)}" fill="#1f2124"/><circle r="35" fill="#2c2f33"/><circle r="35" fill="url(#sheen)"/>`;
// Silver counterweight seen end-on.
const weight = (cx, cy) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="18" fill="#8d9092"/><circle cx="${f(cx)}" cy="${f(cy)}" r="14" fill="#d3d5d3"/><circle cx="${f(cx)}" cy="${f(cy)}" r="14" fill="url(#sheen)"/>`;

export const spool = svg({
  foot: recessed(FOOT),
  handles: [[...P(150, rad(120)), 17]],
  body: [
    drilled(200, 108),
    ring(108, 94),
    ...[0, 1, 2].map((k) => curvedSpoke(-150 + k * 120, -150 + k * 120 + 45, 40, 98, 30, 36)),
    circle(52),
  ],
  details:
    `<circle r="108" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    CAP +
    weight(...P(156, rad(-120))) +
    knob(...P(150, rad(120)), 17),
});
