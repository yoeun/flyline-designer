import { useEffect, useRef } from 'react';
import {
  BACKING_COLORS,
  BACKING_LENGTHS,
  LINE_PRESETS,
  LINE_TYPES,
  REEL_COLORS,
  REELS,
  findById,
  lineColorway,
  lineSwatches,
  makerGroups,
  nameOf,
  reelColors,
  withReelModel,
} from '../data/catalog.js';
import { totalLength, zoneRanges } from '../lib/geometry.js';
import { MIN_LENGTH, TAPER_NAMES, formatFeet, removeZone, setTaperLength, setZoneLength, splitZone, zoneName } from '../lib/lineEdit.js';
import LineEditor from './LineEditor.jsx';
import SearchableSelect from './SearchableSelect.jsx';
import Segmented from './Segmented.jsx';
import Swatches from './Swatches.jsx';

// Native select (keeps the OS menu, keyboard and mobile pickers) with our own chevron.
function Select(props) {
  return (
    <span className="select">
      <select {...props} />
      <span className="icon" aria-hidden="true">
        expand_more
      </span>
    </span>
  );
}

// Maker-grouped options for the searchable Model and Preset menus. The catalog is static, so build them once.
const toGroups = (groups, label) => groups.map(([maker, items]) => ({ label: maker, items: items.map((item) => ({ value: item.id, label: label(item) })) }));
const REEL_GROUPS = toGroups(makerGroups(REELS, 'Generic'), (r) => `${r.name} · ${r.rim} in`);
// Generic lines sort by weight; maker lines keep the catalog's product order.
const byWeight = (a, b) => a.line.weight - b.line.weight || a.name.localeCompare(b.name);
const presetGroups = makerGroups(LINE_PRESETS, 'Generic').map(([maker, presets]) => [maker, maker === 'Generic' ? [...presets].sort(byWeight) : presets]);
const PRESET_GROUPS = [...toGroups(presetGroups, (p) => p.name), { label: null, items: [{ value: 'custom', label: 'Custom' }] }];

const STRENGTHS = [20, 30].map((lb) => [lb, `${lb} lb`]);

const numberOr = (value, fallback) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function ReelOptions({ reel, onChange }) {
  const color = findById(REEL_COLORS, reel.color);
  return (
    <section className="options-group">
      <h2>Reel</h2>
      <SearchableSelect label="Model" groups={REEL_GROUPS} value={reel.model} onChange={(id) => onChange(withReelModel(reel, id))} placeholder="Search reels" />
      <div className="field">
        <span>Color · {color?.name}</span>
        <Swatches colors={reelColors(findById(REELS, reel.model))} value={reel.color} onChange={(c) => onChange({ ...reel, color: c })} label="Reel color" size={34} />
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
    <label className="field field--inline">
      <input type="number" min="0.5" step="0.5" className="mono" aria-label={label} value={value} onChange={(e) => onChange(numberOr(e.target.value, value))} />
      <span>ft</span>
    </label>
  );
}

function LineSelection({ line, selection, onChange, onSelect, colorLocked }) {
  if (!selection) return <p className="hint">Click part of the line to edit it.</p>;
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
  if (colorLocked) {
    return (
      <div className="line-selection">
        <div className="line-selection__head">
          <strong>{name}</strong>
          <span className="muted">
            {nameOf(zone.color)} · <span className="mono">{formatFeet(drawn)}</span>
          </span>
        </div>
        <p className="hint">Colors follow the maker's colorway. Choose Custom to recolor.</p>
      </div>
    );
  }
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
      <Swatches colors={lineSwatches(line)} value={zone.color} onChange={(c) => onChange({ ...line, zones: line.zones.map((z, i) => (i === index ? { ...z, color: c } : z)) })} label={`${name} color`} />
    </div>
  );
}

export function FlyLineOptions({ line, backingColor, presetId, onChange, onPreset, onColorway, selection, onSelect }) {
  const type = findById(LINE_TYPES, line.type);
  const locked = presetId !== 'custom';
  const preset = findById(LINE_PRESETS, presetId);
  const colorway = lineColorway(preset, line);
  const editRef = useRef(null);
  const selected = selection !== null;

  // Clicking anywhere outside the editor and its panel, or pressing Escape, clears the selection.
  useEffect(() => {
    if (!selected) return undefined;
    const onPointerDown = (e) => {
      if (!editRef.current?.contains(e.target)) onSelect(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onSelect(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selected, onSelect]);

  return (
    <section className="options-group">
      <h2>Fly line</h2>
      <div className="field-row">
        <SearchableSelect label="Preset" className="field field--grow" groups={PRESET_GROUPS} value={presetId} onChange={onPreset} placeholder="Search lines" />
        <label className="field field--grow">
          <span>Type</span>
          <Select value={line.type} disabled={locked} onChange={(e) => onChange({ ...line, type: e.target.value })}>
            {LINE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="field">
          <span>Weight</span>
          <Select value={line.weight} disabled={locked} onChange={(e) => onChange({ ...line, weight: Number(e.target.value) })}>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
              <option key={w} value={w}>
                {w} wt
              </option>
            ))}
          </Select>
        </label>
      </div>
      {preset?.colorways && (
        <label className="field">
          <span>Colorway</span>
          <Select value={colorway?.id} disabled={preset.colorways.length < 2} onChange={(e) => onColorway(findById(preset.colorways, e.target.value))}>
            {preset.colorways.map((cw) => (
              <option key={cw.id} value={cw.id}>
                {cw.name}
              </option>
            ))}
          </Select>
        </label>
      )}
      <div ref={editRef} className="line-edit">
        <LineEditor line={line} selection={selection} onSelect={onSelect} onChange={onChange} backingColor={backingColor} zonesLocked={Boolean(colorway)} />
        <LineSelection line={line} selection={selection} onChange={onChange} onSelect={onSelect} colorLocked={Boolean(colorway)} />
      </div>
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
        <div className="field">
          <span>Length</span>
          <div className="backing-controls">
            <Segmented label="Backing length" options={BACKING_LENGTHS.map((y) => [y, y])} value={backing.yards} onChange={(yards) => onChange({ ...backing, yards })} />
            <label className="field field--inline">
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
          </div>
        </div>
        <div className="field">
          <span>Strength</span>
          <Segmented label="Backing strength" options={STRENGTHS} value={backing.pounds} onChange={(pounds) => onChange({ ...backing, pounds })} />
        </div>
      </div>
      <div className="field">
        <span>Color · {nameOf(backing.color)}</span>
        <Swatches colors={BACKING_COLORS} value={backing.color} onChange={(c) => onChange({ ...backing, color: c })} label="Backing color" />
      </div>
    </section>
  );
}
