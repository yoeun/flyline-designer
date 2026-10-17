import { useId } from 'react';
import { REEL_COLORS, findById, hexOf } from '../data/catalog.js';
import { spoolLayout } from '../lib/geometry.js';
import { frameMarkup } from '../lib/reelFrames.js';

const VIEW = { x: -215, y: -250, w: 430, h: 470 };
const RIM_PX = 200;
// The spool core: reel metal in shadow.
const Core = ({ r, hex, opacity }) => (
  <g opacity={opacity}>
    <circle r={r} fill={hex} />
    <circle r={r} fill="#000" fillOpacity="0.6" />
  </g>
);

// mode: 'reel' | 'see-through' | 'line-only'; side: 'drag' | 'spool'
export default function ReelPreview({ setup, mode = 'reel', side = 'drag', background = '#e9ebe6', size, svgRef, title }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const layout = spoolLayout(setup);
  const s = RIM_PX / layout.rimR;
  const arbor = layout.arborR * s;
  const spool = layout.spoolR * s;
  const outer = layout.outerR * s;
  const reelHex = (findById(REEL_COLORS, setup.reel.color) ?? REEL_COLORS[2]).hex;
  const reelOpacity = mode === 'reel' ? 1 : mode === 'see-through' ? 0.32 : 0;
  const lineOnly = mode === 'line-only';

  // Fine wraps across the wound line, alternating dark and light.
  const wraps = [];
  for (let r = arbor + 1.5; r < outer; r += 2.6) wraps.push(r);

  return (
    <svg
      ref={svgRef}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      width={size}
      height={size ? (size * VIEW.h) / VIEW.w : undefined}
      role="img"
      aria-label={title ?? 'Reel with backing and fly line'}
      className="reel-preview"
    >
      <defs>
        <linearGradient id={`line-light-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={background} />

      <Core r={spool} hex={reelHex} opacity={reelOpacity} />

      {/* Outermost ring first so each smaller circle paints over it: no gaps between layers. */}
      {[...layout.rings].reverse().map((ring, i) => (
        <circle key={i} r={ring.outer * s} fill={hexOf(ring.color)} />
      ))}
      <g fill="none" strokeWidth="0.9">
        {wraps.map((r, i) => (
          <circle key={r} r={r} stroke={i % 2 ? '#fff' : '#000'} strokeOpacity={i % 2 ? 0.07 : 0.13} />
        ))}
      </g>
      <g fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.2">
        {layout.rings.map((ring, i) => (
          <circle key={i} r={ring.outer * s} />
        ))}
      </g>
      <circle r={outer} fill={`url(#line-light-${uid})`} />
      {lineOnly ? <circle r={arbor} fill={background} /> : <Core r={arbor} hex={reelHex} />}

      {lineOnly && <circle r={spool} fill="none" stroke="#5b6862" strokeWidth="1.5" strokeDasharray="5 6" opacity="0.55" />}
      {!layout.fits && <circle r={spool} fill="none" stroke="#c0352b" strokeWidth="2.5" strokeDasharray="8 6" />}

      {reelOpacity > 0 && (
        <g color={reelHex} opacity={reelOpacity} dangerouslySetInnerHTML={{ __html: frameMarkup(layout.reel.design, side, uid) }} />
      )}
    </svg>
  );
}
