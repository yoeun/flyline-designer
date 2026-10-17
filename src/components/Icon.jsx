import { cn } from '@/lib/utils';

// Material Symbols ligatures, like the rest of the app, instead of shadcn's default lucide icons.
export default function Icon({ name, className }) {
  return (
    <span className={cn('icon pointer-events-none', className)} aria-hidden="true">
      {name}
    </span>
  );
}
