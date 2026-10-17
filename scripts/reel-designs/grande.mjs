// Redington Grande.
// Photos are angled; the straight-on layout is inferred. Drag side: a solid fan plate covers the top half (under the
// foot), cut by a straight edge from the hub down to the rim at ~3 o'clock and a level edge from the hub out to
// 9 o'clock; the lower half is open between ~12 tapered spokes. Red accent ring around the hub on both sides. Handle placement on the
// spool is arbitrary (it turns); it sits opposite a round counterweight.
import { P, arcPts, circle, f, foot, knob, knurl, rad, ring, roundPoly, spoke, svg } from './lib.mjs';

const RED = '#b0243a';
// Drag side spokes fill the open sector from 10° round to 172°.
const DRAG_SPOKES = Array.from({ length: 12 }, (_, k) => 10 + k * 14.7);
const plate = roundPoly([...arcPts(184, rad(172), rad(370), 30), [46, -48], [-40, 52]], 8);

// Body-colored drag knob: knurled skirt and a raised cap with a dark logo button.
const grandeKnob =
  `<circle r="66" fill="none" stroke="${RED}" stroke-width="5"/>` +
  `<path d="${knurl(48, 1.5, 60)}" fill="currentColor"/><path d="${knurl(48, 1.5, 60)}" fill="#000" fill-opacity=".35"/>` +
  `<circle r="40" fill="currentColor"/><circle r="40" fill="url(#sheen)"/>` +
  `<circle r="40" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
  `<circle r="16" fill="#1d1f22"/><circle r="16" fill="url(#sheen)"/>`;

export const drag = svg({
  back: [ring(190, 178)],
  body: [
    ring(200, 186),
    ring(180, 172),
    foot(132, -244, 14, 30),
    plate,
    circle(66),
    ...DRAG_SPOKES.map((a) => spoke(a, 60, 176, 10, 24)),
  ],
  details: '<circle r="183" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3"/>' + grandeKnob,
});

// Spool side: ~22 tapered spokes all round, a red hub ring and a dark knurled center nut.
const HANDLE = 160;
const SPOOL_SPOKES = Array.from({ length: 22 }, (_, k) => -90 + (k * 360) / 22);
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
    `<circle r="50" fill="${RED}"/><circle r="50" fill="url(#sheen)"/>` +
    Array.from({ length: 22 }, (_, i) => {
      const t = rad(-90 + ((i + 0.5) * 360) / 22), [x, y] = P(42, t);
      return `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="#000" fill-opacity=".35"/>`;
    }).join('') +
    `<path d="${knurl(32, 1.2, 48)}" fill="#1d1f22"/><circle r="26" fill="#2b2e31"/><circle r="12" fill="#c9ccc8"/><circle r="12" fill="url(#sheen)"/>` +
    `<circle cx="${f(P(150, rad(HANDLE - 180))[0])}" cy="${f(P(150, rad(HANDLE - 180))[1])}" r="18" fill="#1d1f22"/>` +
    knob(...P(150, rad(HANDLE)), 18),
});
