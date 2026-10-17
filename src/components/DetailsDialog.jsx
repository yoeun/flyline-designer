import { useState } from 'react';
import Button from './Button.jsx';
import Field from './Field.jsx';
import { Input } from './Input.jsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { STYLES } from '../lib/rack.js';

const HEADINGS = { edit: 'Title, styles and notes', save: 'Save to rack', 'save-changes': 'Save changes', 'save-as-new': 'Save as new' };

function DetailsForm({ mode, details, fallbackTitle, onSubmit, onClose }) {
  const [title, setTitle] = useState(details.title ?? '');
  const [styles, setStyles] = useState(details.styles ?? []);
  const [notes, setNotes] = useState(details.notes ?? '');

  // Keep the styles in STYLES order, whatever order they were ticked in.
  const toggle = (id) =>
    setStyles((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return STYLES.map((x) => x.id).filter((x) => next.has(x));
    });
  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title: title.trim(), styles, notes: notes.trim() });
  };

  return (
    <form onSubmit={submit} className="contents">
      <DialogHeader>
        <DialogTitle>{HEADINGS[mode]}</DialogTitle>
      </DialogHeader>
      <Field label="Title" htmlFor="details-title">
        <Input id="details-title" value={title} placeholder={fallbackTitle} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <fieldset className="flex flex-col gap-1.5 text-[14px]">
        <legend className="mb-1.5 text-muted-foreground">Style</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {STYLES.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 text-[15px]">
              <input type="checkbox" className="size-4 accent-primary" checked={styles.includes(s.id)} onChange={() => toggle(s.id)} />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Notes" htmlFor="details-notes">
        <Textarea id="details-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="max-h-36 min-h-20 overflow-y-auto text-[15px] md:text-[15px]" />
      </Field>
      <DialogFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" type="submit">
          {mode === 'edit' ? 'Done' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Title, styles and notes for a setup. Edits stay in the dialog until it is submitted; Cancel drops them.
// The form mounts fresh on each open, so it always starts from the current details.
export default function DetailsDialog({ open, mode, details, fallbackTitle, onSubmit, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DetailsForm mode={mode} details={details} fallbackTitle={fallbackTitle} onSubmit={onSubmit} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
