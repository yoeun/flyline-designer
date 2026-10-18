import { useId } from 'react';
import { cn } from '@/lib/utils';
import { REEL_COLORS, findById, hexOf, reelAccent, reelTrim } from '../data/catalog.js';
import { spoolLayout } from '../lib/geometry.js';
import { frameArbor, frameMarkup, spinCage } from '../lib/reelFrames.js';

const VIEW = { x: -215, y: -250, w: 430, h: 470 };
const RIM_PX = 200;
const OTHER_SIDE = { drag: 'spool', spool: 'drag' };

// The hex color scaled toward black, for metal in shadow.
const shade = (hex, k) =>
  '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');

// Ink for markings printed on a part of this color, like a dial's numbers: dark on light metal, light on dark.
const inkOn = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 110 ? '#1b1d1f' : '#e4e4e0';
};

// mode: 'reel' | 'see-through' | 'line-only'; side: 'drag' | 'spool'. showLine false draws the reel empty.
export default function ReelPreview({ setup, mode = 'reel', side = 'drag', showLine = true, background = '#e9ebe6', size, svgRef, title, className }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const layout = spoolLayout(setup);
  const s = RIM_PX / layout.rimR;
  const spool = layout.spoolR * s;
  // The line starts on the arbor the frame drawing shows, where it shows one. Each ring keeps its share of the
  // spool's area between the arbor and the spool's edge, so the reel looks as full as the numbers say it is.
  const arbor = frameArbor(layout.reel.design) ?? layout.arborR * s;
  const share = (spool * spool - arbor * arbor) / (layout.spoolR ** 2 - layout.arborR ** 2);
  const drawn = (r) => Math.sqrt(arbor * arbor + (r * r - layout.arborR ** 2) * share);
  const outer = drawn(layout.outerR);
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
          {/* The other side's frame, seen from behind: mirrored and in shadow, without its printing (text, and
              marks a drawing tags data-print, like a dial's dots), which is on the far face. */}
          <g
            className="[&_[data-print]]:hidden [&_text]:hidden"
            transform="scale(-1 1)"
            color={shade(reelHex, 0.5)}
            style={{ '--reel-accent': 'currentColor', '--reel-trim': 'currentColor' }}
            dangerouslySetInnerHTML={{ __html: frameMarkup(layout.reel.design, OTHER_SIDE[side], `${uid}b`) }}
          />
        </g>
      )}

      {showLine && (
        <g mask={`url(#line-${uid})`}>
          {/* Outermost ring first so each smaller circle paints over it: no gaps between layers. */}
          {[...layout.rings].reverse().map((ring, i) => (
            <circle key={i} r={drawn(ring.outer)} fill={hexOf(ring.color)} />
          ))}
          <g fill="none" strokeWidth="0.9">
            {wraps.map((r, i) => (
              <circle key={r} r={r} stroke={i % 2 ? '#fff' : '#000'} strokeOpacity={i % 2 ? 0.07 : 0.13} />
            ))}
          </g>
          <g fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.2">
            {layout.rings.map((ring, i) => (
              <circle key={i} r={drawn(ring.outer)} />
            ))}
          </g>
          <circle r={outer} fill={`url(#line-light-${uid})`} />
        </g>
      )}

      {lineOnly && <circle r={spool} fill="none" stroke="#5b6862" strokeWidth="1.5" strokeDasharray="5 6" opacity="0.55" />}
      {showLine && !layout.fits && <circle r={spool} fill="none" stroke="#c0352b" strokeWidth="2.5" strokeDasharray="8 6" />}

      {reelOpacity > 0 && (
        <g
          color={reelHex}
          style={{
            '--reel-accent': reelAccent(layout.reel, finish.id) ?? 'currentColor',
            '--reel-trim': reelTrim(layout.reel, finish.id) ?? 'currentColor',
            '--reel-ink': inkOn(reelAccent(layout.reel, finish.id) ?? reelHex),
          }}
          opacity={reelOpacity}
          // Clicking the handle turns the spool.
          onClick={(e) => {
            if (!e.target.closest('[data-handle]')) return;
            e.stopPropagation();
            spinCage(e.currentTarget);
          }}
          dangerouslySetInnerHTML={{ __html: frameMarkup(layout.reel.design, side, uid, { handles: side === 'spool' }) }}
        />
      )}
    </svg>
  );
}
