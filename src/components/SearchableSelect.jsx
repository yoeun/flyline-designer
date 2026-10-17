import { useId, useMemo, useRef } from 'react';
import { Combobox, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList } from '@/components/ui/combobox';
import Field from './Field.jsx';

// A select you can type into to filter. groups is [{ label, items: [{ value, label }] }];
// a group with no label renders its items without a heading. Wraps shadcn's combobox so the
// rest of the app never imports from ui/ directly.
export default function SearchableSelect({ label, grow = false, groups, value, onChange, placeholder = 'Search' }) {
  const id = useId();
  const inputRef = useRef(null);
  const selected = useMemo(() => {
    for (const group of groups) {
      const item = group.items.find((i) => i.value === value);
      if (item) return item;
    }
    return null;
  }, [groups, value]);
  // Select the field's text when it gets focus or the list opens, so typing replaces it with a
  // search. Wait a frame, or the click that opened it drops a caret instead.
  const selectText = () => requestAnimationFrame(() => inputRef.current?.select());

  // An explicit label rather than a wrapping <label>: while the list is open, Base UI hides
  // everything outside it from screen readers, and a wrapping label would lose the input's name.
  return (
    <Field label={label} labelId={`${id}-label`} htmlFor={id} grow={grow}>
      <Combobox items={groups} value={selected} onValueChange={(item) => item && onChange(item.value)} isItemEqualToValue={(a, b) => a.value === b.value} onOpenChange={(open, { reason }) => {
          // Typing opens the list too; selecting then would swallow the letter just typed.
          if (open && reason !== 'input-change') selectText();
        }} autoHighlight>
        <ComboboxInput
          id={id}
          aria-labelledby={`${id}-label`}
          placeholder={placeholder}
          // Sized and colored like the native selects beside it. text-base on phones keeps iOS from zooming in on focus.
          className="h-10 w-full rounded-[8px] bg-card hover:border-primary dark:bg-card [&_input]:text-ellipsis [&_input]:md:text-[15px]"
          ref={inputRef}
          onFocus={selectText}
        />
        {/* At least 18rem wide, so long names in the narrow Preset field stay on one line. */}
        <ComboboxContent className="min-w-72">
          <ComboboxEmpty>No matches</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <ComboboxGroup key={group.label ?? ''} items={group.items}>
                {group.label && <ComboboxLabel>{group.label}</ComboboxLabel>}
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
