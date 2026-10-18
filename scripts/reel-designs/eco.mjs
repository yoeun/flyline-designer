// Maxcatch ECO.
// Drawn from Maxcatch's product photos: a three-quarter shot of each side of the black reel with orange parts, a
// near-frontal shot of the silver one and the finish lineup. It is the same die-cast frame and spool as Sunshine's
// SF-001 (sf-001.mjs, whose shapes it reuses). Drag side: the frame is a thin rim, the foot and three swept, drilled
// spokes round the drag knob; through it shows the spool's cage, which turns: its drilled back flange, with the
// spool face's ring of round holes. Spool side: the drilled spool flange over a recessed web. Here the reel foot,
// the drag knob and the spool's hub cap are the accent (orange on the black reel). The knob is scalloped like
// SF-001's but its face is printed with a 0–9 scale; the hub cap carries Maxcatch's M. The handle is black at 3
// o'clock and the counterweight silver at 9, as in the spool-side photo. The scale's ticks and the M are
// approximate.
import { ACCENT, P, f, knob, knurl, rad, screw, svg } from './lib.mjs';
import { CAGE, FOOT, FRAME, FRAME_DETAILS, SPOOL, SPOOL_BACK, SPOOL_DETAILS } from './sf-001.mjs';

// Same spool as the SF-001: the wound line starts just inside the flange's notched edge.
export const arbor = 128;

// The foot in the accent color, behind the frame.
const ACCENT_FOOT = `<path d="${FOOT}" ${ACCENT}/><path d="${FOOT}" fill="url(#sheen)"/>`;

// The drag knob's printed scale: a tick every 18°, with 0, 3, 6 and 9 in place of four of them, each reading
// outward from the center.
const LABELS = { 0: '3', 5: '6', 10: '9', 15: '0' };
const scale = Array.from({ length: 20 }, (_, k) => {
  const deg = -90 + k * 18;
  if (LABELS[k]) {
    const [x, y] = P(44, rad(deg));
    return `<text x="${f(x)}" y="${f(y)}" transform="rotate(${deg + 90} ${f(x)} ${f(y)})" text-anchor="middle" dominant-baseline="central" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#fff" fill-opacity=".85">${LABELS[k]}</text>`;
  }
  const [x0, y0] = P(40, rad(deg)), [x1, y1] = P(49, rad(deg));
  return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#fff" stroke-opacity=".8" stroke-width="2.4" stroke-linecap="round"/>`;
}).join('');

export const drag = svg({
  under: ACCENT_FOOT,
  cage: [CAGE],
  body: [FRAME],
  details:
    FRAME_DETAILS +
    // The accent knob with scalloped edge, its printed face and a silver screw.
    `<path d="${knurl(70, 4, 11)}" ${ACCENT}/><path d="${knurl(70, 4, 11)}" fill="#000" fill-opacity=".14"/><path d="${knurl(70, 4, 11)}" fill="url(#sheen)"/>` +
    `<circle r="56" ${ACCENT}/><circle r="56" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>` +
    scale +
    `<circle r="17" fill="#8d9092"/><circle r="14" fill="#d3d5d3"/><circle r="14" fill="url(#sheen)"/>` +
    `<path d="M-9 -3L9 3" stroke="#6d7174" stroke-width="2.4" stroke-linecap="round"/>`,
});

const handle = P(160, rad(0));
const weight = P(160, rad(180));

export const spool = svg({
  foot: ACCENT_FOOT + `<path d="${FOOT}" fill="#000" fill-opacity=".2"/>`,
  handles: [[...handle, 17]],
  back: SPOOL_BACK,
  body: [SPOOL],
  details:
    SPOOL_DETAILS +
    // The accent hub sleeve showing around the cap, then the cap with Maxcatch's M between two screws.
    `<circle r="50" ${ACCENT}/><circle r="50" fill="#000" fill-opacity=".3"/>` +
    `<circle r="44" fill="#000" fill-opacity=".25"/><circle r="42" ${ACCENT}/><circle r="42" fill="url(#sheen)"/>` +
    `<path d="M-13 9L-10 -9L0 3L10 -9L13 9M-4 9L0 3L4 9" fill="none" stroke="#e4e6e3" stroke-opacity=".85" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>` +
    screw(0, -28, 5) +
    screw(0, 28, 5) +
    // Silver counterweight and the black handle.
    `<circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="19" fill="#8d9092"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="15" fill="#d3d5d3"/><circle cx="${f(weight[0])}" cy="${f(weight[1])}" r="15" fill="url(#sheen)"/>` +
    knob(...handle, 17),
});
