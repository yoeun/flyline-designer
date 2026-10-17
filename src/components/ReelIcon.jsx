import { cn } from '@/lib/utils';

// A reel seen face-on: rim, six spokes and a hub. Custom, as Material Symbols has no reel. Sized like Icon.
const SPOKES = [0, 60, 120, 180, 240, 300].map((deg) => (deg * Math.PI) / 180);

export default function ReelIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-5 flex-none', className)} fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true">
      <ReelIconPaths />
    </svg>
  );
}

// The icon's shapes alone, for a caller that draws its own <svg>.
export function ReelIconPaths() {
  return (
    <>
      <circle cx="12" cy="12" r="9.5" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.6" fill="currentColor" stroke="none" />
      {SPOKES.map((a) => (
        <line key={a} x1={12 + 4.6 * Math.cos(a)} y1={12 + 4.6 * Math.sin(a)} x2={12 + 9.5 * Math.cos(a)} y2={12 + 9.5 * Math.sin(a)} strokeWidth="1.8" />
      ))}
    </>
  );
}
