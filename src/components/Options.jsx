import { useEffect, useRef } from 'react';
import {
  BACKING_COLORS,
  BACKING_LENGTHS,
  LINE_PRESETS,
  LINE_TYPES,
  REEL_COLORS,
  REEL_MODELS,
  REELS,
  findById,
  lineColorway,
  lineMenu,
  lineSwatches,
  makerGroups,
  menuId,
  nameOf,
  reelColors,
  reelMenu,
  reelSizeLabel,
  reelSizes,
  switchReelModel,
  weightMenu,
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
// `children` sit beside the title, for a link that belongs to the section.
function SectionHeading({ title, changed, onReset, children }) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <h2 className={HEADING}>{title}</h2>
        {changed && <span className="size-2 rounded-full bg-orange-500" role="img" aria-label="Changed" />}
        {children}
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
const toGroups = (groups, label) => groups.map(([maker, items]) => ({ label: maker, items: items.map((item) => ({ value: item.id, label: label(item), disabled: item.disabled })) }));
// One entry per reel model; its sizes are picked under Size.
const REEL_GROUPS = toGroups(makerGroups(reelMenu(REEL_MODELS), 'Generic'), (m) => m.name);
// One entry per maker product; its sizes are picked under Weight. Lines the reel takes no size of
// are disabled and go last. Generic lines sort by weight; maker lines keep the catalog's product order.
const byWeight = (a, b) => Boolean(a.disabled) - Boolean(b.disabled) || a.line.weight - b.line.weight || a.name.localeCompare(b.name);
// Built once per reel size, as the reel decides which lines are disabled.
const presetGroupsByReel = new Map();
function presetGroups(reel) {
  if (!presetGroupsByReel.has(reel?.id)) {
    const groups = makerGroups(lineMenu(LINE_PRESETS, reel), 'Generic').map(([maker, presets]) => [maker, maker === 'Generic' ? [...presets].sort(byWeight) : presets]);
    presetGroupsByReel.set(reel?.id, [...toGroups(groups, (p) => p.name), { label: null, items: [{ value: 'custom', label: 'Custom' }] }]);
  }
  return presetGroupsByReel.get(reel?.id);
}

const STRENGTHS = [20, 30].map((lb) => [lb, `${lb} lb`]);
const TYPE_ITEMS = LINE_TYPES.map((t) => ({ value: t.id, label: t.name }));

const numberOr = (value, fallback) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

// `weight` is the line's, so a new model lands on a size that suits it.
export function ReelOptions({ reel, weight, onChange, changed, onReset }) {
  const color = findById(REEL_COLORS, reel.color);
  const size = findById(REELS, reel.model);
  const sizes = reelSizes(size?.product);
  return (
    <section className={GROUP}>
      <SectionHeading title="Reel" changed={changed} onReset={onReset} />
      <div className="flex flex-wrap gap-2.5">
        <SearchableSelect label="Model" grow groups={REEL_GROUPS} value={size?.product} onChange={(id) => onChange(switchReelModel(reel, id, weight))} placeholder="Search reels" />
        <Select key={size?.product} label="Size" items={sizes.map((s) => ({ value: s.id, label: reelSizeLabel(s) }))} value={reel.model} disabled={sizes.length < 2} onChange={(id) => onChange(withReelModel(reel, id))} triggerClassName="w-auto min-w-[110px]" />
      </div>
      <Field label={`Color · ${color?.name}`}>
        <Swatches colors={reelColors(size)} value={reel.color} onChange={(c) => onChange({ ...reel, color: c })} label="Reel color" size={34} />
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

// `reel` is the reel size, which limits the weights on offer.
export function FlyLineOptions({ line, reel, backingColor, presetId, onChange, onPreset, onColorway, selection, onSelect, changed, onReset, onOpenGuide }) {
  const locked = presetId !== 'custom';
  const preset = findById(LINE_PRESETS, presetId);
  const colorway = lineColorway(preset, line);
  // A maker line's weights are the sizes its product is sold in; picking one switches preset. Either
  // way only weights the reel takes are offered, plus the line's own if a loaded setup has another.
  const sizes = preset?.product ? weightMenu(reel, line, presetId) : null;
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
      <SectionHeading title="Fly line" changed={changed} onReset={onReset}>
        <Button variant="link" className="ml-1.5 gap-1 py-0" onClick={onOpenGuide}>
          <Icon name="menu_book" />
          Line guide
        </Button>
      </SectionHeading>
      <div className="flex flex-wrap gap-2.5">
        <SearchableSelect label="Preset" grow groups={presetGroups(reel)} value={menuId(presetId)} onChange={onPreset} placeholder="Search lines" />
        <Select label="Type" grow items={TYPE_ITEMS} value={line.type} disabled={locked} onChange={(type) => onChange({ ...line, type })} />
        {sizes ? (
          <Select key={`${preset.product} ${reel?.id}`} label="Weight" items={sizes} value={presetId} disabled={sizes.length < 2} onChange={onPreset} triggerClassName="w-auto min-w-[85px]" />
        ) : (
          <Select key={reel?.id} label="Weight" items={weightMenu(reel, line, presetId)} value={line.weight} disabled={locked} onChange={(weight) => onChange({ ...line, weight })} triggerClassName="w-[85px]" />
        )}
      </div>
      {/* Keyed so a new preset's selects start fresh: kept mounted, the select reports the old value back. */}
      {preset?.colorways && (
        <Select
          key={preset.id}
          label="Colorway"
          items={preset.colorways.map((cw) => ({ value: cw.id, label: cw.name }))}
          value={colorway?.id ?? null}
          disabled={preset.colorways.length < 2}
          onChange={(id) => {
            const cw = findById(preset.colorways, id);
            if (cw) onColorway(cw);
          }}
        />
      )}
      <div ref={editRef} className="flex flex-col gap-3.5">
        <LineEditor line={line} selection={selection} onSelect={onSelect} onChange={onChange} backingColor={backingColor} zonesLocked={Boolean(colorway)} />
        <LineSelection line={line} selection={selection} onChange={onChange} onSelect={onSelect} colorLocked={Boolean(colorway)} />
      </div>
      {preset?.estimated && <p className={HINT}>Taper split estimated from the maker's published head length.</p>}
      {locked && <p className={HINT}>{sizes ? 'Choose Custom to change type, taper or colors.' : 'Choose Custom to change type or weight.'}</p>}
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
