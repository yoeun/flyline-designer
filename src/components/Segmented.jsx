import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

// A row of toggle buttons where one is pressed. options is [[id, label, icon?]]; when every
// option has an icon the buttons are square and show only the icon, with the label as its name.
// Wraps shadcn's toggle group, which works in string values, so ids map back to their own type.
// invalid(id), when given, returns a reason for options that will not work; those show red with it as the tooltip.
export default function Segmented({ label, options, value, onChange, invalid }) {
  const icons = options.every(([, , icon]) => icon);
  return (
    <ToggleGroup
      aria-label={label}
      spacing={0.5}
      value={[String(value)]}
      onValueChange={([picked]) => {
        // Pressing the pressed button would leave nothing selected; keep the current value.
        const option = options.find(([id]) => String(id) === picked);
        if (option) onChange(option[0]);
      }}
      className="rounded-lg border border-border bg-secondary p-[3px]"
    >
      {options.map(([id, optionLabel, icon]) => (
        <ToggleGroupItem
          key={id}
          value={String(id)}
          aria-label={icons ? optionLabel : undefined}
          title={invalid?.(id) || (icons ? optionLabel : undefined)}
          className={cn(
            'h-auto min-h-[34px] pointer-coarse:min-h-11 cursor-pointer rounded-[7px] text-[14px] hover:bg-transparent aria-pressed:bg-card aria-pressed:shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
            invalid?.(id) && 'text-destructive aria-pressed:text-destructive',
            icons ? 'grid w-[34px] min-w-0 pointer-coarse:w-11 place-items-center p-0 text-muted-foreground aria-pressed:text-foreground aria-pressed:[&_.icon]:[font-variation-settings:"FILL"_1]' : 'px-[11px] py-[5px]',
          )}
        >
          {icons ? icon : optionLabel}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
