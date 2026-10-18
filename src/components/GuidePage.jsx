import { useEffect, useId, useMemo, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { LINE_PRESETS, nameOf, nearestSize } from '../data/catalog.js';
import { CATEGORIES, chartPoints, densityName, filterProducts, formatRange, groupBySeries, heaviness, linkProducts, makerSeries, productFacts } from '../lib/guide.js';
import { GROUP_HEADING, PAGE_BAR, usePageBar } from '../lib/pageBar.js';
import Chips, { CHIP } from './Chips.jsx';
import FilterSheet from './FilterSheet.jsx';
import Icon from './Icon.jsx';
import LineEditor from './LineEditor.jsx';
import { Input } from './Input.jsx';
import Select from './Select.jsx';
import TaperChart from './TaperChart.jsx';

// One JSON file per maker, loaded only when the guide opens so the designer bundle doesn't carry them.
const MAKER_FILES = import.meta.glob('../data/guide/*.json', { import: 'default' });
const MAKER_ORDER = ['rio', 'scientific-anglers', 'orvis', 'royal-wulff', 'airflo', 'cortland'];
const makerOrder = (id) => (MAKER_ORDER.includes(id) ? MAKER_ORDER.indexOf(id) : MAKER_ORDER.length);

async function loadMakers() {
  const makers = await Promise.all(Object.values(MAKER_FILES).map((load) => load()));
  return makers.sort((a, b) => makerOrder(a.id) - makerOrder(b.id) || a.maker.localeCompare(b.maker));
}

const CHART_WEIGHT = 5;
// Chart labels name the maker only when several are shown; these keep them short.
const SHORT_MAKER = { 'scientific-anglers': 'SA', 'royal-wulff': 'Wulff' };
const heading = 'font-heading text-[15px] font-bold tracking-[0.06em] uppercase';
const money = (n) => `$${n % 1 ? n.toFixed(2) : n}`;
// The list price; for a discontinued line with none, the last archived price ("last seen $79 (2023)").
function priceText(product) {
  if (Number.isFinite(product.price)) return money(product.price);
  const seen = product.priceNote?.match(/\$(\d+(?:\.\d+)?).*?\b(20\d\d)\b/);
  return seen ? `last seen ${money(Number(seen[1]))} (${seen[2]})` : null;
}
const fmt = (n, unit = '') => (Number.isFinite(n) ? `${n}${unit}` : '—');
// Use tags split on "/" and ","; a "label: value" part (SA's "water temp: Cold/Medium") stays whole.
const uses = (text) =>
  text ? [...new Set(text.split(/;\s*/).flatMap((part) => (part.includes(':') ? [part.trim()] : part.split(/\s*\/\s*|,\s*/))).filter(Boolean))] : [];

// One maker line: what it's for, the sizes and densities it comes in, and its per-size specs on demand.
function ProductCard({ maker, product, weight, sizes, showSeries, onTry }) {
  const [open, setOpen] = useState(false);
  const facts = productFacts(product);
  const heavy = heaviness(product);
  // In the designer's line menu: its size at the chosen rod weight, or the nearest.
  const preset = sizes ? nearestSize(sizes, weight ?? CHART_WEIGHT) : null;
  const tableId = useId();

  return (
    <li className="flex flex-col gap-2.5 rounded-card border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <h4 className="text-[17px] leading-tight font-bold">
            <span className="sr-only">{maker.maker} </span>
            {product.name}
          </h4>
          {showSeries && product.series && <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] font-semibold text-muted-foreground">{product.series}</span>}
          {product.discontinued && <span className="rounded-full border border-warn-border bg-warn-bg px-2 py-0.5 text-[12px] font-semibold text-warn">Discontinued</span>}
        </div>
        <div className="flex items-baseline gap-3 text-[14px] text-muted-foreground">
          {product.rank && (
            <span title={product.rankSource ?? undefined}>
              <span className="sr-only">Popularity </span>#{product.rank}
            </span>
          )}
          {priceText(product) && (
            <span className="font-semibold text-foreground" title={product.priceNote ?? undefined}>
              {priceText(product)}
            </span>
          )}
        </div>
      </div>
      {/* The line itself, at the size Try would load: a picture of its taper and colors. */}
      {preset && (
        <div className="rounded-md bg-stage px-3 py-2.5">
          <LineEditor line={preset.line} bare label={`${product.name}, ${preset.sizeLabel ?? `${preset.line.weight} wt`}, ${preset.line.zones.length === 1 ? nameOf(preset.line.zones[0].color) : preset.line.zones.map((z) => nameOf(z.color)).join(' to ')}`} />
        </div>
      )}
      {product.summary && <p className="text-[14px] text-muted-foreground">{product.summary}</p>}
      {(product.primaryUse || product.secondaryUse) && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Built for">
          {uses(product.primaryUse).map((u) => (
            <li key={`p${u}`} className="rounded-full bg-accent px-2.5 py-0.5 text-[13px] font-semibold text-accent-foreground">
              {u}
            </li>
          ))}
          {uses(product.secondaryUse).map((u) => (
            <li key={`s${u}`} className="rounded-full border border-border px-2.5 py-0.5 text-[13px] text-muted-foreground">
              {u}
            </li>
          ))}
        </ul>
      )}
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-x-4 gap-y-1.5 text-[14px]">
        {[
          ['Sizes', facts.weights.length ? `${formatRange([facts.weights[0], facts.weights.at(-1)])} wt` : product.sizes.map((s) => s.label).join(', ')],
          ['Density', facts.densities.join(', ')],
          ['Head', formatRange(facts.head, ' ft')],
          ['Weight', heavy ? heavy.label : product.weightLabel ?? '—', heavy && `Average of ${heavy.count} ${heavy.count === 1 ? 'size' : 'sizes'} against the AFFTA 30 ft standard${product.weightLabel ? `. ${maker.maker} says: ${product.weightLabel}` : ''}`],
        ].map(([term, value, title]) => (
          <div key={term} className="flex min-w-0 flex-col">
            <dt className="text-[12px] text-muted-foreground">{term}</dt>
            <dd className="m-0" title={title || undefined}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={tableId}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg pr-2 text-[14px] font-semibold text-primary pointer-coarse:min-h-11 hover:bg-accent"
        >
          <Icon name={open ? 'expand_less' : 'expand_more'} />
          {open ? 'Hide specs' : `Specs for ${product.sizes.length} ${product.sizes.length === 1 ? 'size' : 'sizes'}`}
        </button>
        {preset && (
          <button type="button" onClick={() => onTry(preset.id)} className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg px-2 text-[14px] font-semibold text-primary pointer-coarse:min-h-11 hover:bg-accent">
            <Icon name="visibility" />
            Try {preset.sizeLabel ?? `${preset.line.weight} wt`} on a reel
          </button>
        )}
        {product.url && (
          <a href={product.url} target="_blank" rel="noreferrer" className="flex min-h-9 items-center gap-1 rounded-lg px-2 text-[14px] text-muted-foreground pointer-coarse:min-h-11 hover:bg-accent">
            {maker.maker} page
            <Icon name="open_in_new" className="text-[16px]" />
          </a>
        )}
      </div>
      {open && (
        <div id={tableId} className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[320px] border-collapse text-[14px] tabular-nums">
            <thead>
              <tr className="border-b border-border text-left text-[12px] text-muted-foreground">
                <th className="py-1.5 pr-3 font-semibold">Size</th>
                <th className="py-1.5 pr-3 font-semibold">Density</th>
                <th className="py-1.5 pr-3 text-right font-semibold">Head</th>
                <th className="py-1.5 pr-3 text-right font-semibold">Total</th>
                <th className="py-1.5 text-right font-semibold" title="Grains in the first 30 ft">30 ft gr</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes.map((s, i) => (
                <tr key={i} className={cn('border-b border-border last:border-0', weight !== null && s.weights?.includes(weight) && 'bg-accent')}>
                  <td className="py-1.5 pr-3 font-semibold">{s.label}</td>
                  <td className="py-1.5 pr-3">{densityName(s)}</td>
                  <td className="py-1.5 pr-3 text-right">{fmt(s.head, ' ft')}</td>
                  <td className="py-1.5 pr-3 text-right">{fmt(s.total, ' ft')}</td>
                  <td className="py-1.5 text-right">{fmt(s.grains30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </li>
  );
}

// How a maker's lineup is organized, open until closed.
function Explainer({ maker }) {
  if (!maker.explainer?.length && !maker.omitted?.length) return null;
  return (
    <Collapsible defaultOpen className="rounded-card border border-border bg-card">
      <CollapsibleTrigger className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-left text-[14px] font-semibold">
        How the {maker.maker} lineup is organized
        <Icon name="expand_more" className="text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex max-w-[75ch] flex-col gap-2 px-4 pb-4 text-[14px]">
        {maker.explainer.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {maker.omitted?.length > 0 && <p className="text-[13px] text-muted-foreground">Not covered here (two-hand and shooting lines): {maker.omitted.join(', ')}.</p>}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Every single-hand line from the makers in src/data/guide, with filters, a taper chart and per-size specs.
export default function GuidePage({ onTry }) {
  const [makers, setMakers] = useState(null);
  const [failed, setFailed] = useState(false);
  const [maker, setMakerId] = useState(null);
  // Series belong to one maker, so picking a maker clears it.
  const [series, setSeries] = useState(null);
  const setMaker = (id) => {
    setMakerId(id);
    setSeries(null);
  };
  const [category, setCategory] = useState(null);
  const [weight, setWeight] = useState(null);
  const [search, setSearch] = useState('');
  const [discontinued, setDiscontinued] = useState(false);
  const links = useMemo(() => (makers ? linkProducts(makers, LINE_PRESETS) : new Map()), [makers]);
  const barRef = usePageBar();

  useEffect(() => {
    let live = true;
    loadMakers()
      .then((m) => live && setMakers(m))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  if (!makers) {
    return (
      <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Line guide">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-heading text-[20px] font-bold tracking-[0.06em] uppercase">Line guide</h2>
        </div>
        <p className="text-[14px] text-muted-foreground">{failed ? 'The line guide could not be loaded. Check your connection and reload.' : 'Loading the line guide…'}</p>
      </main>
    );
  }

  const sections = filterProducts(makers, { maker, series, category, weight, search, discontinued }).filter((s) => s.products.length > 0);
  const count = sections.reduce((n, s) => n + s.products.length, 0);
  const weights = [...new Set(makers.flatMap((m) => m.products.flatMap((p) => p.sizes.flatMap((s) => s.weights ?? []))))].sort((a, b) => a - b);
  const points = chartPoints(makers, { maker, discontinued, weight: CHART_WEIGHT });
  const manyMakers = new Set(points.map((p) => p.maker)).size > 1;
  const chartData = points.map((p) => ({ ...p, label: manyMakers ? `${SHORT_MAKER[p.makerId] ?? p.maker} ${p.label}` : p.label })).sort((a, b) => a.head - b.head);
  const chosen = makers.find((m) => m.id === maker) ?? null;
  const showChart = chartData.length > 1 && (!category || category === 'trout');

  // The filters, shown inline from sm up and in the Filter sheet on phones.
  const makerChips = makers.length > 1 && <Chips label="Maker" value={maker} onChange={setMaker} options={[{ value: null, label: 'All' }, ...makers.map((m) => ({ value: m.id, label: m.maker }))]} />;
  const seriesChips = chosen && makerSeries(chosen).length > 1 && (
    <Chips label="Series" value={series} onChange={setSeries} options={[{ value: null, label: 'All' }, ...makerSeries(chosen).map((s) => ({ value: s, label: s }))]} />
  );
  const useChips = <Chips label="Use" value={category} onChange={setCategory} options={[{ value: null, label: 'All' }, ...CATEGORIES.map((c) => ({ value: c.id, label: c.name }))]} />;
  const weightSelect = (
    <Select
      label="Rod weight"
      value={weight === null ? 'any' : String(weight)}
      onChange={(v) => setWeight(v === 'any' ? null : Number(v))}
      items={[{ value: 'any', label: 'Any' }, ...weights.map((w) => ({ value: String(w), label: `${w} wt` }))]}
    />
  );
  const searchField = (
    <label className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5 text-[14px]">
      <span className="text-muted-foreground">Search</span>
      <Input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, use or series" />
    </label>
  );
  const discontinuedToggle = (
    <Toggle pressed={discontinued} onPressedChange={setDiscontinued} className={cn(CHIP, 'h-auto min-h-10 max-w-full gap-1.5 self-start whitespace-normal hover:bg-card')}>
      <Icon name={discontinued ? 'check_box' : 'check_box_outline_blank'} />
      Show discontinued
    </Toggle>
  );
  // What the Filter button names once a filter is on; search stays out, it's always in view.
  const active = [chosen?.maker, series, CATEGORIES.find((c) => c.id === category)?.name, weight !== null && `${weight} wt`, discontinued && 'Discontinued'].filter(Boolean).join(' · ');
  const clearFilters = () => {
    setMaker(null);
    setSeries(null);
    setCategory(null);
    setWeight(null);
    setDiscontinued(false);
  };

  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Line guide">
      {/* The title, the search and, from sm up, the filters stay in a bar under the fixed header while the
          lines scroll, and each maker's heading sticks under it. */}
      <div ref={barRef} className={PAGE_BAR}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-heading text-[20px] font-bold tracking-[0.06em] uppercase">Line guide</h2>
            <span className="text-[14px] text-muted-foreground">
              {count} {count === 1 ? 'line' : 'lines'}
            </span>
          </div>
          <FilterSheet active={active} onClear={clearFilters} doneLabel={`Show ${count} ${count === 1 ? 'line' : 'lines'}`}>
            {makerChips}
            {seriesChips}
            {useChips}
            <div className="w-40">{weightSelect}</div>
            {discontinuedToggle}
          </FilterSheet>
        </div>

        {/* Phones keep only the search here; the other filters are in the Filter sheet. */}
        <div className="sm:hidden">{searchField}</div>
        <div className="hidden flex-col gap-2.5 sm:flex">
          {makerChips}
          {seriesChips}
          {useChips}
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-32">{weightSelect}</div>
            {searchField}
            {discontinuedToggle}
          </div>
        </div>
      </div>

      {showChart && (
        <section className="flex flex-col gap-2 rounded-panel border border-border bg-card p-4" aria-labelledby="taper-chart-title">
          <div className="flex flex-col gap-0.5">
            <h3 id="taper-chart-title" className={heading}>
              Trout tapers at {CHART_WEIGHT} wt
            </h3>
            <p className="max-w-[75ch] text-[14px] text-muted-foreground">
              Floating trout lines{chosen ? ` from ${chosen.maker}` : ''}. Shorter, heavier heads (up and left) load a rod at short range and carry bigger rigs; longer, lighter heads (down and right) carry long casts
              and land softly. Lines that share a taper share a dot.
            </p>
          </div>
          <TaperChart points={chartData} weight={CHART_WEIGHT} />
          <details className="text-[14px]">
            <summary className="min-h-9 cursor-pointer py-1.5 font-semibold text-primary pointer-coarse:py-2.5">Chart data</summary>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-border text-left text-[12px] text-muted-foreground">
                    <th className="py-1.5 pr-3 font-semibold">Line</th>
                    <th className="py-1.5 pr-3 text-right font-semibold">Head</th>
                    <th className="py-1.5 pr-3 text-right font-semibold">30 ft grains</th>
                    <th className="py-1.5 font-semibold">Against AFFTA</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((p) => (
                    <tr key={p.key} className="border-b border-border last:border-0">
                      <td className="py-1.5 pr-3">
                        {p.maker} {p.products.map((x) => x.name).join(', ')}
                      </td>
                      <td className="py-1.5 pr-3 text-right">{p.head} ft</td>
                      <td className="py-1.5 pr-3 text-right">{p.grains}</td>
                      <td className="py-1.5">{p.heaviness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      )}

      {sections.length === 0 && <p className="text-[14px] text-muted-foreground">No lines match these filters.</p>}
      {sections.map(({ maker: m, products }) => (
        <section key={m.id} className="flex flex-col gap-3" aria-labelledby={`maker-${m.id}`}>
          <h3 id={`maker-${m.id}`} className={cn(heading, GROUP_HEADING)}>
            {m.maker} <span className="font-sans text-[14px] font-normal tracking-normal text-muted-foreground normal-case">{products.length} {products.length === 1 ? 'line' : 'lines'}</span>
          </h3>
          <Explainer maker={m} />
          {/* One maker: its lines under their series, so tiers of the same taper sit together. */}
          {(chosen ? groupBySeries(products) : [{ series: null, products }]).map((g) => (
            <div key={g.series ?? ''} className="flex flex-col gap-2">
              {chosen && g.series && (
                <h4 className="text-[14px] font-semibold text-muted-foreground">
                  {g.series} · {g.products.length} {g.products.length === 1 ? 'line' : 'lines'}
                </h4>
              )}
              {chosen && !g.series && groupBySeries(products).length > 1 && <h4 className="text-[14px] font-semibold text-muted-foreground">Other lines</h4>}
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,420px),1fr))] items-start gap-3">
                {g.products.map((p) => (
                  <ProductCard key={p.id} maker={m} product={p} weight={weight} sizes={links.get(p.id)} showSeries={!chosen} onTry={onTry} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
