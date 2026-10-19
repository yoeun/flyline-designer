// Sunshine Fishing SF-003 Pro.
// Drag side drawn from Sunshine's two near-straight-on drag-side photos (gunmetal and black): the frame is a thin
// rim, the foot and a "PRO" plate, an inverted triangle whose two straight arms run from the rim at about 10:30 and
// 1:30 down to the rim at 6 o'clock, filled solid below the round hub and open above it, with a plain disc hub cap.
// The many narrow bars seen through its three windows are the spool's cage, which turns: the same ring of 26 radial
// slots as the spool face, round the opening into the drum (the counterweight and handle are left out: the wound
// line hides them).
// Spool side from the white-background three-quarter shots: a wide face cut with a ring of radial slots around a
// big opening into the drum, a recessed web of three spokes, a tall knurled hub cap, a silver counterweight at
// about 10 o'clock and the black handle knob at 5.
// On the black finish the foot, triangle plate and both hub caps are black but the spool and the drag side's outer
// rim stay gunmetal, so those, and the drag side's cage, take the finish's trim (the reel color where there is
// none). The spool-side shots are at an angle, so its slot count, the web and the handle and counterweight
// positions are approximate.
import { P, TRIM, circle, f, foot, knob, knurl, rad, recessed, ring, roundPoly, slots, spoke, svg } from './lib.mjs';

// The wound line starts at the spool face's opening: a 50 mm drum in a 94 mm spool (7/8) is 106 at rim 200.
export const arbor = 106;

const RIM_IN = 183; // inner edge of the frame's rim
const HUB = 80; // the frame's hub disc

// Where the line through p0 along d meets the circle of radius r, toward d's end.
const meet = (p0, d, r) => {
  const b = p0[0] * d[0] + p0[1] * d[1], a = d[0] * d[0] + d[1] * d[1], c = p0[0] * p0[0] + p0[1] * p0[1] - r * r;
  const t = (-b + Math.sqrt(b * b - a * c)) / a;
  return [p0[0] + d[0] * t, p0[1] + d[1] * t];
};
const ang = ([x, y]) => Math.atan2(y, x);
const unwrap = (a0, a1) => (a1 < a0 ? a1 + 2 * Math.PI : a1);
const arc = (r, p0, p1, steps) => {
  const a0 = ang(p0);
  return Array.from({ length: steps + 1 }, (_, i) => P(r, a0 + ((unwrap(a0, ang(p1)) - a0) * i) / steps));
};
const mirror = ([x, y]) => [-x, y];

// The triangle's arms. Each outer edge is a straight chord of the rim: through (-86, 0), leaning in 0.275 per unit
// down. The inner edges, which bound the top window, lean in more steeply and meet the hub.
const OUTER = { p: [-86, 0], d: [0.275, 1] };
const INNER = { p: [-60, -50], d: [0.43, 1] };
// A side window: the rim's segment cut off by the left arm's outer edge (mirrored for the right).
const sideWindow = (() => {
  const top = meet(OUTER.p, [-OUTER.d[0], -OUTER.d[1]], RIM_IN), bottom = meet(OUTER.p, OUTER.d, RIM_IN);
  // Counter-clockwise from the bottom round the left side to the top, then straight back down the arm.
  return arc(RIM_IN, bottom, top, 30);
})();
// The top window: the rim above the arms' inner edges, down to the hub.
const topWindow = (() => {
  const rimL = meet(INNER.p, [-INNER.d[0], -INNER.d[1]], RIM_IN), hubL = meet(INNER.p, [-INNER.d[0], -INNER.d[1]], HUB + 6);
  const rimR = mirror(rimL), hubR = mirror(hubL);
  return [...arc(RIM_IN, rimL, rimR, 20), ...arc(HUB + 6, hubL, hubR, 10).reverse()];
})();
const WINDOWS =
  roundPoly(sideWindow, 16) + roundPoly(sideWindow.map(mirror).reverse(), 16) + roundPoly(topWindow, 14);

// Spool parts in the finish's trim: plain, and darkened as `back` would.
const trimmed = (...ds) => ds.map((d) => `<path d="${d}" fill-rule="evenodd" ${TRIM}/>`).join('');
const recessedTrim = (...ds) => trimmed(...ds) + ds.map((d) => `<path d="${d}" fill-rule="evenodd" fill="#000" opacity=".2"/>`).join('');

// The spool's ring of radial slots, shared by both sides.
const SLOTS = { n: 26, rIn: 120, rOut: 182, bar: 13, corner: 6, off: -90 + 360 / 52 };

const FOOT = foot(140, -244, 14, 40);

// A plain hub cap in the frame color, a little lighter than the frame, with an edge ring.
const cap = (r) =>
  `<circle r="${r + 4}" fill="#000" fill-opacity=".22"/><circle r="${r}" fill="currentColor"/><circle r="${r}" fill="#fff" fill-opacity=".14"/>` +
  `<circle r="${r}" fill="url(#sheen)"/><circle r="${r - 6}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`;

export const drag = svg({
  cage: [ring(196, 104) + slots(SLOTS)],
  cageFill: TRIM,
  body: [circle(200) + WINDOWS, FOOT],
  details:
    // The outer rim is gunmetal on the black finish too: redrawn in the trim over the body's frame color.
    trimmed(ring(200, RIM_IN)) +
    `<path d="${ring(200, RIM_IN)}" fill-rule="evenodd" fill="url(#sheen)"/>` +
    `<circle r="${RIM_IN}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="${HUB}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/>` +
    cap(64) +
    // PRO, reading down the plate below the hub.
    `<text x="0" y="0" transform="translate(4 112) rotate(90)" text-anchor="middle" dominant-baseline="central" font-family="system-ui,Helvetica,Arial,sans-serif" font-weight="800" font-size="22" letter-spacing="8" fill="#fff" fill-opacity=".85">PRO</text>`,
});

// Spool face: a ring of radial slots around the opening into the drum.
const FACE = ring(200, 104) + slots(SLOTS);
// The recessed web inside the drum: a ring and three spokes out from the hub.
const WEB = [ring(104, 92), ...[-90, 30, 150].map((a) => spoke(a, 30, 96, 22, 14)), circle(50)];
const handle = P(150, rad(55));
const weight = P(150, rad(-125));

export const spool = svg({
  foot: recessed(FOOT),
  handles: [[...handle, 18]],
  under: recessedTrim(...WEB),
  body: [FACE],
  details:
    // The face again in the trim color, over the body's frame color.
    trimmed(FACE) +
    `<path d="${FACE}" fill-rule="evenodd" fill="url(#sheen)"/>` +
    `<circle r="182" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="120" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    // The tall hub cap: a knurled side round a flat face, in the frame color.
    `<circle r="50" fill="#000" fill-opacity=".28" transform="translate(3 5)"/>` +
    `<path d="${knurl(46, 1.5, 48)}" fill="currentColor"/><path d="${knurl(46, 1.5, 48)}" fill="#000" fill-opacity=".35"/>` +
    cap(38) +
    // Silver counterweight and the black handle knob.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="20" fill="#000" fill-opacity=".2"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="17" fill="#c9ccc8"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="17" fill="url(#sheen)"/>` +
    knob(...handle, 18),
});
