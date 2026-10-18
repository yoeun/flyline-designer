// Sunshine Fishing SF-001 Large Arbor.
// Drawn from Sunshine's own product photos: a three-quarter shot of each side, a near-frontal shot of the three
// sizes side by side and an exploded view. The die-cast frame is a thin rim with three broad spokes swept slightly
// clockwise (a Y), each drilled with a row of round holes, around a big black knurled drag knob with a silver center
// screw; the deep windows between them show the spool's drilled back flange. The spool face is a flange drilled
// with a ring of round holes, whose notched inner edge (the ends of the drum's bars) opens onto a recessed web of
// three curved spokes, with a black hub cap, a silver counterweight at 3 o'clock and the handle at 9.
// The photos are all at an angle, so spoke angles and widths, hole counts and the web inside the spool are
// approximate. Maxcatch's ECO is the same casting (eco.mjs), so the shapes it shares are exported.
import { P, arcPts, circle, f, foot, knob, knurl, rad, recessed, ring, roundPoly, screw, svg } from './lib.mjs';

// The wound line starts on the drum, just inside the spool face's notched edge: 7/8 is 2.40 in inside 3.74 in.
export const arbor = 128;

const RIM_IN = 184; // inner edge of the frame's rim

// A spoke's edge as [r, deg] points from r0 out to the rim: the spoke's center swings `sweep` degrees clockwise from
// hub to rim, and its edge sits `side` (±1) half a width w(r) off it.
const spokeEdge = ({ at, sweep, w0, w1 }, side, r0, steps = 12) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const r = r0 + ((RIM_IN - r0) * i) / steps;
    const t = (r - 60) / (RIM_IN - 60);
    const center = at - sweep * (1 - t) * (1 - t);
    const w = w0 + (w1 - w0) * t;
    return P(r, rad(center + (side * (w / 2) / r) * (180 / Math.PI)));
  });

// The three spokes, by where they meet the rim (degrees, y down) and their width at the hub and at the rim.
const SPOKES = [
  { at: -86, sweep: 14, w0: 46, w1: 50 },
  { at: 34, sweep: 14, w0: 54, w1: 68 },
  { at: 152, sweep: 14, w0: 54, w1: 68 },
];
// Each window runs from one spoke's trailing edge to the next one's leading edge, down to r0 at the hub: deep on
// either side of the top spoke, shallow across the bottom.
const WINDOW_R0 = [90, 124, 90];
const windowPath = (k) => {
  const a = SPOKES[k], b = SPOKES[(k + 1) % 3], r0 = WINDOW_R0[k];
  const out = spokeEdge(a, 1, r0);
  const back = spokeEdge(b, -1, r0).reverse();
  // Join them along the rim and around the hub.
  const ang = ([x, y]) => Math.atan2(y, x);
  const unwrap = (a0, a1) => (a1 < a0 ? a1 + 2 * Math.PI : a1);
  const rimA0 = ang(out.at(-1)), rimA1 = unwrap(rimA0, ang(back[0]));
  const hubA0 = ang(out[0]), hubA1 = unwrap(hubA0, ang(back.at(-1)));
  return roundPoly(
    [...out, ...arcPts(RIM_IN, rimA0, rimA1, 16).slice(1, -1), ...back, ...arcPts(r0, hubA1, hubA0, 8).slice(1, -1)],
    22,
  );
};
// Round holes down each spoke's center line, biggest nearest the hub.
const HOLES = [
  [104, 11],
  [140, 10.5],
  [171, 7],
];
const spokeHoles = (s) =>
  HOLES.map(([r, hr]) => {
    const t = (r - 60) / (RIM_IN - 60);
    return circle(hr, ...P(r, rad(s.at - s.sweep * (1 - t) * (1 - t))));
  }).join('');

// The spool's flange: a ring of round holes, skipping any `skip(deg)` says to.
const holeRing = (n, r, hr, off, skip = () => false) =>
  Array.from({ length: n }, (_, k) => off + (k * 360) / n)
    .filter((deg) => !skip(((deg % 360) + 540) % 360 - 180))
    .map((deg) => circle(hr, ...P(r, rad(deg))))
    .join('');
const FLANGE_HOLES = (skip) => holeRing(20, 163, 14, -90 + 9, skip);

export const FOOT = foot(136, -244, 14, 40);
// The spool's back flange behind the windows.
export const FRAME_BACK = ring(196, 128) + FLANGE_HOLES();
export const FRAME = circle(200) + [0, 1, 2].map(windowPath).join('') + SPOKES.map(spokeHoles).join('');
// The rim's inner edge, then the boss under the knob.
export const FRAME_DETAILS =
  `<circle r="${RIM_IN}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
  `<circle r="82" fill="#000" fill-opacity=".22"/>`;

export const drag = svg({
  back: [FRAME_BACK],
  body: [FRAME, FOOT],
  details:
    FRAME_DETAILS +
    // The black knurled knob with scalloped edge and a silver screw.
    `<path d="${knurl(70, 4, 11)}" fill="#1f2123"/><path d="${knurl(70, 4, 11)}" fill="url(#sheen)"/>` +
    `<circle r="56" fill="#26282b"/><circle r="56" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>` +
    `<circle r="17" fill="#8d9092"/><circle r="14" fill="#d3d5d3"/><circle r="14" fill="url(#sheen)"/>` +
    `<path d="M-9 -3L9 3" stroke="#6d7174" stroke-width="2.4" stroke-linecap="round"/>`,
});

// Spool face: the drilled flange, its inner edge notched where the drum's bars end.
const NOTCHES = 24;
const notchedEdge = (() => {
  const pts = [];
  for (let k = 0; k < NOTCHES; k++) {
    const a = -90 + (k * 360) / NOTCHES, half = 360 / NOTCHES / 2;
    // A bar end reaching in to the drum, then the gap between bars.
    pts.push(P(140, rad(a - half * 0.45)), P(129, rad(a - half * 0.4)), P(129, rad(a + half * 0.4)), P(140, rad(a + half * 0.45)));
  }
  return roundPoly(pts.reverse(), 2);
})();
// The recessed web inside the drum: three curved spokes from the hub, with small holes along them.
const curvedSpoke = (a0, a1, r0, r1, w) => {
  const mid = Array.from({ length: 11 }, (_, i) => P(r0 + ((r1 - r0) * i) / 10, rad(a0 + ((a1 - a0) * i * i) / 100)));
  const side = (s) =>
    mid.map((p, i) => {
      const q = mid[Math.min(i + 1, 10)], o = mid[Math.max(i - 1, 0)];
      const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy);
      return [p[0] - (dy / l) * (w / 2) * s, p[1] + (dx / l) * (w / 2) * s];
    });
  return roundPoly([...side(1), ...side(-1).reverse()], 4);
};
const WEB = [-120, 0, 120];
const handle = P(160, rad(180));
const weight = P(160, rad(0));

export const SPOOL_BACK = [ring(134, 112), ...WEB.map((a) => curvedSpoke(a, a + 40, 40, 124, 26)), circle(50)];
export const SPOOL = circle(200) + FLANGE_HOLES((d) => Math.abs(d) < 10 || Math.abs(d) > 170) + notchedEdge;
export const SPOOL_DETAILS =
  `<circle r="190" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
  // Small holes along the web's spokes, into the dark.
  WEB.map((a) =>
    [70, 98]
      .map((r) => P(r, rad(a + 40 * ((r - 40) / 84) ** 2)))
      .map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#141516"/>`)
      .join(''),
  ).join('');

export const spool = svg({
  foot: recessed(FOOT),
  handles: [[...handle, 17]],
  back: SPOOL_BACK,
  body: [SPOOL],
  details:
    SPOOL_DETAILS +
    // The black hub cap with two screws.
    `<circle r="46" fill="#000" fill-opacity=".25"/><circle r="42" fill="#1f2123"/><circle r="42" fill="url(#sheen)"/>` +
    screw(0, -26, 5) +
    screw(0, 26, 5) +
    // Silver counterweight and the black handle.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="19" fill="#8d9092"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="15" fill="#d3d5d3"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="15" fill="url(#sheen)"/>` +
    knob(...handle, 17),
});
