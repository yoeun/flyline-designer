import { useLayoutEffect, useRef, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { conflictsFor, rackConflicts } from '../lib/checks.js';
import { filterRack, rackWeights } from '../lib/rackView.js';
import Icon from './Icon.jsx';
import RackCard from './RackCard.jsx';
import RackFilter, { NO_FILTER, isFiltered, rackFilter } from './RackFilter.jsx';

// Side by side, the rack takes at most 45% of the column and its list scrolls inside it.
// The search and filter are shared with the rack page; a weight filter shows that weight, then one either side.
export default function Rack({ setups, currentId, open, onToggle, filter: picked, onFilterChange, onLoad, onEditDetails, onDuplicate, onRemove, onExpand }) {
  const conflicts = rackConflicts(setups);
  const weights = rackWeights(setups);
  const filter = rackFilter(picked, weights);
  const { exact, near } = filterRack(setups, filter);
  const shown = [...exact, ...near];
  const filtered = isFiltered(filter);
  // The list's last height, so the no-match message holds it and the strip doesn't jump while the search changes.
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(null);
  useLayoutEffect(() => {
    if (listRef.current) setListHeight(listRef.current.offsetHeight);
  });

  return (
    <Collapsible
      open={open}
      onOpenChange={onToggle}
      render={<section />}
      className="rounded-card border border-border bg-card wide:flex wide:max-h-[45%] wide:flex-none wide:flex-col"
    >
      <CollapsibleTrigger className="group flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left">
        <span className="flex flex-wrap items-baseline gap-2.5 text-[14px]">
          <span className="font-heading text-[17px] leading-[normal] font-bold tracking-[0.06em] uppercase">Your rack</span>
          <span className="text-muted-foreground">
            {filtered && `${shown.length} of `}
            {setups.length} {setups.length === 1 ? 'setup' : 'setups'}
          </span>
        </span>
        <span className="flex items-center gap-3 text-[14px]">
          {/* Counted across the whole rack, whatever the filter shows. */}
          {conflicts.length > 0 && (
            <span className="font-semibold text-warn">
              {conflicts.length} color {conflicts.length === 1 ? 'conflict' : 'conflicts'}
            </span>
          )}
          <Icon name="expand_more" className="text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 px-4 pb-4 wide:min-h-0 wide:overflow-y-auto">
        {setups.length === 0 ? (
          <p className="text-[14px] text-muted-foreground">Nothing saved yet. Use Save to keep a setup here and compare backing colors across your reels.</p>
        ) : shown.length === 0 ? (
          // Before the list has been seen, an unseen card stands in for its height.
          <div className="relative" style={{ minHeight: listHeight ?? undefined }}>
            {listHeight === null && (
              <div className="invisible pb-2" aria-hidden="true" inert>
                <RackCard setup={setups[0]} onLoad={() => {}} />
              </div>
            )}
            <p className="absolute inset-0 flex items-center gap-2 text-[14px] text-muted-foreground">
              No setups match.
              <button type="button" onClick={() => onFilterChange(NO_FILTER)} className="cursor-pointer font-semibold text-primary hover:underline">
                Clear
              </button>
            </p>
          </div>
        ) : (
          // Room around the cards so the scroll box doesn't clip the current card's ring.
          <ul ref={listRef} className="-mx-1 flex gap-3 overflow-x-auto px-1 pt-1 pb-2" aria-label="Saved setups">
            {shown.map((s) => (
              <li key={s.id} className="flex">
                <RackCard setup={s} current={s.id === currentId} conflicts={conflictsFor(s.id, conflicts, setups)} onLoad={onLoad} onEditDetails={onEditDetails} onDuplicate={onDuplicate} onRemove={onRemove} />
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-3 text-[14px]">
          {setups.length > 0 && <RackFilter filter={filter} weights={weights} count={shown.length} onChange={onFilterChange} className="flex-1" />}
          <button type="button" onClick={onExpand} className="-mr-2 ml-auto flex min-h-9 flex-none pointer-coarse:min-h-11 cursor-pointer items-center rounded-lg px-2 font-semibold text-primary hover:bg-accent">
            See all
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
