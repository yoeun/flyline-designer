// Maxcatch Avid.
// Drawn from Maxcatch's three-quarter product shots of the 5/6 in jade, one of each side, checked against an
// in-use shot of the drag side in sapphire and the size chart. The machined frame is a thin rim with a comb of
// radial teeth hanging in from it, free at their inner ends, crossed by three straight bars that form a triangle
// with its corners at the rim, one up under the foot; they meet the raised boss around the big black drag knob
// (its printed dial and logo left out). The spool face is a ring of radial windows around a thin inner ring, with
// three curved spokes from the hub, the red spool cap over the red drag housing behind (both the finish's accent),
// a silver counterweight at about 3 o'clock and the black handle at 9. Foot and drag knob are black on every
// finish.
// The photos are all at an angle, so the triangle's corners, tooth and window counts and the spokes' sweep are
// approximate.
import { ACCENT, P, circle, f, foot, knob, knurl, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// The wound line starts on the drum: the 5/6's 41 mm inside 85 mm (96), the 7/8's 47 in 95 (99).
export const arbor = 97;

// Frame triangle: corners near the rim at these angles (degrees, y down), each side a bar W wide whose inner edge
// just meets the knob's boss. `mirror` flips it for the view from the spool side.
const CORNERS = [-88, 32, 152];
const W = 20, D = 90; // bar width, and the bar's center line's distance from the reel's center
const triangle = (mirror = false) =>
  CORNERS.map((c) => {
    const a = rad(mirror ? 180 - (c + 60) : c + 60); // the side's normal, halfway between two corners
    const t = Math.sqrt(194 * 194 - D * D);
    const [mx, my] = P(D, a), u = [-Math.sin(a), Math.cos(a)];
    return strut([mx - u[0] * t, my - u[1] * t], [mx + u[0] * t, my + u[1] * t], W);
  });
// Comb of teeth from the rim, free at their inner ends.
const TEETH = Array.from({ length: 20 }, (_, k) => -90 + 9 + k * 18);
const teeth = () => TEETH.map((a) => spoke(a, 114, 192, 10, 18));
const frame = (mirror) => [ring(200, 186), ...teeth(), ...triangle(mirror), ...(mirror ? [] : [circle(82)])];

const FOOT = foot(132, -244, 14, 30);
const BLACK_FOOT = `<path d="${FOOT}" fill="#1f2123"/><path d="${FOOT}" fill="url(#sheen)"/>`;

// A spoke curving from (r0, a0) to (r1, a1), w0 wide at the hub and w1 at the ring.
function curvedSpoke(a0, a1, r0, r1, w0, w1, steps = 10) {
  const mid = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
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

// Spool face: 20 radial windows between the rim and a thin inner ring, open inside it but for three swept spokes
// to the hub. `mirror` flips the spokes for the view from behind, through the frame.
const RING_IN = 104;
const face = (mirror = false) => [
  circle(200) + slots({ n: 20, rIn: 124, rOut: 186, bar: 17, corner: 6 }) + circle(RING_IN),
  ...[-170, -50, 70].map((a) => (mirror ? curvedSpoke(180 - a, 180 - a - 32, 44, 108, 16, 22) : curvedSpoke(a, a + 32, 44, 108, 16, 22))),
  circle(50),
];

// The black drag knob: knurled skirt, flat face with the dial's ticks.
const TICKS = Array.from({ length: 24 }, (_, k) => {
  const a = rad(-90 + k * 15), [x0, y0] = P(k % 6 ? 50 : 46, a), [x1, y1] = P(55, a);
  return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
}).join('');
const DRAG_KNOB =
  `<circle r="86" fill="#000" fill-opacity=".18"/><circle r="82" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>` +
  `<path d="${knurl(70, 1.5, 60)}" fill="#1c1d1f"/><circle r="62" fill="#26282b"/><circle r="62" fill="url(#sheen)"/>` +
  `<path d="${TICKS}" stroke="#d9dbd9" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>`;

export const drag = svg({
  under: BLACK_FOOT,
  back: face(true),
  body: frame(false),
  details: `<circle r="186" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` + DRAG_KNOB,
});

// Spool side: the red drag housing shows through the face's open middle, under the red knurled cap.
const handle = P(166, rad(180));
const weight = P(150, rad(8));
const HOUSING = `<circle r="78" ${ACCENT}/><circle r="78" fill="#000" fill-opacity=".22"/>`;
const CAP =
  `<circle r="48" fill="#000" fill-opacity=".2"/><path d="${knurl(42, 1.2, 50)}" ${ACCENT}/>` +
  `<circle r="35" ${ACCENT}/><circle r="35" fill="#fff" fill-opacity=".08"/><circle r="42" fill="url(#sheen)"/>`;
const WEIGHT = `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="18" fill="#8d9092"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="15" fill="#d3d5d3"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="15" fill="url(#sheen)"/>`;

export const spool = svg({
  foot: BLACK_FOOT,
  handles: [[...handle, 18]],
  under: HOUSING,
  back: frame(true),
  body: face(),
  details:
    `<circle r="190" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="${RING_IN}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    CAP +
    WEIGHT +
    knob(...handle, 18),
});
