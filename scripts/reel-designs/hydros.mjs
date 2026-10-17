// Orvis Hydros.
import { P, bars, circle, dragKnob, foot, knob, pad, rad, ring, screw, slots, spoke, svg } from './lib.mjs';

// The Hydros foot is dark whatever the reel color.
const HYDROS_FOOT = `<path d="${foot(130, -244, 14, 30)}" fill="#3b3e41"/><path d="${foot(130, -244, 14, 30)}" fill="url(#sheen)"/>`;
export const drag = svg({
  under: HYDROS_FOOT,
  body: [
    ring(200, 104) + slots({ n: 14, rIn: 118, rOut: 178, bar: 17, corner: 9, off: -90 + 360 / 28 }),
    ...bars([[-36, -192], [-36, 192]], 16),
    ...bars([[36, -192], [36, 192]], 16),
    ...bars([[-88, -178], [-70, 0], [-88, 178]], 18),
    ...bars([[88, -178], [70, 0], [88, 178]], 18),
  ],
  details: dragKnob(64),
});

export const spool = svg({
  under: HYDROS_FOOT,
  body: [
    ring(200, 100) + slots({ n: 14, rIn: 116, rOut: 176, bar: 17, corner: 9, off: -90 + 360 / 28 }),
    ...[0, 1, 2, 3, 4].map((k) => spoke(-90 + k * 72, 30, 104, 16, 12, 25)),
    circle(38),
    pad(146, -38, 46, 64),
  ],
  details:
    `<path d="${pad(146, 142, 44, 54)}" fill="#a3a59f"/><path d="${pad(146, 142, 44, 54)}" fill="url(#sheen)"/>` +
    knob(...P(146, rad(-38)), 17) +
    screw(...P(16, rad(-50)), 4) +
    screw(...P(16, rad(130)), 4),
});
