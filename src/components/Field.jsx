import { cn } from '@/lib/utils';

// A labelled stack: muted label text over its control. grow lets it share a row with others.
// With htmlFor the label is a real <label>, so clicking it focuses that input.
export default function Field({ label, labelId, htmlFor, grow = false, className, children }) {
  const Label = htmlFor ? 'label' : 'span';
  return (
    <div className={cn('flex flex-col gap-1.5 text-[14px]', grow && 'min-w-0 flex-[1_1_140px]', className)}>
      <Label id={labelId} htmlFor={htmlFor} className="text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
