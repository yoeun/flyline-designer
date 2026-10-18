import { useState } from 'react';
import { cn } from '@/lib/utils';
import { conflictsFor } from '../lib/checks.js';
import { STYLES } from '../lib/rack.js';
import { filterRack, rackWeights } from '../lib/rackView.js';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Button from './Button.jsx';
import Chips from './Chips.jsx';
import Icon from './Icon.jsx';
import RackCard from './RackCard.jsx';

// The whole rack, filtered by line weight and style. A shared rack (readOnly) has its own heading and
// no card menus; actions sit beside the heading. On phones the filters fold into a Filter button that
// opens them in a sheet from the bottom, so the cards start near the top of the screen.
export default function RackPage({ setups, currentId, conflicts, onLoad, onEditDetails, onRemove, readOnly = false, title = 'Your rack', actions = null }) {
  const [pickedWeight, setWeight] = useState(null);
  const [style, setStyle] = useState(null);
  const weights = rackWeights(setups);
  // A weight whose last setup was removed falls back to All.
  const weight = weights.includes(pickedWeight) ? pickedWeight : null;
  const { exact, near } = filterRack(setups, { weight, style });
  const [filtersOpen, setFiltersOpen] = useState(false);
  // What the Filter button shows once a filter is on, e.g. "5 wt · Dry".
  const active = [weight !== null && `${weight} wt`, STYLES.find((s) => s.id === style)?.name].filter(Boolean).join(' · ');

  const filters = (
    <>
      <Chips label="Rod weight" value={weight} onChange={setWeight} options={[{ value: null, label: 'All' }, ...weights.map((w) => ({ value: w, label: `${w} wt` }))]} />
      <Chips label="Style" value={style} onChange={setStyle} options={[{ value: null, label: 'All' }, ...STYLES.map((s) => ({ value: s.id, label: s.name }))]} />
    </>
  );

  const grid = (list, label) => (
    // One card per row on phones, filling the width; side by side from sm up.
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label={label}>
      {list.map((s) => (
        <li key={s.id} className="flex">
          <RackCard
            setup={s}
            current={s.id === currentId}
            conflicts={conflictsFor(s.id, conflicts, setups)}
            currentStyle="label"
            showNotes
            size="lg"
            loadLabel={readOnly ? 'View' : 'Load'}
            onLoad={onLoad}
            onEditDetails={readOnly ? undefined : onEditDetails}
            onRemove={readOnly ? undefined : onRemove}
          />
        </li>
      ))}
    </ul>
  );

  const heading = 'font-heading text-[15px] font-bold tracking-[0.06em] uppercase';

  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Rack">
      {/* The title with the setup count under it; the buttons sit to the right of both. */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="font-heading text-[20px] leading-tight font-bold tracking-[0.06em] uppercase">{title}</h2>
          <span className="text-[14px] text-muted-foreground">
            {setups.length} {setups.length === 1 ? 'setup' : 'setups'}
          </span>
        </div>
        <div className="flex flex-none gap-2">
          {setups.length > 0 && (
            <Button className={cn('gap-1.5 sm:hidden', active && 'border-primary text-primary')} onClick={() => setFiltersOpen(true)} aria-label={active ? `Filter: ${active}` : 'Filter'}>
              <Icon name="filter_list" />
              {active || 'Filter'}
            </Button>
          )}
          {actions}
        </div>
      </div>

      {setups.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">{readOnly ? 'This rack is empty.' : 'Nothing saved yet. Design a setup and save it to keep it here.'}</p>
      ) : (
        <>
          <div className="hidden flex-col gap-2.5 sm:flex">{filters}</div>
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetContent side="bottom" className="max-h-[85dvh] gap-0 overflow-y-auto rounded-t-2xl">
              <SheetHeader className="pb-2">
                <SheetTitle className="font-heading text-[17px] font-bold tracking-[0.06em] uppercase">Filter</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">{filters}</div>
              <SheetFooter className="flex-row gap-2">
                <Button
                  className="flex-1"
                  disabled={!active}
                  onClick={() => {
                    setWeight(null);
                    setStyle(null);
                  }}
                >
                  Clear
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => setFiltersOpen(false)}>
                  Show {exact.length + near.length} {exact.length + near.length === 1 ? 'setup' : 'setups'}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {exact.length === 0 && near.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">No setups match these filters.</p>
          ) : weight === null ? (
            grid(exact, 'Saved setups')
          ) : (
            <>
              {exact.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className={heading}>{weight} wt</h3>
                  {grid(exact, `${weight} wt setups`)}
                </section>
              )}
              {near.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className={heading}>Also fits a {weight} wt</h3>
                  {grid(near, `Also fits a ${weight} wt`)}
                </section>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
