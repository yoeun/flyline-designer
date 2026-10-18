import { useState } from 'react';
import { cn } from '@/lib/utils';
import { conflictsFor } from '../lib/checks.js';
import { GROUP_HEADING, PAGE_BAR, usePageBar } from '../lib/pageBar.js';
import { filterRack, rackWeights } from '../lib/rackView.js';
import RackCard from './RackCard.jsx';
import RackFilter, { NO_FILTER, isFiltered, rackFilter } from './RackFilter.jsx';

// The whole rack, searched and filtered by line weight and style; the filter is shared with the designer's
// rack strip (a shared rack keeps its own). A shared rack (readOnly) has its own heading and no card menus; actions sit beside the heading.
export default function RackPage({ setups, currentId, conflicts, filter: given, onFilterChange: onGivenChange, onLoad, onViewDetails, onEditDetails, onDuplicate, onRemove, readOnly = false, title = 'Your rack', actions = null }) {
  const [own, setOwn] = useState(NO_FILTER);
  const onFilterChange = onGivenChange ?? setOwn;
  const weights = rackWeights(setups);
  const filter = rackFilter(given ?? own, weights);
  const { weight } = filter;
  const { exact, near } = filterRack(setups, filter);
  const count = exact.length + near.length;

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
            onViewDetails={readOnly ? undefined : onViewDetails}
            onEditDetails={readOnly ? undefined : onEditDetails}
            onDuplicate={readOnly ? undefined : onDuplicate}
            onRemove={readOnly ? undefined : onRemove}
          />
        </li>
      ))}
    </ul>
  );

  const barRef = usePageBar();
  const heading = 'font-heading text-[15px] font-bold tracking-[0.06em] uppercase';

  return (
    <main className="flex flex-col gap-5 px-[max(16px,2.5vw)] pt-6 pb-10" aria-label="Rack">
      {/* The title with the setup count under it, the buttons to the right of both, and the search and Filter
          button stay in a bar under the fixed header while the setups scroll; a weight's headings stick under it. */}
      <div ref={barRef} className={PAGE_BAR}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 className="font-heading text-[20px] leading-tight font-bold tracking-[0.06em] uppercase">{title}</h2>
            <span className="text-[14px] text-muted-foreground">
              {isFiltered(filter) && `${count} of `}
              {setups.length} {setups.length === 1 ? 'setup' : 'setups'}
            </span>
          </div>
          <div className="flex flex-none gap-2">{actions}</div>
        </div>
        {setups.length > 0 && <RackFilter filter={filter} weights={weights} count={count} onChange={onFilterChange} />}
      </div>

      {setups.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">{readOnly ? 'This rack is empty.' : 'Nothing saved yet. Design a setup and save it to keep it here.'}</p>
      ) : (
        <>
          {count === 0 ? (
            <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
              No setups match.
              <button type="button" onClick={() => onFilterChange(NO_FILTER)} className="cursor-pointer font-semibold text-primary hover:underline">
                Clear
              </button>
            </p>
          ) : weight === null ? (
            grid(exact, 'Saved setups')
          ) : (
            <>
              {exact.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className={cn(heading, GROUP_HEADING)}>{weight} wt</h3>
                  {grid(exact, `${weight} wt setups`)}
                </section>
              )}
              {near.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className={cn(heading, GROUP_HEADING)}>Also fits a {weight} wt</h3>
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
