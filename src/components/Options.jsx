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
import { zoneRanges } from '../lib/geometry.js';
import { MIN_LENGTH, TAPER_NAMES, formatFeet, removeZone, setTaperLength, setZoneLength, splitZone, zoneName } from '../lib/lineEdit.js';
import Button from './Button.jsx';
import Field from './Field.jsx';
import Icon from './Icon.jsx';
import { NumberInput } from './Input.jsx';
import LineEditor from './LineEditor.jsx';
import SearchableSelect from './SearchableSelect.jsx';
import Segmented from './Segmented.jsx';
import Select from './Select.jsx';
import Swatches from './Swatches.jsx';

const GROUP = 'flex flex-col gap-3.5 px-5.5 py-5';
const HEADING = 'font-heading text-[20px] leading-[normal] font-bold tracking-[0.06em] uppercase';

// A section's title, with an orange dot and a Reset button once it differs from the saved setup.
function SectionHeading({ title, changed, onReset }) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <h2 className={HEADING}>{title}</h2>
        {changed && <span className="size-2 rounded-full bg-orange-500" role="img" aria-label="Changed" />}
      </div>
      {changed && (
        <Button variant="ghost" className="-my-1 h-8 gap-1 px-2 text-[14px] text-muted-foreground" onClick={onReset} aria-label={`Reset ${title.toLowerCase()}`}>
          <Icon name="restart_alt" />
          Reset
        </Button>
      )}
    </div>
  );
}

const HINT = 'text-[13px] text-muted-foreground';
const MONO = 'font-mono tabular-nums';

// Maker-grouped options for the searchable Model and Preset menus. The catalog is static, so build them once.
const toGroups = (groups, label) => groups.map(([maker, items]) => ({ label: maker, items: items.map((item) => ({ value: item.id, label: label(item) })) }));
const REEL_GROUPS = toGroups(makerGroups(REELS, 'Generic'), (r) => r.name);
// Generic lines sort by weight; maker lines keep the catalog's product order.
const byWeight = (a, b) => a.line.weight - b.line.weight || a.name.localeCompare(b.name);
const presetGroups = makerGroups(LINE_PRESETS, 'Generic').map(([maker, presets]) => [maker, maker === 'Generic' ? [...presets].sort(byWeight) : presets]);
const PRESET_GROUPS = [...toGroups(presetGroups, (p) => p.name), { label: null, items: [{ value: 'custom', label: 'Custom' }] }];

const STRENGTHS = [20, 30].map((lb) => [lb, `${lb} lb`]);
const TYPE_ITEMS = LINE_TYPES.map((t) => ({ value: t.id, label: t.name }));
const WEIGHT_ITEMS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => ({ value: w, label: `${w} wt` }));

const numberOr = (value, fallback) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function ReelOptions({ reel, onChange, changed, onReset }) {
  const color = findById(REEL_COLORS, reel.color);
  return (
    <section className={GROUP}>
      <SectionHeading title="Reel" changed={changed} onReset={onReset} />
      <SearchableSelect label="Model" groups={REEL_GROUPS} value={reel.model} onChange={(id) => onChange(withReelModel(reel, id))} placeholder="Search reels" />
      <Field label={`Color · ${color?.name}`}>
        <Swatches colors={reelColors(findById(REELS, reel.model))} value={reel.color} onChange={(c) => onChange({ ...reel, color: c })} label="Reel color" size={34} />
      </Field>
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
  return <NumberInput label={label} unit="ft" min="0.5" step="0.5" className="w-full max-w-[90px]" value={value} onChange={(e) => onChange(numberOr(e.target.value, value))} />;
}

const SELECTION = 'flex flex-col gap-3 rounded-lg bg-secondary p-3';
const SELECTION_HEAD = 'flex flex-wrap items-center gap-2.5 text-[14px]';

function LineSelection({ line, selection, onChange, onSelect, colorLocked }) {
  if (!selection) return null;
  if (selection.kind === 'taper') {
    const { key } = selection;
    return (
      <div className={SELECTION}>
        <div className={SELECTION_HEAD}>
          <strong>{TAPER_NAMES[key]}</strong>
          <LengthField label={`${TAPER_NAMES[key]} length in feet`} value={line.taper[key]} onChange={(ft) => onChange(setTaperLength(line, key, ft))} />
          <span className="text-muted-foreground">{TAPER_HINTS[key]}</span>
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
      <div className={SELECTION}>
        <div className={SELECTION_HEAD}>
          <strong>{name}</strong>
          <span className="text-muted-foreground">
            {nameOf(zone.color)} · <span className={MONO}>{formatFeet(drawn)}</span>
          </span>
        </div>
        <p className={HINT}>Colors follow the maker's colorway. Choose Custom to recolor.</p>
      </div>
    );
  }
  return (
    <div className={SELECTION}>
      <div className={SELECTION_HEAD}>
        <strong>{name}</strong>
        {index === count - 1 ? (
          <span className="text-muted-foreground">
            <span className={MONO}>{formatFeet(drawn)}</span> · rest of line
          </span>
        ) : (
          <LengthField label={`${name} length in feet`} value={zone.length} onChange={(ft) => onChange(setZoneLength(line, index, ft))} />
        )}
        <span className="ml-auto flex gap-3.5">
          <Button variant="link" disabled={drawn < 2 * MIN_LENGTH} onClick={() => onChange(splitZone(line, index))}>
            Split
          </Button>
          <Button
            variant="link"
            disabled={count < 2}
            onClick={() => {
              onChange(removeZone(line, index));
              onSelect({ kind: 'zone', index: Math.min(index, count - 2) });
            }}
          >
            Remove
          </Button>
        </span>
      </div>
      <Swatches colors={lineSwatches(line)} value={zone.color} onChange={(c) => onChange({ ...line, zones: line.zones.map((z, i) => (i === index ? { ...z, color: c } : z)) })} label={`${name} color`} />
    </div>
  );
}

export function FlyLineOptions({ line, backingColor, presetId, onChange, onPreset, onColorway, selection, onSelect, changed, onReset }) {
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
    <section className={GROUP}>
      <SectionHeading title="Fly line" changed={changed} onReset={onReset} />
      <div className="flex flex-wrap gap-2.5">
        <SearchableSelect label="Preset" grow groups={PRESET_GROUPS} value={presetId} onChange={onPreset} placeholder="Search lines" />
        <Select label="Type" grow items={TYPE_ITEMS} value={line.type} disabled={locked} onChange={(type) => onChange({ ...line, type })} />
        <Select label="Weight" items={WEIGHT_ITEMS} value={line.weight} disabled={locked} onChange={(weight) => onChange({ ...line, weight })} triggerClassName="w-[85px]" />
      </div>
      {preset?.colorways && (
        <Select
          label="Colorway"
          items={preset.colorways.map((cw) => ({ value: cw.id, label: cw.name }))}
          value={colorway?.id ?? null}
          disabled={preset.colorways.length < 2}
          onChange={(id) => onColorway(findById(preset.colorways, id))}
        />
      )}
      <div ref={editRef} className="flex flex-col gap-3.5">
        <LineEditor line={line} selection={selection} onSelect={onSelect} onChange={onChange} backingColor={backingColor} zonesLocked={Boolean(colorway)} />
        <LineSelection line={line} selection={selection} onChange={onChange} onSelect={onSelect} colorLocked={Boolean(colorway)} />
      </div>
      {locked && <p className={HINT}>Choose Custom to change type or weight.</p>}
    </section>
  );
}

export function BackingOptions({ backing, onChange, changed, onReset }) {
  return (
    <section className={GROUP}>
      <SectionHeading title="Backing" changed={changed} onReset={onReset} />
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2.5">
        <Field label="Length">
          <div className="flex flex-wrap items-center gap-2.5">
            <Segmented label="Backing length" options={BACKING_LENGTHS.map((y) => [y, y])} value={backing.yards} onChange={(yards) => onChange({ ...backing, yards })} />
            <NumberInput
              label="Backing length in yards"
              unit="yd"
              min="0"
              step="10"
              className="w-20"
              value={backing.yards}
              onChange={(e) => onChange({ ...backing, yards: numberOr(e.target.value, backing.yards) })}
            />
          </div>
        </Field>
        <Field label="Strength">
          <Segmented label="Backing strength" options={STRENGTHS} value={backing.pounds} onChange={(pounds) => onChange({ ...backing, pounds })} />
        </Field>
      </div>
      <Field label={`Color · ${nameOf(backing.color)}`}>
        <Swatches colors={BACKING_COLORS} value={backing.color} onChange={(c) => onChange({ ...backing, color: c })} label="Backing color" />
      </Field>
    </section>
  );
}
