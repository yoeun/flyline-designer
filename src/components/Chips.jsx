import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export const CHIP = 'min-h-9 pointer-coarse:min-h-11 pointer-coarse:px-4 cursor-pointer rounded-full border border-input bg-card px-3.5 text-[14px] aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground';

// A pick-one row of chips; picking the chosen one again keeps it chosen.
export default function Chips({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="min-w-20 text-[13px] font-semibold text-muted-foreground">{label}</span>
      <ToggleGroup aria-label={label} value={[String(value)]} onValueChange={(v) => v.length && onChange(options.find((o) => String(o.value) === v[0]).value)} className="flex-wrap">
        {options.map((o) => (
          <ToggleGroupItem key={String(o.value)} value={String(o.value)} className={CHIP}>
            {o.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
