import { useId } from 'react';
import { cn } from '@/lib/utils';
import { REEL_COLORS, findById, hexOf } from '../data/catalog.js';
import { spoolLayout } from '../lib/geometry.js';
import { frameMarkup } from '../lib/reelFrames.js';

const VIEW = { x: -215, y: -250, w: 430, h: 470 };
const RIM_PX = 200;
const OTHER_SIDE = { drag: 'spool', spool: 'drag' };

// The hex color scaled toward black, for metal in shadow.
const shade = (hex, k) =>
  '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');

// mode: 'reel' | 'see-through' | 'line-only'; side: 'drag' | 'spool'. showLine false draws the reel empty.
export default function ReelPreview({ setup, mode = 'reel', side = 'drag', showLine = true, background = '#e9ebe6', size, svgRef, title, className }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const layout = spoolLayout(setup);
  const s = RIM_PX / layout.rimR;
  const arbor = layout.arborR * s;
  const spool = layout.spoolR * s;
  const outer = layout.outerR * s;
  const finish = findById(REEL_COLORS, setup.reel.color) ?? REEL_COLORS[2];
  const reelHex = finish.hex;
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
      className={cn('block h-auto w-full', className)}
    >
      <defs>
        <linearGradient id={`line-light-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <clipPath id={`spool-${uid}`}>
          <circle r={spool} />
        </clipPath>
        {/* The line is a ring: the far side of the reel shows through the arbor. */}
        <mask id={`line-${uid}`}>
          <circle r={RIM_PX} fill="#fff" />
          <circle r={arbor} fill="#000" />
        </mask>
      </defs>

      <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={background} />

      {reelOpacity > 0 && (
        <g clipPath={`url(#spool-${uid})`} opacity={reelOpacity}>
          {/* The other side's frame, seen from behind: mirrored and in shadow. */}
          <g
            transform="scale(-1 1)"
            color={shade(reelHex, 0.5)}
            dangerouslySetInnerHTML={{ __html: frameMarkup(layout.reel.design, OTHER_SIDE[side], `${uid}b`) }}
          />
        </g>
      )}

      {showLine && (
        <g mask={`url(#line-${uid})`}>
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
        </g>
      )}

      {lineOnly && <circle r={spool} fill="none" stroke="#5b6862" strokeWidth="1.5" strokeDasharray="5 6" opacity="0.55" />}
      {showLine && !layout.fits && <circle r={spool} fill="none" stroke="#c0352b" strokeWidth="2.5" strokeDasharray="8 6" />}

      {reelOpacity > 0 && (
        <g color={reelHex} style={finish.accent ? { '--accent': finish.accent } : undefined} opacity={reelOpacity} dangerouslySetInnerHTML={{ __html: frameMarkup(layout.reel.design, side, uid) }} />
      )}
    </svg>
  );
}
