// Piscifun Sword (the original; Sword II is sword-ii.mjs).
// Spool side drawn from Piscifun's three-quarter spool-side photos of an empty black reel and the gunmetal one (olive
// and gray look the same): a flange drilled with a ring of twelve big round holes and twelve small ones between them
// near the rim, its inner edge scalloped round the big holes, opening onto a thin drum ring with three swept arms to
// the hub, a big knurled logo knob in the middle, the handle up top-left and a silver counterweight at the bottom.
// No straight-on drag-side photo exists: the frame (a thin rim, the foot, five arms swept counter-clockwise from a
// central boss in a "storm vortex", the knob over it) is inferred from Piscifun's stylized drag-side render and an
// angled wet-studio shot. Through it shows the spool's cage, which turns: the flange's twelve big holes and scalloped
// inner edge, as on the spool side (the small holes hide behind the rim). Spoke sweep and widths are approximate.
// The foot and handle take the finish's accent (green on gunmetal, champagne on olive); the logo knob and drag knob
// take its trim, falling back to the body color: green on gunmetal, gray on gray, body-colored on olive and black.
import { ACCENT, P, TRIM, circle, f, foot, knurl, rad, ring, roundPoly, screw, svg } from './lib.mjs';

// Mid arbor, no arbor diameter published. Per the user, the spool's floor runs straight on under the flange's
// scalloped inner edge (out to 116), so the backing starts there, under the ridges.
export const arbor = 112;

// A spoke curving from (r0, a0) to (r1, a1), w0 wide at the hub and w1 at the rim, as in sword-ii.mjs.
function curvedSpoke(a0, a1, r0, r1, w0, w1, ease = 2, steps = 12) {
  const mid = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    // Ease the angle so the spoke bends away from the hub and runs into the rim (ease 2: leaves it radially).
    return P(r0 + (r1 - r0) * t, rad(a0 + (a1 - a0) * t ** ease));
  });
  const side = (s) =>
    mid.map((p, i) => {
      const q = mid[Math.min(i + 1, steps)], o = mid[Math.max(i - 1, 0)];
      const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy);
      const w = (w0 + (w1 - w0) * (i / steps)) / 2;
      return [p[0] - (dy / l) * w * s, p[1] + (dx / l) * w * s];
    });
  return roundPoly([...side(1), ...side(-1).reverse()], 4);
}

// The spool flange's holes: twelve big, and twelve small in the cage between them, just outside the big ones' ring
// where the gap between neighbours widens. The thick outer rim outside them is plain.
const BIG = Array.from({ length: 12 }, (_, k) => -90 + k * 30);
const BIG_HOLES = BIG.map((a) => circle(27, ...P(147, rad(a)))).join('');
const HOLES = BIG_HOLES + BIG.map((a) => circle(9, ...P(166, rad(a + 15)))).join('');
// The flange's inner edge: reaching in to r 104 between the big holes, scalloped out to 114 round each one.
const INNER_EDGE = (() => {
  const pts = Array.from({ length: 96 }, (_, i) => {
    const a = (i * 360) / 96 - 90;
    return P(109 + 5 * Math.cos(rad(12 * (a + 90))), rad(a));
  });
  return roundPoly(pts.reverse(), 2);
})();

const FOOT = foot(134, -244, 14, 34);
const ACCENT_FOOT = `<path d="${FOOT}" ${ACCENT}/><path d="${FOOT}" fill="url(#sheen)"/>`;

// Drag side: five arms swept counter-clockwise from the boss, ending at the rim every 72°. The small holes hide behind the rim.
const ARMS = [0, 1, 2, 3, 4].map((k) => -150 + k * 72);

export const drag = svg({
  under: ACCENT_FOOT,
  cage: [circle(196) + BIG_HOLES + INNER_EDGE],
  body: [ring(200, 184), ...ARMS.map((a) => curvedSpoke(a + 70, a, 70, 192, 26, 18, 1.5)), circle(84)],
  details:
    `<circle r="184" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="84" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` +
    // The drag knob: knurled rim, flat face, slotted center screw.
    `<circle r="62" fill="#000" fill-opacity=".22"/><path d="${knurl(58, 1.4, 56)}" ${TRIM}/><path d="${knurl(58, 1.4, 56)}" fill="#000" fill-opacity=".18"/>` +
    `<circle r="50" ${TRIM}/><circle r="58" fill="url(#sheen)"/>` +
    screw(0, 0, 12),
});

// Spool side.
const HANDLE = P(160, rad(-112));
const WEIGHT = P(166, rad(84));
const HUB_ARMS = [0, 1, 2].map((k) => -60 + k * 120);

export const spool = svg({
  foot: ACCENT_FOOT + `<path d="${FOOT}" fill="#000" fill-opacity=".2"/>`,
  handles: [[...HANDLE, 22]],
  // A recessed floor runs straight on under the flange's scalloped inner edge, no gap, out to 116; inside 100 the
  // middle is cut out, leaving only the three hub arms reaching to the ridges and the center dial.
  back: [ring(116, 100)],
  body: [circle(200) + HOLES + INNER_EDGE, ...HUB_ARMS.map((a) => curvedSpoke(a, a - 50, 40, 112, 22, 16)), circle(52)],
  details:
    // The floor ring in shadow just inside the ridges, where it drops under them; kept off the arms.
    '<radialGradient id="sword-floor" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="116">' +
    '<stop offset=".86" stop-color="#000" stop-opacity=".05"/><stop offset=".97" stop-color="#000" stop-opacity=".45"/></radialGradient>' +
    `<mask id="sword-floor-mask"><path d="${ring(116, 100)}" fill="#fff" fill-rule="evenodd"/><use href="#body" fill="#000"/></mask>` +
    '<circle r="116" fill="url(#sword-floor)" mask="url(#sword-floor-mask)"/>' +
    // The thick outer rim's inner groove.
    `<circle r="182" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` +
    `<circle r="52" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    // The logo knob: trim, knurled rim, a pale mark for the logo.
    `<circle r="48" fill="#000" fill-opacity=".25"/><path d="${knurl(44, 1.2, 52)}" ${TRIM}/><path d="${knurl(44, 1.2, 52)}" fill="#000" fill-opacity=".2"/>` +
    `<circle r="38" ${TRIM}/><circle r="44" fill="url(#sheen)"/>` +
    `<path d="M-16 -14L14 -14L4 2L10 2L-4 22L0 6L-8 6Z" fill="#fff" fill-opacity=".75"/>` +
    // Silver counterweight seen end-on.
    `<circle cx="${f(WEIGHT[0])}" cy="${f(WEIGHT[1])}" r="19" fill="#8d9092"/><circle cx="${f(WEIGHT[0])}" cy="${f(WEIGHT[1])}" r="15" fill="#d3d5d3"/><circle cx="${f(WEIGHT[0])}" cy="${f(WEIGHT[1])}" r="15" fill="url(#sheen)"/>` +
    // The handle seen end-on: accent, ribbed, a silver screw in its end.
    `<circle cx="${f(HANDLE[0])}" cy="${f(HANDLE[1])}" r="22" ${ACCENT}/><circle cx="${f(HANDLE[0])}" cy="${f(HANDLE[1])}" r="22" fill="#000" fill-opacity=".2"/>` +
    `<circle cx="${f(HANDLE[0])}" cy="${f(HANDLE[1])}" r="17" ${ACCENT}/><circle cx="${f(HANDLE[0])}" cy="${f(HANDLE[1])}" r="22" fill="url(#sheen)"/>` +
    screw(...HANDLE, 6),
});
