// Shared shapes for the reel frame designs in this folder (see gen-reel-frames.mjs).
// Coordinates match ReelPreview: centered, rim radius 200, y down.

export const f = (n) => +n.toFixed(1);
export const rad = (deg) => (deg * Math.PI) / 180;
export const P = (r, a) => [r * Math.cos(a), r * Math.sin(a)];

// Closed polygon with every corner rounded by up to `r`.
export function roundPoly(pts, r) {
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

export const circle = (r, cx = 0, cy = 0) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
export const ring = (outer, inner) => circle(outer) + circle(inner);

// Points along a line parallel to direction `a`, offset `d` sideways, where it meets radius r.
export const edge = (a, d, r) => {
  const t = Math.sqrt(r * r - d * d);
  return [t * Math.cos(a) - d * Math.sin(a), t * Math.sin(a) + d * Math.cos(a)];
};
export const arcPts = (r, a0, a1, steps = 10) => Array.from({ length: steps + 1 }, (_, i) => P(r, a0 + ((a1 - a0) * i) / steps));

// n windows between straight bars of width `bar`, from rIn to rOut, first bar at `off` degrees.
// `slant` shifts each bar sideways so it no longer points at the center.
export function slots({ n, rIn, rOut, bar, corner, off = -90, slant = 0 }) {
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

// n windows between spokes that taper toward the center: `barOut` wide at rOut, `barIn` at rIn, first spoke at `off`
// degrees. Most reels' spokes taper; measure the bar at a few radii before reaching for straight `slots`.
export function taperedSlots({ n, rIn, rOut, barIn, barOut, corner, off = -90 }) {
  const at = ([x, y]) => Math.atan2(y, x);
  const wrap = (from, to) => (to < from ? to + 2 * Math.PI : to);
  let d = '';
  for (let k = 0; k < n; k++) {
    const a0 = rad(off + (k * 360) / n), a1 = rad(off + ((k + 1) * 360) / n);
    const A2 = edge(a0, barOut / 2, rOut), B2 = edge(a1, -barOut / 2, rOut);
    const B1 = edge(a1, -barIn / 2, rIn), A1 = edge(a0, barIn / 2, rIn);
    const outer = arcPts(rOut, at(A2), wrap(at(A2), at(B2)));
    const inner = arcPts(rIn, wrap(at(A1), at(B1)), at(A1), 6);
    d += roundPoly([...outer, ...inner], corner);
  }
  return d;
}

// The subpaths of `d` whose index passes `keep`: e.g. drop the windows a handle or counterweight fills.
export const pickPaths = (d, keep) => (d.match(/M[^Z]*Z/g) ?? []).filter((_, k) => keep(k)).join('');

// A face sunk inside `wall` (rim = 200): the spokes drop steeply from `wall` to `floor`, darkest at the wall's foot,
// then run on a shade darker to the center, with a light lip at the wall's top. `cut` is every opening in the face
// (windows, holes): the shading covers metal only. Both gradients fade to nothing before their paths' edges, so
// the parts of `cut` that even-odd turns back on outside them stay clear. `id` must be unique to the design.
export function sunkFace({ id, wall, floor, cut }) {
  const at = (r, outer) => (r / outer).toFixed(3);
  const grad = (name, r, stops) =>
    `<radialGradient id="${id}-${name}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${r}">` +
    stops.map(([rr, color, op]) => `<stop offset="${at(rr, r)}" stop-color="${color}" stop-opacity="${op}"/>`).join('') +
    '</radialGradient>';
  return (
    grad('wall', wall, [[floor - 12, '#000', '.25'], [floor, '#000', '.7'], [floor + 1, '#000', '.6'], [wall, '#000', '0']]) +
    grad('lip', wall + 2, [[wall - 2, '#fff', '0'], [wall, '#fff', '.3'], [wall + 2, '#fff', '0']]) +
    `<path d="${circle(wall) + cut}" fill="url(#${id}-wall)" fill-rule="evenodd"/>` +
    `<path d="${circle(wall + 2) + circle(wall - 2) + cut}" fill="url(#${id}-lip)" fill-rule="evenodd"/>`
  );
}

// Where one side (1 = clockwise, -1 = counterclockwise) of a straight tapering spoke crosses radius r. The spoke
// runs along `a` degrees from r0 (w0 wide) to r1 (w1 wide), as `spoke` draws it.
function spokeSide({ a, r0, r1, w0, w1 }, side, r) {
  const t = rad(a), n = [-Math.sin(t), Math.cos(t)];
  const p0 = P(r0, t).map((v, i) => v + (side * n[i] * w0) / 2), p1 = P(r1, t).map((v, i) => v + (side * n[i] * w1) / 2);
  const d = [p1[0] - p0[0], p1[1] - p0[1]];
  const A = d[0] ** 2 + d[1] ** 2, B = 2 * (p0[0] * d[0] + p0[1] * d[1]), C = p0[0] ** 2 + p0[1] ** 2 - r * r;
  const u = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
  return [p0[0] + u * d[0], p0[1] + u * d[1]];
}

// The windows between spokes, an outer ring's inner edge (rOut) and a hub or inner ring (rIn), with every corner
// rounded by `fillet` where a spoke meets a ring. Cut them out of one solid disc (`circle(rim) + spokeWindows(…)`)
// instead of overlapping rings and `spoke`s, which leaves sharp inside corners. `spokes` are { a, r0, r1, w0, w1 },
// in clockwise order; a window runs clockwise from each spoke to the next. Each window must span under 180°.
export function spokeWindows({ spokes, rIn, rOut, fillet }) {
  const pt = ([x, y]) => `${f(x)} ${f(y)}`;
  const toward = (p, q) => {
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return [p[0] + ((q[0] - p[0]) * fillet) / l, p[1] + ((q[1] - p[1]) * fillet) / l];
  };
  const along = (p, r, dir) => P(r, Math.atan2(p[1], p[0]) + (dir * fillet) / r);
  return spokes
    .map((from, i) => {
      const to = spokes[(i + 1) % spokes.length];
      const c1 = spokeSide(from, 1, rIn), c2 = spokeSide(from, 1, rOut), c3 = spokeSide(to, -1, rOut), c4 = spokeSide(to, -1, rIn);
      return (
        `M${pt(toward(c1, c2))}L${pt(toward(c2, c1))}Q${pt(c2)} ${pt(along(c2, rOut, 1))}` +
        `A${rOut} ${rOut} 0 0 1 ${pt(along(c3, rOut, -1))}Q${pt(c3)} ${pt(toward(c3, c4))}L${pt(toward(c4, c3))}` +
        `Q${pt(c4)} ${pt(along(c4, rIn, -1))}A${rIn} ${rIn} 0 0 0 ${pt(along(c1, rIn, 1))}Q${pt(c1)} ${pt(toward(c1, c2))}Z`
      );
    })
    .join('');
}

// Chamfers round a frame's openings, for svg's details: a flat, angled facet of even width along each window's edge,
// with crisp edges. Facets facing the top left are lit, those facing the bottom right shaded, each in one even shade
// (a chamfer is a flat cut, not a rounded edge). `windows` are the openings to chamfer, as cut from the frame. Only
// their edges get it: the shape shaded is a disc bigger than the reel minus `windows`, clipped to `clip` (the
// frame's outer radius), so the outer rim and anything else, like a foot, stay flat. `width` is the facet's width;
// `light` and `shade` its opacities. `id` must be unique to the design.
export function bevel(id, { windows, clip = 200, width = 3.5, light = 0.45, shade = 0.4 }) {
  const facing = (d, result) =>
    `<feOffset in="SourceAlpha" dx="${d}" dy="${d}" result="${result}-off"/>` +
    `<feComposite in="band" in2="${result}-off" operator="out" result="${result}"/>`;
  return (
    `<filter id="${id}-bevel" x="-10%" y="-10%" width="120%" height="120%">` +
    `<feMorphology in="SourceAlpha" operator="erode" radius="${width}" result="core"/>` +
    '<feComposite in="SourceAlpha" in2="core" operator="out" result="band"/>' +
    facing(2 * width, 'lit-a') + facing(-2 * width, 'shade-a') +
    `<feFlood flood-color="#fff" flood-opacity="${light}"/><feComposite in2="lit-a" operator="in" result="lit"/>` +
    `<feFlood flood-color="#000" flood-opacity="${shade}"/><feComposite in2="shade-a" operator="in" result="shade"/>` +
    '<feMerge><feMergeNode in="shade"/><feMergeNode in="lit"/></feMerge></filter>' +
    `<clipPath id="${id}-bevel-clip"><circle r="${clip}"/></clipPath>` +
    `<g clip-path="url(#${id}-bevel-clip)"><path d="${circle(clip + 20) + windows}" fill-rule="evenodd" filter="url(#${id}-bevel)"/></g>`
  );
}

// A straight spoke from r0 to r1 along `deg`, w0 wide at r0 and w1 wide at r1.
export function spoke(deg, r0, r1, w0, w1 = w0, sweep = 0) {
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
export function strut(p0, p1, w0, w1 = w0) {
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

export const rect = (x, y, w, h, r = 4) => roundPoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], r);

// Foot plate on a post, top edge at y.
export const foot = (half, y = -246, h = 16, postHalf = 26) =>
  roundPoly([[-half, y], [half, y], [half - 8, y + h], [postHalf, y + h], [postHalf, -186], [-postHalf, -186], [-postHalf, y + h], [-half + 8, y + h]], 5);

// Wavy-edged knob, r ± amp with `teeth` bumps.
export function knurl(r, amp, teeth) {
  const pts = Array.from({ length: teeth * 8 }, (_, i) => {
    const a = (i / (teeth * 8)) * 2 * Math.PI;
    return P(r + amp * Math.cos(teeth * a), a);
  });
  return 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z';
}

// Fill for a part in the finish's accent color, where the finish has one (e.g. Lamson Ember's orange); otherwise the
// reel color. ReelPreview sets --reel-accent on every reel (not --accent: the page theme has one of its own).
export const ACCENT = 'style="fill:var(--reel-accent, currentColor)"';
// A second part color, e.g. a foot that differs from both frame and accent; set by --reel-trim, else the reel color.
export const TRIM = 'style="fill:var(--reel-trim, currentColor)"';
// Ink for markings printed on the accent, like a dial's numbers: set by --reel-ink to contrast with it, else dark.
export const INK = 'style="fill:var(--reel-ink, #1b1d1f)"';

export const SHEEN = `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>`;
export const SHEEN_RECT = `<rect x="-215" y="-250" width="430" height="470" fill="url(#sheen)" mask="url(#body-mask)"/>`;

// under: fixed-color markup behind everything; back: recessed metal (darkened); body: front metal in reel color;
// details: fixed colors on top. On the spool side the spool turns: foot is markup that stays put behind it, and
// handles lists the [cx, cy, r] circles a click on the handle can land in. Everything else is in [data-cage]
// pieces that turn together, while the shadow's offset and the sheen's light stay put. On the drag side, cage is
// the spool seen through the frame, in recessed metal: a [data-cage="cw"] piece that turns the other way, shaded as
// one layer by --reel-cage at --reel-cage-opacity (25% black by default; ReelPreview lightens it instead on a dark
// finish, where darker wouldn't show). cageFill paints it, e.g. TRIM for a spool in the trim color.
export function svg({ foot = '', under = '', cage = [], cageFill = 'fill="currentColor"', back = [], body, details = '', handles = [] }) {
  const backPaths = back.map((d) => `<path d="${d}"/>`).join('');
  const bodyPaths = body.map((d) => `<path d="${d}"/>`).join('');
  const handleAttr = handles.length ? ` data-handles="${handles.map((h) => h.map(f).join(' ')).join(',')}"` : '';
  const cageAttr = foot ? ' data-cage=""' : '';
  const turn = (markup) => (foot ? `<g data-cage="">${markup}</g>` : markup);
  const cagePaths = cage.map((d) => `<path d="${d}"/>`).join('');
  const spoolCage = cage.length
    ? `<g data-cage="cw" fill-rule="evenodd"><g ${cageFill}>${cagePaths}</g><g style="fill:var(--reel-cage, #000);opacity:var(--reel-cage-opacity, .25)">${cagePaths}</g></g>\n`
    : '';
  const behind = `${under ? under + '\n' : ''}${spoolCage}${back.length ? '<use href="#back" fill="currentColor"/><use href="#back" fill="#000" opacity=".2"/>' : ''}`;
  const shadow = foot
    ? '<g transform="translate(2 4)"><use href="#body" data-cage="" fill="#000" opacity=".28"/></g>'
    : '<use href="#body" fill="#000" opacity=".28" transform="translate(2 4)"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-215 -250 430 470" color="#b8bdc2"${handleAttr}>
<defs>${SHEEN}<g id="back" fill-rule="evenodd">${backPaths}</g><g id="body" fill-rule="evenodd">${bodyPaths}</g><mask id="body-mask"><use href="#body"${cageAttr} fill="#fff"/></mask></defs>
${foot ? foot + '\n' : ''}${behind && turn(behind)}
${shadow}
${turn(`<use href="#body" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2"/>
<use href="#body" fill="currentColor"/>`)}
${SHEEN_RECT}
${turn(details)}
</svg>
`;
}

// The frame's rim seen from the spool side: a ring outside the spool that stays still while it turns, a shade
// lighter than the spool's face, with a dark groove between rim and spool. Markup for svg's foot; the spool's own
// rim then stops at `gap`.
export const frameRim = (inner = 189, gap = 185) =>
  `<path d="${ring(200, inner)}" fill="currentColor" fill-rule="evenodd"/><path d="${ring(200, inner)}" fill="#fff" fill-opacity=".12" fill-rule="evenodd"/><path d="${ring(200, inner)}" fill="url(#sheen)" fill-rule="evenodd"/>` +
  `<path d="${ring(inner, gap)}" fill="#1b1d1f" fill-opacity=".7" fill-rule="evenodd"/>`;

// Paths in recessed metal, as `back` draws them, e.g. for svg's foot.
export const recessed = (...ds) => {
  const paths = ds.map((d) => `<path d="${d}"/>`).join('');
  return `<g fill-rule="evenodd" fill="currentColor">${paths}</g><g fill-rule="evenodd" fill="#000" opacity=".2">${paths}</g>`;
};

// Dark knob with a screw slot, e.g. a handle seen end-on.
export const knob = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#2b2e31"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.72}" fill="#3a3e42"/><path d="M${f(cx - r * 0.5)} ${f(cy + r * 0.2)}L${f(cx + r * 0.5)} ${f(cy - r * 0.2)}" stroke="#1b1d1f" stroke-width="2.5" stroke-linecap="round"/>`;

export const screw = (cx, cy, r) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#c9ccc8"/><path d="M${f(cx - r * 0.7)} ${f(cy)}L${f(cx + r * 0.7)} ${f(cy)}" stroke="#55595c" stroke-width="1.6"/>`;
// A dark drag knob with a knurled rim and a silver center screw.
export const dragKnob = (r) =>
  `<path d="${knurl(r, 2, 36)}" fill="#26282b"/><path d="${knurl(r, 2, 36)}" fill="url(#sheen)"/><circle r="${r - 9}" fill="#303336"/><circle r="${r - 9}" fill="url(#sheen)"/>${screw(0, 0, 10)}`;
// A filled pad across a window, e.g. a counterweight, centered at radius r and angle deg.
export const pad = (r, deg, w, h) => {
  const a = rad(deg), [cx, cy] = P(r, a);
  const u = [Math.cos(a), Math.sin(a)], v = [-Math.sin(a), Math.cos(a)];
  const c = (du, dv) => [cx + u[0] * du + v[0] * dv, cy + u[1] * du + v[1] * dv];
  return roundPoly([c(-h / 2, -w / 2), c(h / 2, -w / 2), c(h / 2, w / 2), c(-h / 2, w / 2)], 6);
};
// A bar through polyline points, w wide.
export const bars = (pts, w) => pts.slice(1).map((p, i) => strut(pts[i], p, w)).concat(pts.slice(1, -1).map(([x, y]) => circle(w / 2, x, y)));


// Spokes each tangent to a hexagon at the hub, like Lamson's Liquid S spool: { corner, end } per spoke, from its
// hexagon corner out to radius `reach`, where it ends at `ends` degrees. They sweep clockwise outward, or
// counter-clockwise with ccw. `hex` is the hexagon's inner radius; `overshoot` runs each spoke a little past `reach`.
export function hexSpokes({ hex, reach, ends, ccw = false, overshoot = 0 }) {
  const along = Math.sqrt(reach * reach - hex * hex);
  const sweep = (Math.atan2(along, hex) * 180) / Math.PI;
  return ends.map((end) => {
    const t = rad(ccw ? end + sweep : end - sweep);
    const [tx, ty] = P(hex, t), d = ccw ? [Math.sin(t), -Math.cos(t)] : [-Math.sin(t), Math.cos(t)];
    const at = (u) => [tx + d[0] * u, ty + d[1] * u];
    return { corner: at(-hex * Math.tan(rad(30))), end: at(along + overshoot) };
  });
}
