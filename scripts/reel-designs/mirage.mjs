// Orvis Mirage.
// The drag-side plate is asymmetric: a solid lobe carrying the logo runs from the hub to the right rim, with a
// triangular window in it and long curved slots along the rim above and below; three arms sweep from the
// hub to the left rim and a fourth crosses over the top. The spool's slanted bars show through behind.
// Foot, drag ring and handle are an accent color (teal or navy by finish), drawn here as a muted teal-blue.
import { P, arcPts, circle, foot, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

const ACCENT = '#2c6479';
const accentFoot = `<path d="${foot(118, -240, 16, 56)}" fill="${ACCENT}"/><path d="${foot(118, -240, 16, 56)}" fill="url(#sheen)"/>`;

// A plate between radii r0 and r1 from a0 to a1 degrees, with a curved slot cut along it.
const slotted = (a0, a1, r0, r1, s0, s1, inset) =>
  roundPoly([...arcPts(r1, rad(a0), rad(a1), 16), ...arcPts(r0, rad(a1), rad(a0), 16)], 8) +
  roundPoly([...arcPts(s1, rad(a0 + inset), rad(a1 - inset), 16), ...arcPts(s0, rad(a1 - inset), rad(a0 + inset), 16)], 7);

// The Mirage cap: three rounded lobes, seen as grooves on the drag knob and the spool cap.
const lobes = (r) =>
  [0, 1, 2]
    .map((k) => {
      const a = rad(-90 + k * 120);
      const [x0, y0] = P(r * 0.15, a), [x1, y1] = P(r * 0.95, a + 0.35);
      return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)}Q${(x1 * 0.6).toFixed(1)} ${(y1 * 0.4 + y0 * 0.6).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>`;
    })
    .join('');

const lobe = roundPoly(
  [[10, -62], [30, -92], [62, -86], [92, -62], [112, -34], [130, -12], [182, -10], [182, 34], [148, 40], [124, 66], [104, 84], [40, 76], [0, 62]],
  10,
) + roundPoly([[76, -20], [128, 28], [58, 56]], 10);

export const drag = svg({
  under: accentFoot,
  back: [ring(184, 128) + slots({ n: 16, rIn: 136, rOut: 178, bar: 9, corner: 5, slant: 40 })],
  body: [
    ring(200, 180),
    lobe,
    slotted(-66, -6, 142, 186, 154, 174, 4),
    slotted(32, 88, 142, 186, 156, 174, 5),
    strut([-118, -148], [100, -86], 28),
    strut([-184, -42], [-40, -64], 28, 34),
    strut([-180, -8], [-28, 78], 26, 32),
    strut([-152, 110], [112, 86], 26),
    circle(74),
  ],
  details:
    `<circle r="60" fill="${ACCENT}"/><circle r="60" fill="url(#sheen)"/>` +
    `<circle r="44" fill="currentColor"/><circle r="44" fill="#000" fill-opacity=".08"/>${lobes(44)}`,
});

export const spool = svg({
  under: accentFoot,
  body: [
    ring(200, 125) + slots({ n: 16, rIn: 134, rOut: 184, bar: 11, corner: 6, slant: 36 }),
    // The counterweight plate across the top of the slots.
    roundPoly([...arcPts(188, rad(-120), rad(-64), 10), ...arcPts(152, rad(-64), rad(-120), 10)], 8),
    ...[0, 1, 2, 3, 4, 5].map((k) => spoke(-70 + k * 60, 38, 130, 10, 36, 58)),
    circle(44),
  ],
  details:
    `<circle r="40" fill="${ACCENT}"/><circle r="30" fill="currentColor"/><circle r="30" fill="#000" fill-opacity=".06"/>${lobes(30)}` +
    `<circle cx="${P(162, rad(96))[0].toFixed(1)}" cy="${P(162, rad(96))[1].toFixed(1)}" r="16" fill="${ACCENT}"/><circle cx="${P(162, rad(96))[0].toFixed(1)}" cy="${P(162, rad(96))[1].toFixed(1)}" r="10" fill="#2b2e31"/>`,
});
