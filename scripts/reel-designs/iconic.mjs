// Hatch Iconic (Large and Mid Arbor share this frame).
// Drawn from Hatch's straight-on 5 Plus photos. The drag side's swirl is simplified to six curved arms from the hub
// to the rim, over the spool's darker outer cage.
import { P, circle, f, hexSpokes, knurl, rad, ring, roundPoly, strut, svg } from './lib.mjs';

// A curved bar from point p0 to p2, bowed `bend` sideways at its middle, w0 wide at p0 and w1 at p2.
const curvePt = (p0, p2, bend, t) => {
  const len = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]);
  const c = [(p0[0] + p2[0]) / 2 - ((p2[1] - p0[1]) / len) * bend, (p0[1] + p2[1]) / 2 + ((p2[0] - p0[0]) / len) * bend];
  const u = 1 - t;
  return {
    p: [u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]],
    d: [2 * u * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0]), 2 * u * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1])],
  };
};
export function curve(p0, p2, w0, w1, bend = 0) {
  const n = 14, left = [], right = [];
  for (let i = 0; i <= n; i++) {
    const { p, d } = curvePt(p0, p2, bend, i / n);
    const dl = Math.hypot(...d), w = (w0 + ((w1 - w0) * i) / n) / 2;
    left.push([p[0] - (d[1] / dl) * w, p[1] + (d[0] / dl) * w]);
    right.push([p[0] + (d[1] / dl) * w, p[1] - (d[0] / dl) * w]);
  }
  return roundPoly([...left, ...right.reverse()], 4);
}
// The same from (r0, a0) to (r1, a1), angles in degrees; `at` gives a point partway along it.
export const arm = (a0, r0, a1, r1, w0, w1, bend = 0) => curve(P(r0, rad(a0)), P(r1, rad(a1)), w0, w1, bend);
export const armAt = (a0, r0, a1, r1, bend, t) => curvePt(P(r0, rad(a0)), P(r1, rad(a1)), bend, t).p;

// Foot plate on two posts with an opening between them, as on the Hatch frames.
export const hatchFoot = (half = 132) => [
  roundPoly([[-half, -244], [half, -244], [half - 10, -231], [-half + 10, -231]], 5),
  roundPoly([[-62, -236], [-38, -236], [-30, -188], [-62, -188]], 6),
  roundPoly([[38, -236], [62, -236], [62, -188], [30, -188]], 6),
];

// Frame-colored drag cap with a knurled edge and the Hatch "H" on its face.
export const hatchCap = (r, logo = true) =>
  `<path d="${knurl(r, 1.2, 70)}" fill="#000" fill-opacity=".22"/><circle r="${r - 6}" fill="currentColor"/><circle r="${r - 6}" fill="url(#sheen)"/>` +
  `<circle r="${r - 6}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.5"/>` +
  (logo ? `<path d="M${-r * 0.42} 0H${r * 0.42}M${-r * 0.28} ${-r * 0.13}V${r * 0.13}M${r * 0.28} ${-r * 0.13}V${r * 0.13}" stroke="#000" stroke-opacity=".45" stroke-width="3.5" stroke-linecap="round"/>` : "");

// Mirrors a path left to right (every coordinate pair here is absolute).
const mirrorX = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${-x} ${y}`);

// The Iconic drag side: six curved arms swirl out from the hub. The arms are laid
// out below sweeping clockwise and drawn mirrored, so they sweep counter-clockwise like the other reels.
// [hub angle, rim angle, bow]: six arms 60° apart, all alike: once mirrored they lean counter-clockwise and curve
// clockwise.
const ARM_BOW = 30;
const ARMS = [0, 1, 2, 3, 4, 5].map((k) => [-130 + k * 60, -85 + k * 60, ARM_BOW]);
// Behind the arms, the spool's outer cage shows in a much darker shade so it reads as a separate piece: a ring
// where the backing starts (radius ~120 across the sizes) with curved bars out to the rim, set up like the main
// arms (laid out clockwise, then mirrored): they lean hard counter-clockwise and curve clockwise.
// The spool side shows the same cage from the other face: `mirrored` false.
const CAGE_R = 120;
const outerCage = ({ mirrored = true, r = CAGE_R, bars = 12, lean = 50, bow = 18 } = {}) => [
  ring(r + 6, r - 6),
  ...Array.from({ length: bars }, (_, k) => {
    const d = arm(-75 + (k * 360) / bars, r, -75 + (k * 360) / bars + lean, 190, 16, 12, bow);
    return mirrored ? mirrorX(d) : d;
  }),
];
const shaded = (paths) => paths.map((d) => `<path d="${d}" fill="currentColor" fill-rule="evenodd"/><path d="${d}" fill="#000" fill-opacity=".45" fill-rule="evenodd"/>`).join('');

// The arms start at `armIn`, well inside the hub, so they run deep toward the center under the cap.
export const iconicDrag = ({ hub = 56, cap = 50, armIn = 30, arms = ARMS } = {}) =>
  svg({
    under: shaded(outerCage()),
    body: [ring(200, 184), ...hatchFoot(), ...arms.map(([a0, a1, b]) => mirrorX(arm(a0, armIn, a1, 190, 36, 12, b))), circle(hub)],
    details: hatchCap(cap),
  });

export const drag = iconicDrag();

// Spool side: a rim and inner ring joined by twelve swept bars, eight spokes to the hub, the handle and
// a counterweight on bosses across from each other.
export const silverKnob = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#8c8a84"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r - 3}" fill="#c9c6bd"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r - 3}" fill="url(#sheen)"/>`;
export const counterweight = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#c9c6bd"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="url(#sheen)"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.55}" fill="#1f2123"/>`;

// `hex` (a radius) swaps the curved spokes and round hub for six spokes tangent to a hexagon hub of that inner
// radius, sweeping counter-clockwise, like the Lamson spools.
export const hatchSpool = ({ inner = 132, bars = 12, barSweep = -30, barBend = -8, spokes = 8, spokeSweep = 14, spokeBend = 0, barWidth = 18, counter = counterweight, hub = 66, cap = 52, handle = -50, hex = null } = {}) => {
  const hexLines = hex && hexSpokes({ hex, reach: CAGE_R, ends: [0, 1, 2, 3, 4, 5].map((k) => -60 + k * 60), ccw: true, overshoot: 4 });
  const center = hex
    ? [...hexLines.map(({ corner, end }) => strut(corner, end, 22, 16)), roundPoly(hexLines.map(({ corner }) => corner), 4)]
    : [...Array.from({ length: spokes }, (_, k) => arm(-90 + (k * 360) / spokes - spokeSweep, hub - 6, -90 + (k * 360) / spokes, inner - 8, 22, 16, spokeBend)), circle(hub)];
  return svg({
  back: [...hatchFoot()],
  body: [
    ring(200, 180),
    // With a hexagon hub (the Iconic) the outer cage is the drag side's, seen from this face; otherwise a ring of
    // bars leaning counter-clockwise toward the rim.
    ...(hex
      ? outerCage({ mirrored: false })
      : [ring(inner, inner - 16), ...Array.from({ length: bars }, (_, k) => arm(-75 + (k * 360) / bars + barSweep, inner - 8, -75 + (k * 360) / bars, 190, barWidth, 16, barBend))]),
    ...center,
    circle(30, ...P(160, rad(handle))),
    circle(28, ...P(160, rad(handle + 180))),
  ],
  details: hatchCap(cap, false) + silverKnob(...P(160, rad(handle)), 25) + counter(...P(160, rad(handle + 180)), 20),
});
};

export const spool = hatchSpool({ hex: 50, cap: 40 });
