// Draws the reel frame SVGs in src/assets/reels: one per design and side. Run `npm run reels`
// after editing a design here, and commit the regenerated SVGs with it.
// Coordinates match ReelPreview: centered, rim radius 200, y down.
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2] ?? new URL('../src/assets/reels', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const f = (n) => +n.toFixed(1);
const rad = (deg) => (deg * Math.PI) / 180;
const P = (r, a) => [r * Math.cos(a), r * Math.sin(a)];

// Closed polygon with every corner rounded by up to `r`.
function roundPoly(pts, r) {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p = pts[i], p1 = pts[(i + 1) % n];
    const l0 = Math.hypot(p[0] - p0[0], p[1] - p0[1]);
    const l1 = Math.hypot(p1[0] - p[0], p1[1] - p[1]);
    const k0 = Math.min(r, l0 / 2) / l0, k1 = Math.min(r, l1 / 2) / l1;
    const a = [p[0] + (p0[0] - p[0]) * k0, p[1] + (p0[1] - p[1]) * k0];
    const b = [p[0] + (p1[0] - p[0]) * k1, p[1] + (p1[1] - p[1]) * k1];
    d += `${i ? 'L' : 'M'}${f(a[0])} ${f(a[1])}Q${f(p[0])} ${f(p[1])} ${f(b[0])} ${f(b[1])}`;
  }
  return d + 'Z';
}

const circle = (r, cx = 0, cy = 0) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const ring = (outer, inner) => circle(outer) + circle(inner);

// Points along a line parallel to direction `a`, offset `d` sideways, where it meets radius r.
const edge = (a, d, r) => {
  const t = Math.sqrt(r * r - d * d);
  return [t * Math.cos(a) - d * Math.sin(a), t * Math.sin(a) + d * Math.cos(a)];
};
const arcPts = (r, a0, a1, steps = 10) => Array.from({ length: steps + 1 }, (_, i) => P(r, a0 + ((a1 - a0) * i) / steps));

// n windows between straight bars of width `bar`, from rIn to rOut, first bar at `off` degrees.
// `slant` shifts each bar sideways so it no longer points at the center.
function slots({ n, rIn, rOut, bar, corner, off = -90, slant = 0 }) {
  let d = '';
  for (let k = 0; k < n; k++) {
    const a0 = rad(off + (k * 360) / n), a1 = rad(off + ((k + 1) * 360) / n);
    const A1 = edge(a0, slant + bar / 2, rIn), A2 = edge(a0, slant + bar / 2, rOut);
    const B2 = edge(a1, slant - bar / 2, rOut), B1 = edge(a1, slant - bar / 2, rIn);
    const outer = arcPts(rOut, Math.atan2(A2[1], A2[0]), Math.atan2(B2[1], B2[0]) + (Math.atan2(B2[1], B2[0]) < Math.atan2(A2[1], A2[0]) ? 2 * Math.PI : 0));
    const innerA0 = Math.atan2(A1[1], A1[0]);
    let innerA1 = Math.atan2(B1[1], B1[0]);
    if (innerA1 < innerA0) innerA1 += 2 * Math.PI;
    const inner = arcPts(rIn, innerA1, innerA0, 6);
    d += roundPoly([...outer, ...inner], corner);
  }
  return d;
}

// A straight spoke from r0 to r1 along `deg`, w0 wide at r0 and w1 wide at r1.
function spoke(deg, r0, r1, w0, w1 = w0, sweep = 0) {
  const a = rad(deg), s = rad(deg - sweep);
  const n0 = [-Math.sin(s), Math.cos(s)], n1 = [-Math.sin(a), Math.cos(a)];
  const c0 = P(r0, s), c1 = P(r1, a);
  return roundPoly(
    [
      [c0[0] + n0[0] * w0 / 2, c0[1] + n0[1] * w0 / 2],
      [c1[0] + n1[0] * w1 / 2, c1[1] + n1[1] * w1 / 2],
      [c1[0] - n1[0] * w1 / 2, c1[1] - n1[1] * w1 / 2],
      [c0[0] - n0[0] * w0 / 2, c0[1] - n0[1] * w0 / 2],
    ],
    3,
  );
}

// A straight strut between two points, w0 wide at p0 and w1 wide at p1.
function strut(p0, p1, w0, w1 = w0) {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const n = [-(p1[1] - p0[1]) / len, (p1[0] - p0[0]) / len];
  return roundPoly(
    [
      [p0[0] + (n[0] * w0) / 2, p0[1] + (n[1] * w0) / 2],
      [p1[0] + (n[0] * w1) / 2, p1[1] + (n[1] * w1) / 2],
      [p1[0] - (n[0] * w1) / 2, p1[1] - (n[1] * w1) / 2],
      [p0[0] - (n[0] * w0) / 2, p0[1] - (n[1] * w0) / 2],
    ],
    3,
  );
}

const rect = (x, y, w, h, r = 4) => roundPoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], r);

// Foot plate on a post, top edge at y.
const foot = (half, y = -246, h = 16, postHalf = 26) =>
  roundPoly([[-half, y], [half, y], [half - 8, y + h], [postHalf, y + h], [postHalf, -186], [-postHalf, -186], [-postHalf, y + h], [-half + 8, y + h]], 5);

// Wavy-edged knob, r ± amp with `teeth` bumps.
function knurl(r, amp, teeth) {
  const pts = Array.from({ length: teeth * 8 }, (_, i) => {
    const a = (i / (teeth * 8)) * 2 * Math.PI;
    return P(r + amp * Math.cos(teeth * a), a);
  });
  return 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z';
}

const SHEEN = `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>`;
const SHEEN_RECT = `<rect x="-215" y="-250" width="430" height="470" fill="url(#sheen)" mask="url(#body-mask)"/>`;

// under: fixed-color markup behind everything; back: recessed metal (darkened); body: front metal in reel color;
// details: fixed colors on top.
function svg({ under = '', back = [], body, details = '' }) {
  const backPaths = back.map((d) => `<path d="${d}"/>`).join('');
  const bodyPaths = body.map((d) => `<path d="${d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-215 -250 430 470" color="#b8bdc2">
<defs>${SHEEN}<g id="back" fill-rule="evenodd">${backPaths}</g><g id="body" fill-rule="evenodd">${bodyPaths}</g><mask id="body-mask"><use href="#body" fill="#fff"/></mask></defs>
${under ? under + '\n' : ''}${back.length ? '<use href="#back" fill="currentColor"/><use href="#back" fill="#000" opacity=".2"/>' : ''}
<use href="#body" fill="#000" opacity=".28" transform="translate(2 4)"/>
<use href="#body" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2"/>
<use href="#body" fill="currentColor"/>
${SHEEN_RECT}
${details}
</svg>
`;
}

// Dark knob with a screw slot, e.g. a handle seen end-on.
const knob = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#2b2e31"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.72}" fill="#3a3e42"/><path d="M${f(cx - r * 0.5)} ${f(cy + r * 0.2)}L${f(cx + r * 0.5)} ${f(cy - r * 0.2)}" stroke="#1b1d1f" stroke-width="2.5" stroke-linecap="round"/>`;

// Liquid S spool side: five spokes swept back 40°; the handle sits partway along the one ending at -105°.
const LIQUID_SPOKES = [0, 1, 2, 3, 4].map((k) => -105 + k * 72);
const liquidHandle = (() => {
  const [x0, y0] = P(26, rad(-145)), [x1, y1] = P(188, rad(-105));
  return [x0 + (x1 - x0) * 0.62, y0 + (y1 - y0) * 0.62];
})();

const designs = {
  'generic-drag': svg({
    back: [ring(186, 108) + slots({ n: 20, rIn: 118, rOut: 176, bar: 11, corner: 6 })],
    body: [ring(200, 184), foot(120), spoke(-90, 0, 192, 40, 34), spoke(30, 0, 192, 36, 28), spoke(150, 0, 192, 36, 28), circle(56)],
    details: `<path d="${knurl(44, 2, 24)}" fill="#2b2e31"/><circle r="34" fill="#3a3e42"/><circle r="12" fill="#2b2e31"/>`,
  }),
  'generic-spool': svg({
    // Foot sits behind the spool on this side.
    back: [foot(120)],
    body: [ring(200, 106) + slots({ n: 12, rIn: 116, rOut: 182, bar: 16, corner: 7, off: -60 }), circle(36), ...[0, 72, 144, 216, 288].map((a) => spoke(a - 54, 0, 110, 18, 12))],
    details: `<circle cx="${f(P(146, rad(-60))[0])}" cy="${f(P(146, rad(-60))[1])}" r="24" fill="currentColor"/>${knob(...P(146, rad(-60)), 17)}<circle r="22" fill="#000" fill-opacity=".14"/><circle r="5" fill="#000" fill-opacity=".3"/>`,
  }),
  'run-drag': svg({
    back: [ring(188, 112) + slots({ n: 32, rIn: 120, rOut: 180, bar: 8, corner: 3 })],
    body: [ring(200, 186), foot(150, -240, 14, 30), spoke(-125, 0, 194, 44, 36), spoke(-55, 0, 194, 44, 36), spoke(90, 0, 194, 54, 46), circle(64)],
    details:
      `<circle r="54" fill="#000" fill-opacity=".22"/>` +
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * 2 * Math.PI;
        const [x0, y0] = P(42, a), [x1, y1] = P(52, a);
        return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".3" stroke-width="3"/>`;
      }).join('') +
      `<circle r="24" fill="#1d1f22"/><circle r="18" fill="none" stroke="#d6d9d4" stroke-width="3"/>`,
  }),
  'run-spool': svg({
    back: [foot(150, -240, 14, 30)],
    body: [
      ring(200, 108) + slots({ n: 32, rIn: 118, rOut: 182, bar: 8, corner: 3 }),
      rect(-21, -184, 42, 70, 6),
      rect(-21, 114, 42, 70, 6),
      ...Array.from({ length: 8 }, (_, k) => spoke(-67.5 + k * 45, 0, 112, 12, 9)),
      circle(30),
    ],
    details: `${knob(0, -150, 15)}${knob(0, 150, 15)}<circle r="21" fill="#000" fill-opacity=".14"/><circle r="21" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`,
  }),
  'liquid-s-drag': svg({
    back: [ring(190, 116) + slots({ n: 24, rIn: 126, rOut: 180, bar: 12, corner: 7 })],
    body: [
      ring(200, 189),
      foot(128, -244, 14, 34),
      // One thick vertical spoke: wide under the foot, narrowing past the drag to a strip at 6 o'clock.
      roundPoly([[-52, -196], [52, -196], [36, -40], [22, 40], [22, 196], [-22, 196], [-22, 40], [-36, -40]], 8),
      // The Y arms branch off it above the drag and rise to the rim.
      strut([-30, -108], P(194, rad(-137)), 20, 15),
      strut([30, -108], P(194, rad(-43)), 20, 15),
    ],
    details: `<path d="${knurl(60, 3.5, 20)}" fill="#3a3d41"/><path d="${knurl(60, 3.5, 20)}" fill="url(#sheen)"/><circle r="36" fill="#2f3235"/><circle r="18" fill="#e2581f"/><circle cx="-4" cy="5" r="3" fill="#7a2a0c"/><circle cx="4" cy="-5" r="3" fill="#7a2a0c"/>`,
  }),
  'liquid-s-spool': svg({
    back: [foot(128, -244, 14, 34)],
    body: [ring(200, 184), ...LIQUID_SPOKES.map((a) => spoke(a, 26, 188, 20, 13, 40)), circle(38)],
    details: `${knob(...liquidHandle, 16)}<circle r="30" fill="#fff" fill-opacity=".1"/>`,
  }),
};

// The Hydros foot is dark whatever the reel color.
const HYDROS_FOOT = `<path d="${foot(130, -244, 14, 30)}" fill="#3b3e41"/><path d="${foot(130, -244, 14, 30)}" fill="url(#sheen)"/>`;
const screw = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#c9ccc8"/><path d="M${f(cx - r * 0.7)} ${f(cy)}L${f(cx + r * 0.7)} ${f(cy)}" stroke="#55595c" stroke-width="1.6"/>`;
// A dark drag knob with a knurled rim and a silver center screw.
const dragKnob = (r) =>
  `<path d="${knurl(r, 2, 36)}" fill="#26282b"/><path d="${knurl(r, 2, 36)}" fill="url(#sheen)"/><circle r="${r - 9}" fill="#303336"/><circle r="${r - 9}" fill="url(#sheen)"/>${screw(0, 0, 10)}`;
// A filled pad across a window, e.g. a counterweight, centered at radius r and angle deg.
const pad = (r, deg, w, h) => {
  const a = rad(deg), [cx, cy] = P(r, a);
  const u = [Math.cos(a), Math.sin(a)], v = [-Math.sin(a), Math.cos(a)];
  const c = (du, dv) => [cx + u[0] * du + v[0] * dv, cy + u[1] * du + v[1] * dv];
  return roundPoly([c(-h / 2, -w / 2), c(h / 2, -w / 2), c(h / 2, w / 2), c(-h / 2, w / 2)], 6);
};
// A bar through polyline points, w wide.
const bars = (pts, w) => pts.slice(1).map((p, i) => strut(pts[i], p, w)).concat(pts.slice(1, -1).map(([x, y]) => circle(w / 2, x, y)));

Object.assign(designs, {
  'hydros-drag': svg({
    under: HYDROS_FOOT,
    body: [
      ring(200, 104) + slots({ n: 14, rIn: 118, rOut: 178, bar: 17, corner: 9, off: -90 + 360 / 28 }),
      ...bars([[-36, -192], [-36, 192]], 16),
      ...bars([[36, -192], [36, 192]], 16),
      ...bars([[-88, -178], [-70, 0], [-88, 178]], 18),
      ...bars([[88, -178], [70, 0], [88, 178]], 18),
    ],
    details: dragKnob(64),
  }),
  'hydros-spool': svg({
    under: HYDROS_FOOT,
    body: [
      ring(200, 100) + slots({ n: 14, rIn: 116, rOut: 176, bar: 17, corner: 9, off: -90 + 360 / 28 }),
      ...[0, 1, 2, 3, 4].map((k) => spoke(-90 + k * 72, 30, 104, 16, 12, 25)),
      circle(38),
      pad(146, -38, 46, 64),
    ],
    details:
      `<path d="${pad(146, 142, 44, 54)}" fill="#a3a59f"/><path d="${pad(146, 142, 44, 54)}" fill="url(#sheen)"/>` +
      knob(...P(146, rad(-38)), 17) +
      screw(...P(16, rad(-50)), 4) +
      screw(...P(16, rad(130)), 4),
  }),
  'clearwater-drag': svg({
    body: [
      ring(200, 108) + slots({ n: 18, rIn: 120, rOut: 180, bar: 12, corner: 5, slant: 34 }),
      foot(124, -244, 14, 30),
      ...bars([[-72, -190], [-46, -20], [-46, 20], [-64, 192]], 30),
      ...bars([[72, -190], [46, -20], [46, 20], [64, 192]], 30),
    ],
    details: dragKnob(70),
  }),
  'clearwater-spool': svg({
    back: [foot(124, -244, 14, 30)],
    body: [
      ring(200, 110) + slots({ n: 14, rIn: 122, rOut: 178, bar: 15, corner: 6, slant: 30 }),
      ...[0, 1, 2].map((k) => spoke(-60 + k * 120, 34, 114, 22, 16, 35)),
      circle(44),
      pad(150, -62, 52, 62),
      pad(150, 146, 52, 62),
    ],
    details: knob(...P(150, rad(-62)), 17) + screw(...P(18, rad(-50)), 4) + screw(...P(18, rad(130)), 4),
  }),
});

// Behemoth drag dial: body-colored, knurled edge, radial ribs on the face.
const behemothDial = (() => {
  const ribs = Array.from({ length: 24 }, (_, i) => {
    const t = (i / 24) * 2 * Math.PI, [x0, y0] = P(16, t), [x1, y1] = P(46, t);
    return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`;
  }).join('');
  return `<path d="${knurl(56, 1.5, 60)}" fill="currentColor"/><path d="${knurl(56, 1.5, 60)}" fill="#000" fill-opacity=".3"/><circle r="50" fill="currentColor"/><circle r="50" fill="url(#sheen)"/>${ribs}<circle r="14" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`;
})();

Object.assign(designs, {
  'behemoth-drag': svg({
    // The upper half plate sits below the rims, shaded like a shallow dish.
    under: (() => {
      const plate = roundPoly([...arcPts(170, rad(4), rad(-184), 40)], 6);
      return (
        '<radialGradient id="dish" gradientUnits="userSpaceOnUse" r="170"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient>' +
        '<linearGradient id="plate-sheen" gradientUnits="userSpaceOnUse" x1="-215" y1="-250" x2="215" y2="220"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>' +
        `<path d="${plate}" fill="currentColor"/><path d="${plate}" fill="url(#plate-sheen)"/><path d="${plate}" fill="url(#dish)"/>`
      );
    })(),
    // Recessed band between the outer lip and the inner rim, all the way around.
    back: [ring(187, 175)],
    body: [
      ring(200, 186),
      ring(176, 166),
      foot(118, -244, 14, 30),
      // The lower half is open between eight spokes.
      circle(80),
      ...Array.from({ length: 8 }, (_, k) => spoke(14 + (k * 152) / 7, 70, 170, 14, 24)),
    ],
    // Soft shadows inside the lip and around the raised hub boss.
    details:
      `<path d="${ring(186, 176)}" fill="#000" fill-opacity=".14" fill-rule="evenodd"/>` +
      '<circle r="185" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="3"/>' +
      '<circle r="82" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="4"/>' +
      '<circle r="78" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>' +
      behemothDial,
  }),
  'behemoth-spool': svg({
    back: [foot(118, -244, 14, 30)],
    body: [ring(200, 184), ...Array.from({ length: 16 }, (_, k) => spoke(-90 + k * 22.5, 40, 190, 10, 22)), circle(46)],
    details:
      Array.from({ length: 16 }, (_, i) => {
        const t = rad(-90 + i * 22.5 + 11.25), [x0, y0] = P(24, t), [x1, y1] = P(43, t);
        return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`;
      }).join('') +
      `<circle cx="${f(P(150, rad(-67.5))[0])}" cy="${f(P(150, rad(-67.5))[1])}" r="22" fill="currentColor"/>` +
      knob(...P(150, rad(-67.5)), 16),
  }),
});

for (const [name, text] of Object.entries(designs)) writeFileSync(`${OUT}/${name}.svg`, text);
console.log(Object.keys(designs).join(' '));
