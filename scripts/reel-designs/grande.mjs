// Redington Grande.
// Photos are angled; the straight-on layout is inferred. Drag side: the frame is a rim, the foot, a solid wedge up to
// the rim under the foot, its two edges tangent to the drag boss and 120° apart, and the drag knob, all frame color.
// Through the open lower half shows the spool's cage, which turns: its 14 tapered spokes, the same as the spool
// side's, without the handle and counterweight (the wound line hides them). Red accent ring around the spool hub.
// Handle placement on the spool is arbitrary (it turns); it sits opposite a round counterweight.
import { P, arcPts, circle, f, foot, knob, knurl, rad, recessed, ring, roundPoly, spoke, svg } from './lib.mjs';

const RED = '#b0243a';
// Each edge runs up and out to the rim at WEDGE degrees from straight up, just touching the boss (r 66).
const BOSS = 66;
const WEDGE = rad(60);
const edgeRim = (sx) => {
  const t = [sx * BOSS * Math.cos(WEDGE), BOSS * Math.sin(WEDGE)], d = [sx * Math.sin(WEDGE), -Math.cos(WEDGE)];
  const b = t[0] * d[0] + t[1] * d[1], c = BOSS * BOSS - 184 * 184;
  const k = -b + Math.sqrt(b * b - c);
  return { touch: t, rim: [t[0] + d[0] * k, t[1] + d[1] * k] };
};
const [LEFT, RIGHT] = [edgeRim(-1), edgeRim(1)];
const RIM_ANGLE = (Math.atan2(RIGHT.rim[1], RIGHT.rim[0]) * 180) / Math.PI; // right edge's angle at the rim
const plate = roundPoly([RIGHT.touch, LEFT.touch, LEFT.rim, ...arcPts(184, rad(-180 - RIM_ANGLE), rad(RIM_ANGLE), 20), RIGHT.rim], 8);
// The spool's 14 tapered spokes, shared by both sides.
const SPOKES = Array.from({ length: 14 }, (_, k) => spoke(-90 + (k * 360) / 14, 20, 186, 8, 24));

// Drag knob, all in the frame color: knurled skirt and a raised cap with a logo button.
const grandeKnob =
  `<path d="${knurl(56, 1.5, 64)}" fill="currentColor"/><path d="${knurl(56, 1.5, 64)}" fill="#000" fill-opacity=".35"/>` +
  `<circle r="47" fill="currentColor"/><circle r="47" fill="url(#sheen)"/>` +
  `<circle r="47" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
  `<circle r="19" fill="currentColor"/><circle r="19" fill="url(#sheen)"/><circle r="19" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;

export const drag = svg({
  cage: [ring(188, 182), ...SPOKES],
  // Recessed groove between the outer rim and the inner one.
  back: [ring(190, 178)],
  body: [
    ring(200, 186),
    ring(180, 172),
    foot(132, -244, 14, 30),
    plate,
    circle(BOSS),
  ],
  details: '<circle r="183" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3"/>' + grandeKnob,
});

// Spool side, all frame color but the red hub showing between the spokes: 14 evenly spaced tapered spokes, a large knurled center cap and a
// round counterweight opposite the handle.
const HANDLE = 160;
export const spool = svg({
  // The red hub sits behind the spokes, showing between them.
  under: `<circle r="56" fill="${RED}"/><circle r="56" fill="url(#sheen)"/>`,
  foot: recessed(foot(132, -244, 14, 30)),
  handles: [[...P(150, rad(HANDLE)), 26]],
  body: [
    ring(200, 182),
    ...SPOKES,
    // Handle and counterweight bosses.
    circle(26, ...P(150, rad(HANDLE))),
    circle(24, ...P(150, rad(HANDLE - 180))),
  ],
  details:
    // A knurled frame-colored center cap over the spokes' inner ends.
    `<path d="${knurl(42, 1.2, 56)}" fill="currentColor"/><path d="${knurl(42, 1.2, 56)}" fill="#000" fill-opacity=".25"/>` +
    `<circle r="35" fill="currentColor"/><circle r="35" fill="url(#sheen)"/><circle r="35" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    `<circle r="14" fill="currentColor"/><circle r="14" fill="#000" fill-opacity=".15"/>` +
    `<circle cx="${f(P(150, rad(HANDLE - 180))[0])}" cy="${f(P(150, rad(HANDLE - 180))[1])}" r="18" fill="currentColor"/>` +
    `<circle cx="${f(P(150, rad(HANDLE - 180))[0])}" cy="${f(P(150, rad(HANDLE - 180))[1])}" r="18" fill="#000" fill-opacity=".15"/>` +
    knob(...P(150, rad(HANDLE)), 18),
});
