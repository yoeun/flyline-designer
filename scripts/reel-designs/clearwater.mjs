// Orvis Clearwater (Cast). Traced from straight-on photos of both sides.
// Both sides share a cage of tilted V's: pairs of bars that meet at an inner ring and open out to the rim.
import { P, circle, foot, hexSpokes, knob, knurl, pad, rad, ring, screw, strut, svg } from './lib.mjs';

const V_COUNT = 12;
const V_TILT = 6; // degrees the V's lean, clockwise at the rim
const V_SPREAD = 8; // half the angle between a V's arms at the rim
const vCage = (inner) =>
  Array.from({ length: V_COUNT }, (_, k) => {
    const a = -90 + 360 / V_COUNT / 2 + (k * 360) / V_COUNT;
    const apex = P(inner, rad(a));
    return [-1, 1].map((side) => strut(apex, P(190, rad(a + V_TILT + side * V_SPREAD)), 10, 12));
  }).flat();

// Drag side: a thick pair from the foot down to the sides of the knob's boss, each tangent to it, and an inner pair
// from the bottom of the rim up into the boss's lower half, closer together at the bottom (like the 2020–25 Hydros).
const BOSS = 86;
const BAR_END = 40; // how far either side of center the bars meet the foot and the bottom of the rim
const toBoss = (x, y) => {
  const f = [x, y], dist = Math.hypot(...f);
  const t = Math.atan2(y, x) - Math.sign(x * y) * Math.acos(BOSS / dist);
  return strut(f, P(BOSS, t), 24, 30);
};
// A silver drag knob with a knurled rim and a slotted center screw.
const silverKnob = (r) =>
  `<path d="${knurl(r, 1.6, 64)}" fill="#c4c7c4"/><circle r="${r - 9}" fill="#d9dbd8"/><circle r="${r}" fill="url(#sheen)"/>${screw(0, 0, 13)}`;

export const drag = svg({
  body: [
    ring(200, 184),
    ring(132, 122),
    ...vCage(127),
    foot(124, -244, 14, 30),
    ...[-1, 1].map((sx) => toBoss(sx * BAR_END, -194)),
    ...[-1, 1].map((sx) => strut([sx * 36, 194], [sx * 56, 40], 24, 28)),
    circle(BOSS),
  ],
  details: silverKnob(74),
});

// Spool side: the same V cage around an inner ring, and six spokes tangent to a large hexagon at the hub
// (like Lamson's), sweeping counter-clockwise. Counterweight at the top, handle at the bottom.
const HEX = 46;
const SPOKES = hexSpokes({ hex: HEX, reach: 112, ends: [0, 1, 2, 3, 4, 5].map((k) => -60 + k * 60), ccw: true, overshoot: 4 });
const handle = P(156, rad(98));

export const spool = svg({
  back: [foot(124, -244, 14, 30)],
  body: [
    ring(200, 184),
    ring(118, 106),
    ...vCage(112),
    ...SPOKES.map(({ corner, end }) => strut(corner, end, 18, 14)),
    `M${SPOKES.map(({ corner }) => corner.map((v) => v.toFixed(1)).join(' ')).join('L')}Z`,
  ],
  details:
    `<path d="${pad(152, -90, 58, 34)}" fill="#26282b"/><path d="${pad(152, -90, 58, 34)}" fill="url(#sheen)"/>` +
    `<circle r="${HEX - 6}" fill="#000" fill-opacity=".1"/>` +
    screw(0, -16, 5) +
    screw(0, 16, 5) +
    `<circle cx="${handle[0].toFixed(1)}" cy="${handle[1].toFixed(1)}" r="24" fill="currentColor"/>` +
    knob(...handle, 18),
});
