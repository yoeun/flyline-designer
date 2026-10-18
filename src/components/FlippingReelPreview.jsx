import { useEffect, useRef } from 'react';
import { SIDES, spinCage } from '../lib/reelFrames.js';
import { cn } from '@/lib/utils';
import ReelPreview from './ReelPreview.jsx';

// A ReelPreview with both sides drawn back to back, so changing `side` turns the reel over rather than
// swapping the drawing; nothing else rotates it. Takes ReelPreview's props: the title gets the side, and
// svgRef goes to the side facing out (it's what exports). className sizes the outer box, svgClassName
// each drawing. Each time spins goes up, the spool spins on the side facing out: from the drag side, the spool
// seen through the frame.
export default function FlippingReelPreview({ side = 'drag', spins = 0, title, svgRef, className, svgClassName, ...props }) {
  const faces = useRef({});
  useEffect(() => {
    if (spins) spinCage(faces.current[side]);
  }, [spins]);
  return (
    <span className={cn('block perspective-[1600px]', className)}>
      <span className={cn('grid h-full transition-transform duration-500 ease-in-out transform-3d motion-reduce:transition-none', side === 'spool' && 'rotate-y-180')}>
        {SIDES.map(([value, label]) => (
          <span key={value} ref={(el) => {
            faces.current[value] = el;
          }} className={cn('h-full min-h-0 [grid-area:1/1] backface-hidden', value === 'spool' && 'rotate-y-180')} aria-hidden={value !== side}>
            <ReelPreview {...props} side={value} svgRef={value === side ? svgRef : undefined} title={title && `${title}, ${label.toLowerCase()} side`} className={svgClassName} />
          </span>
        ))}
      </span>
    </span>
  );
}
