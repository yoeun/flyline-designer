import { useId } from 'react';
import { REEL_COLORS, findById, hexOf } from '../data/catalog.js';
import { spoolLayout } from '../lib/geometry.js';

const VIEW = { x: -215, y: -250, w: 430, h: 470 };
const RIM_PX = 200;
const PORTS = 8;
const PORT_OPENNESS = 0.62;
const HUB = '#2b2e31';

function portPath(rIn, rOut, center, halfSpan) {
  const p = (r, a) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
  const a0 = center - halfSpan;
  const a1 = center + halfSpan;
  return `M${p(rOut, a0)}A${rOut} ${rOut} 0 0 1 ${p(rOut, a1)}L${p(rIn, a1)}A${rIn} ${rIn} 0 0 0 ${p(rIn, a0)}Z`;
}

const annulus = (outer, inner) =>
  `M0 ${-outer}A${outer} ${outer} 0 1 0 0 ${outer}A${outer} ${outer} 0 1 0 0 ${-outer}Z` +
  `M0 ${-inner}A${inner} ${inner} 0 1 1 0 ${inner}A${inner} ${inner} 0 1 1 0 ${-inner}Z`;

// mode: 'reel' | 'see-through' | 'line-only'
export default function ReelPreview({ setup, mode = 'reel', background = '#e9ebe6', size, svgRef, title }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const layout = spoolLayout(setup);
  const s = RIM_PX / layout.rimR;
  const arbor = layout.arborR * s;
  const spool = layout.spoolR * s;
  const reelHex = (findById(REEL_COLORS, setup.reel.color) ?? REEL_COLORS[2]).hex;
  const reelOpacity = mode === 'reel' ? 1 : mode === 'see-through' ? 0.32 : 0;
  const lineOnly = mode === 'line-only';

  const span = (2 * Math.PI) / PORTS;
  const inset = 6;
  const ports = Array.from({ length: PORTS }, (_, k) =>
    portPath(arbor + 16 + inset, spool - 14 - inset, (k + 0.5) * span, (span * PORT_OPENNESS) / 2 - inset / spool),
  );

  const texture = [];
  for (let r = arbor + 3; r < layout.outerR * s; r += 4.5) texture.push(r);

  const handleR = (arbor + spool) / 2 + 8;
  const handle = { x: handleR * Math.cos((3 * Math.PI) / 4), y: handleR * Math.sin((3 * Math.PI) / 4) };
  const sheen = `url(#sheen-${uid})`;

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
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <mask id={`ports-${uid}`}>
          <circle r={spool} fill="#fff" />
          <g fill="#000" stroke="#000" strokeWidth={inset * 2} strokeLinejoin="round">
            {ports.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </mask>
      </defs>

      <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={background} />

      <g opacity={reelOpacity}>
        <rect x="-24" y={-RIM_PX - 32} width="48" height="40" fill={reelHex} />
        <rect x="-74" y={-RIM_PX - 44} width="148" height="16" rx="5" fill={reelHex} />
        <rect x="-74" y={-RIM_PX - 44} width="148" height="16" rx="5" fill={sheen} />
        <circle r={spool} fill="#24272a" />
      </g>

      {/* Outermost ring first so each smaller circle paints over it: no gaps between layers. */}
      {[...layout.rings].reverse().map((ring, i) => (
        <circle key={i} r={ring.outer * s} fill={hexOf(ring.color)} />
      ))}
      <g fill="none" stroke="#000" strokeOpacity="0.09" strokeWidth="0.8">
        {texture.map((r) => (
          <circle key={r} r={r} />
        ))}
      </g>
      <circle r={arbor} fill={lineOnly ? background : '#24272a'} />

      {lineOnly && <circle r={spool} fill="none" stroke="#5b6862" strokeWidth="1.5" strokeDasharray="5 6" opacity="0.55" />}
      {!layout.fits && <circle r={spool} fill="none" stroke="#c0352b" strokeWidth="2.5" strokeDasharray="8 6" />}

      <g opacity={reelOpacity}>
        <path d={annulus(RIM_PX, spool)} fill={reelHex} fillRule="evenodd" />
        <path d={annulus(RIM_PX, spool)} fill={sheen} fillRule="evenodd" />
        <circle r={spool} fill={reelHex} mask={`url(#ports-${uid})`} />
        <circle r={spool} fill={sheen} mask={`url(#ports-${uid})`} />
        <circle r={spool} fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1.5" />
        <circle r={arbor * 0.63} fill={HUB} />
        <circle r={arbor * 0.48} fill="#3b3f43" />
        <rect x="-5" y={-arbor * 0.28} width="10" height={arbor * 0.56} rx="5" fill="#1d1f22" transform="rotate(35)" />
        <circle r={arbor * 0.63} fill={sheen} />
        <circle cx={handle.x} cy={handle.y} r="21" fill={HUB} />
        <circle cx={handle.x} cy={handle.y} r="13" fill="#474b50" />
      </g>
    </svg>
  );
}
