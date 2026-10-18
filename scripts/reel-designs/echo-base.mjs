// Echo Base.
// Drawn from Echo's product shot of the 6/8 (both sides in one image): the drag side straight on, the spool side
// at three-quarters. The composite frame is a thick rim and five pairs of parallel chamfered bars (up-left,
// up-right, a pair either side running slightly downhill and one straight down) from a boss around the black drag
// knob, whose rim is scalloped with round dimples around a flat logo face. Behind them shows the perforated
// spool's back flange: a ring of big holes, smaller holes inside it and a few tiny ones near the rim. The spool
// face is a plain outer band drilled with a ring of big holes, a recessed step with a ring of smaller holes, a flat
// hub disc and the black spindle cap with two screws; the handle sits at 9 o'clock and a chrome counterweight at 3.
// The chrome line guard on the foot's pillar is from Echo's description, not the photo. Hole counts and the spool
// face's radii are read off the angled shot, so they're approximate.
import { P, circle, edge, f, foot, knob, rad, recessed, ring, roundPoly, screw, strut, svg } from './lib.mjs';

// The wound line starts on the mid-arbor drum, at the edge of the flat hub disc: Trident measured the 4/5's arbor
// at 1.6 in inside a 3.5 in rim (200 × 1.6 / 3.5 ≈ 91).
export const arbor = 91;

// Holes of radius `hr` on a ring of radius r, n of them from `off` degrees.
const holes = (n, r, hr, off = -90) =>
  Array.from({ length: n }, (_, k) => circle(hr, ...P(r, rad(off + (k * 360) / n)))).join('');

// Frame bars: five pairs, by the direction of the pair's center line (degrees, y down). Each bar runs parallel to
// it, BAR_GAP either side, from the boss into the rim.
const PAIRS = [-122, -58, 14, 90, 166];
const BAR_GAP = 23, BAR_W = 25, BOSS = 80;
const BARS = PAIRS.flatMap((a) => [-1, 1].map((s) => [edge(rad(a), s * BAR_GAP, BOSS - 8), edge(rad(a), s * BAR_GAP, 192)]));

// The base wide pillar, with the chrome line guard across it just above the rim.
const FOOT = foot(130, -244, 14, 46);
const GUARD = `<path d="${roundPoly([[-40, -222], [40, -222], [40, -208], [-40, -208]], 4)}" fill="#c9ccc8"/><path d="${roundPoly([[-40, -222], [40, -222], [40, -208], [-40, -208]], 4)}" fill="url(#sheen)"/>`;

// The black drag knob: a dark rim scalloped with round dimples, and a flat face where the logo goes.
const DRAG_KNOB =
  `<circle r="72" fill="#1f2123"/><circle r="72" fill="url(#sheen)"/>` +
  Array.from({ length: 13 }, (_, k) => P(60, rad(-90 + (k * 360) / 13)))
    .map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="#000" fill-opacity=".35"/><circle cx="${f(x + 1)}" cy="${f(y + 1)}" r="6" fill="#fff" fill-opacity=".06"/>`)
    .join('') +
  `<circle r="46" fill="#2a2c2f"/><circle r="46" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>` +
  `<circle r="46" fill="url(#sheen)"/>`;

export const drag = svg({
  // The spool's back flange behind the bars.
  back: [ring(192, 60) + holes(18, 148, 17) + holes(18, 106, 10, -80) + holes(18, 178, 5, -80)],
  body: [ring(200, 178), circle(BOSS), FOOT, ...BARS.map(([p0, p1]) => strut(p0, p1, BAR_W))],
  details:
    `<circle r="178" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="2"/>` +
    // Each bar's flat top, a little lighter than its chamfered sides.
    BARS.map(([p0, p1]) => `<path d="${strut(p0, p1, BAR_W - 10)}" fill="#fff" fill-opacity=".07"/>`).join('') +
    `<circle r="${BOSS}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
    DRAG_KNOB +
    GUARD,
});

// Spool side.
const handle = P(138, rad(180));
const weight = P(152, rad(0));
const BIG_HOLES = 22;

export const spool = svg({
  foot: recessed(FOOT) + GUARD,
  handles: [[...handle, 19]],
  // The recessed step inside the big holes, drilled with smaller holes.
  back: [ring(132, 92) + holes(20, 112, 9)],
  body: [
    // Outer band and its big holes, leaving out the two under the counterweight and the handle's post.
    circle(200) +
      Array.from({ length: BIG_HOLES }, (_, k) => -90 + (360 / BIG_HOLES) * (k + 0.5))
        .filter((d) => Math.abs(((d + 540) % 360) - 180) > 10 && Math.abs(d - 180) > 10)
        .map((d) => circle(16, ...P(152, rad(d))))
        .join('') +
      circle(132),
    // The flat hub disc.
    circle(92),
  ],
  details:
    `<circle r="190" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="132" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3"/>` +
    // The handle's post from the band in to the knob.
    `<path d="${strut(P(160, rad(180)), handle, 16)}" fill="currentColor"/>` +
    // The black spindle boss and its cap with two screws.
    `<circle r="50" fill="#000" fill-opacity=".25"/><circle r="46" fill="#1f2123"/><circle r="46" fill="url(#sheen)"/>` +
    `<circle r="24" fill="#2a2d30"/><circle r="24" fill="url(#sheen)"/>` +
    screw(0, -34, 5) +
    screw(0, 34, 5) +
    // Chrome counterweight, domed.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="20" fill="#8d9092"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="16" fill="#e2e4e2"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="16" fill="url(#sheen)"/>` +
    knob(...handle, 19),
});
