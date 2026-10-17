import { Button as UiButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// The app's buttons, on shadcn's Button. Wraps ui/ so the rest of the app never imports it directly.
// On touch screens (pointer-coarse) every button is at least 44px tall, the smallest comfortable tap.
const VARIANTS = {
  default: ['outline', 'h-auto min-h-10 rounded-md border-input bg-card px-3.5 py-2 text-[15px] pointer-coarse:min-h-11 hover:border-primary hover:bg-card dark:border-input dark:bg-card dark:hover:bg-card'],
  primary: ['default', 'h-auto min-h-10 rounded-md border-primary px-3.5 py-2 text-[15px] font-semibold pointer-coarse:min-h-11 hover:bg-primary'],
  link: ['link', 'h-auto border-0 px-0 py-2 text-[14px] font-normal pointer-coarse:min-h-11 disabled:opacity-45'],
  ghost: ['ghost', 'h-auto border-0 font-normal whitespace-normal pointer-coarse:min-h-11'],
};

export default function Button({ variant = 'default', className, ...props }) {
  const [base, classes] = VARIANTS[variant];
  return <UiButton type="button" variant={base} className={cn(classes, className)} {...props} />;
}
