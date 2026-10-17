import {
  BACKING_COLORS,
  BACKING_LENGTHS,
  LINE_COLORS,
  LINE_PRESETS,
  LINE_TYPES,
  REEL_COLORS,
  REELS,
  findById,
  nameOf,
} from '../data/catalog.js';
import { totalLength, zoneRanges } from '../lib/geometry.js';
import { MIN_LENGTH, TAPER_NAMES, formatFeet, removeZone, setTaperLength, setZoneLength, splitZone, zoneName } from '../lib/lineEdit.js';
import LineEditor from './LineEditor.jsx';
import Swatches from './Swatches.jsx';

const numberOr = (value, fallback) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function ReelOptions({ reel, onChange }) {
  const color = findById(REEL_COLORS, reel.color);
  return (
    <section className="options-group">
      <h2>Reel</h2>
      <label className="field">
        <span>Model</span>
        <select value={reel.model} onChange={(e) => onChange({ ...reel, model: e.target.value })}>
          {REELS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} · {r.rim} in
            </option>
          ))}
        </select>
      </label>
      <div className="field">
        <span>Color · {color?.name}</span>
        <Swatches colors={REEL_COLORS} value={reel.color} onChange={(c) => onChange({ ...reel, color: c })} label="Reel color" size={34} />
      </div>
    </section>
  );
}

const TAPER_HINTS = {
  front: 'thins down to the tip',
  body: 'thickest part of the line',
  back: 'thins down to the running line',
  running: 'thin line behind the head',
};

function LengthField({ label, value, onChange }) {
  return (
    <label className="field inline">
      <input type="number" min="0.5" step="0.5" className="mono" aria-label={label} value={value} onChange={(e) => onChange(numberOr(e.target.value, value))} />
      <span>ft</span>
    </label>
  );
}

function LineSelection({ line, selection, onChange, onSelect }) {
  if (selection.kind === 'taper') {
    const { key } = selection;
    return (
      <div className="line-selection">
        <div className="line-selection__head">
          <strong>{TAPER_NAMES[key]}</strong>
          <LengthField label={`${TAPER_NAMES[key]} length in feet`} value={line.taper[key]} onChange={(ft) => onChange(setTaperLength(line, key, ft))} />
          <span className="muted">{TAPER_HINTS[key]}</span>
        </div>
      </div>
    );
  }

  const { index } = selection;
  const count = line.zones.length;
  const name = zoneName(index, count);
  const zone = line.zones[index];
  const drawn = zoneRanges(line)[index].length;
  return (
    <div className="line-selection">
      <div className="line-selection__head">
        <strong>{name}</strong>
        {index === count - 1 ? (
          <span className="muted">
            <span className="mono">{formatFeet(drawn)}</span> · rest of line
          </span>
        ) : (
          <LengthField label={`${name} length in feet`} value={zone.length} onChange={(ft) => onChange(setZoneLength(line, index, ft))} />
        )}
        <span className="line-selection__actions">
          <button type="button" className="link-button" disabled={drawn < 2 * MIN_LENGTH} onClick={() => onChange(splitZone(line, index))}>
            Split
          </button>
          <button
            type="button"
            className="link-button"
            disabled={count < 2}
            onClick={() => {
              onChange(removeZone(line, index));
              onSelect({ kind: 'zone', index: Math.min(index, count - 2) });
            }}
          >
            Remove
          </button>
        </span>
      </div>
      <Swatches colors={LINE_COLORS} value={zone.color} onChange={(c) => onChange({ ...line, zones: line.zones.map((z, i) => (i === index ? { ...z, color: c } : z)) })} label={`${name} color`} />
    </div>
  );
}

export function FlyLineOptions({ line, backingColor, presetId, onChange, onPreset, selection, onSelect }) {
  const type = findById(LINE_TYPES, line.type);
  const locked = presetId !== 'custom';

  return (
    <section className="options-group">
      <h2>Fly line</h2>
      <div className="field-row">
        <label className="field field--grow">
          <span>Preset</span>
          <select value={presetId} onChange={(e) => onPreset(e.target.value)}>
            {LINE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>
        <label className="field field--grow">
          <span>Type</span>
          <select value={line.type} disabled={locked} onChange={(e) => onChange({ ...line, type: e.target.value })}>
            {LINE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Weight</span>
          <select value={line.weight} disabled={locked} onChange={(e) => onChange({ ...line, weight: Number(e.target.value) })}>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
              <option key={w} value={w}>
                {w} wt
              </option>
            ))}
          </select>
        </label>
      </div>
      <LineEditor line={line} selection={selection} onSelect={onSelect} onChange={onChange} backingColor={backingColor} />
      <LineSelection line={line} selection={selection} onChange={onChange} onSelect={onSelect} />
      <p className="hint">
        {type?.name} · {line.weight} wt · <span className="mono">{formatFeet(totalLength(line))}</span> total
        {locked && ' · choose Custom to change type or weight'}
      </p>
    </section>
  );
}

export function BackingOptions({ backing, onChange }) {
  const custom = !BACKING_LENGTHS.includes(backing.yards);
  return (
    <section className="options-group">
      <h2>Backing</h2>
      <div className="backing-row">
        <div className="segmented" role="group" aria-label="Backing length">
          {BACKING_LENGTHS.map((y) => (
            <button key={y} type="button" aria-pressed={backing.yards === y} onClick={() => onChange({ ...backing, yards: y })}>
              {y}
            </button>
          ))}
        </div>
        <label className="field inline">
          <input
            type="number"
            min="0"
            step="10"
            className={`mono${custom ? ' is-custom' : ''}`}
            aria-label="Backing length in yards"
            value={backing.yards}
            onChange={(e) => onChange({ ...backing, yards: numberOr(e.target.value, backing.yards) })}
          />
          <span>yd</span>
        </label>
        <div className="segmented" role="group" aria-label="Backing strength">
          {[20, 30].map((lb) => (
            <button key={lb} type="button" aria-pressed={backing.pounds === lb} onClick={() => onChange({ ...backing, pounds: lb })}>
              {lb} lb
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <span>Color · {nameOf(backing.color)}</span>
        <Swatches colors={BACKING_COLORS} value={backing.color} onChange={(c) => onChange({ ...backing, color: c })} label="Backing color" />
      </div>
    </section>
  );
}
