import { Button as UiButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// The app's buttons, on shadcn's Button. Wraps ui/ so the rest of the app never imports it directly.
const VARIANTS = {
  default: ['outline', 'h-auto min-h-10 rounded-md border-input bg-card px-3.5 py-2 text-[15px] hover:border-primary hover:bg-card dark:border-input dark:bg-card dark:hover:bg-card'],
  primary: ['default', 'h-auto min-h-10 rounded-md border-primary px-3.5 py-2 text-[15px] font-semibold hover:bg-primary'],
  link: ['link', 'h-auto border-0 px-0 py-2 text-[14px] font-normal disabled:opacity-45'],
  ghost: ['ghost', 'h-auto border-0 font-normal whitespace-normal'],
};

export default function Button({ variant = 'default', className, ...props }) {
  const [base, classes] = VARIANTS[variant];
  return <UiButton type="button" variant={base} className={cn(classes, className)} {...props} />;
}
