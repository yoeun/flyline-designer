// Sage Spectrum (original, 2017). Started as a copy of spectrum-c.mjs, then redrawn from House of Fly's Copper
// photos of both sides.
// Drag side: the frame is a rim and five wide straight spokes (two up, one each side, one down; "sage" on the upper
// right one) round a flat numbered dial with a web-patterned face and a logo badge, in the accent (else the frame
// color). Through it shows the spool's cage, which turns: 20 windows between its rim and an inner ring. The spool's
// handle and knob pads would show through too, but the wound line hides them. Spool side: the same window ring,
// three straight spokes 120° apart to a logo hub, the handle in line with the top one and a round silver knob
// opposite at 6 o'clock.
import { ACCENT, P, circle, f, frameRim, pad, rad, recessed, ring, slots, spoke, svg } from './lib.mjs';
import { logo, rimHandle, sageFoot } from './sage.mjs';

// The wound line starts at the inner edge of the window ring.
export const arbor = 110;

// Five spokes 72° apart, one straight down.
const SPOKES = [90, 162, 234, 306, 18].map((a) => (a > 180 ? a - 360 : a));

// The spool's 20 windows, centered on 12 o'clock, with the handle and knob pads at 12 and 6.
const RIM = { n: 20, rIn: 132, rOut: 177, bar: 14, corner: 8, off: -99 };

// The spool seen through the frame's middle: a darkened disc with the arbor's lip.
const SPOOL = (rOut, rIn) =>
  `<path d="${ring(rOut, rIn)}" fill="currentColor" fill-rule="evenodd"/><path d="${ring(rOut, rIn)}" fill="#000" fill-opacity=".38" fill-rule="evenodd"/>` +
  `<circle r="${rOut - 14}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="5"/>`;

// A flat dial in the accent: an outer ring numbered 1–10 anticlockwise from the top, with a dot between each pair,
// and a web-patterned face round a ringed logo badge.
const DIAL =
  `<circle r="80" ${ACCENT}/><circle r="80" fill="url(#sheen)"/>` +
  `<circle r="66" fill="#000" fill-opacity=".1"/><circle r="66" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.5"/>` +
  Array.from({ length: 10 }, (_, i) => {
    const a = -96 - i * 36, [x, y] = P(73, rad(a)), [dx, dy] = P(73, rad(a - 18));
    return (
      `<text transform="translate(${f(x)} ${f(y)}) rotate(${f(a + 90)})" y="3" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="8.5" fill="#1b1d1f" fill-opacity=".75">${i + 1}</text>` +
      `<circle cx="${f(dx)}" cy="${f(dy)}" r="1.4" fill="#1b1d1f" fill-opacity=".55"/>`
    );
  }).join('') +
  `<path d="${Array.from({ length: 16 }, (_, i) => {
    const a = rad(i * 22.5), [x0, y0] = P(36, a), [x1, y1] = P(58, a);
    return `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
  }).join('')}" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>` +
  `<circle r="58" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/><circle r="36" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>` +
  `<circle r="27" fill="#c9ccc8"/><circle r="24" fill="#1b1d1f"/>${logo(0, 0, 26)}`;

// "sage" and the leaf, reading outward along the upper right spoke.
const SPOKE_LOGO = (() => {
  const a = SPOKES[3], [x, y] = P(146, rad(a));
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${a})">${logo(-26, 0, 11)}<text x="-17" y="5" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-style="italic" font-size="15" fill="#f2f2ee">sage</text></g>`;
})();

export const drag = svg({
  under: SPOOL(120, 84),
  cage: [ring(182, 118) + slots(RIM)],
  body: [
    ring(200, 178),
    sageFoot(),
    ...SPOKES.map((a) => spoke(a, 60, 190, 26, 22)),
    circle(90),
  ],
  details: SPOKE_LOGO + DIAL,
});

export const spool = svg({
  foot: recessed(sageFoot()) + frameRim(),
  handles: [[...P(156, rad(-90)), 20]],
  under: SPOOL(118, 40),
  // The cage is set into the frame's rim and the spokes and hub stand up from it: three shades.
  back: [ring(185, 116) + slots(RIM), pad(156, -90, 46, 50), pad(156, 90, 46, 50)],
  body: [
    ...[-90, 30, 150].map((a) => spoke(a, 34, 118, 30, 24)),
    circle(44),
  ],
  details:
    logo(0, 0, 30) +
    rimHandle(156, -90, 20) +
    `<circle cx="0" cy="156" r="17" fill="#9ea3a6"/><circle cx="0" cy="156" r="17" fill="url(#sheen)"/><circle cx="0" cy="156" r="17" fill="none" stroke="#1b1d1f" stroke-opacity=".5" stroke-width="2"/>`,
});
