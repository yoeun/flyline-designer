// Ventures Fly Co Ascent.
// Spool side drawn from Ventures' face-on photos of the 5/6 (the Toe Dipper and Fly Flinger combo listings) and a
// 2026 shot at a slight angle: a flat light face whose outer band is cut with fourteen rounded ports, flaring
// outward, around a darker gunmetal hub disc with sixteen radial slots, the black "VFC" hub cap (lettering left
// out), a polished ball counterweight up-left and the black handle with its silver end low-right. Counterweight
// and handle each take a port's place, so only twelve ports are open; two round holes in the hub's slot ring sit
// behind them. The foot is black.
// No drag-side photo exists (the maker's ReelBack and ReelDragKnob shots aren't archived): per the user, the drag
// side looks like the spool side, so it's the same face with all fourteen ports open, an unbroken ring of hub
// slots and the black center cap as the drag knob. That whole ported face is drawn as the frame, with no spool cage
// behind it: nothing shows which of it is frame and which spool, and it has no spokes to keep if the port ring were
// the spool. Port and slot sizes are read off small photos, so approximate.
import { P, circle, f, foot, rad, slots, svg } from './lib.mjs';

// The wound line starts at the inner edge of the ports, where the backing shows: about 0.53 of the rim.
export const arbor = 106;

// Ports: fourteen windows from 104 to 172 between straight bars, one centered at 12 o'clock. `skip` lists the
// window indices (clockwise from the top) filled in for the handle and counterweight.
const N = 14, STEP = 360 / N;
const pick = (d, keep) => (d.match(/M[^Z]*Z/g) ?? []).filter((_, k) => keep(k)).join('');
const ports = (skip = []) =>
  pick(slots({ n: N, rIn: 104, rOut: 172, bar: 21, corner: 9, off: -90 - STEP / 2 }), (k) => !skip.includes(k));

// Hub: sixteen radial slots from the cap's collar out to the disc's edge, bars at 12 and 6 o'clock. On the spool
// side the two nearest the handle and counterweight are round holes instead.
const HUB = 100;
const SLOT_STEP = 360 / 16;
const hubSlots = (skip = []) =>
  pick(slots({ n: 16, rIn: 54, rOut: 93, bar: 9, corner: 4, off: -90 }), (k) => !skip.includes(k));
const hub = (skip = []) =>
  circle(HUB) + hubSlots(skip) + skip.map((k) => circle(12, ...P(76, rad(-90 + SLOT_STEP * (k + 0.5))))).join('');

const FOOT = foot(128, -244, 14, 32);
const BLACK_FOOT = `<path d="${FOOT}" fill="#1f2123"/><path d="${FOOT}" fill="url(#sheen)"/>`;

// The hub disc is darker gunmetal than the face: recessed, plus a little more shade.
const hubShade = (d) =>
  `<path d="${d}" fill="#000" fill-opacity=".14" fill-rule="evenodd"/><circle r="${HUB}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;
// Black hub cap on the gunmetal collar.
const CAP =
  `<circle r="44" fill="#000" fill-opacity=".22"/><circle r="40" fill="#1c1d1f"/><circle r="40" fill="url(#sheen)"/>` +
  `<circle r="40" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>`;
// The groove just inside the face's outer edge.
const GROOVE = `<circle r="189" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>`;
// What shows through the hub slots: the dark frame behind.
const UNDER = `<circle r="${HUB}" fill="#161718"/>`;

export const drag = svg({
  under: UNDER + BLACK_FOOT,
  back: [hub()],
  body: [circle(200) + ports() + circle(HUB)],
  details: GROOVE + hubShade(hub()) + CAP,
});

// Spool side: handle in the port at about 4 o'clock (index 6), counterweight in the one at about 11 (index 13).
const handle = P(140, rad(-90 + STEP * 6));
const weight = P(148, rad(-90 + STEP * 13));
const HUB_SKIP = [6, 14];
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
  under: UNDER,
  back: [hub(HUB_SKIP)],
  body: [circle(200) + ports([6, 13]) + circle(HUB)],
  details: GROOVE + hubShade(hub(HUB_SKIP)) + CAP + ball(weight) + grip(handle),
});
