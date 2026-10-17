// Orvis Clearwater.
import { P, bars, circle, dragKnob, foot, knob, pad, rad, ring, screw, slots, spoke, svg } from './lib.mjs';

export const drag = svg({
  body: [
    ring(200, 108) + slots({ n: 18, rIn: 120, rOut: 180, bar: 12, corner: 5, slant: 34 }),
    foot(124, -244, 14, 30),
    ...bars([[-72, -190], [-46, -20], [-46, 20], [-64, 192]], 30),
    ...bars([[72, -190], [46, -20], [46, 20], [64, 192]], 30),
  ],
  details: dragKnob(70),
});

export const spool = svg({
  back: [foot(124, -244, 14, 30)],
  body: [
    ring(200, 110) + slots({ n: 14, rIn: 122, rOut: 178, bar: 15, corner: 6, slant: 30 }),
    ...[0, 1, 2].map((k) => spoke(-60 + k * 120, 34, 114, 22, 16, 35)),
    circle(44),
    pad(150, -62, 52, 62),
    pad(150, 146, 52, 62),
  ],
  details: knob(...P(150, rad(-62)), 17) + screw(...P(18, rad(-50)), 4) + screw(...P(18, rad(130)), 4),
});
