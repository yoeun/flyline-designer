// Orvis Hydros.
import { P, circle, dragKnob, foot, knob, pad, rad, ring, screw, slots, spoke, strut, svg } from './lib.mjs';

// The Hydros foot is dark whatever the reel color.
const HYDROS_FOOT = `<path d="${foot(130, -244, 14, 30)}" fill="#3b3e41"/><path d="${foot(130, -244, 14, 30)}" fill="url(#sheen)"/>`;
export const drag = svg({
  under: HYDROS_FOOT,
  body: [
    ring(200, 104) + slots({ n: 14, rIn: 118, rOut: 178, bar: 17, corner: 9, off: -90 + 360 / 28 }),
    // Two straight bars, wide apart at the top and closer at the bottom, each with a thinner one just inside it
    // running the same way.
    strut([-68, -190], [-36, 192], 28, 22),
    strut([68, -190], [36, 192], 28, 22),
    strut([-44, -192], [-16, 192], 16, 12),
    strut([44, -192], [16, 192], 16, 12),
  ],
  details: dragKnob(64),
});

// Spool side: three double spokes, 120° apart. Each pair is two parallel bars as far apart as the hub is wide.
const HUB = 38;
const HYDROS_SPOKES = [-90, 30, 150].flatMap((deg) => {
  const a = rad(deg), u = [Math.cos(a), Math.sin(a)], n = [-u[1], u[0]];
  return [-1, 1].map((side) => {
    const off = side * (HUB - 6), at = (t) => [n[0] * off + u[0] * t, n[1] * off + u[1] * t];
    return strut(at(0), at(Math.sqrt(108 * 108 - off * off)), 12, 12);
  });
});

export const spool = svg({
  under: HYDROS_FOOT,
  body: [
    ring(200, 100) + slots({ n: 14, rIn: 116, rOut: 176, bar: 17, corner: 9, off: -90 + 360 / 28 }),
    ...HYDROS_SPOKES,
    circle(HUB),
    pad(146, -38, 46, 64),
  ],
  details:
    `<path d="${pad(146, 142, 44, 54)}" fill="#a3a59f"/><path d="${pad(146, 142, 44, 54)}" fill="url(#sheen)"/>` +
    knob(...P(146, rad(-38)), 17) +
    screw(...P(16, rad(-50)), 4) +
    screw(...P(16, rad(130)), 4),
});
