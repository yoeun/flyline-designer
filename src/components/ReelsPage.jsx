import { useState } from 'react';
import PHOTOS from 'reel-photos';
import { BACKING_COLORS, LINE_COLORS, REELS, REEL_MODELS, makerGroups, reelColors, reelSizeLabel, reelSizes } from '../data/catalog.js';
import { PREVIEW_COLORS, capacityText, photosByModel, previewSetup } from '../lib/reelsPage.js';
import Field from './Field.jsx';
import ReelPreview from './ReelPreview.jsx';
import Segmented from './Segmented.jsx';
import Swatches from './Swatches.jsx';

// Every reel model on one page, each size drawn from both sides, to check the drawings and data at a
// glance. Drawings share one scale, so a bigger reel draws bigger. In dev, the maker photos sit beside them.
const PX_PER_INCH = 34;
// ReelPreview's rim spans 400 of its 430 units across.
const previewWidth = (rim) => Math.round((rim * PX_PER_INCH * 430) / 400);
// Every drawing sits in a box of one size, big enough for the largest reel plus padding, so the
// sizes line up in a grid; the reel inside keeps its scale.
const BOX_PAD = 20;
const BOX = previewWidth(Math.max(...REELS.map((r) => r.rim))) + 2 * BOX_PAD;
const BOX_H = Math.round(((BOX - 2 * BOX_PAD) * 470) / 430) + 2 * BOX_PAD;

const heading = 'font-heading text-[15px] font-bold tracking-[0.06em] uppercase';
const PHOTOS_BY_MODEL = photosByModel(REEL_MODELS, PHOTOS);
// Makers A–Z, generic last; within a maker, current models before discontinued ones.
const GROUPS = makerGroups(REEL_MODELS, 'Generic').map(([maker, models]) => [maker, [...models.filter((m) => !m.discontinued), ...models.filter((m) => m.discontinued)]]);

const LINE_OPTIONS = [
  ['shown', 'Line'],
  ['hidden', 'Empty'],
];

// `view` is the page-wide drawing settings: { line: 'shown' | 'hidden', colors }.
function SizeBlock({ size, color, view }) {
  const setup = previewSetup(size, color, view.colors);
  const showLine = view.line === 'shown';
  const width = previewWidth(size.rim);
  const capacity = capacityText(size);
  return (
    <li className="flex flex-col gap-1.5">
      <p className="text-[14px] font-semibold">{reelSizeLabel(size)}</p>
      <div className="flex flex-wrap gap-1.5">
        {['drag', 'spool'].map((side) => (
          <div key={side} className="flex items-center justify-center rounded-md bg-stage" style={{ width: BOX, height: BOX_H }}>
            <ReelPreview setup={setup} side={side} showLine={showLine} size={width} background="none" className="w-auto" title={`${size.name}, ${side} side`} />
          </div>
        ))}
      </div>
      <p className="font-mono text-[12px] text-muted-foreground tabular-nums">
        rim {size.rim}″ · spool {size.spool}″ · width {size.width}″
        {capacity && <br />}
        {capacity}
        {showLine && (
          <>
            <br />
            drawn with WF{setup.line.weight}F + 100 yd
          </>
        )}
      </p>
    </li>
  );
}

function ModelCard({ model, view }) {
  const colors = reelColors(model);
  const [color, setColor] = useState(colors[0].id);
  const photos = PHOTOS_BY_MODEL[model.id] ?? [];
  return (
    <li className="flex flex-col gap-3 rounded-card border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-[17px] leading-tight font-bold">{model.name}</h4>
          {model.discontinued && <span className="rounded-full border border-warn-border bg-warn-bg px-2 py-0.5 text-[12px] font-semibold text-warn">Discontinued</span>}
          <span className="font-mono text-[12px] text-muted-foreground">
            {model.id} · design {model.design}
          </span>
        </div>
        <Swatches colors={colors} value={color} onChange={setColor} label={`${model.name} color`} size={24} />
      </div>
      <ul className="grid gap-x-6 gap-y-5" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${2 * BOX + 6}px), ${2 * BOX + 6}px))` }}>
        {reelSizes(model.id).map((size) => (
          <SizeBlock key={size.id} size={size} color={color} view={view} />
        ))}
      </ul>
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
      {model.notes && <p className="text-[13px] text-muted-foreground">{model.notes}</p>}
    </li>
  );
}

// The page-wide controls: line on or off, and the backing, head and running line colors.
function ViewControls({ view, onChange }) {
  const setColor = (key) => (id) => onChange({ ...view, colors: { ...view.colors, [key]: id } });
  const shown = view.line === 'shown';
  return (
    <div className="sticky top-0 z-10 -mx-[max(16px,2.5vw)] flex flex-wrap items-end gap-x-6 gap-y-3 border-b border-border bg-background/95 px-[max(16px,2.5vw)] py-3 backdrop-blur">
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
    </div>
  );
}

export default function ReelsPage() {
  const [view, setView] = useState({ line: 'shown', colors: PREVIEW_COLORS });
  const count = REEL_MODELS.reduce((n, m) => n + reelSizes(m.id).length, 0);
  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Reels">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-heading text-[20px] font-bold tracking-[0.06em] uppercase">Reels</h2>
        <p className="text-[14px] text-muted-foreground">
          {REEL_MODELS.length} models, {count} sizes, drawn to scale
        </p>
      </div>
      <ViewControls view={view} onChange={setView} />
      <nav aria-label="Makers" className="flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
        {GROUPS.map(([maker]) => (
          <a key={maker} href={`#reels-${maker}`} className="text-primary underline-offset-2 hover:underline">
            {maker}
          </a>
        ))}
      </nav>
      {GROUPS.map(([maker, models]) => (
        <section key={maker} id={`reels-${maker}`} className="flex flex-col gap-3" aria-label={maker}>
          <h3 className={heading}>{maker}</h3>
          <ul className="flex flex-col gap-3">
            {models.map((m) => (
              <ModelCard key={m.id} model={m} view={view} />
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
