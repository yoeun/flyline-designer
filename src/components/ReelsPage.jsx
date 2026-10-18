import { useState } from 'react';
import PHOTOS from 'reel-photos';
import { BACKING_COLORS, LINE_COLORS, REELS, REEL_MODELS, makerGroups, reelColors, reelSizeLabel, reelSizes } from '../data/catalog.js';
import { PREVIEW_COLORS, capacityText, photosByModel, previewSetup } from '../lib/reelsPage.js';
import { SIDES } from '../lib/reelFrames.js';
import Button from './Button.jsx';
import Field from './Field.jsx';
import Icon from './Icon.jsx';
import ReelPreview from './ReelPreview.jsx';
import Segmented from './Segmented.jsx';
import Select from './Select.jsx';
import Swatches from './Swatches.jsx';
import FilterSheet from './FilterSheet.jsx';

// Every reel model on one page, one large drawing each: pick the size, the side and the finish on the
// drawing itself. Drawings share one scale across the page, so a bigger reel draws bigger, both between
// a model's sizes and between models. In dev, the maker photos sit below.
const MAX_RIM = Math.max(...REELS.map((r) => r.rim));
// The drawing area fits the largest reel; ReelPreview's rim spans 400 of its 430 units across, 470 down.
const AREA_RATIO = '430 / 470';

const heading = 'font-heading text-[15px] font-bold tracking-[0.06em] uppercase';
const PHOTOS_BY_MODEL = photosByModel(REEL_MODELS, PHOTOS);
// Makers A–Z, generic last; within a maker, current models before discontinued ones.
const GROUPS = makerGroups(REEL_MODELS, 'Generic').map(([maker, models]) => [maker, [...models.filter((m) => !m.discontinued), ...models.filter((m) => m.discontinued)]]);

const LINE_OPTIONS = [
  ['shown', 'Line'],
  ['hidden', 'Empty'],
];

// One model: a stage with the size picker at the top left and Drag/Spool at the top right, the reel
// drawn to the page's scale, and the finishes along the bottom; the size's numbers below. `view` is the
// page-wide drawing settings: { line: 'shown' | 'hidden', colors }. New setup opens the designer on the
// size and finish picked here.
function ModelCard({ model, view, onNewSetup }) {
  const sizes = reelSizes(model.id);
  const colors = reelColors(model);
  const [sizeId, setSizeId] = useState(sizes[0].id);
  const [side, setSide] = useState('drag');
  const [color, setColor] = useState(colors[0].id);
  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const setup = previewSetup(size, color, view.colors);
  const showLine = view.line === 'shown';
  // The size's specs as table rows; the line the drawing assumes is for checking drawings, so dev only.
  const specs = [
    ['Rim', `${size.rim}″`],
    ['Spool', `${size.spool}″`],
    ['Width', `${size.width}″`],
    size.rated ? ['Capacity', capacityText(size)] : size.arbor && ['Arbor', `${size.arbor}″`],
    import.meta.env.DEV && showLine && ['Drawn with', `WF${setup.line.weight}F + 100 yd`],
  ].filter(Boolean);
  const photos = PHOTOS_BY_MODEL[model.id] ?? [];
  return (
    <li className="flex min-w-0 flex-col gap-3 rounded-card border border-border bg-card p-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="text-[17px] leading-tight font-bold">{model.name}</h4>
            {model.discontinued && <span className="rounded-full border border-warn-border bg-warn-bg px-2 py-0.5 text-[12px] font-semibold text-warn">Discontinued</span>}
          </div>
          <Button className="-my-1 flex-none gap-1 pl-2.5 font-semibold" onClick={() => onNewSetup(setup.reel)} aria-label={`New setup on ${size.name}`}>
            <Icon name="add" />
            New setup
          </Button>
        </div>
        {/* The catalog id and drawing design, for checking the data; like the photos, only on the dev server. */}
        {import.meta.env.DEV && (
          <p className="font-mono text-[12px] text-muted-foreground">
            {model.id} · design {model.design}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-panel bg-stage p-3 text-stage-foreground">
        <div className="flex items-start justify-between gap-2">
          {sizes.length > 1 ? (
            <Select
              label={`${model.name} size`}
              labelHidden
              items={sizes.map((s) => ({ value: s.id, label: reelSizeLabel(s) }))}
              value={size.id}
              onChange={setSizeId}
              // Closed, it shows just the weights ("3/4/5 wt") so it fits beside Drag/Spool on a small phone.
              valueLabel={(id) => reelSizeLabel(sizes.find((s) => s.id === id) ?? size).replace(/\s*\(.*\)$/, '')}
              triggerClassName="w-auto max-w-full rounded-lg"
            />
          ) : (
            <span className="self-center text-[14px] font-semibold">{reelSizeLabel(size)}</span>
          )}
          <Segmented label="Reel side" options={SIDES} value={side} onChange={setSide} />
        </div>
        <div className="flex items-center justify-center" style={{ aspectRatio: AREA_RATIO }}>
          <span className="block" style={{ width: `${(size.rim / MAX_RIM) * 100}%` }}>
            <ReelPreview setup={setup} side={side} showLine={showLine} background="none" title={`${size.name}, ${side} side`} />
          </span>
        </div>
        {colors.length > 1 && <Swatches colors={colors} value={color} onChange={setColor} label={`${model.name} color`} size={24} touchSize={32} className="justify-center gap-3" />}
      </div>
      <table className="w-full border-collapse text-[14px] tabular-nums">
        <caption className="sr-only">{`${size.name} specs`}</caption>
        <tbody>
          {specs.map(([label, value]) => (
            <tr key={label} className="border-b border-border last:border-0">
              <th scope="row" className="w-24 py-1.5 pr-3 text-left font-normal text-muted-foreground">
                {label}
              </th>
              <td className="py-1.5">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {photos.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Maker photos">
          {photos.map((p) => (
            <li key={p.file}>
              <a href={p.url} target="_blank" rel="noreferrer" title={p.file}>
                <img src={p.url} alt={p.file} loading="lazy" className="h-32 w-auto rounded-md border border-border bg-white object-contain" />
              </a>
            </li>
          ))}
        </ul>
      )}
      {/* Research notes on where the numbers came from, folded away until asked for. */}
      {model.notes && (
        <details className="text-[14px]">
          <summary className="min-h-9 cursor-pointer py-1.5 font-semibold text-primary pointer-coarse:py-2.5">Research notes</summary>
          <p className="text-[13px] text-muted-foreground">{model.notes}</p>
        </details>
      )}
    </li>
  );
}

// The page-wide controls: line on or off, and the backing, head and running line colors.
function ViewControls({ view, onChange }) {
  const setColor = (key) => (id) => onChange({ ...view, colors: { ...view.colors, [key]: id } });
  const shown = view.line === 'shown';
  return (
    <>
      <Segmented label="Line" options={LINE_OPTIONS} value={view.line} onChange={(line) => onChange({ ...view, line })} />
      {shown && (
        <>
          <Field label="Backing">
            <Swatches colors={BACKING_COLORS} value={view.colors.backing} onChange={setColor('backing')} label="Backing color" size={22} />
          </Field>
          <Field label="Head">
            <Swatches colors={LINE_COLORS} value={view.colors.head} onChange={setColor('head')} label="Head color" size={22} />
          </Field>
          <Field label="Running line">
            <Swatches colors={LINE_COLORS} value={view.colors.running} onChange={setColor('running')} label="Running line color" size={22} />
          </Field>
        </>
      )}
    </>
  );
}

const DEFAULT_VIEW = { line: 'shown', colors: PREVIEW_COLORS };

export default function ReelsPage({ onNewSetup }) {
  const [view, setView] = useState(DEFAULT_VIEW);
  // What the View button says once the view differs from the default.
  const active = view.line !== 'shown' ? 'Line hidden' : view.colors !== PREVIEW_COLORS ? 'Custom colors' : '';
  const count = REEL_MODELS.reduce((n, m) => n + reelSizes(m.id).length, 0);
  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Reels">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-heading text-[20px] font-bold tracking-[0.06em] uppercase">Reels</h2>
          <p className="text-[14px] text-muted-foreground">
            {REEL_MODELS.length} models, {count} sizes, drawn to scale
          </p>
        </div>
        {/* On phones the line and colors open in a sheet instead of a bar over the reels. */}
        <FilterSheet title="View" icon="tune" active={active} onClear={() => setView(DEFAULT_VIEW)} clearLabel="Reset">
          <ViewControls view={view} onChange={setView} />
        </FilterSheet>
      </div>
      {/* From sm up the controls stay in a bar under the fixed header while the reels scroll. */}
      <div className="sticky top-(--header-h) z-10 -mx-[max(16px,2.5vw)] hidden flex-wrap items-end gap-x-6 gap-y-3 border-b border-border bg-background/95 px-[max(16px,2.5vw)] py-3 backdrop-blur sm:flex">
        <ViewControls view={view} onChange={setView} />
      </div>
      {/* Maker chips that jump to each maker's reels, styled like the app's filter chips so they read as controls. */}
      <nav aria-label="Makers" className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px] font-semibold text-muted-foreground">Jump to</span>
        {GROUPS.map(([maker, models]) => (
          <a
            key={maker}
            href={`#reels-${maker}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-input bg-card px-3.5 text-[14px] font-semibold hover:border-primary hover:text-primary pointer-coarse:min-h-11 pointer-coarse:px-4"
          >
            {maker}
            <span className="text-[12px] font-normal text-muted-foreground">{models.length}</span>
          </a>
        ))}
      </nav>
      {GROUPS.map(([maker, models]) => (
        <section key={maker} id={`reels-${maker}`} className="flex scroll-mt-[calc(var(--header-h)+1rem)] flex-col gap-3 sm:scroll-mt-[calc(var(--header-h)+9rem)]" aria-label={maker}>
          <h3 className={heading}>{maker}</h3>
          {/* Cards in equal columns, so every drawing area is the same size and the scale holds across them. */}
          <ul className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
            {models.map((m) => (
              <ModelCard key={m.id} model={m} view={view} onNewSetup={onNewSetup} />
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
