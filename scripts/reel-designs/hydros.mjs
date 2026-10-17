// Orvis Hydros (2026). Its parts are shared with the 2020–25 Hydros (hydros-2020.mjs).
import { P, circle, dragKnob, foot, knob, pad, rad, ring, roundPoly, screw, slots, strut, svg } from './lib.mjs';

// The Hydros foot is dark whatever the reel color.
export const HYDROS_FOOT = `<path d="${foot(130, -244, 14, 30)}" fill="#3b3e41"/><path d="${foot(130, -244, 14, 30)}" fill="url(#sheen)"/>`;
// Drag side: the window ring and two straight bars, wide apart at the top and closer at the bottom.
export const HYDROS_FRAME = [
  ring(200, 104) + slots({ n: 14, rIn: 118, rOut: 178, bar: 17, corner: 9, off: -90 + 360 / 28 }),
  strut([-68, -190], [-36, 192], 28, 22),
  strut([68, -190], [36, 192], 28, 22),
];
export const drag = svg({
  under: HYDROS_FOOT,
  body: [
    ...HYDROS_FRAME,
    // Each bar has a thinner one just inside it, running the same way.
    strut([-44, -192], [-16, 192], 16, 12),
    strut([44, -192], [16, 192], 16, 12),
  ],
  details: dragKnob(64),
});

// Spool side: three arcs, each curving in from the ring to touch the hub and back out, so neighbouring ends
// read as double spokes 120° apart, each pair as wide as the hub.
export const HUB = 38;
const ARC_R = 108; // where the arcs meet the ring
const ARC_W = 18;
const arcBand = (mid) => {
  const m = rad(mid), u = [Math.cos(m), Math.sin(m)];
  // The ends sit where a straight pair as wide as the hub would meet the ring, either side of the spokes at mid ± 60°.
  const theta = rad(60) - Math.asin((HUB - ARC_W / 2) / ARC_R);
  // A circle through both ends and tangent to the hub at its nearest point: center on the mid ray, d out.
  const d = (ARC_R * ARC_R - HUB * HUB) / (2 * (ARC_R * Math.cos(theta) - HUB));
  const rho = d - HUB;
  const c = [u[0] * d, u[1] * d];
  const end = (sign) => {
    const [x, y] = P(ARC_R, m + sign * theta);
    return Math.atan2(y - c[1], x - c[0]);
  };
  let a0 = end(-1), a1 = end(1);
  // Sweep the short way round, through the side nearest the hub.
  const near = Math.atan2(-u[1], -u[0]);
  const within = (a, lo, hi) => ((a - lo + 4 * Math.PI) % (2 * Math.PI)) <= ((hi - lo + 4 * Math.PI) % (2 * Math.PI));
  if (!within(near, a0, a1)) [a0, a1] = [a1, a0];
  const span = (a1 - a0 + 4 * Math.PI) % (2 * Math.PI);
  const along = (r) => Array.from({ length: 25 }, (_, i) => [c[0] + r * Math.cos(a0 + (span * i) / 24), c[1] + r * Math.sin(a0 + (span * i) / 24)]);
  return roundPoly([...along(rho + ARC_W / 2), ...along(rho - ARC_W / 2).reverse()], 2);
};
const HYDROS_SPOKES = [-30, 90, 210].map(arcBand);

// The spool around the spokes: window ring, hub, handle pad and counterweight.
export const hydrosSpool = (spokes) =>
  svg({
    under: HYDROS_FOOT,
    body: [ring(200, 100) + slots({ n: 14, rIn: 116, rOut: 176, bar: 17, corner: 9, off: -90 + 360 / 28 }), ...spokes, circle(HUB), pad(146, -38, 46, 64)],
    details: SPOOL_DETAILS,
  });
const SPOOL_DETAILS =
  `<path d="${pad(146, 142, 44, 54)}" fill="#a3a59f"/><path d="${pad(146, 142, 44, 54)}" fill="url(#sheen)"/>` +
  knob(...P(146, rad(-38)), 17) +
  screw(...P(16, rad(-50)), 4) +
  screw(...P(16, rad(130)), 4);

export const spool = hydrosSpool(HYDROS_SPOKES);
