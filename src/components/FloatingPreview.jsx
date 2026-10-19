import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ReelPreview from './ReelPreview.jsx';

// A small copy of the preview, pinned at the top right under the header, once the real one and the
// rack under it have scrolled up out of sight, so it never covers either. On a narrow screen the options sit below the preview, so this keeps the
// reel in view while editing them. Tapping it scrolls back to the preview. Wide screens keep the
// preview beside the options, so it never shows there.
export default function FloatingPreview({ targetRef, untilRef, setup, mode, side, background }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const target = untilRef.current;
    if (!target) return;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
    const observer = new IntersectionObserver(
      // Only once it is wholly above the viewport, not before the page has scrolled to it.
      ([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < header),
      { rootMargin: `-${header}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [untilRef]);

  return (
    <button
      type="button"
      onClick={() => targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
      aria-label="Scroll to preview"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={cn(
        'fixed top-[calc(var(--header-h)+8px)] right-2 z-20 w-48 cursor-pointer rounded-panel bg-stage p-3 shadow-[-4px_6px_20px_rgba(0,0,0,0.22)] ring-1 ring-black/20 transition-[opacity,scale] duration-200 wide:hidden',
        shown ? 'opacity-100' : 'pointer-events-none scale-90 opacity-0',
      )}
    >
      <ReelPreview setup={setup} mode={mode} side={side} background={background} />
    </button>
  );
}
