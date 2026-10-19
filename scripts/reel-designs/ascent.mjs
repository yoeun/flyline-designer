// Ventures Fly Co Ascent.
// Spool side drawn from Ventures' face-on photos of the 5/6 (the Toe Dipper and Fly Flinger combo listings) and a
// 2026 shot at a slight angle: a flat light face whose outer band is cut with fourteen rounded ports, flaring
// outward, around a darker gunmetal hub disc, sunk at the arbor's diameter, with fourteen radial slots lined up
// with the ports, so the fourteen spokes run unbroken from the rim to the cap, the black "VFC" hub cap (lettering left
// out), a polished ball counterweight up-left and the black handle with its silver end low-right. Counterweight
// and handle each take a port's place, so only twelve ports are open; two round holes in the hub's slot ring sit
// behind them. The foot is black.
// No drag-side photo exists (the maker's ReelBack and ReelDragKnob shots aren't archived): per the user, the drag
// side looks like the spool side, so it's the same face with all fourteen ports open, an unbroken ring of hub
// slots and the black center cap as the drag knob. That whole ported face is drawn as the frame, with no spool cage
// behind it: nothing shows which of it is frame and which spool, and it has no spokes to keep if the port ring were
// the spool. Port and slot sizes are read off small photos, so approximate.
import { P, arcPts, circle, edge, f, foot, rad, roundPoly, svg } from './lib.mjs';

// The wound line starts at the inner edge of the ports, where the backing shows: about 0.53 of the rim.
export const arbor = 106;

// Spokes taper toward the center, so each window sits between bars `barOut` wide at rOut and `barIn` at rIn.
const tapered = ({ n, rIn, rOut, barIn, barOut, corner, off }) =>
  Array.from({ length: n }, (_, k) => {
    const a0 = rad(off + (k * 360) / n), a1 = rad(off + ((k + 1) * 360) / n);
    const A2 = edge(a0, barOut / 2, rOut), B2 = edge(a1, -barOut / 2, rOut);
    const B1 = edge(a1, -barIn / 2, rIn), A1 = edge(a0, barIn / 2, rIn);
    const at = ([x, y]) => Math.atan2(y, x);
    const wrap = (from, to) => (to < from ? to + 2 * Math.PI : to);
    const outer = arcPts(rOut, at(A2), wrap(at(A2), at(B2)));
    const inner = arcPts(rIn, wrap(at(A1), at(B1)), at(A1), 6);
    return roundPoly([...outer, ...inner], corner);
  }).join('');
const pick = (d, keep) => (d.match(/M[^Z]*Z/g) ?? []).filter((_, k) => keep(k)).join('');

// Fourteen spokes, measured off the photo: about 22 wide at the rim, narrowing to 15 at the ports' inner edge and
// holding about that across the hub to the cap.
// Ports: fourteen windows from 104 to 172, one centered at 12 o'clock. `skip` lists the window indices (clockwise
// from the top) filled in for the handle and counterweight.
const N = 14, STEP = 360 / N;
const ports = (skip = []) =>
  pick(tapered({ n: N, rIn: 104, rOut: 172, barIn: 15, barOut: 22, corner: 9, off: -90 - STEP / 2 }), (k) => !skip.includes(k));

// Hub: fourteen radial slots from the cap's collar out to the disc's edge, one under each port, so the bars carry
// the port ring's spokes on to the cap. On the spool side the two under the handle and counterweight are round
// holes in wider spokes instead.
const HUB = 100;
const hubSlots = (skip = []) =>
  pick(tapered({ n: N, rIn: 52, rOut: 93, barIn: 12, barOut: 15, corner: 4, off: -90 - STEP / 2 }), (k) => !skip.includes(k));
// The hub's openings: its slots, plus the round holes in the wider spokes.
const openings = (skip = []) => hubSlots(skip) + skip.map((k) => circle(12, ...P(76, rad(-90 + STEP * k)))).join('');
const hub = (skip = []) => circle(HUB) + openings(skip);

const FOOT = foot(128, -244, 14, 32);
const BLACK_FOOT = `<path d="${FOOT}" fill="#1f2123"/><path d="${FOOT}" fill="url(#sheen)"/>`;

// The hub disc is darker gunmetal than the face: recessed, plus a little more shade.
const hubShade = (d) =>
  `<path d="${d}" fill="#000" fill-opacity=".22" fill-rule="evenodd"/><circle r="${HUB}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;
// The face drops steeply to the hub at the arbor: a wall from 120 down to the hub's edge at 100, darkest at its
// foot, with its shadow pooling on the hub floor just inside and a light lip at its top. Shaded on the metal only:
// the ports and the hub's openings cut out of the band, and both gradients fade out before the band's edges so the cut-outs stay clear.
const WALL = 120;
const at = (r, outer) => (r / outer).toFixed(3);
const BEVEL_GRADIENT =
  `<radialGradient id="ascent-wall" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${WALL}">` +
  `<stop offset="${at(86, WALL)}" stop-color="#000" stop-opacity="0"/><stop offset="${at(HUB, WALL)}" stop-color="#000" stop-opacity=".85"/>` +
  `<stop offset="${at(HUB + 1, WALL)}" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="ascent-lip" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${WALL + 2}">` +
  `<stop offset="${at(WALL - 2, WALL + 2)}" stop-color="#fff" stop-opacity="0"/><stop offset="${at(WALL, WALL + 2)}" stop-color="#fff" stop-opacity=".3"/>` +
  `<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
const bevel = (skip) =>
  BEVEL_GRADIENT +
  `<path d="${circle(WALL) + circle(86) + ports(skip) + openings(skip)}" fill="url(#ascent-wall)" fill-rule="evenodd"/>` +
  `<path d="${circle(WALL + 2) + circle(WALL - 2) + ports(skip)}" fill="url(#ascent-lip)" fill-rule="evenodd"/>`;
// Black hub cap on the gunmetal collar.
const CAP =
  `<circle r="44" fill="#000" fill-opacity=".22"/><circle r="40" fill="#1c1d1f"/><circle r="40" fill="url(#sheen)"/>` +
  `<circle r="40" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>`;
// The groove just inside the face's outer edge.
const GROOVE = `<circle r="189" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>`;

export const drag = svg({
  under: BLACK_FOOT,
  back: [hub()],
  body: [circle(200) + ports() + circle(HUB)],
  details: GROOVE + hubShade(hub()) + bevel() + CAP,
});

// Spool side: handle in the port at about 4 o'clock (index 6), counterweight in the one at about 11 (index 13).
const handle = P(156, rad(-90 + STEP * 6));
const weight = P(148, rad(-90 + STEP * 13));
const HUB_SKIP = [6, 13];
const ball = ([x, y]) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="19" fill="#7e8285"/><circle cx="${f(x)}" cy="${f(y)}" r="17" fill="#d6d8d7"/>` +
  `<circle cx="${f(x - 5)}" cy="${f(y - 6)}" r="6" fill="#fff" fill-opacity=".7"/><circle cx="${f(x)}" cy="${f(y)}" r="17" fill="url(#sheen)"/>`;
// Black handle with a silver end cap and its screw slot.
const grip = ([x, y]) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="20" fill="#1c1d1f"/><circle cx="${f(x)}" cy="${f(y)}" r="12" fill="#9a9ea0"/>` +
  `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="url(#sheen)"/>` +
  `<path d="M${f(x - 4)} ${f(y - 8)}L${f(x + 4)} ${f(y + 8)}" stroke="#3a3d40" stroke-width="2.4" stroke-linecap="round"/>`;

export const spool = svg({
  foot: BLACK_FOOT,
  handles: [[...handle, 20]],
  back: [hub(HUB_SKIP)],
  body: [circle(200) + ports([6, 13]) + circle(HUB)],
  details: GROOVE + hubShade(hub(HUB_SKIP)) + bevel([6, 13]) + CAP + ball(weight) + grip(handle),
});
