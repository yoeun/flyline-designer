import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { hexOf, nameOf } from '../data/catalog.js';
import { lineDiameters, totalLength, zoneRanges } from '../lib/geometry.js';
import { STEP, TAPER_KEYS, TAPER_NAMES, editorScale, formatFeet, handleHalfWidths, moveTaperBoundary, moveZoneBoundary, zoneName } from '../lib/lineEdit.js';

const W = 520;
const LEFT = 26; // room for the backing stub
const SPAN = W - LEFT - 8;
const MIN_PX = 56; // wide enough for short taper labels; the editor is not to scale
const RULE_Y = 34;
const MID = 76;
const TOTAL_Y = 124; // total dimension rule, below the zone lengths
const MAX_HALF = 11;
// Touch screens get finger-sized drag handles.
const COARSE = '(pointer: coarse)';
const subscribeCoarse = (onChange) => {
  const media = window.matchMedia(COARSE);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const useCoarsePointer = () => useSyncExternalStore(subscribeCoarse, () => window.matchMedia(COARSE).matches);
// Half a 44px tap target, in screen pixels.
const FINGER = 22;
// The touch bands for taper and zone targets, top to bottom of the drawing, split below the taper lengths.
const BANDS = { taper: [0, 55], zone: [55, 150] };

const sameLengths = (a, b) =>
  TAPER_KEYS.every((k) => a.taper[k] === b.taper[k]) && a.zones.every((z, i) => z.length === b.zones[i].length);

const SHORT = { front: 'FRONT', body: 'BODY', back: 'BACK', running: 'RUNNING LINE' };

// Labels grow on phones, where the whole editor is drawn smaller.
const NAME = 'fill-muted-foreground font-sans text-[8px] font-semibold tracking-[0.08em] max-[480px]:text-[12px]';
const LEN = 'fill-muted-foreground font-mono text-[8.5px] max-[480px]:text-[12.5px]';
const SELECTED_TEXT = 'fill-foreground font-semibold';
// Clickable parts: a transparent hit box (the first rect) that outlines on keyboard focus.
const PART = 'cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-primary [&:focus-visible>rect:first-child]:stroke-2';
const RULE = 'stroke-muted-foreground stroke-1';
const RULE_ON = 'stroke-foreground stroke-3';

function zoneLabel(z, count) {
  if (z.index === count - 1) return `rest · ${nameOf(z.color).toLowerCase()}`;
  return z.index === 0 ? `tip ${formatFeet(z.length)}` : formatFeet(z.length);
}

// Dimension line for the taper on top, the fly line colored by zone below. Tip on the right.
// With `zonesLocked` (a maker colorway) the color boundaries can't be dragged.
// readOnly draws the line without selection or handles, for showing a setup that can't be edited.
export default function LineEditor({ line, selection = null, onSelect, onChange, backingColor, zonesLocked = false, readOnly = false }) {
  const clip = `editor-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const svgRef = useRef(null);
  const drag = useRef(null);
  const coarse = useCoarsePointer();
  // Drawing units per screen pixel, so handle sizes can be set in pixels.
  const [unitsPerPx, setUnitsPerPx] = useState(1);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || readOnly) return;
    const observer = new ResizeObserver(([entry]) => entry.contentRect.width && setUnitsPerPx(W / entry.contentRect.width));
    observer.observe(svg);
    return () => observer.disconnect();
  }, [readOnly]);
  const scale = editorScale(line, SPAN, MIN_PX);
  const x = (ft) => LEFT + scale.x(ft);
  const zones = zoneRanges(line);
  const total = totalLength(line);
  const t = line.taper;
  const d = lineDiameters(line);
  const half = (dia) => Math.max(2, (dia / d.body) * MAX_HALF);

  const stations = [
    [0, d.tip],
    [t.front, d.body],
    [t.front + t.body, d.body],
    [t.front + t.body + t.back, d.running],
    [total, d.running],
  ];
  const outline = [
    ...stations.map(([f, dia]) => `${x(f).toFixed(1)},${(MID - half(dia)).toFixed(1)}`),
    ...[...stations].reverse().map(([f, dia]) => `${x(f).toFixed(1)},${(MID + half(dia)).toFixed(1)}`),
  ].join(' ');

  // A selected taper section is bounded by boundaries k and k + 1 (0 and 4 are the outer ticks).
  const selK = selection?.kind === 'taper' ? TAPER_KEYS.indexOf(selection.key) : -1;
  const edgeOn = (k) => selK >= 0 && (k === selK || k === selK + 1);

  const handles = readOnly ? [] : [
    ...[1, 2, 3].map((k) => ({
      id: `taper-${k}`,
      on: edgeOn(k),
      move: (l, ft) => moveTaperBoundary(l, k, ft),
      ft: scale.edges[k].fromFt,
      label: `Boundary between ${TAPER_NAMES[TAPER_KEYS[k - 1]].toLowerCase()} and ${TAPER_NAMES[TAPER_KEYS[k]].toLowerCase()}`,
      y1: RULE_Y - 9,
      y2: RULE_Y + 9,
    })),
    ...(zonesLocked ? [] : zones.slice(0, -1)).map((z) => ({
      id: `zone-${z.index}`,
      move: (l, ft) => moveZoneBoundary(l, z.index, ft),
      ft: z.end,
      label: `End of ${zoneName(z.index, zones.length).toLowerCase()}`,
      y1: MID - 17,
      y2: MID + 17,
    })),
  ];

  // Hit areas: 20 units wide with a mouse. A phone draws the whole line under 100px tall, so on touch
  // screens the taper handles take the top band and the zone handles the rest, each about 44px wide
  // but kept clear of neighbors in their row.
  for (const row of ['taper', 'zone']) {
    const inRow = handles.filter((h) => h.id.startsWith(row));
    handleHalfWidths(inRow.map((h) => x(h.ft)), coarse ? FINGER * unitsPerPx : 10).forEach((half, i) => {
      const [top, bottom] = coarse ? BANDS[row] : [inRow[i].y1 - 3, inRow[i].y2 + 3];
      Object.assign(inRow[i], { half, hitY1: top, hitY2: bottom });
    });
  }

  const isTaper = (key) => selection?.kind === 'taper' && selection.key === key;
  const isZone = (i) => selection?.kind === 'zone' && selection.index === i;
  // With a zone selected, the rest of the line fades back instead of drawing a box around it.
  const dim = (i) => selection?.kind === 'zone' && selection.index !== i;
  const select = (sel) => (e) => {
    e.stopPropagation();
    onSelect(sel);
  };
  const onActivate = (sel) => (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onSelect(sel);
  };
  // What makes a taper section or zone a button; a read-only line just labels it.
  const part = (sel, on, label) =>
    readOnly
      ? { 'aria-label': label }
      : { role: 'button', tabIndex: 0, 'aria-pressed': on, 'aria-label': label, className: PART, onClick: select(sel), onKeyDown: onActivate(sel) };

  // The scale is frozen for the whole drag so min widths don't shift under the pointer.
  const onPointerDown = (h) => (e) => {
    if (e.button !== 0 || !e.isPrimary) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: h.id, scale };
  };
  const onPointerMove = (e) => {
    const h = drag.current && handles.find((c) => c.id === drag.current.id);
    if (!h) return;
    const rect = svgRef.current.getBoundingClientRect();
    const next = h.move(line, drag.current.scale.ft(((e.clientX - rect.left) / rect.width) * W - LEFT));
    if (!sameLengths(next, line)) onChange(next);
  };
  const endDrag = () => {
    drag.current = null;
  };
  // Tip is on the right, so Left moves a boundary away from the tip.
  const onHandleKey = (h) => (e) => {
    const step = e.shiftKey ? 10 * STEP : STEP;
    const delta = { ArrowLeft: step, ArrowRight: -step }[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    const next = h.move(line, h.ft + delta);
    if (!sameLengths(next, line)) onChange(next);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} 150`}
      className="block h-auto w-full select-none"
      role="group"
      aria-label={readOnly ? 'Fly line' : 'Fly line editor'}
      {...(!readOnly && { onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onClick: () => onSelect(null) })}
    >
      <defs>
        <clipPath id={clip}>
          <polygon points={outline} />
        </clipPath>
      </defs>

      <line className={RULE} x1={x(total)} x2={x(0)} y1={RULE_Y} y2={RULE_Y} />
      <g strokeLinecap="round">
        <line className={edgeOn(4) ? RULE_ON : RULE} x1={x(total)} x2={x(total)} y1={RULE_Y - 6} y2={RULE_Y + 6} />
        <line className={edgeOn(0) ? RULE_ON : RULE} x1={x(0)} x2={x(0)} y1={RULE_Y - 6} y2={RULE_Y + 6} />
      </g>
      {scale.edges.map((e) => {
        const sel = { kind: 'taper', key: e.key };
        const on = isTaper(e.key);
        const mid = LEFT + (e.x0 + e.x1) / 2;
        return (
          <g key={e.key} {...part(sel, on, `${TAPER_NAMES[e.key]}, ${formatFeet(t[e.key])}`)}>
            <rect x={LEFT + e.x1} y={coarse ? BANDS.taper[0] : 6} width={e.x0 - e.x1} height={coarse ? BANDS.taper[1] - BANDS.taper[0] : 46} rx="4" fill="transparent" />
            {on && <line className={RULE_ON} strokeLinecap="round" x1={LEFT + e.x1} x2={LEFT + e.x0} y1={RULE_Y} y2={RULE_Y} />}
            <text className={cn(NAME, on && SELECTED_TEXT)} x={mid} y={RULE_Y - 11} textAnchor="middle">
              {SHORT[e.key]}
            </text>
            <text className={cn(LEN, on && SELECTED_TEXT)} x={mid} y={RULE_Y + 17} textAnchor="middle">
              {formatFeet(t[e.key])}
            </text>
          </g>
        );
      })}

      <rect x={LEFT - 20} y={MID - 2} width="20" height="4" fill={hexOf(backingColor)} />
      <g clipPath={`url(#${clip})`}>
        {zones.map((z) => (
          <rect
            key={z.index}
            className={dim(z.index) ? 'opacity-30' : undefined}
            x={x(z.end)}
            y={MID - 14}
            width={Math.max(0, x(z.start) - x(z.end))}
            height="28"
            fill={hexOf(z.color)}
          />
        ))}
      </g>
      <polygon className="fill-none stroke-foreground [stroke-opacity:0.25]" points={outline} />
      {zones.map((z) => {
        const sel = { kind: 'zone', index: z.index };
        const on = isZone(z.index);
        const width = Math.max(0, x(z.start) - x(z.end));
        return (
          <g key={z.index} {...part(sel, on, `${zoneName(z.index, zones.length)}, ${nameOf(z.color)}, ${formatFeet(z.length)}`)} className={cn(!readOnly && PART, dim(z.index) && 'opacity-30')}>
            <rect x={x(z.end)} y={coarse ? BANDS.zone[0] : MID - 18} width={width} height={coarse ? BANDS.zone[1] - BANDS.zone[0] : 52} rx="4" fill="transparent" />
            <text className={cn(LEN, on && SELECTED_TEXT)} x={x(z.end) + width / 2} y={MID + 30} textAnchor="middle">
              {zoneLabel(z, zones.length)}
            </text>
          </g>
        );
      })}

      <g aria-hidden="true">
        <line className={RULE} x1={x(total)} x2={x(0)} y1={TOTAL_Y} y2={TOTAL_Y} />
        <g strokeLinecap="round">
          <line className={RULE} x1={x(total)} x2={x(total)} y1={TOTAL_Y - 6} y2={TOTAL_Y + 6} />
          <line className={RULE} x1={x(0)} x2={x(0)} y1={TOTAL_Y - 6} y2={TOTAL_Y + 6} />
        </g>
        <text className={LEN} x={(x(total) + x(0)) / 2} y={TOTAL_Y + 17} textAnchor="middle">
          {formatFeet(total)} total
        </text>
      </g>

      {handles.map((h) => (
        <g
          key={h.id}
          role="slider"
          tabIndex={0}
          aria-label={h.label}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={h.ft}
          aria-valuetext={`${formatFeet(h.ft)} from the tip`}
          className="cursor-ew-resize touch-none outline-none [&:focus-visible>rect]:stroke-primary [&:focus-visible>rect]:stroke-2 [&:hover>rect]:fill-accent"
          onPointerDown={onPointerDown(h)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={onHandleKey(h)}
        >
          <rect x={x(h.ft) - h.half} y={h.hitY1} width={2 * h.half} height={h.hitY2 - h.hitY1} rx="4" fill="transparent" />
          <line className={cn('stroke-foreground', h.on ? 'stroke-3' : 'stroke-2')} strokeLinecap="round" x1={x(h.ft)} x2={x(h.ft)} y1={h.y1} y2={h.y2} />
        </g>
      ))}
    </svg>
  );
}
