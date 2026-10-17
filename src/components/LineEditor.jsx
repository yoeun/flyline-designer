import { useId, useRef } from 'react';
import { hexOf, nameOf } from '../data/catalog.js';
import { lineDiameters, totalLength, zoneRanges } from '../lib/geometry.js';
import { STEP, TAPER_KEYS, TAPER_NAMES, editorScale, formatFeet, moveTaperBoundary, moveZoneBoundary, zoneName } from '../lib/lineEdit.js';

const W = 520;
const LEFT = 26; // room for the backing stub
const SPAN = W - LEFT - 8;
const MIN_PX = 28;
const RULE_Y = 34;
const MID = 76;
const MAX_HALF = 11;
const sameLengths = (a, b) =>
  TAPER_KEYS.every((k) => a.taper[k] === b.taper[k]) && a.zones.every((z, i) => z.length === b.zones[i].length);

const SHORT = { front: 'FRONT', body: 'BODY', back: 'BACK', running: 'RUNNING LINE' };

function zoneLabel(z, count) {
  if (z.index === count - 1) return `rest · ${nameOf(z.color).toLowerCase()}`;
  return z.index === 0 ? `tip ${formatFeet(z.length)}` : formatFeet(z.length);
}

// Dimension line for the taper on top, the fly line colored by zone below. Tip on the right.
export default function LineEditor({ line, selection, onSelect, onChange, backingColor }) {
  const clip = `editor-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const svgRef = useRef(null);
  const drag = useRef(null);
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

  const handles = [
    ...[1, 2, 3].map((k) => ({
      id: `taper-${k}`,
      on: edgeOn(k),
      move: (l, ft) => moveTaperBoundary(l, k, ft),
      ft: scale.edges[k].fromFt,
      label: `Boundary between ${TAPER_NAMES[TAPER_KEYS[k - 1]].toLowerCase()} and ${TAPER_NAMES[TAPER_KEYS[k]].toLowerCase()}`,
      y1: RULE_Y - 9,
      y2: RULE_Y + 9,
    })),
    ...zones.slice(0, -1).map((z) => ({
      id: `zone-${z.index}`,
      move: (l, ft) => moveZoneBoundary(l, z.index, ft),
      ft: z.end,
      label: `End of ${zoneName(z.index, zones.length).toLowerCase()}`,
      y1: MID - 17,
      y2: MID + 17,
    })),
  ];

  const isTaper = (key) => selection?.kind === 'taper' && selection.key === key;
  const isZone = (i) => selection?.kind === 'zone' && selection.index === i;
  const onActivate = (sel) => (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onSelect(sel);
  };

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
      viewBox={`0 0 ${W} 114`}
      className="line-editor"
      role="group"
      aria-label="Fly line editor"
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <defs>
        <clipPath id={clip}>
          <polygon points={outline} />
        </clipPath>
      </defs>

      <line className="line-editor__rule" x1={x(total)} x2={x(0)} y1={RULE_Y} y2={RULE_Y} />
      <g className="line-editor__tick">
        <line className={edgeOn(4) ? 'is-on' : undefined} x1={x(total)} x2={x(total)} y1={RULE_Y - 6} y2={RULE_Y + 6} />
        <line className={edgeOn(0) ? 'is-on' : undefined} x1={x(0)} x2={x(0)} y1={RULE_Y - 6} y2={RULE_Y + 6} />
      </g>
      {scale.edges.map((e) => {
        const sel = { kind: 'taper', key: e.key };
        const on = isTaper(e.key);
        const mid = LEFT + (e.x0 + e.x1) / 2;
        return (
          <g
            key={e.key}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${TAPER_NAMES[e.key]}, ${formatFeet(t[e.key])}`}
            className={`line-editor__span${on ? ' is-selected' : ''}`}
            onClick={() => onSelect(sel)}
            onKeyDown={onActivate(sel)}
          >
            <rect x={LEFT + e.x1} y="6" width={e.x0 - e.x1} height="46" rx="4" fill="transparent" />
            {on && <line className="line-editor__rule-on" x1={LEFT + e.x1} x2={LEFT + e.x0} y1={RULE_Y} y2={RULE_Y} />}
            <text className="line-editor__name" x={mid} y={RULE_Y - 11} textAnchor="middle">
              {SHORT[e.key]}
            </text>
            <text className="line-editor__len" x={mid} y={RULE_Y + 17} textAnchor="middle">
              {formatFeet(t[e.key])}
            </text>
          </g>
        );
      })}

      <rect x={LEFT - 20} y={MID - 2} width="20" height="4" fill={hexOf(backingColor)} />
      <g clipPath={`url(#${clip})`}>
        {zones.map((z) => (
          <rect key={z.index} x={x(z.end)} y={MID - 14} width={Math.max(0, x(z.start) - x(z.end))} height="28" fill={hexOf(z.color)} />
        ))}
      </g>
      <polygon className="line-editor__outline" points={outline} />
      {zones.map((z) => {
        const sel = { kind: 'zone', index: z.index };
        const on = isZone(z.index);
        const width = Math.max(0, x(z.start) - x(z.end));
        return (
          <g
            key={z.index}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${zoneName(z.index, zones.length)}, ${nameOf(z.color)}, ${formatFeet(z.length)}`}
            className={`line-editor__zone${on ? ' is-selected' : ''}`}
            onClick={() => onSelect(sel)}
            onKeyDown={onActivate(sel)}
          >
            <rect x={x(z.end)} y={MID - 18} width={width} height="52" rx="4" fill="transparent" />
            {on && <rect className="line-editor__ring" x={x(z.end) - 2} y={MID - 16} width={width + 4} height="32" rx="6" />}
            <text className="line-editor__len" x={x(z.end) + width / 2} y={MID + 30} textAnchor="middle">
              {zoneLabel(z, zones.length)}
            </text>
          </g>
        );
      })}

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
          className={`line-editor__handle${h.on ? ' is-on' : ''}`}
          onPointerDown={onPointerDown(h)}
          onKeyDown={onHandleKey(h)}
        >
          <rect x={x(h.ft) - 10} y={h.y1 - 3} width="20" height={h.y2 - h.y1 + 6} rx="4" fill="transparent" />
          <line x1={x(h.ft)} x2={x(h.ft)} y1={h.y1} y2={h.y2} />
        </g>
      ))}
    </svg>
  );
}
