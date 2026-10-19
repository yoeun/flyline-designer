// Lamson Liquid S.
// Drag side: the frame is a rim, the foot, one thick vertical spoke from the foot past the drag to 6 o'clock and two
// Y arms branching off it up to the rim, round the knurled drag knob. Through it shows the spool's cage, which
// turns: its 24 windows, the same as the spool side's, without the handle (the wound line hides it). Spool side:
// that window ring set back behind the spool's rim and five swept spokes, with the handle partway along one.
import { ACCENT, P, chamfer, circle, foot, knob, knurl, rad, recessed, ring, roundPoly, slots, strut, sunkFace, svg } from './lib.mjs';

// The wound line starts at the inner edge of the spool's windows.
export const arbor = 126;

// The spool's 24 windows, shared by both sides.
const RIM = { n: 24, rIn: 126, rOut: 171, bar: 12, corner: 7 };

// Liquid S spool side, from Lamson's photo of the bare spool: five spokes, 72° apart, swept hard: each leaves the
// hexagonal center almost tangent to it (70° back from where it meets the rim), so neighbours form a V beside it.
// They're thick at the center and taper to the rim, and each has one deep chamfer along its trailing (clockwise)
// edge. The one ending at -105° stops at the handle; the windows show past it.
const LIQUID_SPOKES = [0, 1, 2, 3, 4].map((k) => -105 + k * 72);
const SPOKE_W = [32, 14];
// Each spoke's line runs back past the center until its base meets the next spoke counterclockwise (15% of its
// length back from P(30, a - 70)), so the bases lock together into a pinwheel round the center.
const spokeEnds = (a) => {
  const p0 = P(30, rad(a - 70)), p1 = P(190, rad(a));
  return [[p0[0] - (p1[0] - p0[0]) * 0.17, p0[1] - (p1[1] - p0[1]) * 0.17], p1];
};
const liquidHandle = (() => {
  const [[x0, y0], [x1, y1]] = spokeEnds(-105);
  return [x0 + (x1 - x0) * 0.78, y0 + (y1 - y0) * 0.78];
})();
const along = ([a, b], t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// Each spoke from the center to the rim, or, for the handle's, to just past the handle.
const SPOKE_LINES = LIQUID_SPOKES.map((a) => {
  const [p0, p1] = spokeEnds(a);
  return a === -105 ? [p0, along([p0, p1], 0.85)] : [p0, p1];
});
const spokeWidthAt = (t) => SPOKE_W[0] + (SPOKE_W[1] - SPOKE_W[0]) * t;
const SPOOL_SPOKES = SPOKE_LINES.map(([p0, p1], i) => strut(p0, p1, SPOKE_W[0], i === 0 ? spokeWidthAt(0.85) : SPOKE_W[1]));
// Where a spoke tip meets the rim it flares into it: a curved fillet on each side, from the spoke's edge 20 in from
// the rim's inner edge (181) round to the rim 14 along it. The handle's spoke stops short of the rim, so has none.
const FILLET = { r: 181, back: 20, along: 14 };
const tipFillets = ([p0, p1]) => {
  const l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const d = [(p1[0] - p0[0]) / l, (p1[1] - p0[1]) / l], n = [-d[1], d[0]];
  // Where the spoke's center line crosses radius r.
  const t = (r) => {
    const B = p0[0] * d[0] + p0[1] * d[1], C = p0[0] ** 2 + p0[1] ** 2 - r * r;
    return -B + Math.sqrt(B * B - C);
  };
  const width = (u) => SPOKE_W[0] + (SPOKE_W[1] - SPOKE_W[0]) * (u / l);
  const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  return [1, -1]
    .map((side) => {
      const edge = (u) => [p0[0] + d[0] * u + (side * n[0] * width(u)) / 2, p0[1] + d[1] * u + (side * n[1] * width(u)) / 2];
      const corner = edge(t(FILLET.r)), start = edge(t(FILLET.r) - FILLET.back);
      const a = Math.atan2(corner[1], corner[0]) + (side * FILLET.along) / FILLET.r;
      const end = P(FILLET.r + 4, a), corner2 = [corner[0] * (FILLET.r + 4) / FILLET.r, corner[1] * (FILLET.r + 4) / FILLET.r];
      return `M${pt(start)}L${pt(corner2)}L${pt(end)}Q${pt(corner)} ${pt(start)}Z`;
    })
    .join('');
};

// The hexagonal center the spokes grow out of, under the round cap.
const HEX = roundPoly(Array.from({ length: 6 }, (_, k) => P(46, rad(-90 + k * 60))), 8);
// A spoke's deep chamfer, like the drag side's arms': a facet along its clockwise edge, 2/3 of its width, in one even
// shade, the same on every spoke. It runs from the hexagonal center toward the rim, fading out at the tip.
const spokeFacet = ([p0, p1], i) => {
  const l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const n = [-(p1[1] - p0[1]) / l, (p1[0] - p0[0]) / l]; // the clockwise side
  // Where the spoke's center line crosses radius r.
  const cross = (r) => {
    const d = [p1[0] - p0[0], p1[1] - p0[1]], B = p0[0] * d[0] + p0[1] * d[1], A = l * l, C = p0[0] ** 2 + p0[1] ** 2 - r * r;
    return Math.min(1, (-B + Math.sqrt(B * B - A * C)) / A);
  };
  const t0 = cross(44), t1 = cross(181);
  const w1 = i === 0 ? spokeWidthAt(0.85) : SPOKE_W[1];
  const width = (t) => SPOKE_W[0] + (w1 - SPOKE_W[0]) * t;
  const at = (t, k) => { const c = along([p0, p1], t); return [c[0] + n[0] * width(t) * k, c[1] + n[1] * width(t) * k]; };
  const pts = [at(t0, 0.5), at(t1, 0.5), at(t1, -1 / 6), at(t0, -1 / 6)];
  // Toward the tip it fades out, from 150 to the rim's inner edge, so the spoke flows on into the rim.
  const [g0, g1] = [along([p0, p1], cross(150)), along([p0, p1], t1)];
  const id = `liquid-facet-${i}`;
  return (
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${g0[0].toFixed(1)}" y1="${g0[1].toFixed(1)}" x2="${g1[0].toFixed(1)}" y2="${g1[1].toFixed(1)}">` +
    '<stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    `<path d="M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z" fill="url(#${id})"/>`
  );
};

// The spool's window ring curves down to its floor below the windows: a gradient drop from the windows' inner edge
// (126) to the ring's inner edge (116), on the ring only. A mask keeps it off the body (frame or spool spokes) that
// crosses over it. `side` keeps the ids apart.
const curvedFloor = (side) =>
  `<mask id="liquid-${side}-floor"><rect x="-215" y="-250" width="430" height="470" fill="#fff"/><use href="#body" fill="#000"/></mask>` +
  `<g mask="url(#liquid-${side}-floor)">${sunkFace({ id: `liquid-${side}`, wall: RIM.rIn, floor: 116, cut: slots(RIM) + circle(116) })}</g>`;

// The drag side's middle spoke, one straight taper: 104 wide under the foot, narrowing evenly to 44 at 6 o'clock,
// its ends following the rim's outer edge. It's a separate piece laid over the rim, so its whole outline is
// chamfered, across the rim too.
const MIDDLE_SPOKE = (() => {
  // Where the side through (x0, -196) and (x1, 196) meets the rim's outer edge, top (-1) or bottom (1).
  const meet = (x0, x1, end) => {
    const k = (x1 - x0) / 392, c = x0 + 196 * k; // x = c + k * y
    const y = (end * Math.sqrt(200 ** 2 * (1 + k * k) - c * c) - c * k) / (1 + k * k);
    return [c + k * y, y];
  };
  const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const tl = meet(-52, -22, -1), tr = meet(52, 22, -1), br = meet(52, 22, 1), bl = meet(-52, -22, 1);
  return `M${pt(tl)}A200 200 0 0 1 ${pt(tr)}L${pt(br)}A200 200 0 0 1 ${pt(bl)}Z`;
})();

// The drag side's Y arms leave the middle spoke a little below halfway between the drag knob and the rim (at about
// y -98) and rise steeply to the rim.
const ARM_ENDS = [
  [[-30, -86], P(194, rad(-128))],
  [[30, -86], P(194, rad(-52))],
];
const ARMS = ARM_ENDS.map(([a, b]) => strut(a, b, 20, 15));
// Each arm's one chamfer: a wide facet along its upper edge, over 2/3 of its width, in one shade by the way it faces
// the light from the top left (the right arm's lit, the left arm's in shade). The arm's lower edge has none.
const armFacet = ([a, b]) => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  let n = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
  if (n[1] > 0) n = [-n[0], -n[1]];
  const at = (p, w, k) => [p[0] + n[0] * w * k, p[1] + n[1] * w * k];
  const pts = [at(a, 20, 1 / 2), at(b, 15, 1 / 2), at(b, 15, -1 / 6), at(a, 20, -1 / 6)];
  const facing = (n[0] + n[1]) * -Math.SQRT1_2; // toward the light
  // One facing the light only weakly (the left arm's) would barely differ from the arm's face, so it's shaded.
  const fill = facing > 0.3 ? `fill="#fff" fill-opacity="${(0.15 + 0.3 * facing).toFixed(2)}"` : 'fill="#000" fill-opacity=".25"';
  return `<path d="M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z" ${fill}/>`;
};

// The drag button takes the finish's accent: orange-red on Smoke, yellow on Day Break.
export const drag = svg({
  cage: [ring(190, 116) + slots(RIM)],
  body: [
    ring(200, 181),
    foot(128, -244, 14, 34),
    MIDDLE_SPOKE,
    ...ARMS,
  ],
  // Chamfers: the rim's inner edge, and each arm's upper edge (inside the rim), kept off the middle spoke laid over
  // them; then the middle spoke's own, round its whole outline. All stop inside the outer edge, where a dark chamfer,
  // a flat facet, runs all the way round. That runs across the foot's post where it meets the frame, so the foot
  // reads as a separate piece, and across the spoke's ends, so they're shaded like the rim.
  details:
    curvedFloor('drag') +
    `<mask id="liquid-frame-mask"><circle r="196" fill="#fff"/><path d="${MIDDLE_SPOKE}" fill="#000"/></mask>` +
    `<mask id="liquid-arm-mask"><circle r="181" fill="#fff"/><path d="${MIDDLE_SPOKE}" fill="#000"/></mask>` +
    `<g mask="url(#liquid-frame-mask)">${chamfer('liquid-frame', ring(200, 181))}</g>` +
    `<g mask="url(#liquid-arm-mask)">${ARM_ENDS.map(armFacet).join('')}</g>` +
    `<clipPath id="liquid-spoke-clip"><circle r="196"/></clipPath><g clip-path="url(#liquid-spoke-clip)">${chamfer('liquid-spoke', MIDDLE_SPOKE)}</g>` +
    `<path d="${ring(200, 196)}" fill="#000" fill-opacity=".2" fill-rule="evenodd"/><path d="${knurl(60, 3.5, 20)}" fill="#3a3d41"/><path d="${knurl(60, 3.5, 20)}" fill="url(#sheen)"/><circle r="36" fill="#2f3235"/><circle r="18" ${ACCENT}/><circle cx="-4" cy="5" r="3" fill="#000" fill-opacity=".45"/><circle cx="4" cy="-5" r="3" fill="#000" fill-opacity=".45"/>`,
});

export const spool = svg({
  foot: recessed(foot(128, -244, 14, 34)),
  handles: [[...liquidHandle, 16]],
  // The spool's window ring, set back behind its rim and spokes.
  back: [ring(190, 116) + slots(RIM)],
  body: [ring(200, 181), ...SPOOL_SPOKES, ...SPOKE_LINES.slice(1).map(tipFillets), HEX],
  // The rim's inner edge chamfered (off the spokes), inside a dark outer chamfer; each spoke's deep chamfer; then the
  // round cap on the hexagon, and the handle.
  details:
    curvedFloor('spool') +
    `<mask id="liquid-spool-mask"><circle r="196" fill="#fff"/>${[...SPOOL_SPOKES, ...SPOKE_LINES.slice(1).map(tipFillets), HEX].map((d) => `<path d="${d}" fill="#000"/>`).join('')}</mask>` +
    `<g mask="url(#liquid-spool-mask)">${chamfer('liquid-spool', ring(200, 181))}</g>` +
    `<path d="${ring(200, 196)}" fill="#000" fill-opacity=".2" fill-rule="evenodd"/>` +
    SPOKE_LINES.map(spokeFacet).join('') +
    `<circle r="24" fill="#000" fill-opacity=".25"/><circle r="22" fill="currentColor"/><circle r="22" fill="url(#sheen)"/>` +
    knob(...liquidHandle, 16),
});
