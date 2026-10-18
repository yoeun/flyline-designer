// Sage Arbor XL, from Sage's photos of both sides (Stillwater Fly Shop's gallery).
// Drag side: the frame is a thin rim and five evenly spaced straight spokes ("sage" on the upper right one) round a
// dark dial ring numbered 1–20 anticlockwise from the top, round a knob with three raised spokes and three ribbed
// windows round a ringed logo badge. Through the frame shows the spool's cage, which turns: 26 windows and an inner
// ring drilled with small holes. The back of the spool's handle pad shows through at 12 too, but the wound line
// hides it. Spool side: the cage sits set down inside the frame's rim, its 24 windows broken by the handle's pad
// at 12 and the knob's at 6. Its three spokes (one up, two spread 130° from it) run in to a hub with a logo badge.
import { P, arcPts, circle, f, frameRim, pad, rad, recessed, ring, roundPoly, slots, spoke, svg } from './lib.mjs';
import { logo, rimHandle, sageFoot } from './sage.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 119;

// The spool's 26 window slots, centered on 12 o'clock; on the spool side the handle and knob pads fill 12 and 6.
const RIM = { n: 26, rIn: 119, rOut: 177, bar: 12, corner: 7, off: -90 - 180 / 26 };
// The frame's five spokes, 72° apart with one straight down; the same angles seen from either side.
const SPOKES = [90, 162, -126, -54, 18];

// The drag knob in a dark dial ring numbered 1–20 anticlockwise from the top, with a dot between each pair. The
// knob's three raised spokes (at 1, 14 and 8) join an outer rim to a ring round the logo badge; between them sit
// three recessed windows with four pairs of radial lines in each, 12 in all. The windows and lines are tagged as
// printing so they don't show through the spool side.
const KNOB_SPOKES = [-90, 30, 150];
const window_ = (arm) => {
  const a0 = rad(arm + 7), a1 = rad(arm + 113), b0 = rad(arm + 12), b1 = rad(arm + 108);
  return roundPoly([...arcPts(56, a0, a1, 16), ...arcPts(34, b1, b0, 10)], 7);
};
const DIAL =
  `<circle r="76" fill="#2b2d30"/><circle r="76" fill="url(#sheen)"/>` +
  Array.from({ length: 20 }, (_, i) => {
    const a = -90 - i * 18, [x, y] = P(69, rad(a)), [dx, dy] = P(69, rad(a - 9));
    return (
      `<text transform="translate(${f(x)} ${f(y)}) rotate(${f(a + 90)})" y="2.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="6.5" fill="#c9ccc8">${i + 1}</text>` +
      `<circle data-print="" cx="${f(dx)}" cy="${f(dy)}" r="1" fill="#c9ccc8"/>`
    );
  }).join('') +
  `<circle data-print="" cy="-80" r="1.8" fill="#e4e4e0"/>` +
  `<circle r="62" fill="currentColor"/><circle r="62" fill="#fff" fill-opacity=".2"/><circle r="62" fill="url(#sheen)"/>` +
  `<g data-print="">` +
  KNOB_SPOKES.map((arm) => `<path d="${window_(arm)}" fill="#000" fill-opacity=".28"/>`).join('') +
  `<path d="${KNOB_SPOKES.flatMap((arm) =>
    Array.from({ length: 4 }, (_, k) => rad(arm + 24 + k * 24)).flatMap((a) =>
      [-1.8, 1.8].map((off) => {
        const [nx, ny] = [-Math.sin(a) * off, Math.cos(a) * off], [x0, y0] = P(37, a), [x1, y1] = P(53, a);
        return `M${f(x0 + nx)} ${f(y0 + ny)}L${f(x1 + nx)} ${f(y1 + ny)}`;
      }),
    ),
  ).join('')}" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>` +
  `</g>` +
  `<circle r="29" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.5"/>` +
  `<circle r="25" fill="#e4e4e0"/><circle r="22" fill="#1b1d1f"/>${logo(0, 0, 25)}`;

// "sage" and the leaf, reading outward along the upper right spoke.
const SPOKE_LOGO = (() => {
  const a = -54, [x, y] = P(150, rad(a));
  return `<g data-print="" transform="translate(${f(x)} ${f(y)}) rotate(${a})">${logo(-28, 0, 12)}<text x="-18" y="6" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-style="italic" font-size="17" fill="#f2f2ee">sage</text></g>`;
})();

// The cage's inner ring, drilled with a small hole behind each window.
const HOLES = Array.from({ length: RIM.n }, (_, k) => circle(2.6, ...P(111, rad(-90 + (k * 360) / RIM.n)))).join('');

export const drag = svg({
  cage: [ring(190, 104) + slots({ ...RIM, rOut: 186 }) + HOLES],
  body: [
    ring(200, 189),
    sageFoot(),
    ...SPOKES.map((a) => spoke(a, 70, 194, 22, 20)),
    circle(82),
  ],
  details: SPOKE_LOGO + DIAL,
});

export const spool = svg({
  // Still: the foot and the frame's rim round the spool. The app draws the drag side's frame behind, through the middle.
  foot: recessed(sageFoot()) + frameRim(),
  handles: [[...P(147, rad(-90)), 20]],
  // The cage is set down into the frame's rim and the spokes and hub stand up from it: three shades.
  back: [ring(185, 104) + slots(RIM), pad(147, -90, 36, 64), pad(147, 90, 36, 64)],
  body: [...[-90, 40, 140].map((a) => spoke(a, 36, 106, 20, 16)), circle(44)],
  details:
    `<circle r="30" fill="#1b1d1f"/><circle r="30" fill="url(#sheen)"/>` +
    logo(0, 0, 24) +
    rimHandle(147, -90, 20) +
    `<circle cx="0" cy="160" r="18" fill="#26282b"/><circle cx="0" cy="160" r="18" fill="url(#sheen)"/>`,
});
