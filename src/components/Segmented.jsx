import { cn } from '@/lib/utils';

// A row of toggle buttons where one is pressed. options is [[id, label, icon?]]; when every
// option has an icon the buttons are square and show only the icon, with the label as its name.
export default function Segmented({ label, options, value, onChange }) {
  const icons = options.every(([, , icon]) => icon);
  return (
    <div className="inline-flex gap-0.5 rounded-lg border border-border bg-secondary p-[3px]" role="group" aria-label={label}>
      {options.map(([id, optionLabel, icon]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          aria-label={icons ? optionLabel : undefined}
          title={icons ? optionLabel : undefined}
          onClick={() => onChange(id)}
          className={cn(
            'min-h-[34px] cursor-pointer rounded-[7px] text-[14px] font-medium aria-pressed:bg-card aria-pressed:shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
            icons ? 'grid w-[34px] place-items-center text-muted-foreground aria-pressed:text-foreground aria-pressed:[&_.icon]:[font-variation-settings:"FILL"_1]' : 'px-[11px] py-[5px]',
          )}
        >
          {icons ? icon : optionLabel}
        </button>
      ))}
    </div>
  );
}
