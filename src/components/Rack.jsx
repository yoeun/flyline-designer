import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { conflictsFor, rackConflicts } from '../lib/checks.js';
import Icon from './Icon.jsx';
import RackCard from './RackCard.jsx';

// Side by side, the rack takes at most 45% of the column and its list scrolls inside it.
export default function Rack({ setups, currentId, open, onToggle, onLoad, onEditDetails, onRemove, onExpand }) {
  const conflicts = rackConflicts(setups);

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
            {setups.length} {setups.length === 1 ? 'setup' : 'setups'}
          </span>
        </span>
        <Icon name="expand_more" className="text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 px-4 pb-4 wide:min-h-0 wide:overflow-y-auto">
        {setups.length === 0 ? (
          <p className="text-[14px] text-muted-foreground">Nothing saved yet. Use Save to keep a setup here and compare backing colors across your reels.</p>
        ) : (
          <ul className="flex gap-3 overflow-x-auto pb-2" aria-label="Saved setups">
            {setups.map((s) => (
              <li key={s.id} className="flex">
                <RackCard setup={s} current={s.id === currentId} conflicts={conflictsFor(s.id, conflicts, setups)} onLoad={onLoad} onEditDetails={onEditDetails} onRemove={onRemove} />
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-3 text-[14px]">
          {conflicts.length > 0 && (
            <span className="font-semibold text-warn">
              {conflicts.length} color {conflicts.length === 1 ? 'conflict' : 'conflicts'}
            </span>
          )}
          <button type="button" onClick={onExpand} className="-mr-2 ml-auto flex min-h-9 cursor-pointer items-center rounded-lg px-2 font-semibold text-primary hover:bg-accent">
            See all
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
