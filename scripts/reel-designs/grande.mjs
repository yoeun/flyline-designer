// Redington Grande.
// Photos are angled; the straight-on layout is inferred. Drag side: a solid wedge up to the rim under the foot, its
// two edges tangent to the drag boss and 90° apart; the rest is open between tapered spokes. Red accent ring around the spool hub; the drag side is all frame color. Handle placement on the
// spool is arbitrary (it turns); it sits opposite a round counterweight.
import { P, arcPts, circle, f, foot, knob, knurl, rad, ring, roundPoly, spoke, svg } from './lib.mjs';

const RED = '#b0243a';
// Each edge touches the boss (r 66) at 45° below level and runs up and out at 45° to the rim. Below it, seven
// spokes, lined up with the spool's 14: the ones in the lower half.
const BOSS = 66;
const edgeRim = (sx) => {
  const t = [sx * BOSS * Math.SQRT1_2, BOSS * Math.SQRT1_2], d = [sx * Math.SQRT1_2, -Math.SQRT1_2];
  const b = t[0] * d[0] + t[1] * d[1], c = BOSS * BOSS - 184 * 184;
  const k = -b + Math.sqrt(b * b - c);
  return { touch: t, rim: [t[0] + d[0] * k, t[1] + d[1] * k] };
};
const [LEFT, RIGHT] = [edgeRim(-1), edgeRim(1)];
const RIM_ANGLE = (Math.atan2(RIGHT.rim[1], RIGHT.rim[0]) * 180) / Math.PI; // right edge's angle at the rim
const plate = roundPoly([RIGHT.touch, LEFT.touch, LEFT.rim, ...arcPts(184, rad(-180 - RIM_ANGLE), rad(RIM_ANGLE), 20), RIGHT.rim], 8);
const SPOOL_SPOKES = Array.from({ length: 14 }, (_, k) => -90 + (k * 360) / 14);
const DRAG_SPOKES = SPOOL_SPOKES.filter((a) => a > 0 && a < 180);

// Drag knob, all in the frame color: knurled skirt and a raised cap with a logo button.
const grandeKnob =
  `<path d="${knurl(48, 1.5, 60)}" fill="currentColor"/><path d="${knurl(48, 1.5, 60)}" fill="#000" fill-opacity=".35"/>` +
  `<circle r="40" fill="currentColor"/><circle r="40" fill="url(#sheen)"/>` +
  `<circle r="40" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
  `<circle r="16" fill="currentColor"/><circle r="16" fill="url(#sheen)"/><circle r="16" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;

export const drag = svg({
  back: [ring(190, 178)],
  body: [
    ring(200, 186),
    ring(180, 172),
    foot(132, -244, 14, 30),
    plate,
    circle(BOSS),
    ...DRAG_SPOKES.map((a) => spoke(a, 60, 176, 10, 24)),
  ],
  details: '<circle r="183" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3"/>' + grandeKnob,
});

// Spool side, all frame color but a thin red ring at the hub: 14 evenly spaced tapered spokes, a large knurled center cap and a
// round counterweight opposite the handle.
const HANDLE = 160;
export const spool = svg({
  back: [foot(132, -244, 14, 30)],
  body: [
    ring(200, 182),
    ...SPOOL_SPOKES.map((a) => spoke(a, 50, 186, 8, 24)),
    circle(52),
    // Handle and counterweight bosses.
    circle(26, ...P(150, rad(HANDLE))),
    circle(24, ...P(150, rad(HANDLE - 180))),
  ],
  details:
    // The red hub ring shows only as a thin band around a large frame-colored cap.
    `<circle r="50" fill="${RED}"/><circle r="50" fill="url(#sheen)"/>` +
    `<path d="${knurl(45, 1.2, 60)}" fill="currentColor"/><path d="${knurl(45, 1.2, 60)}" fill="#000" fill-opacity=".25"/>` +
    `<circle r="38" fill="currentColor"/><circle r="38" fill="url(#sheen)"/><circle r="38" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    `<circle r="12" fill="currentColor"/><circle r="12" fill="#000" fill-opacity=".15"/>` +
    `<circle cx="${f(P(150, rad(HANDLE - 180))[0])}" cy="${f(P(150, rad(HANDLE - 180))[1])}" r="18" fill="currentColor"/>` +
    `<circle cx="${f(P(150, rad(HANDLE - 180))[0])}" cy="${f(P(150, rad(HANDLE - 180))[1])}" r="18" fill="#000" fill-opacity=".15"/>` +
    knob(...P(150, rad(HANDLE)), 18),
});
