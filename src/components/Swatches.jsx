import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

// Color dots that pick one color: shadcn's radio group, restyled. marked adds a small accent
// dot to one color (the suggested one).
export default function Swatches({ colors, value, onChange, label, size = 32, marked }) {
  return (
    <RadioGroup aria-label={label} value={value} onValueChange={onChange} className="flex w-auto flex-wrap gap-2.5">
      {colors.map((c) => (
        <RadioGroupItem
          key={c.id}
          value={c.id}
          aria-label={marked === c.id ? `${c.name} (suggested)` : c.name}
          title={c.name}
          style={{ '--swatch': c.hex, '--size': `${size}px` }}
          className={cn(
            'size-(--size) cursor-pointer border-swatch-ring bg-(--swatch) data-checked:border-swatch-ring data-checked:bg-(--swatch) data-checked:shadow-[0_0_0_2px_var(--panel),0_0_0_4px_var(--ink)] dark:bg-(--swatch) dark:data-checked:bg-(--swatch) motion-safe:transition-transform motion-safe:duration-100 motion-safe:hover:scale-108 [&>[data-slot=radio-group-indicator]]:hidden',
            marked === c.id
              ? 'after:inset-auto after:-right-[3px] after:-bottom-[3px] after:size-2.5 after:rounded-full after:border-2 after:border-card after:bg-primary'
              : 'after:hidden',
          )}
        />
      ))}
    </RadioGroup>
  );
}
