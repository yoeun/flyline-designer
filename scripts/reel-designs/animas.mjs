// Ross Animas.
// Drag side: five pairs of bars from the knob to the rim, evenly spaced with one pair straight down; each pair
// spreads slightly toward the rim. A logo plaque sits at the top, between the two upper pairs. Behind this main cage,
// the spool's outer cage of windows shows through, recessed. Spool side: eight Y's whose stems run in to the hub
// and whose arms carry on as the outer cage's sixteen bars; wood-wrapped handle at 9 o'clock, counterweight at 3.
// Both from Ross's straight-on product photos; the spool's dark drag housing behind the spokes is left out.
import { ACCENT, P, circle, f, foot, knurl, pad, rad, ring, roundPoly, slots, spoke, strut, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 146;

// The spool: eight Y's 45° apart, stems at 12, 3, 6 and 9 o'clock; each Y's arms carry on as bars of the outer cage.
const N = 8;
const FORK = 360 / N / 4; // each arm of a Y sits this many degrees off its stem
const OUTER = { n: 2 * N, rIn: 148, rOut: 188, bar: 13, corner: 8, off: -90 + FORK };

const ANIMAS_FOOT = foot(140, -244, 14, 32);

// Drag knob in the finish's accent (copper, gold or silver), in a scalloped collar, with the RR monogram engraved.
const animasKnob =
  `<path d="${knurl(80, 3, 22)}" fill="currentColor"/><path d="${knurl(80, 3, 22)}" fill="#000" fill-opacity=".18"/>` +
  `<circle r="72" ${ACCENT}/><circle r="72" fill="url(#sheen)"/>` +
  `<circle r="64" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2.5"/>` +
  `<text x="-17" y="33" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="96" letter-spacing="-31" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="2.6">RR</text>`;

// The engraved logo plaque: a thick plate bridging the inner bars of the two upper pairs (see pair below), from the
// center out.
const barAt = (deg, r) => P(r, rad(deg + ((r - 86) / (190 - 86)) * -2 * Math.sign(deg + 90)));
const plaque = roundPoly([barAt(-111, 40), barAt(-111, 150), barAt(-69, 150), barAt(-69, 40)], 8);
const plaqueArt =
  `<path d="${plaque}" fill="#000" fill-opacity=".08"/>` +
  `<path d="M-26 -126L-16 -133L-8 -127L2 -135L12 -127L20 -132L28 -126" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.6"/>` +
  `<path d="M-14 -100C-4 -106 4 -96 14 -102M-12 -88C-2 -94 6 -84 16 -90" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.6"/>`;

const PAIRS = [0, 1, 2, 3, 4].map((k) => 90 + k * 72);
// Each bar runs straight from under the knob out to the rim.
const pair = (a) =>
  [-1, 1].map((s) => {
    const p0 = P(86, rad(a + s * 15)), p1 = P(190, rad(a + s * 13));
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), back = 50 / len;
    return strut([p0[0] - (p1[0] - p0[0]) * back, p0[1] - (p1[1] - p0[1]) * back], p1, 18, 16);
  });

export const drag = svg({
  back: [ring(186, 138) + slots(OUTER)],
  body: [ring(200, 184), ANIMAS_FOOT, ...PAIRS.flatMap(pair), plaque, circle(84)],
  details: plaqueArt + animasKnob,
});

// Spool face: each stem runs from the hub to a fork about a third of the way out; its two arms spread to the cage
// ring, landing on the cage's bars.
const STEMS = Array.from({ length: N }, (_, k) => -90 + (k * 360) / N);
const FORK_R = 96;
const ys = STEMS.flatMap((a) => [
  strut(P(26, rad(a)), P(FORK_R, rad(a)), 18, 17),
  ...[-1, 1].map((sd) => strut(P(FORK_R, rad(a)), P(140, rad(a + sd * FORK)), 16, 15)),
]);
const handleAt = P(166, Math.PI);
const weightAt = P(166, 0);

export const spool = svg({
  back: [ANIMAS_FOOT],
  body: [
    ring(200, 134) + slots({ ...OUTER, rIn: 146 }),
    ...ys,
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
