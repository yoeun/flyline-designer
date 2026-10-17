import { useEffect, useRef, useState } from 'react';
import { AFFTA_GRAINS } from '../lib/guide.js';

const M = { top: 14, right: 14, bottom: 44, left: 50 };
const FONT = 12;
const textWidth = (text) => text.length * FONT * 0.56;
const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

// Tick values every `step` covering [lo, hi].
const ticks = (lo, hi, step) => Array.from({ length: Math.floor((hi - lo) / step) + 1 }, (_, i) => lo + i * step);

// Where each dot's label goes: the first spot beside it that clears the plot edges, the other dots and the
// labels placed so far. A label moved away from its dot gets a leader line; one with no room is left to
// the tooltip and the table.
function placeLabels(points, box, reserved) {
  const placed = [...reserved];
  const dots = points.map((p) => ({ x: p.cx - 7, y: p.cy - 7, w: 14, h: 14 }));
  const spots = [
    [10, 0, 'start'],
    [-10, 0, 'end'],
    [0, -14, 'middle'],
    [0, 14, 'middle'],
    [10, -16, 'start'],
    [10, 16, 'start'],
    [-10, -16, 'end'],
    [-10, 16, 'end'],
    [14, -30, 'start'],
    [14, 30, 'start'],
    [-14, -30, 'end'],
    [-14, 30, 'end'],
  ];
  // Crowded dots first, so they get the near spots.
  const order = points.map((p, i) => i).sort((a, b) => points[a].cx - points[b].cx);
  const out = new Array(points.length).fill(null);
  for (const i of order) {
    const p = points[i];
    const w = textWidth(p.label);
    for (const [dx, dy, anchor] of spots) {
      const x = anchor === 'start' ? p.cx + dx : anchor === 'end' ? p.cx + dx - w : p.cx - w / 2;
      const rect = { x, y: p.cy + dy - FONT / 2 - 1, w, h: FONT + 2 };
      const inside = rect.x >= box.x && rect.x + rect.w <= box.x + box.w && rect.y >= box.y && rect.y + rect.h <= box.y + box.h;
      if (!inside || placed.some((r) => overlaps(r, rect)) || dots.some((d, j) => j !== i && overlaps(d, rect))) continue;
      placed.push(rect);
      out[i] = { x: anchor === 'end' ? p.cx + dx : anchor === 'middle' ? p.cx : p.cx + dx, y: p.cy + dy, anchor, leader: Math.abs(dy) > 14 };
      break;
    }
  }
  return out;
}

// Head length against grains in the first 30 ft, one dot per taper, with the AFFTA weights as reference lines.
export default function TaperChart({ points, weight = 5 }) {
  const wrap = useRef(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const refs = [weight, weight + 1].filter((w) => w in AFFTA_GRAINS).map((w) => ({ w, grains: AFFTA_GRAINS[w] }));
  const heads = points.map((p) => p.head);
  const grains = [...points.map((p) => p.grains), ...refs.map((r) => r.grains)];
  const x0 = Math.floor((Math.min(...heads) - 2) / 5) * 5, x1 = Math.ceil((Math.max(...heads) + 2) / 5) * 5;
  const y0 = Math.floor((Math.min(...grains) - 5) / 10) * 10, y1 = Math.ceil((Math.max(...grains) + 5) / 10) * 10;
  const height = Math.round(Math.min(440, Math.max(300, width * 0.62)));
  const plot = { x: M.left, y: M.top, w: width - M.left - M.right, h: height - M.top - M.bottom };
  const sx = (v) => plot.x + ((v - x0) / (x1 - x0)) * plot.w;
  const sy = (v) => plot.y + plot.h - ((v - y0) / (y1 - y0)) * plot.h;

  const dots = points.map((p) => ({ ...p, cx: sx(p.head), cy: sy(p.grains) }));
  const refLabels = refs.map((r) => {
    const text = `AFFTA ${r.w} wt · ${r.grains} gr`;
    return { ...r, text, rect: { x: plot.x + plot.w - textWidth(text) - 4, y: sy(r.grains) - FONT - 5, w: textWidth(text) + 4, h: FONT + 2 } };
  });
  const labels = placeLabels(dots, plot, refLabels.map((r) => r.rect));
  const xStep = x1 - x0 > 30 ? 10 : 5;
  const yStep = y1 - y0 > 80 ? 20 : 10;
  const shown = dots.find((d) => d.key === hover);
  const nearest = (e) => {
    const box = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    const x = e.clientX - box.left, y = e.clientY - box.top;
    let best = null, bestD = 24;
    for (const d of dots) {
      const dist = Math.hypot(d.cx - x, d.cy - y);
      if (dist < bestD) [best, bestD] = [d.key, dist];
    }
    return best;
  };

  return (
    <div ref={wrap} className="relative w-full">
      <svg width={width} height={height} role="img" aria-label={`Head length against 30 ft grain weight at ${weight} wt, ${points.length} tapers`} className="block font-sans">
        {ticks(y0, y1, yStep).map((v) => (
          <g key={`y${v}`}>
            <line x1={plot.x} x2={plot.x + plot.w} y1={sy(v)} y2={sy(v)} stroke="var(--line)" strokeWidth="1" />
            <text x={plot.x - 8} y={sy(v)} dy="0.35em" textAnchor="end" fontSize={FONT} fill="var(--muted)" className="tabular-nums">
              {v}
            </text>
          </g>
        ))}
        {ticks(x0, x1, xStep).map((v) => (
          <text key={`x${v}`} x={sx(v)} y={plot.y + plot.h + 18} textAnchor="middle" fontSize={FONT} fill="var(--muted)" className="tabular-nums">
            {v}
          </text>
        ))}
        <line x1={plot.x} x2={plot.x + plot.w} y1={plot.y + plot.h} y2={plot.y + plot.h} stroke="var(--line-strong)" strokeWidth="1" />
        <text x={plot.x + plot.w / 2} y={height - 6} textAnchor="middle" fontSize={FONT} fill="var(--muted)">
          Head length (ft)
        </text>
        <text transform={`translate(13 ${plot.y + plot.h / 2}) rotate(-90)`} textAnchor="middle" fontSize={FONT} fill="var(--muted)">
          Grains in the first 30 ft
        </text>

        {refLabels.map((r) => (
          <g key={`ref${r.w}`}>
            <line x1={plot.x} x2={plot.x + plot.w} y1={sy(r.grains)} y2={sy(r.grains)} stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={plot.x + plot.w - 2} y={sy(r.grains) - 6} textAnchor="end" fontSize={FONT} fill="var(--muted)" stroke="var(--panel)" strokeWidth="3" paintOrder="stroke">
              {r.text}
            </text>
          </g>
        ))}

        {dots.map((d, i) => {
          const l = labels[i];
          return (
            l && (
              <g key={`l${d.key}`}>
                {l.leader && <line x1={d.cx} y1={d.cy} x2={l.anchor === 'end' ? l.x + 2 : l.anchor === 'start' ? l.x - 2 : l.x} y2={l.y} stroke="var(--line-strong)" strokeWidth="1" />}
                <text x={l.x} y={l.y} dy="0.35em" textAnchor={l.anchor} fontSize={FONT} fill="var(--ink)" stroke="var(--panel)" strokeWidth="3" paintOrder="stroke" fontWeight={hover === d.key ? 700 : 500}>
                  {d.label}
                </text>
              </g>
            )
          );
        })}

        {dots.map((d) => (
          <g
            key={d.key}
            tabIndex={0}
            role="img"
            aria-label={`${d.maker} ${d.label}: ${d.head} ft head, ${d.grains} grains, ${d.heaviness.toLowerCase()}`}
            onFocus={() => setHover(d.key)}
            onBlur={() => setHover((h) => (h === d.key ? null : h))}
            className="cursor-default outline-none"
          >
            <circle cx={d.cx} cy={d.cy} r={hover === d.key ? 7 : 5} fill="var(--accent)" stroke="var(--panel)" strokeWidth="2" />
          </g>
        ))}
        {/* Hover goes to the nearest dot within reach, so close dots are still easy to pick apart. */}
        <rect
          x={plot.x - 12}
          y={plot.y - 12}
          width={plot.w + 24}
          height={plot.h + 24}
          fill="transparent"
          onPointerMove={(e) => setHover(nearest(e))}
          onPointerLeave={() => setHover(null)}
        />
      </svg>
      {shown && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 flex max-w-72 flex-col gap-0.5 rounded-md border border-border bg-popover px-3 py-2 text-[13px] shadow-md"
          style={{
            left: Math.min(Math.max(0, shown.cx - 120), width - 240),
            top: shown.cy > height / 2 ? undefined : shown.cy + 14,
            bottom: shown.cy > height / 2 ? height - shown.cy + 14 : undefined,
          }}
        >
          <strong className="tabular-nums">
            {shown.head} ft head · {shown.grains} gr
          </strong>
          <span>
            {shown.maker} {shown.products.length > 1 ? shown.label.replace(/ \(.*\)$/, '') : shown.label}
          </span>
          {shown.products.length > 1 && <span className="text-[12px] text-muted-foreground">Sold as {shown.products.map((p) => p.name).join(', ')}</span>}
          <span className="text-muted-foreground">
            {shown.heaviness} at {weight} wt
          </span>
        </div>
      )}
    </div>
  );
}
