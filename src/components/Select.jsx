import { useId } from 'react';
import { Select as UiSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Field from './Field.jsx';

// A labelled dropdown. items is [{ value, label }]. Wraps shadcn's select so the rest of the app
// never imports from ui/ directly.
export default function Select({ label, items, value, onChange, disabled = false, grow = false, triggerClassName }) {
  const id = useId();
  return (
    <Field label={label} labelId={id} grow={grow}>
      <UiSelect items={items} value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          aria-labelledby={id}
          className={cn(
            'h-10 w-full cursor-pointer rounded-md data-[size=default]:h-10 bg-card px-2.5 py-2 text-[15px] hover:border-primary disabled:border-dashed disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-70 dark:bg-card dark:hover:bg-card dark:disabled:bg-secondary',
            triggerClassName,
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </UiSelect>
    </Field>
  );
}
