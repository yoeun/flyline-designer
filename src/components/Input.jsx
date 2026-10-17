import { Input as UiInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// shadcn's Input at the app's control size. text-[15px] on phones too, so iOS doesn't zoom in on focus.
export function Input({ className, ...props }) {
  return (
    <UiInput
      className={cn('h-auto min-h-10 rounded-md bg-card px-2.5 py-2 text-[15px] md:text-[15px] dark:bg-card', className)}
      {...props}
    />
  );
}

// A number input with its unit after it, e.g. "12 ft". The label is for screen readers.
export function NumberInput({ label, unit, className, value, onChange, ...props }) {
  return (
    <label className="flex flex-row items-center gap-1.5 text-[14px]">
      <Input type="number" aria-label={label} className={cn('font-mono tabular-nums', className)} value={value} onChange={onChange} {...props} />
      <span className="text-muted-foreground">{unit}</span>
    </label>
  );
}
