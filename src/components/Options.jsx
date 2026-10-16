import { useState } from 'react';
import {
  BACKING_FAMILIES,
  BACKING_LENGTHS,
  LINE_COLORS,
  LINE_PRESETS,
  LINE_TYPES,
  REEL_COLORS,
  REELS,
  findById,
  hexOf,
  nameOf,
} from '../data/catalog.js';
import { totalLength, zoneRanges } from '../lib/geometry.js';
import { formatFeet } from './LineDiagram.jsx';
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

export function FlyLineOptions({ line, presetId, onChange, onPreset }) {
  const [active, setActive] = useState(0);
  const zones = zoneRanges(line);
  const current = Math.min(active, line.zones.length - 1);
  const isLast = current === line.zones.length - 1;
  const total = totalLength(line);
  const type = findById(LINE_TYPES, line.type);

  const setTaper = (key, value) => onChange({ ...line, taper: { ...line.taper, [key]: numberOr(value, line.taper[key]) } });
  const setZone = (patch) => onChange({ ...line, zones: line.zones.map((z, i) => (i === current ? { ...z, ...patch } : z)) });
  const addZone = () => {
    const zonesCopy = [...line.zones];
    zonesCopy.splice(zonesCopy.length - 1, 0, { length: 10, color: 'white' });
    onChange({ ...line, zones: zonesCopy });
    setActive(zonesCopy.length - 2);
  };
  const removeZone = () => {
    if (line.zones.length < 2) return;
    onChange({ ...line, zones: line.zones.filter((_, i) => i !== current) });
    setActive(Math.max(0, current - 1));
  };

  return (
    <section className="options-group">
      <h2>Fly line</h2>
      <label className="field">
        <span>Line</span>
        <select
          value={presetId}
          onChange={(e) => {
            setActive(0);
            onPreset(e.target.value);
          }}
        >
          {LINE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          {presetId === 'custom' && <option value="custom">Custom</option>}
        </select>
      </label>
      <div className="line-summary">
        <span className="line-summary__bar" aria-hidden="true">
          {zones.map((z, i) => (
            <span key={i} style={{ flexGrow: z.length, background: hexOf(z.color) }} />
          ))}
        </span>
        <span className="muted">
          {type?.name} · {line.weight} wt · <span className="mono">{formatFeet(total)}</span> · {zones.map((z) => nameOf(z.color).toLowerCase()).join(' / ')}
        </span>
      </div>

      <details className="line-details">
        <summary>Line details</summary>
        <div className="line-details__body">
          <div className="field-grid">
            <label className="field span-2">
              <span>Line type</span>
              <select value={line.type} onChange={(e) => onChange({ ...line, type: e.target.value })}>
                {LINE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Weight</span>
              <select value={line.weight} onChange={(e) => onChange({ ...line, weight: Number(e.target.value) })}>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
                  <option key={w} value={w}>
                    {w} wt
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="taper">
            <legend>
              Taper (ft) · total <span className="mono">{formatFeet(total)}</span>
            </legend>
            {[
              ['front', 'Front taper'],
              ['body', 'Body'],
              ['back', 'Back taper'],
              ['running', 'Running line'],
            ].map(([key, label]) => (
              <label key={key} className="field">
                <span>{label}</span>
                <input type="number" min="0" step="0.5" className="mono" value={line.taper[key]} onChange={(e) => setTaper(key, e.target.value)} />
              </label>
            ))}
          </fieldset>

          <div className="field">
            <span>Color zones, from the tip back</span>
            <div className="zone-tabs" role="tablist" aria-label="Color zones">
              {zones.map((z, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  className={`zone-tab${i === current ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="dot" style={{ background: hexOf(z.color) }} />
                  {i === 0 ? 'Tip' : i === zones.length - 1 ? 'Rest' : `Zone ${i + 1}`}
                  <span className="mono muted">{formatFeet(z.length)}</span>
                </button>
              ))}
              <button type="button" className="zone-add" onClick={addZone}>
                + Add zone
              </button>
            </div>
            <div className="zone-panel" role="tabpanel">
              <div className="zone-panel__row">
                <label className="field">
                  <span>Length (ft)</span>
                  {isLast ? (
                    <output className="mono">{formatFeet(zones[current].length)} (rest of line)</output>
                  ) : (
                    <input type="number" min="0" step="0.5" className="mono" value={line.zones[current].length} onChange={(e) => setZone({ length: numberOr(e.target.value, 0) })} />
                  )}
                </label>
                {line.zones.length > 1 && (
                  <button type="button" className="link-button" onClick={removeZone}>
                    Remove zone
                  </button>
                )}
              </div>
              <Swatches colors={LINE_COLORS} value={line.zones[current].color} onChange={(c) => setZone({ color: c })} label={`Zone ${current + 1} color`} />
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}

export function BackingOptions({ backing, lineType, onChange }) {
  const type = findById(LINE_TYPES, lineType);
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
      <div className="families">
        {BACKING_FAMILIES.map((f) => (
          <div key={f.id} className={`family${type?.family === f.id ? ' is-suggested' : ''}`}>
            <div className="family__label">
              <strong>{f.name}</strong>
              <span>{f.use}</span>
            </div>
            <Swatches colors={f.colors} value={backing.color} onChange={(c) => onChange({ ...backing, color: c })} label={`${f.name} backing colors`} marked={type?.suggested} />
          </div>
        ))}
      </div>
      <p className="hint">
        Highlighted row matches the line type ({type?.name}). Selected: {nameOf(backing.color)}.
      </p>
    </section>
  );
}
