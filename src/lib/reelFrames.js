// Frame drawings per reel design and side. Each SVG uses the preview's coordinates
// (centered, rim radius 200) and paints its metal in currentColor.
// Every <design>-<side>.svg in src/assets/reels (drawn by scripts/gen-reel-frames.mjs), as { design: { drag, spool } }.
const FILES = import.meta.glob('../assets/reels/*.svg', { query: '?raw', import: 'default', eager: true });
export const FRAMES = {};
for (const [path, svg] of Object.entries(FILES)) {
  const [, design, side] = path.match(/([\w-]+)-(drag|spool)\.svg$/);
  (FRAMES[design] ??= {})[side] = svg;
}

// The radius (rim = 200) a design draws its spool's arbor at, or undefined if it doesn't say.
export function frameArbor(design) {
  const arbor = FRAMES[design]?.drag?.match(/<svg[^>]*\sdata-arbor="([\d.]+)"/)?.[1];
  return arbor ? Number(arbor) : undefined;
}

export const SIDES = [
  ['drag', 'Drag'],
  ['spool', 'Spool'],
];

// Handles smaller than this (rim = 200) get a bigger circle to click.
const HANDLE_HIT = 26;

// The SVG's contents without the outer <svg>, ids suffixed so several previews can share a page. With handles,
// a drawing whose spool turns (a [data-cage] group) gets a clear [data-handle] circle over each handle, inside
// the cage so it turns with it, to grab and turn the spool by (see grabCage).
export function frameMarkup(design, side, suffix, { handles = false } = {}) {
  const svg = (FRAMES[design] ?? FRAMES.generic)[side] ?? FRAMES.generic.drag;
  const hits = handles
    ? (svg.match(/<svg[^>]*\sdata-handles="([^"]+)"/)?.[1] ?? '')
        .split(',')
        .filter(Boolean)
        .map((h) => {
          const [cx, cy, r] = h.split(' ').map(Number);
          return `<circle data-handle="" cx="${cx}" cy="${cy}" r="${Math.max(r, HANDLE_HIT)}" fill="transparent" style="cursor:grab;touch-action:none"/>`;
        })
        .join('')
    : '';
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/(<g data-cage="">[\s\S]*)<\/g>\s*$/, `$1${hits}</g>`)
    .replace(/(id="|url\(#|href="#)([\w-]+)/g, `$1$2-${suffix}`);
}

const cagePieces = (frame) => [...frame.querySelectorAll('[data-cage]')];
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
// Wraps degrees into [0, 360).
const wrap = (deg) => ((deg % 360) + 360) % 360;

// Cage angles are the spool's, in degrees clockwise as seen from the spool side. A [data-cage="cw"] piece is the
// spool seen from the drag side, so it turns the other way on screen.
const sense = (piece) => (piece.dataset.cage === 'cw' ? -1 : 1);
const rotate = (piece, deg) => `rotate(${sense(piece) * deg}deg)`;
// Where the cage rests when nothing animates it: 0 as drawn, or wherever a drag left it.
const restAngle = (piece) => sense(piece) * Number(piece.style.transform.match(/rotate\((-?[\d.e-]+)deg\)/)?.[1] ?? 0);
// Where the cage is drawn right now, mid-spin or not.
function shownAngle(piece) {
  const [a, b] = getComputedStyle(piece).transform.match(/matrix\(([^,]+),([^,]+)/)?.slice(1).map(Number) ?? [1, 0];
  return (sense(piece) * Math.atan2(b, a) * 180) / Math.PI;
}
function setRest(pieces, deg) {
  for (const piece of pieces) {
    Object.assign(piece.style, { transformBox: 'view-box', transformOrigin: '0 0', transform: rotate(piece, wrap(deg)) });
  }
}

// Where the spool in `frame` rests, and setting it, e.g. to carry it over to a drawing of the other side.
export const cageRest = (frame) => {
  const piece = frame.querySelector('[data-cage]');
  return piece ? restAngle(piece) : 0;
};
export const setCageRest = (frame, deg) => setRest(cagePieces(frame), deg);

// The animation frame of a cage coasting after a drag, by its first piece.
const coasting = new WeakMap();
function stopCoasting(pieces) {
  cancelAnimationFrame(coasting.get(pieces[0]));
  coasting.delete(pieces[0]);
}

// Turns a spool's cage, every [data-cage] piece in `frame`, one more full turn counter-clockwise (clockwise for a
// [data-cage="cw"] cage: the spool seen from the drag side), easing out to a stop where it started, so the drawing
// at rest never changes. A click mid-spin carries on from wherever it is.
export function spinCage(frame) {
  const pieces = cagePieces(frame);
  if (!pieces.length || reducedMotion()) return;
  stopCoasting(pieces);
  const rest = restAngle(pieces[0]);
  // How far round the cage has gone from rest, from 0 to 360 counter-clockwise.
  const gone = wrap(rest - shownAngle(pieces[0]));
  const from = gone < 0.5 || gone > 359.5 ? 0 : -gone;
  // At least a full turn: from partway round, on through the next 360.
  const to = from ? -720 : -360;
  setRest(pieces, rest);
  for (const piece of pieces) {
    for (const anim of piece.getAnimations()) anim.cancel();
    piece.animate([{ transform: rotate(piece, rest + from) }, { transform: rotate(piece, rest + to) }], {
      // A gentle ease-out: a sharper one starts so fast that the windows strobe and the spool seems to turn back.
      duration: 1000,
      easing: 'ease-out',
    });
  }
}

// A drag that moves less than this (px) is a click, and spins the cage a turn.
const TAP_SLOP = 5;
// How far back (ms) the pointer's last moves count toward the speed it lets go at; held still longer than this
// before letting go, it doesn't flick.
const FLICK_WINDOW = 100;
// Fastest the spool coasts (degrees/ms, about 3 turns a second): faster, and the windows strobe.
const MAX_SPEED = 1.2;
// Coasting slows by drag on the spool, proportional to speed (time constant, ms), and by a little steady friction
// (degrees/ms²) that brings it to a stop rather than creeping forever. A hard flick coasts about two turns.
const SPIN_DOWN = 900;
const FRICTION = 0.00015;
// Slower than this (degrees/ms), the spool has stopped.
const STOPPED = 0.01;

// Lets the pointer that went down on a spool's handle, inside `frame` (which holds the pointer while it drags),
// turn the spool: every [data-cage] piece in frame's <svg>, whose origin is the spool's center. The cage follows
// the pointer round, and on letting go carries on at the speed it was flicked, slowing to a stop wherever friction
// leaves it. A click without a drag spins it a turn, as spinCage does.
export function grabCage(frame, down) {
  const svg = frame.ownerSVGElement ?? frame.closest('svg');
  const pieces = svg ? cagePieces(svg) : [];
  if (!pieces.length) return;
  down.preventDefault();
  stopCoasting(pieces);
  // Catch the cage where it is, mid-spin or coasting.
  let angle = shownAngle(pieces[0]);
  for (const piece of pieces) for (const anim of piece.getAnimations()) anim.cancel();
  setRest(pieces, angle);

  const pointerAngle = (e) => {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    return (Math.atan2(p.y, p.x) * 180) / Math.PI;
  };
  let last = pointerAngle(down);
  let dragged = false;
  // Recent [time, angle] pairs, for the speed on letting go. The angle isn't wrapped, so a turn adds up.
  const moves = [[down.timeStamp, angle]];
  frame.setPointerCapture(down.pointerId);

  const move = (e) => {
    if (e.pointerId !== down.pointerId) return;
    dragged ||= Math.hypot(e.clientX - down.clientX, e.clientY - down.clientY) > TAP_SLOP;
    const now = pointerAngle(e);
    // The shorter way round from the last move, so crossing ±180° doesn't jump.
    angle += wrap(now - last + 180) - 180;
    last = now;
    setRest(pieces, angle);
    moves.push([e.timeStamp, angle]);
    while (moves.length > 2 && e.timeStamp - moves[0][0] > FLICK_WINDOW) moves.shift();
  };
  const up = (e) => {
    if (e.pointerId !== down.pointerId) return;
    frame.removeEventListener('pointermove', move);
    frame.removeEventListener('pointerup', up);
    frame.removeEventListener('pointercancel', up);
    if (!dragged) return spinCage(svg);
    const [t0, a0] = moves[0];
    const [t1, a1] = moves.at(-1);
    const still = e.timeStamp - t1 > FLICK_WINDOW || t1 <= t0;
    const speed = still ? 0 : Math.max(-MAX_SPEED, Math.min(MAX_SPEED, (a1 - a0) / (t1 - t0)));
    if (Math.abs(speed) >= STOPPED && !reducedMotion()) coast(pieces, angle, speed);
  };
  frame.addEventListener('pointermove', move);
  frame.addEventListener('pointerup', up);
  frame.addEventListener('pointercancel', up);
}

// Turns the cage on from `angle` at `speed` (degrees/ms), slowing until it stops.
function coast(pieces, angle, speed) {
  let then;
  const step = (now) => {
    const dt = Math.min(now - (then ?? now - 16), 50);
    then = now;
    const slowed = speed * Math.exp(-dt / SPIN_DOWN);
    const next = Math.sign(slowed) * Math.max(0, Math.abs(slowed) - FRICTION * dt);
    angle += ((speed + next) / 2) * dt;
    speed = next;
    setRest(pieces, angle);
    if (Math.abs(speed) < STOPPED) coasting.delete(pieces[0]);
    else coasting.set(pieces[0], requestAnimationFrame(step));
  };
  coasting.set(pieces[0], requestAnimationFrame(step));
}
