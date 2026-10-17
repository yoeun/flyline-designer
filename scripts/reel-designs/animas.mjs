// Ross Animas.
// Drag side: seven Y spokes (stem from the knob to a mid ring, forking to the rim), the top stem a wide logo plaque,
// so the outer band has fourteen windows with bars at 3 and 9 o'clock. Spool side: fourteen thin spokes from a
// small hub to the same mid ring and on to the rim; wood-wrapped handle at 9 o'clock, counterweight at 3.
// Both from Ross's straight-on product photos; the spool's dark drag housing behind the spokes is left out.
import { P, circle, f, foot, knurl, pad, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

const N = 7;
const STEMS = Array.from({ length: N }, (_, k) => -90 + (k * 360) / N);
const FORK = 360 / N / 4; // each arm of a Y sits this many degrees off its stem
const OUTER = { n: 2 * N, rIn: 148, rOut: 188, bar: 15, corner: 8, off: -90 + FORK };

const ANIMAS_FOOT = foot(140, -244, 14, 32);

// Copper drag knob in a scalloped collar, with the RR monogram engraved.
const animasKnob =
  `<path d="${knurl(80, 3, 22)}" fill="currentColor"/><path d="${knurl(80, 3, 22)}" fill="#000" fill-opacity=".18"/>` +
  `<circle r="72" fill="#c07a26"/><circle r="72" fill="url(#sheen)"/>` +
  `<circle r="52" fill="none" stroke="#7a4410" stroke-opacity=".7" stroke-width="2.5"/>` +
  `<text x="0" y="14" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="44" letter-spacing="-12" fill="none" stroke="#7a4410" stroke-width="2">RR</text>`;

// The engraved logo plaque on the top stem.
const plaque = roundPoly([[-34, -140], [34, -140], [24, -70], [-24, -70]], 8);
const plaqueArt =
  `<path d="${plaque}" fill="#000" fill-opacity=".08"/>` +
  `<path d="M-26 -126L-16 -133L-8 -127L2 -135L12 -127L20 -132L28 -126" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.6"/>` +
  `<path d="M-14 -100C-4 -106 4 -96 14 -102M-12 -88C-2 -94 6 -84 16 -90" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.6"/>`;

export const drag = svg({
  body: [
    ring(200, 138) + slots(OUTER),
    ANIMAS_FOOT,
    ...STEMS.map((a) => (a === -90 ? plaque : spoke(a, 70, 142, 26, 20))),
    // The Y arms fork just inside the mid ring.
    ...STEMS.flatMap((a) => [-1, 1].map((s) => strut(P(124, rad(a)), P(140, rad(a + s * FORK * 1.6)), 14, 12))),
    circle(84),
  ],
  details: plaqueArt + animasKnob,
});

// Spool face: fourteen thin spokes, paired so they meet near the hub.
const SPOKES = Array.from({ length: 2 * N }, (_, k) => -90 + FORK + (k * 360) / (2 * N));
const handleAt = P(166, Math.PI);
const weightAt = P(166, 0);

export const spool = svg({
  back: [ANIMAS_FOOT],
  body: [
    ring(200, 134) + slots({ ...OUTER, rIn: 146 }),
    ...SPOKES.map((a, k) => spoke(a, 26, 140, 10, 14, k % 2 ? 10 : -10)),
    pad(164, 180, 58, 48),
    pad(164, 0, 54, 44),
    circle(34),
  ],
  details:
    `<circle r="22" fill="#000" fill-opacity=".18"/><circle r="18" fill="#d0d3cf"/><circle r="18" fill="url(#sheen)"/>` +
    `<circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="15" fill="#000" fill-opacity=".14"/><circle cx="${f(weightAt[0])}" cy="${f(weightAt[1])}" r="12" fill="#c9ccc8"/>` +
    `<circle cx="${f(handleAt[0])}" cy="${f(handleAt[1])}" r="30" fill="#7b5236"/><circle cx="${f(handleAt[0])}" cy="${f(handleAt[1])}" r="30" fill="url(#sheen)"/>` +
    `<circle cx="${f(handleAt[0])}" cy="${f(handleAt[1])}" r="15" fill="#5d6164"/><circle cx="${f(handleAt[0])}" cy="${f(handleAt[1])}" r="15" fill="url(#sheen)"/>`,
});
