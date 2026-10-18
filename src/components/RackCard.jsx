import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { REELS, findById } from '../data/catalog.js';
import { STYLES, displayName } from '../lib/rack.js';
import Icon from './Icon.jsx';
import ReelPreview from './ReelPreview.jsx';

// One color per style, the same in light and dark: the letter is white on it.
const STYLE_COLORS = { dry: 'bg-[#b7791f]', nymph: 'bg-[#2c7a7b]', streamer: 'bg-[#8e4585]' };

// A saved setup. The reel drawing is the card: the band above it and the text below stay small.
// size 'lg' (the rack page) makes the card wider and the line weight large enough to read at a glance.
// Without onRemove (a shared rack) the card has no actions menu. loadLabel names what a click does.
export default function RackCard({ setup, current = false, conflicts = [], currentStyle = 'outline', showNotes = false, size = 'sm', className, loadLabel = 'Load', onLoad, onViewDetails, onEditDetails, onDuplicate, onRemove }) {
  const name = displayName(setup);
  const reelName = findById(REELS, setup.reel.model)?.name ?? 'Reel';
  const styles = STYLES.filter((s) => setup.styles?.includes(s.id));

  const remove = () => {
    if (window.confirm(`Remove “${name}” from your rack?`)) onRemove(setup.id);
  };

  const flagged = conflicts.length > 0;

  return (
    <div
      className={cn(
        'relative flex flex-none flex-col overflow-hidden rounded-card border border-border bg-card',
        size === 'lg' ? 'w-full sm:w-[300px]' : 'w-[200px]',
        flagged && 'border-warn-border/60',
        current && currentStyle === 'outline' && 'border-primary ring-2 ring-primary',
        className,
      )}
    >
      <div className="flex min-h-9 items-center justify-between gap-2 bg-muted py-1 pr-1.5 pl-3 text-[13px] text-muted-foreground">
        <span className="flex items-center gap-1">
          {size === 'lg' ? (
            <strong className="text-[22px] leading-none font-bold">
              {setup.line.weight}
              <span className="text-[15px] font-semibold"> wt</span>
            </strong>
          ) : (
            <span className="font-semibold">{setup.line.weight} wt</span>
          )}
          {flagged && (
            <Popover>
              <PopoverTrigger
                openOnHover
                aria-label="Color conflict"
                className="flex size-7 cursor-pointer items-center justify-center rounded-full pointer-coarse:size-11 text-warn hover:bg-border focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Icon name="warning" />
              </PopoverTrigger>
              <PopoverContent align="start" className="flex flex-col gap-2 border-warn-border bg-warn-bg text-warn">
                <strong>Color conflict</strong>
                {conflicts.map((c, i) => (
                  <p key={i} className="text-[13px]">
                    {c.text}
                  </p>
                ))}
              </PopoverContent>
            </Popover>
          )}
          {current && currentStyle === 'label' && <span className="rounded-full bg-border px-2 py-0.5 text-[11px] font-semibold text-foreground">Editing</span>}
        </span>
        <span className="flex items-center gap-1">
          {styles.length > 0 && (
            // The letters say which styles; a tap (or hover) spells them out, so touch screens get the names too.
            <Popover>
              <PopoverTrigger
                openOnHover
                aria-label={`Styles: ${styles.map((s) => s.name).join(', ')}`}
                className="flex cursor-pointer items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11 pointer-coarse:justify-center pointer-coarse:px-1"
              >
                {styles.map((s) => (
                  <span key={s.id} className={cn('flex size-5 items-center justify-center rounded-full text-[11px] leading-none font-bold text-white', STYLE_COLORS[s.id])}>
                    {s.letter}
                  </span>
                ))}
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto text-[13px]">
                {styles.map((s) => s.name).join(' · ')}
              </PopoverContent>
            </Popover>
          )}
          {onRemove && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex size-8 cursor-pointer items-center justify-center rounded-full pointer-coarse:size-11 text-foreground hover:bg-border focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={`More actions for ${name}`}
              >
                <Icon name="more_horiz" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                {onViewDetails && (
                  <DropdownMenuItem className="pointer-coarse:py-3" onClick={() => onViewDetails(setup)}>
                    View details
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="pointer-coarse:py-3" onClick={() => onEditDetails(setup)}>
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuItem className="pointer-coarse:py-3" onClick={() => onDuplicate(setup)}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="pointer-coarse:py-3" onClick={remove}>
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onLoad(setup)}
        title={`${loadLabel} ${name}`}
        className="flex min-w-0 cursor-pointer flex-col items-center gap-1.5 px-2 pt-2 pb-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <ReelPreview setup={setup} mode="reel" side="drag" background="transparent" title={name} className={cn('size-auto w-full', size === 'lg' && 'max-w-[260px] sm:max-w-none')} />
        <span className="flex w-full min-w-0 flex-col px-1">
          <strong className="truncate text-[14px]" title={name}>
            {name}
          </strong>
          <span className="truncate text-[12px] text-muted-foreground">{reelName}</span>
          {showNotes && setup.notes && <span className="mt-1 line-clamp-3 text-[12px] text-muted-foreground">{setup.notes}</span>}
        </span>
      </button>
    </div>
  );
}
