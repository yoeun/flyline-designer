import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

// Color dots that pick one color: shadcn's radio group, restyled. marked adds a small accent
// dot to one color (the suggested one). On touch screens a dot is drawn at touchSize: by default 44px,
// or 32px for sizes under 28 (the dense rows on the Reels page). A dot drawn under 44px still answers
// taps across 44px, through an invisible ring around it.
export default function Swatches({ colors, value, onChange, label, size = 32, touchSize = size >= 28 ? 44 : 32, marked, className }) {
  return (
    <RadioGroup aria-label={label} value={value} onValueChange={onChange} className={cn('flex w-auto flex-wrap gap-2.5', className)}>
      {colors.map((c) => (
        <RadioGroupItem
          key={c.id}
          value={c.id}
          aria-label={marked === c.id ? `${c.name} (suggested)` : c.name}
          title={c.name}
          style={{ '--swatch': c.hex, '--size': `${size}px`, '--touch': `${touchSize}px` }}
          className={cn(
            'size-(--size) cursor-pointer pointer-coarse:size-(--touch)',
            touchSize < 44 && "pointer-coarse:before:absolute pointer-coarse:before:inset-[calc((var(--touch)-44px)/2)] pointer-coarse:before:rounded-full pointer-coarse:before:content-['']",
            ' border-swatch-ring bg-(--swatch) data-checked:border-swatch-ring data-checked:bg-(--swatch) data-checked:shadow-[0_0_0_2px_var(--panel),0_0_0_4px_var(--ink)] dark:bg-(--swatch) dark:data-checked:bg-(--swatch) motion-safe:transition-transform motion-safe:duration-100 motion-safe:hover:scale-108 [&>[data-slot=radio-group-indicator]]:hidden',
            marked === c.id
              ? 'after:inset-auto after:-right-[3px] after:-bottom-[3px] after:size-2.5 after:rounded-full after:border-2 after:border-card after:bg-primary'
              : 'after:hidden',
          )}
        />
      ))}
    </RadioGroup>
  );
}
