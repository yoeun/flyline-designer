// Sage Arbor XL, from Sage's photos of both sides (Stillwater Fly Shop's gallery).
// Drag side: the frame is a thin rim and five evenly spaced straight spokes ("sage" on the upper right one) round a
// black dial ring numbered 1–20 anticlockwise from the top. Inside the ring, the knob's
// face has three smooth arms with 12 pairs of lines between them, round a ringed logo badge. Through the frame shows
// the spool's cage, which turns: 26 windows and an inner ring drilled with small holes. The back of the spool's
// handle pad shows through at 12 too, but the wound line hides it. Spool side: the cage sits
// set down inside the frame's rim, its 24 windows broken by the handle's pad at 12 and the knob's at 6. Its three
// spokes (one up, two spread 130° from it) run in to a hub with a logo badge.
import { P, circle, f, frameRim, pad, rad, recessed, ring, slots, spoke, svg } from './lib.mjs';
import { logo, rimHandle, sageFoot } from './sage.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 119;

// The spool's 26 window slots, centered on 12 o'clock; on the spool side the handle and knob pads fill 12 and 6.
const RIM = { n: 26, rIn: 119, rOut: 177, bar: 12, corner: 7, off: -90 - 180 / 26 };
// The frame's five spokes, 72° apart with one straight down; the same angles seen from either side.
const SPOKES = [90, 162, -126, -54, 18];

// A black dial ring numbered 1–20 anticlockwise from the top, round the knob's face: three smooth arms, 12 pairs of
// lines in the gaps between them, and a ringed logo badge.
const ARMS = [-90, 30, 150];
const DIAL =
  `<circle r="76" fill="#1e2022"/><circle r="76" fill="url(#sheen)"/>` +
  Array.from({ length: 20 }, (_, i) => {
    const a = -90 - i * 18, [x, y] = P(66, rad(a));
    return `<text transform="translate(${f(x)} ${f(y)}) rotate(${f(a + 90)})" y="2.8" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="7.5" fill="#e4e4e0">${i + 1}</text>`;
  }).join('') +
  `<circle data-print="" cy="-80" r="1.8" fill="#e4e4e0"/>` +
  `<circle r="57" fill="currentColor"/><circle r="57" fill="#fff" fill-opacity=".18"/><circle r="57" fill="url(#sheen)"/>` +
  // Four pairs in each 120° gap between arms, 22.5° apart.
  `<path data-print="" d="${ARMS.flatMap((arm) => [-33.75, -11.25, 11.25, 33.75].map((d) => arm + 60 + d))
    .flatMap((deg) => [-2.2, 2.2].map((off) => {
      const a = rad(deg), [nx, ny] = [-Math.sin(a) * off, Math.cos(a) * off], [x0, y0] = P(26, a), [x1, y1] = P(52, a);
      return `M${f(x0 + nx)} ${f(y0 + ny)}L${f(x1 + nx)} ${f(y1 + ny)}`;
    }))
    .join('')}" stroke="#1b1d1f" stroke-opacity=".45" stroke-width="1.3"/>` +
  `<circle r="21" fill="#c9ccc8"/><circle r="18" fill="#1b1d1f"/>${logo(0, 0, 21)}`;

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
