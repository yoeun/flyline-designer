import { useRef, useState } from 'react';
import PHOTOS from 'reel-photos';
import { BACKING_COLORS, LINE_COLORS, REELS, REEL_MODELS, makerGroups, reelColors, reelSizeLabel, reelSizes } from '../data/catalog.js';
import { GROUP_HEADING, PAGE_BAR, usePageBar } from '../lib/pageBar.js';
import { NO_REELS_FILTER, PREVIEW_COLORS, capacityText, photosByModel, previewSetup, scrollToFit } from '../lib/reelsPage.js';
import { cn } from '@/lib/utils';
import Button from './Button.jsx';
import { CARD_GROW, CARD_OUTLINE } from './cardHover.js';
import { CHIP } from './Chips.jsx';
import FlippingReelPreview from './FlippingReelPreview.jsx';
import Icon from './Icon.jsx';
import ReelSideToggle from './ReelSideToggle.jsx';
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

// Reels drawn wound with line, or empty: empty shows both flanges' bars and the far side through the windows, to
// check a drawing against a maker's empty product photos.
const LINE_OPTIONS = [
  ['shown', 'Line'],
  ['hidden', 'Empty'],
];

// One model: a stage with the size picker at the top left and Drag/Spool at the top right, the reel
// drawn to the page's scale, and the finishes along the bottom; the size's numbers below. `view` is the
// page-wide line colors: { backing, head, running }, and `showLine` whether the reel is drawn with line. New setup opens the designer on the
// size and finish picked here. A click anywhere on the card hands it to `onReveal`, to scroll it into view.
// `shown` is the size, finish and side to open on (any of them null for the first); `onPick`, where given,
// hears each change to them, so the page can keep them in its URL. `onOnly` shows just this model, as it is.
function ModelCard({ model, view, showLine, onNewSetup, onReveal, shown = {}, onPick, onOnly }) {
  const sizes = reelSizes(model.id);
  const colors = reelColors(model);
  const [sizeId, setSizeId] = useState(shown.size ?? sizes[0].id);
  const [side, setSide] = useState(shown.side ?? 'drag');
  const [spins, setSpins] = useState(0);
  const [color, setColor] = useState(shown.color ?? colors[0].id);
  const pick = (set, key) => (value) => {
    set(value);
    onPick?.({ [key]: value });
  };
  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const setup = previewSetup(size, color, view);
  // The size's specs as table rows; the line the drawing assumes is for checking drawings, so dev only.
  const specs = [
    ['Rim', `${size.rim}″`],
    ['Spool', `${size.spool}″`],
    ['Width', `${size.width}″`],
    size.rated ? ['Capacity', capacityText(size)] : size.arbor && ['Arbor', `${size.arbor}″`],
    import.meta.env.DEV && showLine && ['Drawn with', `WF${setup.line.weight}F + ${setup.backing.yards} yd of ${setup.backing.pounds} lb`],
  ].filter(Boolean);
  const photos = PHOTOS_BY_MODEL[model.id] ?? [];
  return (
    <li className={cn('flex min-w-0 flex-col gap-3 rounded-card border border-border bg-card p-4', CARD_GROW, 'hover:shadow-sm motion-safe:hover:scale-[1.005]', CARD_OUTLINE)} onClick={(e) => onReveal(e.currentTarget)}>
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
            {/* The id shows just this model, so its URL opens straight on it. */}
            <button type="button" className="underline-offset-2 hover:underline" onClick={() => onOnly({ size: sizeId, color, side })} title="Show only this model">
              {model.id}
            </button>{' '}
            · design {model.design}
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
              onChange={pick(setSizeId, 'size')}
              // Closed, it shows just the weights ("3/4/5 wt") so it fits beside Drag/Spool on a small phone.
              valueLabel={(id) => reelSizeLabel(sizes.find((s) => s.id === id) ?? size).replace(/\s*\(.*\)$/, '')}
              triggerClassName="w-auto max-w-full rounded-lg"
            />
          ) : (
            <span className="self-center text-[14px] font-semibold">{reelSizeLabel(size)}</span>
          )}
          <ReelSideToggle side={side} onChange={pick(setSide, 'side')} onSpin={() => setSpins((n) => n + 1)} />
        </div>
        <div className="flex items-center justify-center" style={{ aspectRatio: AREA_RATIO }}>
          <span className="block" style={{ width: `${(size.rim / MAX_RIM) * 100}%` }}>
            <FlippingReelPreview setup={setup} side={side} spins={spins} showLine={showLine} background="none" title={size.name} />
          </span>
        </div>
        {colors.length > 1 && <Swatches colors={colors} value={color} onChange={pick(setColor, 'color')} label={`${model.name} color`} size={24} touchSize={32} className="justify-center gap-3" />}
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

// Line or empty, then, with line, the colors every reel is drawn with: backing, then running line, then head.
function ViewRows({ line, onLineChange, view, onChange }) {
  const set = (key) => (id) => onChange({ ...view, [key]: id });
  return (
    <>
      <Row label="Line">
        <Segmented label="Line" options={LINE_OPTIONS} value={line} onChange={onLineChange} />
      </Row>
      {line === 'shown' && <ColorRows view={view} set={set} />}
    </>
  );
}

function ColorRows({ view, set }) {
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

// `filter` is what the page's URL asks for (see reelsFilterFromQuery): a maker, or just some models, and for a
// single model the size, finish and side its card shows. Picks on the page go back through `onFilterChange`.
export default function ReelsPage({ onNewSetup, filter = NO_REELS_FILTER, onFilterChange }) {
  const [view, setView] = useState(PREVIEW_COLORS);
  const [line, setLine] = useState('shown');
  // The maker shown, or null for all of them; or, overriding it, just the models the URL names.
  const maker = filter.brand;
  const groups = filter.models.length
    ? GROUPS.map(([m, models]) => [m, models.filter((model) => filter.models.includes(model.id))]).filter(([, models]) => models.length)
    : maker
      ? GROUPS.filter(([m]) => m === maker)
      : GROUPS;
  const only = filter.models.length === 1 ? filter.models[0] : null;
  // A new filter starts at the top of the list rather than wherever the last one was scrolled to.
  const listRef = useRef(null);
  const refilter = (next) => {
    onFilterChange({ ...NO_REELS_FILTER, ...next });
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) window.scrollTo({ top: 0 });
  };
  const pickMaker = (m) => refilter({ brand: m });
  // A clicked card that's cut off, under the filter bar and its maker's heading or past the bottom of the
  // screen, scrolls fully into view.
  const barRef = usePageBar();
  const reveal = (card) => {
    const top = card.closest('section').querySelector('h3').getBoundingClientRect().bottom;
    const by = scrollToFit(card.getBoundingClientRect(), top, window.innerHeight);
    if (by) window.scrollBy({ top: by, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  // What the View button says once the view differs from the default.
  const active = line !== 'shown' ? 'Empty' : view !== PREVIEW_COLORS ? 'Custom colors' : '';
  const reset = () => {
    setView(PREVIEW_COLORS);
    setLine('shown');
  };
  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Reels">
      {/* The title, the maker filter and, from sm up, the line toggle and colors stay in a bar under the fixed header
          while the reels scroll, and each maker's heading sticks under it. On phones the chips are one row that
          scrolls sideways, so the bar stays short. */}
      <div ref={barRef} className={PAGE_BAR}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-[20px] font-bold tracking-[0.06em] uppercase">Reels</h2>
          {/* On phones the line toggle and colors open in a sheet instead of a bar over the reels. */}
          <FilterSheet title="View" icon="tune" active={active} onClear={reset} clearLabel="Reset">
            <ViewRows line={line} onLineChange={setLine} view={view} onChange={setView} />
          </FilterSheet>
        </div>
        {/* Pick one maker, or All; picking the chosen maker again goes back to All. Each chip says how many models it holds. */}
        <Row label="Brand" className="-mr-[max(16px,2.5vw)] sm:mr-0" labelClassName="max-sm:hidden self-start pt-2 pointer-coarse:pt-3">
          <div role="group" aria-label="Brand" className="flex min-w-0 gap-2 overflow-x-auto pr-[max(16px,2.5vw)] sm:flex-wrap sm:overflow-visible sm:pr-0">
            {[[null, ALL_MODELS], ...GROUPS].map(([m, models]) => (
              <button key={m ?? 'all'} type="button" aria-pressed={filter.models.length ? m !== null && maker === m : maker === m} onClick={() => pickMaker(maker === m ? null : m)} className={cn(CHIP, 'group inline-flex flex-none items-center gap-1.5 font-semibold')}>
                {m ?? 'All'}
                <span className="text-[12px] font-normal text-muted-foreground group-aria-pressed:text-primary-foreground/80">{models.length}</span>
              </button>
            ))}
          </div>
        </Row>
        {filter.models.length > 0 && (
          <Row label="Showing" labelClassName="max-sm:hidden">
            <p className="min-w-0 text-[14px]">
              {groups.flatMap(([, models]) => models.map((m) => m.name)).join(', ')}{' '}
              <button type="button" className="font-semibold text-primary underline-offset-2 hover:underline" onClick={() => refilter({ brand: maker })}>
                Show all
              </button>
            </p>
          </Row>
        )}
        <div className="hidden flex-col gap-2.5 sm:flex">
          <ViewRows line={line} onLineChange={setLine} view={view} onChange={setView} />
        </div>
      </div>
      <div ref={listRef} className="flex flex-col gap-5">
        {groups.map(([group, models]) => (
          <section key={group} className="flex flex-col gap-3" aria-label={group}>
            <h3 className={cn(heading, GROUP_HEADING)}>{group}</h3>
            {/* Cards in equal columns, so every drawing area is the same size and the scale holds across them. */}
            <ul className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
              {models.map((m) => (
                <ModelCard
                  key={m.id}
                  model={m}
                  view={view}
                  showLine={line === 'shown'}
                  onNewSetup={onNewSetup}
                  onReveal={reveal}
                  shown={m.id === only ? filter : undefined}
                  onPick={m.id === only ? (patch) => onFilterChange({ ...filter, ...patch }) : undefined}
                  onOnly={(shown) => refilter({ models: [m.id], ...shown })}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
