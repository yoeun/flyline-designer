// Ventures Fly Co Ascent.
// Spool side drawn from Ventures' face-on photos of the 5/6 (the Toe Dipper and Fly Flinger combo listings), a
// 2026 shot at a slight angle and the user's photo: a light face cut by fourteen windows that run from near the rim
// in to the black "VFC" hub cap (lettering left out), between fourteen spokes that taper from the rim to the cap.
// Inside the arbor the face is sunk, so the spokes drop steeply where the backing begins. A polished ball
// counterweight sits up-left and the black handle with its silver end low-right; each fills a window's outer part,
// leaving a round hole in the hub. The foot is black.
// No drag-side photo exists (the maker's ReelBack and ReelDragKnob shots aren't archived): per the user, the drag
// side looks like the spool side, so it's the same face with all fourteen windows open and the black center cap as
// the drag knob. That whole face is drawn as the frame, with no spool cage behind it: nothing shows which of it is
// frame and which spool. Window and spoke sizes are read off small photos, so approximate.
import { P, circle, f, foot, pickPaths, rad, sunkFace, svg, taperedSlots } from './lib.mjs';

// The wound line starts at the foot of the drop: the windows show only line above it, and the background below.
export const arbor = 100;

// Fourteen spokes run from the rim to the cap, measured off the photo: about 22 wide at the rim, 15 where the face
// drops to the hub, 11 at the cap. Between them, fourteen windows run unbroken from 172 in to the cap's collar, one
// centered at 12 o'clock: the line shows in their outer part, and below the backing you see straight through.
// `skip` lists the window indices (clockwise from the top) filled in for the handle and counterweight; each of those
// spokes keeps a round hole in the hub instead.
const N = 14, STEP = 360 / N;
const HUB = 100;
const windows = (skip = []) =>
  pickPaths(taperedSlots({ n: N, rIn: 52, rOut: 172, barIn: 11, barOut: 22, corner: 6, off: -90 - STEP / 2 }), (k) => !skip.includes(k)) +
  skip.map((k) => circle(12, ...P(76, rad(-90 + STEP * k)))).join('');

const FOOT = foot(128, -244, 14, 32);
const BLACK_FOOT = `<path d="${FOOT}" fill="#1f2123"/><path d="${FOOT}" fill="url(#sheen)"/>`;

// Inside the arbor the face is sunk: the spokes drop steeply from 120 to the hub at 100.
const sink = (skip) => sunkFace({ id: 'ascent', wall: 120, floor: HUB, cut: windows(skip) });
// Black hub cap on the gunmetal collar.
const CAP =
  `<circle r="44" fill="#000" fill-opacity=".22"/><circle r="40" fill="#1c1d1f"/><circle r="40" fill="url(#sheen)"/>` +
  `<circle r="40" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>`;
// The groove just inside the face's outer edge.
const GROOVE = `<circle r="189" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/>`;

export const drag = svg({
  under: BLACK_FOOT,
  body: [circle(200) + windows()],
  details: GROOVE + sink() + CAP,
});

// Spool side: handle in the port at about 4 o'clock (index 6), counterweight in the one at about 11 (index 13).
const handle = P(156, rad(-90 + STEP * 6));
const weight = P(148, rad(-90 + STEP * 13));
const SKIP = [6, 13];
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
  body: [circle(200) + windows(SKIP)],
  details: GROOVE + sink(SKIP) + CAP + ball(weight) + grip(handle),
});
