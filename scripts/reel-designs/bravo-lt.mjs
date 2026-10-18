// Echo Bravo LT.
// Drag side drawn from Trident's near-straight-on shot (tilted, foot to one side); spool side from the left half of
// Echo's 2021 product page image (small, but square-on), with Trident's hub close-up for the hub and handle.
// Matte black, sealed carbon drag, no colour accent. The frame is a thin rim with twelve wedge spokes, narrow at the
// big drag knob and broad at the rim, swept a little; the spool's spokes show through the narrow gaps between them.
// The drag knob is a knurled black disc with grey ECHO lettering. The spool face is fourteen radial spokes from a
// hub plate with six screws round a logo cap; the top spoke is wider and carries the handle just inside the rim, and
// the bottom one ends in a small pointed counterweight.
// The drag-side photo is at an angle, so the frame's spoke count (12), widths and sweep are approximate; the knob's
// two-tone face is simplified to one shade.
import { P, circle, f, foot, knob, knurl, rad, recessed, ring, roundPoly, spoke, svg } from './lib.mjs';

// The wound line starts at the arbor: Trident measures 2.16 in inside a 3.48 in rim on the 4/5.
export const arbor = 124;

const FOOT = foot(122, -244, 14, 36);

// Spool spokes: fourteen, one straight up (the handle's) and one straight down (the
// counterweight's), both a little wider at the hub than the rest.
const SPOOL_SPOKES = Array.from({ length: 14 }, (_, k) => -90 + (k * 360) / 14);
const HUB = 46;
const spoolSpokes = (angles) => angles.map((a) => (a === -90 || a === 90 ? spoke(a, HUB - 6, 190, 26, 40) : spoke(a, HUB - 6, 190, 17, 44)));

// Drag side: twelve wedge spokes from the knob's boss to the rim, swept slightly clockwise towards the rim.
const FRAME_SPOKES = Array.from({ length: 12 }, (_, k) => -90 + k * 30);

const dragKnob = (r) =>
  `<path d="${knurl(r, 1.6, 60)}" fill="#1e2022"/><path d="${knurl(r, 1.6, 60)}" fill="url(#sheen)"/>` +
  `<circle r="${r - 7}" fill="#26282a"/><circle r="${r - 7}" fill="url(#sheen)"/>` +
  `<text x="10" y="-8" fill="#9a9ea2" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="17" letter-spacing="1" text-anchor="middle">ECHO</text>` +
  // The Echo caster, as a grey stick figure.
  `<path d="M-4 22L-16 30M-4 22L4 34M-4 22L-6 4M-6 4L-14 -2M-6 4L8 0" stroke="#9a9ea2" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;

export const drag = svg({
  // The spool's spokes, seen from behind through the frame (mirrored).
  back: [ring(192, 176), ...spoolSpokes(SPOOL_SPOKES.map((a) => 180 - a))],
  body: [
    ring(200, 186),
    FOOT,
    ...FRAME_SPOKES.map((a) => spoke(a, 58, 194, 18, 58, -6)),
    circle(64),
  ],
  details: `<circle r="64" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` + dragKnob(56),
});

// The handle sits on the top spoke just inside the rim; the counterweight is a pointed pad on the bottom spoke.
const HANDLE = P(170, rad(-90));
const WEIGHT = roundPoly([[-15, 150], [15, 150], [15, 172], [0, 184], [-15, 172]], 4);

export const spool = svg({
  foot: recessed(FOOT),
  handles: [[...HANDLE, 20]],
  body: [ring(200, 184), ...spoolSpokes(SPOOL_SPOKES), circle(HUB), circle(22, ...HANDLE), WEIGHT],
  details:
    // A crease down the middle of each spoke.
    SPOOL_SPOKES.map((a) => {
      const [x0, y0] = P(HUB + 4, rad(a)), [x1, y1] = P(a === -90 ? 146 : 182, rad(a));
      return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`;
    }).join('') +
    `<path d="${WEIGHT}" fill="#000" fill-opacity=".15"/>` +
    `<circle r="${HUB}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2"/>` +
    [0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${f(P(35, rad(-90 + k * 60))[0])}" cy="${f(P(35, rad(-90 + k * 60))[1])}" r="4" fill="#151617"/>`).join('') +
    `<circle r="24" fill="#1e2022"/><circle r="24" fill="url(#sheen)"/>` +
    `<path d="M-2 10L-10 15M-2 10L4 17M-2 10L-3 -2M-3 -2L-9 -6M-3 -2L7 -4" stroke="#9a9ea2" stroke-width="2" stroke-linecap="round" fill="none"/>` +
    knob(...HANDLE, 17),
});
