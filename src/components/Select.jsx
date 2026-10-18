import { useId } from 'react';
import { Select as UiSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Field from './Field.jsx';

// A labelled dropdown. items is [{ value, label }]. Wraps shadcn's select so the rest of the app
// never imports from ui/ directly. labelHidden keeps the label for screen readers only, for a dropdown
// that sits in a corner with no room for one. valueLabel(value), if given, is the shorter text the closed
// dropdown shows; the list keeps the items' full labels.
export default function Select({ label, labelHidden = false, items, value, onChange, valueLabel, disabled = false, grow = false, triggerClassName }) {
  const id = useId();
  const control = (
    <UiSelect items={items} value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-labelledby={id}
        className={cn(
          'h-10 w-full cursor-pointer rounded-md data-[size=default]:h-10 pointer-coarse:data-[size=default]:h-11 bg-card px-2.5 py-2 text-[15px] hover:border-primary disabled:border-dashed disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-70 dark:bg-card dark:hover:bg-card dark:disabled:bg-secondary',
          triggerClassName,
        )}
      >
        <SelectValue>{valueLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value} className="pointer-coarse:py-3">
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UiSelect>
  );
  if (labelHidden)
    return (
      <div className="min-w-0">
        <span id={id} className="sr-only">
          {label}
        </span>
        {control}
      </div>
    );
  return (
    <Field label={label} labelId={id} grow={grow}>
      {control}
    </Field>
  );
}
