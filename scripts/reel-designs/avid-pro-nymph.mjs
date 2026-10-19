// Maxcatch Avid Pro Nymph.
// Drag side drawn from Maxcatch's three-quarter shot of the 3Five (and the left reel of their spec sheet). The frame
// is a full cage: its thin outer rim wraps round the spool, with the foot and three broad spokes from a boss under
// the big black drag knob (knurled skirt, flat logo face), each forking near the rim into two legs, one up to the
// foot, one to about 4 o'clock and one to about 8. Through it shows the spool's cage, which turns: the spool side's
// flange with its ring of about twenty rectangular windows between radial bars, and its three slim spokes (seen
// from behind). The handle would show through too, but the wound line hides it. Spool side drawn from the right
// reel of the spec sheet (also at three-quarters) and the exploded shot: inside the cage's rim, the same window
// ring around a big open center crossed by three slim spokes from the knurled black spool cap, a black
// counterweight up-right and the black handle with its silver end cap low-left; the frame's spokes show through the
// open center. Spoke angles, the forks, window count and the handle and counterweight radii are read off angled
// shots, so approximate.
import { P, circle, f, foot, knurl, rad, recessed, ring, slots, strut, svg } from './lib.mjs';

// The wound line starts on the drum, at the inside diameter Maxcatch gives for the 3Five: 60 mm inside a 95 mm
// rim (200 × 60 / 95 ≈ 126).
export const arbor = 126;

const CAGE = 186; // inner edge of the cage's rim; the spool's flange fits just inside it
const LIP = arbor + 10; // inner edge of the flange, round the open center

// The spool's flange: windows between radial bars from 146 to 178, inside an unbroken lip, `skip` lists window
// indices (clockwise from 12 o'clock) left solid.
const N = 20, STEP = 360 / N;
const pick = (d, keep) => (d.match(/M[^Z]*Z/g) ?? []).filter((_, k) => keep(k)).join('');
const windows = (skip = []) =>
  pick(slots({ n: N, rIn: 146, rOut: 177, bar: 12, corner: 5, off: -90 - STEP / 2 }), (k) => !skip.includes(k));

// Frame spokes: a stem from the boss to a fork at FORK, then two legs out to the cage's rim, SPREAD degrees either
// side of the stem. By the stem's direction (degrees, y down); `mirror` flips them as seen from the spool side, where
// they only show as far as `reach`.
const SPOKES = [-92, 22, 150];
const FORK = 118, SPREAD = 11;
const frameSpokes = (mirror = false, reach = CAGE + 6) =>
  SPOKES.map((a) => (mirror ? 180 - a : a)).flatMap((a) => {
    const fork = P(FORK, rad(a));
    return [
      strut([0, 0], fork, 66, 46),
      circle(23, ...fork),
      ...[-1, 1].map((s) => strut(fork, P(reach, rad(a + s * SPREAD)), 28, 24)),
    ];
  });

// The spool's three slim spokes from the hub out to the drum.
const SPOOL_SPOKES = [-58, 52, 148];
const spoolSpokes = (mirror = false) =>
  SPOOL_SPOKES.map((a) => (mirror ? 180 - a : a)).map((a) => strut([0, 0], P(arbor + 14, rad(a)), 30, 22));

const FOOT = foot(132, -244, 14, 30);

// The big black drag knob: knurled skirt, flat face.
const DRAG_KNOB =
  `<circle r="78" fill="#000" fill-opacity=".22"/>` +
  `<path d="${knurl(66, 1.6, 48)}" fill="#1f2123"/><path d="${knurl(66, 1.6, 48)}" fill="url(#sheen)"/>` +
  `<circle r="56" fill="#26282b"/><circle r="56" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>` +
  `<circle r="56" fill="url(#sheen)"/>`;

export const drag = svg({
  // The spool's flange behind the spokes, and its slim spokes inside the drum (mirrored, seen from behind).
  cage: [ring(CAGE + 4, LIP) + windows(), ...spoolSpokes(true)],
  body: [ring(200, CAGE), FOOT, circle(74), ...frameSpokes()],
  details:
    `<circle r="${CAGE}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` +
    DRAG_KNOB,
});

// Spool side. The handle sits on the window ring at about 8 o'clock (window 13 left solid), the counterweight on the
// upper-right spoke inside the lip.

const HANDLE_AT = -90 + STEP * 12.5; // ≈ 153°
const handle = P(160, rad(HANDLE_AT));
const weight = P(112, rad(-58));

// The cage's rim, which stays put round the turning spool.
const CAGE_RIM = `<path d="${ring(200, CAGE)}" fill="currentColor" fill-rule="evenodd"/><path d="${ring(200, CAGE)}" fill="url(#sheen)" fill-rule="evenodd"/>` +
  `<circle r="${CAGE + 1}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`;

// Knurled black spool cap with a flat face.
const CAP =
  `<circle r="46" fill="#000" fill-opacity=".25"/>` +
  `<path d="${knurl(40, 1.5, 36)}" fill="#1c1d1f"/><path d="${knurl(40, 1.5, 36)}" fill="url(#sheen)"/>` +
  `<circle r="31" fill="#26282b"/><circle r="31" fill="url(#sheen)"/>`;
// Black domed counterweight.
const ball = ([x, y]) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="18" fill="#141516"/><circle cx="${f(x)}" cy="${f(y)}" r="15" fill="#2a2d30"/>` +
  `<circle cx="${f(x - 4)}" cy="${f(y - 5)}" r="5" fill="#fff" fill-opacity=".25"/><circle cx="${f(x)}" cy="${f(y)}" r="15" fill="url(#sheen)"/>`;
// Black handle with its silver end cap.
const grip = ([x, y]) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="19" fill="#1c1d1f"/><circle cx="${f(x)}" cy="${f(y)}" r="13" fill="#b4b8ba"/>` +
  `<circle cx="${f(x)}" cy="${f(y)}" r="13" fill="url(#sheen)"/>`;

export const spool = svg({
  foot: recessed(FOOT) + CAGE_RIM,
  handles: [[...handle, 19]],
  // Through the open center: the drum's lip and the frame's spokes (mirrored, seen from behind) and boss.
  back: [ring(arbor + 6, arbor - 6), circle(74), ...frameSpokes(true, arbor)],
  body: [
    circle(CAGE - 2) + windows([12]) + circle(LIP),
    ...spoolSpokes(),
    circle(44),
  ],
  details:
    `<circle r="${LIP}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
    `<circle r="140" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/>` +
    CAP +
    ball(weight) +
    grip(handle),
});
