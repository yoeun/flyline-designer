// Orvis Clearwater (Cast). Traced from straight-on photos of both sides.
// Both sides share a cage of tilted V's: pairs of bars that meet at an inner ring and open out to the rim.
import { ACCENT, P, circle, foot, hexSpokes, knob, knurl, pad, rad, recessed, ring, screw, strut, svg } from './lib.mjs';

// The wound line starts at the outer edge of the spool side's inner ring.
export const arbor = 118;

const V_COUNT = 12;
const V_TILT = 6; // degrees the V's lean, clockwise at the rim
const V_SPREAD = 8; // half the angle between a V's arms at the rim
const vCage = (inner) =>
  Array.from({ length: V_COUNT }, (_, k) => {
    const a = -90 + 360 / V_COUNT / 2 + (k * 360) / V_COUNT;
    const apex = P(inner, rad(a));
    return [-1, 1].map((side) => strut(apex, P(190, rad(a + V_TILT + side * V_SPREAD)), 10, 12));
  }).flat();

// Drag side: two long straight bars from the bottom of the rim, close together, up to the top, wider apart (like the
// 2020–25 Hydros), passing either side of the knob's boss; and an inner pair from the foot down onto the top of the boss.
const OUTER = [[36, 194], [80, -176]]; // right bar, bottom to top; the left mirrors it
const OUTER_W = [24, 28]; // its width at the bottom and the top
// The boss reaches the outer bars' outer edges where they pass it, and the knob sits inset from its edge.
const BOSS = (() => {
  const [[x0, y0], [x1, y1]] = OUTER;
  return Math.abs(x0 * y1 - x1 * y0) / Math.hypot(x1 - x0, y1 - y0) + (OUTER_W[0] + OUTER_W[1]) / 4;
})();
const KNOB = BOSS - 12;
const INNER = [[24, -194], 46]; // right bar's foot end, and the angle from straight up where it meets the boss

// The drag knob, in the finish's accent (black, light gray or khaki to suit the frame): a thick knurled rim around a
// recessed face, with a slotted center screw.
const dragKnobWithRecess = (r) => {
  const face = r - 20;
  return (
    `<path d="${knurl(r, 1.6, 64)}" ${ACCENT}/><path d="${knurl(r, 1.6, 64)}" fill="#000" fill-opacity=".1"/>` +
    `<circle r="${r - 3}" ${ACCENT}/><circle r="${r}" fill="url(#sheen)"/>` +
    // The recess: a shade darker, with a shadow inside its edge and a faint highlight on the lower right.
    `<circle r="${face}" ${ACCENT}/><circle r="${face}" fill="#000" fill-opacity=".06"/>` +
    `<circle r="${face}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>` +
    `<circle cx="1.5" cy="1.5" r="${face - 2}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>` +
    screw(0, 0, 13)
  );
};

export const drag = svg({
  body: [
    ring(200, 184),
    ring(132, 122),
    ...vCage(127),
    foot(124, -244, 14, 30),
    ...[-1, 1].map((sx) => strut([sx * OUTER[0][0], OUTER[0][1]], [sx * OUTER[1][0], OUTER[1][1]], ...OUTER_W)),
    ...[-1, 1].map((sx) => strut([sx * INNER[0][0], INNER[0][1]], P(BOSS - 6, rad(-90 + sx * INNER[1])), 22, 28)),
    circle(BOSS),
  ],
  details: dragKnobWithRecess(KNOB),
});

// Spool side: the same V cage around an inner ring, and six spokes tangent to a large hexagon at the hub
// (like Lamson's), sweeping counter-clockwise. Counterweight at the top, handle at the bottom.
const HEX = 46;
const SPOKES = hexSpokes({ hex: HEX, reach: 112, ends: [0, 1, 2, 3, 4, 5].map((k) => -60 + k * 60), ccw: true, overshoot: 4 });
const handle = P(156, rad(98));

export const spool = svg({
  foot: recessed(foot(124, -244, 14, 30)),
  handles: [[...handle, 24]],
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
