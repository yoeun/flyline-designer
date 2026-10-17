// Redington Rise III.
// Photos are angled; the straight-on layout is inferred. Drag side: a V opening at the foot, its two bars running
// from the rim at either end of the foot to a point opposite it at 6 o'clock, filled solid from the hub down; the spool's ring of rounded windows shows through the rest.
// Body-colored knurled drag knob with five scalloped recesses and a silver cap. Spool side: ~24 rounded windows
// round the rim, an open center with three spokes; handle and a counterweight pin sit opposite each other.
import { P, circle, f, foot, knob, knurl, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

const L = P(194, rad(-125)), R = P(194, rad(-55)), APEX = [0, 194];
const WINDOWS = { n: 24, rIn: 124, rOut: 180, bar: 13, corner: 9 };

const riseKnob =
  `<path d="${knurl(58, 1.5, 70)}" fill="currentColor"/><path d="${knurl(58, 1.5, 70)}" fill="#000" fill-opacity=".3"/>` +
  `<circle r="50" fill="currentColor"/><circle r="50" fill="url(#sheen)"/>` +
  [0, 1, 2, 3, 4].map((k) => {
    const [x, y] = P(32, rad(-90 + k * 72));
    return `<circle cx="${f(x)}" cy="${f(y)}" r="9" fill="#000" fill-opacity=".22"/>`;
  }).join('') +
  `<circle r="17" fill="#d9dcdf"/><circle r="17" fill="url(#sheen)"/><circle r="17" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;

export const drag = svg({
  back: [ring(190, 116) + slots(WINDOWS)],
  body: [
    ring(200, 186),
    foot(130, -244, 14, 30),
    strut(L, APEX, 42, 40),
    strut(R, APEX, 42, 40),
    // Solid web between the arms from just above the hub down to the apex.
    roundPoly([[-58, -10], [58, -10], [16, 186], [-16, 186]], 8),
    circle(58),
  ],
  details: riseKnob,
});

const HANDLE = 135;
export const spool = svg({
  back: [foot(130, -244, 14, 30)],
  body: [
    ring(200, 112) + slots(WINDOWS),
    ...[-62, 58, 178].map((a) => spoke(a, 24, 116, 24, 18, -12)),
    circle(36),
    circle(22, ...P(150, rad(HANDLE))),
  ],
  details:
    `<circle r="27" fill="currentColor"/><circle r="27" fill="#000" fill-opacity=".12"/><circle r="27" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
    `<circle cx="${f(P(150, rad(HANDLE - 180))[0])}" cy="${f(P(150, rad(HANDLE - 180))[1])}" r="14" fill="#1d1f22"/><circle cx="${f(P(150, rad(HANDLE - 180))[0])}" cy="${f(P(150, rad(HANDLE - 180))[1])}" r="14" fill="url(#sheen)"/>` +
    knob(...P(150, rad(HANDLE)), 17),
});
