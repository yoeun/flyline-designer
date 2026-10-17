import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { LINE_TYPES, findById } from '../data/catalog.js';
import { rackConflicts } from '../lib/checks.js';
import Button from './Button.jsx';
import ReelPreview from './ReelPreview.jsx';

// Side by side, the rack takes at most 45% of the column and its list scrolls inside it.
export default function Rack({ setups, open, onToggle, onLoad, onRemove }) {
  const conflicts = rackConflicts(setups);
  const flagged = new Set(conflicts.flatMap((c) => c.ids));

  return (
    <Collapsible
      open={open}
      onOpenChange={onToggle}
      render={<section />}
      className="rounded-card border border-border bg-card wide:flex wide:max-h-[45%] wide:flex-none wide:flex-col"
    >
      <CollapsibleTrigger className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left">
        <span className="flex flex-wrap items-baseline gap-2.5 text-[14px]">
          <span className="font-heading text-[17px] leading-[normal] font-bold tracking-[0.06em] uppercase">Your rack</span>
          <span className="text-muted-foreground">
            {setups.length} {setups.length === 1 ? 'setup' : 'setups'}
          </span>
          {conflicts.length > 0 && (
            <span className="font-semibold text-warn">
              {conflicts.length} color {conflicts.length === 1 ? 'conflict' : 'conflicts'}
            </span>
          )}
        </span>
        <span className="text-[14px] font-semibold text-primary">{open ? 'Hide' : 'Show'}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 px-4 pb-4 wide:min-h-0 wide:overflow-y-auto">
        {setups.length === 0 ? (
          <p className="text-[14px] text-muted-foreground">Nothing saved yet. Use Save to rack to keep a setup here and compare backing colors across your reels.</p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
            {setups.map((s) => (
              <li key={s.id} className={cn('relative rounded-lg border border-border', flagged.has(s.id) && 'border-warn-border bg-warn-bg')}>
                <Button variant="ghost" className="flex w-full flex-col gap-0.5 px-1.5 py-2 text-[13px]" onClick={() => onLoad(s)} title={`Load ${s.name}`}>
                  <ReelPreview setup={s} mode="reel" background="transparent" title={s.name} className="size-auto w-[84px]" />
                  <strong>{s.name}</strong>
                  <span className="text-muted-foreground">{findById(LINE_TYPES, s.line.type)?.name}</span>
                </Button>
                <Button variant="ghost" className="absolute top-0.5 right-0.5 size-7 rounded-full p-0 text-[18px] text-muted-foreground" aria-label={`Remove ${s.name}`} onClick={() => onRemove(s.id)}>
                  ×
                </Button>
              </li>
            ))}
          </ul>
        )}
        {conflicts.length > 0 && (
          <ul className="flex flex-wrap gap-2.5">
            {conflicts.map((c) => (
              <li key={c.title} className="flex flex-[1_1_240px] flex-col gap-2 rounded-card border border-warn-border bg-warn-bg px-3.5 py-3 text-warn">
                <strong>{c.title}</strong>
                <p className="text-[14px]">{c.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
