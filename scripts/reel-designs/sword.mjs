// Piscifun Sword (the original; Sword II is sword-ii.mjs).
// Spool side drawn from Piscifun's three-quarter spool-side photos of an empty black reel and the gunmetal one (olive
// and gray look the same): a flange drilled with a ring of twelve big round holes and twelve small ones between them
// near the rim, its inner edge scalloped round the big holes, opening onto a thin drum ring with three swept arms to
// the hub, a big knurled logo knob in the middle, the handle up top-left and a silver counterweight at the bottom.
// Drag side from Piscifun's straight-on drag-side render (the teal outlines in it only mark the shapes): a thick rim,
// the foot, three pairs of arms curving counterclockwise from a central boss to the rim, with a slot between each
// pair's arms cutting into the rim, and the knob over the boss. Through it shows the spool's cage, which turns: the flange's twelve big holes, the small
// holes between them and the scalloped inner edge, as on the spool side. Arm sweep and widths are approximate.
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

// Drag side, from Piscifun's drag-side render: six arms in three pairs, 120° apart, each arm curving counterclockwise
// from the boss out to the rim. Between the pair's two arms a narrow curved slot runs on past the rim's inner edge,
// cutting into the rim; between the pairs are the big windows.
const PAIRS = [-60, 60, 180];
// Each pair follows a centerline curving counterclockwise from the boss (70 out, 70° round from where it meets the
// rim) to the rim (192), its two arms either side of it, 18 wide. The slot between them widens toward the rim, from
// 6 at the boss to 30 at the rim.
const PAIR = { sweep: 70, r0: 70, r1: 192, ease: 1.5, arm: 18, slotIn: 6, slotOut: 30, steps: 24 };
const slotAt = (r) => PAIR.slotIn + (PAIR.slotOut - PAIR.slotIn) * ((r - PAIR.r0) / (PAIR.r1 - PAIR.r0));
// A band following pair p's centerline from radius rA to rB, between lo(r) and hi(r) to either side of it (in units
// along the circle at r; positive is clockwise), its corners rounded. Built radius by radius, so both sides start at
// rA and end at rB exactly.
function pairBand(p, lo, hi, rA = PAIR.r0, rB = PAIR.r1, corner = 4) {
  const { sweep, r0, r1, ease, steps } = PAIR;
  const center = (r) => rad(p + sweep - sweep * Math.max(0, (r - r0) / (r1 - r0)) ** ease);
  const rs = Array.from({ length: steps + 1 }, (_, i) => rA + ((rB - rA) * i) / steps);
  const side = (off) => rs.map((r) => P(r, center(r) + off(r) / r));
  return roundPoly([...side(lo), ...side(hi).reverse()], corner);
}
const ARMS = PAIRS.flatMap((p) => [
  pairBand(p, (r) => slotAt(r) / 2, (r) => slotAt(r) / 2 + PAIR.arm, PAIR.r0, 184),
  pairBand(p, (r) => -slotAt(r) / 2 - PAIR.arm, (r) => -slotAt(r) / 2, PAIR.r0, 184),
]);
// The slot between a pair's arms runs on into the rim, to 186, at its widening width.
const rimSlot = (p) => pairBand(p, (r) => -slotAt(r) / 2, (r) => slotAt(r) / 2, 150, 186, 10);


// Spool side.
// The handle stands where the top big hole would be, and the counterweight where the bottom one would be, so those
// two holes aren't cut on the spool side.
const HANDLE = P(147, rad(-90));
const SPOOL_HOLES = BIG.filter((a) => a !== -90 && a !== 90).map((a) => circle(27, ...P(147, rad(a)))).join('') + HOLES.slice(BIG_HOLES.length);
const WEIGHT = P(147, rad(90));
// The cavity's three arms: straight spokes, 26 wide, each leaning clockwise as it runs out, its outer edge
// tangent to the ring round the dial (58) at angle a. Between them the floor is cut through, each opening bounded by
// one arm's inner edge, the floor ring's inner edge (100), the next arm's tangent edge and the ring round the dial.
// The tangent edge flows on into that ring; the other corners are rounded (12), as where the Run's drag spokes
// meet its collar, so the arms keep their width all the way in.
const HUB_ARMS = [0, 1, 2].map((k) => -60 + k * 120);
const ARM = { rIn: 58, rOut: 100, w: 26, fillet: 12, filletIn: 12 };
const hubOpenings = () => {
  // An arm's edge: the tangent one (outer) or the inner one, as a point and a direction (clockwise, outward).
  const edge = (a, outer) => {
    const n = [Math.cos(rad(a)), Math.sin(rad(a))], d = [-n[1], n[0]];
    const r = outer ? ARM.rIn : ARM.rIn - ARM.w;
    return { o: [n[0] * r, n[1] * r], d };
  };
  // Where an edge crosses radius r, going out.
  const meet = ({ o, d }, r) => {
    const B = o[0] * d[0] + o[1] * d[1], C = o[0] ** 2 + o[1] ** 2 - r * r;
    const t = -B + Math.sqrt(Math.max(0, B * B - C));
    return [o[0] + d[0] * t, o[1] + d[1] * t];
  };
  const ang = ([x, y]) => Math.atan2(y, x);
  const arc = (r, from, to, n = 48) => {
    const a0 = ang(from);
    let a1 = ang(to);
    while (a1 < a0) a1 += 2 * Math.PI;
    return Array.from({ length: n + 1 }, (_, i) => P(r, a0 + ((a1 - a0) * i) / n));
  };
  // A closed outline through `pts` with the corners at the given indices rounded: each cut back by its radius along
  // the outline on both sides and replaced by a curve through the corner.
  const fillet = (pts, corners) => {
    const n = pts.length, dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
    // The point `len` along the outline from pts[i], stepping by `step` (1 or -1), and how many points it passed on
    // the way, which the curve replaces.
    const walk = (i, len, step) => {
      let j = i, left = len;
      for (;;) {
        const k = (j + step + n) % n, l = dist(pts[j], pts[k]);
        if (l >= left) return [[pts[j][0] + ((pts[k][0] - pts[j][0]) * left) / l, pts[j][1] + ((pts[k][1] - pts[j][1]) * left) / l], (step * (j - i) + n) % n];
        left -= l; j = k;
      }
    };
    const cut = corners.map(([i, r]) => ({ i, before: walk(i, r, -1), after: walk(i, r, 1) }));
    const skip = new Set();
    cut.forEach(({ i, before, after }) => {
      for (let s = 1; s <= before[1]; s++) skip.add((i - s + n) % n);
      for (let s = 1; s <= after[1]; s++) skip.add((i + s) % n);
    });
    const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
    let d = '';
    pts.forEach((p, i) => {
      if (skip.has(i)) return;
      const c = cut.find((c) => c.i === i);
      d += c ? `${d ? 'L' : 'M'}${pt(c.before[0])}Q${pt(p)} ${pt(c.after[0])}` : `${d ? 'L' : 'M'}${pt(p)}`;
    });
    return d + 'Z';
  };
  return HUB_ARMS.map((a, k) => {
    const inner = edge(a, false), tangent = edge(HUB_ARMS[(k + 1) % 3], true);
    // Out along the floor ring's edge, back along the next arm's tangent edge to where it touches the center ring,
    // round that ring back to this arm's inner edge.
    const outer = arc(ARM.rOut, meet(inner, ARM.rOut), meet(tangent, ARM.rOut));
    const back = Array.from({ length: 13 }, (_, i) => {
      const [x, y] = meet(tangent, ARM.rOut), t = 1 - (i + 1) / 13;
      return [tangent.o[0] + (x - tangent.o[0]) * t, tangent.o[1] + (y - tangent.o[1]) * t];
    });
    const center = arc(ARM.rIn, meet(inner, ARM.rIn), tangent.o).reverse().slice(1);
    const m = outer.length;
    return fillet([...outer, ...back, ...center], [[0, ARM.fillet], [m - 1, ARM.fillet], [m + back.length + center.length - 1, ARM.filletIn]]);
  }).join('');
};

export const spool = svg({
  foot: ACCENT_FOOT + `<path d="${FOOT}" fill="#000" fill-opacity=".2"/>`,
  handles: [[...HANDLE, 22]],
  // A recessed floor runs straight on under the flange's scalloped inner edge, no gap, out to 116; inside 100 the
  // middle is cut out. The three hub arms are down in that cavity with the floor, reaching from the dial to it.
  back: [circle(116) + hubOpenings()],
  body: [circle(200) + SPOOL_HOLES + INNER_EDGE, circle(52)],
  details:
    // The floor ring and arms in shadow just inside the ridges, where they drop under them.
    '<radialGradient id="sword-floor" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="116">' +
    '<stop offset=".86" stop-color="#000" stop-opacity=".05"/><stop offset=".97" stop-color="#000" stop-opacity=".45"/></radialGradient>' +
    `<mask id="sword-floor-mask"><use href="#back" fill="#fff"/><use href="#body" fill="#000"/></mask>` +
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

// A path of absolute M, L and Q commands mirrored left to right, as the spool's face looks from the drag side.
const mirror = (d) => d.replace(/([MLQ])([^MLQZ]*)/g, (_, c, nums) => c + nums.trim().split(/[ ,]+/).map((v, k) => (k % 2 ? v : String(-Number(v)))).join(' '));

export const drag = svg({
  under: ACCENT_FOOT,
  // The spool seen through the frame: its flange's holes and scalloped inner edge, and below that its recessed floor
  // with the three arms, mirrored as seen from behind. Shaded lighter than the default, which read too dark here.
  cage: [circle(196) + HOLES + INNER_EDGE, circle(116) + mirror(hubOpenings())],
  cageShade: 0.6,
  // The frame's rim is thick, covering the outer half of the small holes.
  body: [ring(200, 166) + PAIRS.map((p) => rimSlot(p)).join(''), ...ARMS, circle(84)],
  details:
    `<circle r="166" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>` +
    `<circle r="84" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2"/>` +
    // The drag knob: knurled rim, flat face, slotted center screw.
    `<circle r="62" fill="#000" fill-opacity=".22"/><path d="${knurl(58, 1.4, 56)}" ${TRIM}/><path d="${knurl(58, 1.4, 56)}" fill="#000" fill-opacity=".18"/>` +
    `<circle r="50" ${TRIM}/><circle r="58" fill="url(#sheen)"/>` +
    screw(0, 0, 12),
});
