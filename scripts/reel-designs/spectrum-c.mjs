// Sage Spectrum C, from House of Fly's photos of both sides.
// Drag side: the frame is a rim and five wide straight spokes ("sage" on the upper right one) round a big flat dial
// numbered 1–10 with a ringed logo badge, in the finish's accent: grey on Black, black on Grey. Spool side: 20
// windows, three straight spokes 120° apart to a logo hub, the handle in line with the top one and a dark knob
// opposite at 6 o'clock. From the drag side the spool's cage shows through the frame and turns: its 20 deep
// windows (no inner ring, unlike the Spectrum). The back of its handle and knob pads would show too, but the wound
// line hides them.
import { ACCENT, P, circle, f, frameRim, pad, rad, recessed, ring, slots, spoke, svg } from './lib.mjs';
import { logo, rimHandle, sageFoot } from './sage.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 100;

// Five spokes 72° apart, one straight down.
const SPOKES = [90, 162, 234, 306, 18].map((a) => (a > 180 ? a - 360 : a));

// Windows centered on 12 o'clock, 18° apart, with pads at 12 and 6 on the spool side.
const RIM = { n: 20, rIn: 100, rOut: 172, bar: 19, corner: 8, off: -99 };

// A flat dial in the accent: tick dots and a pointer round its edge, 1–10 counting anticlockwise from the top,
// and a ringed logo badge.
const DIAL =
  `<circle r="76" ${ACCENT}/><circle r="76" fill="url(#sheen)"/>` +
  Array.from({ length: 30 }, (_, i) => {
    const [x, y] = P(65, rad(-90 + i * 12));
    return i ? `<circle data-print="" cx="${f(x)}" cy="${f(y)}" r="${i % 3 ? 1.1 : 1.9}" fill="#e4e4e0"/>` : '';
  }).join('') +
  `<path data-print="" d="M0 -69L3.5 -62H-3.5Z" fill="#e4e4e0"/>` +
  Array.from({ length: 10 }, (_, i) => {
    const a = -81 - i * 36, [x, y] = P(48, rad(a));
    return `<text transform="translate(${f(x)} ${f(y)}) rotate(${f(a + 90)})" y="4" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11.5" fill="#e4e4e0">${i + 1}</text>`;
  }).join('') +
  `<circle r="24" fill="#9ea3a6"/><circle r="24" fill="url(#sheen)"/><circle r="20.5" fill="#2b2e31"/>${logo(0, 0, 23)}`;

// "sage" and the leaf, reading outward along the upper right spoke.
const SPOKE_LOGO = (() => {
  const a = SPOKES[3], [x, y] = P(140, rad(a));
  return `<g data-print="" transform="translate(${f(x)} ${f(y)}) rotate(${a})">${logo(-28, 0, 12)}<text x="-18" y="6" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-style="italic" font-size="17" fill="#1b1d1f" fill-opacity=".8">sage</text></g>`;
})();

export const drag = svg({
  // Its inner ring shows round the frame's hub.
  cage: [ring(184, 92) + slots(RIM)],
  body: [
    ring(200, 178),
    sageFoot(),
    ...SPOKES.map((a) => spoke(a, 60, 192, 34, 30)),
    circle(82),
  ],
  details: SPOKE_LOGO + DIAL,
});

export const spool = svg({
  foot: recessed(sageFoot()) + frameRim(),
  handles: [[...P(154, rad(-90)), 20]],
  // The cage is set into the frame's rim and the spokes and hub stand up from it: three shades.
  back: [ring(185, 90) + slots(RIM), pad(136, -90, 54, 74), pad(136, 90, 54, 74)],
  body: [
    ...[-90, 30, 150].map((a) => spoke(a, 26, 92, 22, 18)),
    circle(32),
  ],
  details:
    logo(0, 0, 24) +
    rimHandle(154, -90, 20) +
    `<circle cx="0" cy="158" r="18" fill="#2b2e31"/><circle cx="0" cy="158" r="18" fill="url(#sheen)"/>`,
});
