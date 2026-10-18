import { useState } from 'react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Button from './Button.jsx';
import Icon from './Icon.jsx';

// On phones (below sm) a page's filters fold into a button that opens them in a sheet from the bottom,
// so the content starts near the top of the screen. The button names what is active (e.g. "5 wt · Dry").
// The sheet's title and buttons stay put while its filters scroll. Without onClear (view options rather
// than filters) the footer is a single Done button; clearLabel renames Clear (e.g. Reset for view options).
export default function FilterSheet({ title = 'Filter', icon = 'filter_list', active = '', onClear, clearLabel = 'Clear', doneLabel = 'Done', children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className={cn('gap-1.5 sm:hidden', active && 'border-primary text-primary')} onClick={() => setOpen(true)} aria-label={active ? `${title}: ${active}` : title}>
        <Icon name={icon} />
        <span className="max-w-40 truncate">{active || title}</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
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
