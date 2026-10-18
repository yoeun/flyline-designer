import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Button from './Button.jsx';
import Icon from './Icon.jsx';

// On phones (below sm) a page's filters fold into a button that opens them in a sheet from the bottom,
// so the content starts near the top of the screen. The button names what is active (e.g. "5 wt · Dry").
// The sheet's title and buttons stay put while its filters scroll. Without onClear (view options rather
// than filters) the footer is a single Done button; clearLabel renames Clear (e.g. Reset for view options).
// With always, the button shows on every screen size and opens the filters in a popover from sm up.
export default function FilterSheet({ title = 'Filter', icon = 'filter_list', active = '', onClear, clearLabel = 'Clear', doneLabel = 'Done', always = false, className, children }) {
  const [open, setOpen] = useState(false);
  // Which one the button opens is decided on the press, so a resize in between can't leave both open.
  const [wide, setWide] = useState(false);
  const show = () => {
    setWide(always && window.matchMedia('(min-width: 40rem)').matches);
    setOpen(true);
  };
  const button = (
    <Button className={cn('gap-1.5', !always && 'sm:hidden', active && 'border-primary text-primary', className)} onClick={show} aria-label={active ? `${title}: ${active}` : title}>
      <Icon name={icon} />
      <span className="max-w-40 truncate">{active || title}</span>
    </Button>
  );
  return (
    <>
      {always ? (
        <Popover open={open && wide} onOpenChange={(o) => !o && setOpen(false)}>
          <PopoverTrigger render={button} />
          <PopoverContent align="start" side="top" className="flex w-auto max-w-[min(420px,calc(100vw-32px))] flex-col gap-3 p-4">
            {children}
            {onClear && (
              <Button variant="link" className="self-start" disabled={!active} onClick={onClear}>
                {clearLabel}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      ) : (
        button
      )}
      <Sheet open={open && !wide} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] gap-0 overflow-hidden rounded-t-2xl border-t-0">
          <SheetHeader className="flex-none pb-2">
            <SheetTitle className="font-heading text-[17px] font-bold tracking-[0.06em] uppercase">{title}</SheetTitle>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-2">{children}</div>
          <SheetFooter className="flex-none flex-row gap-2 border-t border-border">
            {onClear && (
              <Button className="flex-1" disabled={!active} onClick={onClear}>
                {clearLabel}
              </Button>
            )}
            <Button variant="primary" className="flex-1" onClick={() => setOpen(false)}>
              {doneLabel}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
