import { useRef, useState } from 'react';
import PHOTOS from 'reel-photos';
import { BACKING_COLORS, LINE_COLORS, REELS, REEL_MODELS, makerGroups, reelColors, reelSizeLabel, reelSizes } from '../data/catalog.js';
import { PREVIEW_COLORS, capacityText, photosByModel, previewSetup } from '../lib/reelsPage.js';
import { SIDES } from '../lib/reelFrames.js';
import { cn } from '@/lib/utils';
import Button from './Button.jsx';
import { CARD_LIFT, CARD_OUTLINE } from './cardHover.js';
import { CHIP } from './Chips.jsx';
import FlippingReelPreview from './FlippingReelPreview.jsx';
import Icon from './Icon.jsx';
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
// Makers A–Z; within a maker, current models before discontinued ones. The generic reels are the
// designer's stand-ins, not real reels, so they're left out.
const GROUPS = makerGroups(REEL_MODELS, 'Generic')
  .filter(([maker]) => maker !== 'Generic')
  .map(([maker, models]) => [maker, [...models.filter((m) => !m.discontinued), ...models.filter((m) => m.discontinued)]]);
const ALL_MODELS = GROUPS.flatMap(([, models]) => models);

// One model: a stage with the size picker at the top left and Drag/Spool at the top right, the reel
// drawn to the page's scale, and the finishes along the bottom; the size's numbers below. `view` is the
// page-wide line colors: { backing, head, running }. New setup opens the designer on the
// size and finish picked here.
function ModelCard({ model, view, onNewSetup }) {
  const sizes = reelSizes(model.id);
  const colors = reelColors(model);
  const [sizeId, setSizeId] = useState(sizes[0].id);
  const [side, setSide] = useState('drag');
  const [color, setColor] = useState(colors[0].id);
  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const setup = previewSetup(size, color, view);
  // The size's specs as table rows; the line the drawing assumes is for checking drawings, so dev only.
  const specs = [
    ['Rim', `${size.rim}″`],
    ['Spool', `${size.spool}″`],
    ['Width', `${size.width}″`],
    size.rated ? ['Capacity', capacityText(size)] : size.arbor && ['Arbor', `${size.arbor}″`],
    import.meta.env.DEV && ['Drawn with', `WF${setup.line.weight}F + ${setup.backing.yards} yd of ${setup.backing.pounds} lb`],
  ].filter(Boolean);
  const photos = PHOTOS_BY_MODEL[model.id] ?? [];
  return (
    <li className={cn('flex min-w-0 flex-col gap-3 rounded-card border border-border bg-card p-4', CARD_LIFT, CARD_OUTLINE)}>
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
            <FlippingReelPreview setup={setup} side={side} background="none" title={size.name} />
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

// A labelled row of the filter bar: the label in a fixed column, its control beside it.
function Row({ label, className, labelClassName, children }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <span className={cn('w-24 flex-none text-[13px] font-semibold text-muted-foreground', labelClassName)}>{label}</span>
      {children}
    </div>
  );
}

// The line colors every reel is drawn with: backing, then running line, then head.
function ColorRows({ view, onChange }) {
  const set = (key) => (id) => onChange({ ...view, [key]: id });
  return (
    <>
      <Row label="Backing">
        <Swatches colors={BACKING_COLORS} value={view.backing} onChange={set('backing')} label="Backing color" size={22} />
      </Row>
      <Row label="Running line">
        <Swatches colors={LINE_COLORS} value={view.running} onChange={set('running')} label="Running line color" size={22} />
      </Row>
      <Row label="Head">
        <Swatches colors={LINE_COLORS} value={view.head} onChange={set('head')} label="Head color" size={22} />
      </Row>
    </>
  );
}

export default function ReelsPage({ onNewSetup }) {
  const [view, setView] = useState(PREVIEW_COLORS);
  // The maker shown, or null for all of them.
  const [maker, setMaker] = useState(null);
  const groups = maker ? GROUPS.filter(([m]) => m === maker) : GROUPS;
  // A new maker starts at the top of the list rather than wherever the last one was scrolled to.
  const listRef = useRef(null);
  const pickMaker = (m) => {
    setMaker(m);
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) window.scrollTo({ top: 0 });
  };
  // What the View button says once the view differs from the default.
  const active = view !== PREVIEW_COLORS ? 'Custom colors' : '';
  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Reels">
      {/* The title, the maker filter and, from sm up, the line colors stay in a bar under the fixed header while
          the reels scroll. On phones the chips are one row that scrolls sideways, so the bar stays short. */}
      <div className="sticky top-(--header-h) z-10 -mx-[max(16px,2.5vw)] -mt-6 flex flex-col gap-2.5 border-b border-border bg-background/95 px-[max(16px,2.5vw)] pt-4 pb-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-[20px] font-bold tracking-[0.06em] uppercase">Reels</h2>
          {/* On phones the line colors open in a sheet instead of a bar over the reels. */}
          <FilterSheet title="View" icon="tune" active={active} onClear={() => setView(PREVIEW_COLORS)} clearLabel="Reset">
            <ColorRows view={view} onChange={setView} />
          </FilterSheet>
        </div>
        {/* Pick one maker, or All; picking the chosen maker again goes back to All. Each chip says how many models it holds. */}
        <Row label="Brand" className="-mr-[max(16px,2.5vw)] sm:mr-0" labelClassName="max-sm:hidden self-start pt-2 pointer-coarse:pt-3">
          <div role="group" aria-label="Brand" className="flex min-w-0 gap-2 overflow-x-auto pr-[max(16px,2.5vw)] sm:flex-wrap sm:overflow-visible sm:pr-0">
            {[[null, ALL_MODELS], ...GROUPS].map(([m, models]) => (
              <button key={m ?? 'all'} type="button" aria-pressed={maker === m} onClick={() => pickMaker(maker === m ? null : m)} className={cn(CHIP, 'group inline-flex flex-none items-center gap-1.5 font-semibold')}>
                {m ?? 'All'}
                <span className="text-[12px] font-normal text-muted-foreground group-aria-pressed:text-primary-foreground/80">{models.length}</span>
              </button>
            ))}
          </div>
        </Row>
        <div className="hidden flex-col gap-2.5 sm:flex">
          <ColorRows view={view} onChange={setView} />
        </div>
      </div>
      <div ref={listRef} className="flex flex-col gap-5">
        {groups.map(([group, models]) => (
          <section key={group} className="flex flex-col gap-3" aria-label={group}>
            <h3 className={heading}>{group}</h3>
            {/* Cards in equal columns, so every drawing area is the same size and the scale holds across them. */}
            <ul className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
              {models.map((m) => (
                <ModelCard key={m.id} model={m} view={view} onNewSetup={onNewSetup} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
