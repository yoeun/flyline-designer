import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { reelColors, reelSizeLabel } from '../data/catalog.js';
import { previewSetup } from '../lib/reelsPage.js';
import { SIDES } from '../lib/reelFrames.js';
import ReelPreview from './ReelPreview.jsx';
import Segmented from './Segmented.jsx';
import Swatches from './Swatches.jsx';

// One reel size drawn as large as the screen allows, with a Drag/Spool toggle in the preview's corner
// and the reel's finishes along its bottom. It fills the screen on a phone and is a large dialog on wider
// screens. `shown` is { size, color, lineColors, side, showLine }, or null. Picking a finish here
// recolors only this view; the reel's card keeps its own.
function Viewer({ shown }) {
  const [side, setSide] = useState(shown.side);
  const [color, setColor] = useState(shown.color);
  const finishes = reelColors(shown.size);
  const setup = previewSetup(shown.size, color, shown.lineColors);
  return (
    <>
      <DialogHeader className="flex-none pr-10">
        <DialogTitle className="font-heading text-[18px] font-bold tracking-[0.04em] uppercase">{shown.size.name}</DialogTitle>
        <DialogDescription>{reelSizeLabel(shown.size)}</DialogDescription>
      </DialogHeader>
      {/* The preview: the side toggle at the top right as in the designer, the reel, then its finishes.
          The rows stack, so a second row of finishes shrinks the reel rather than covering it. */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-panel bg-stage p-3 text-stage-foreground">
        <div className="flex flex-none justify-end">
          <Segmented label="Reel side" options={SIDES} value={side} onChange={setSide} />
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <ReelPreview setup={setup} side={side} showLine={shown.showLine} background="none" title={`${shown.size.name}, ${side} side`} className="max-h-full w-auto max-w-full" />
        </div>
        {finishes.length > 1 && (
          <Swatches colors={finishes} value={setup.reel.color} onChange={setColor} label={`${shown.size.name} color`} size={24} touchSize={32} className="flex-none justify-center gap-3" />
        )}
      </div>
      <p className="flex-none text-center font-mono text-[12px] text-muted-foreground tabular-nums">
        rim {shown.size.rim}″ · spool {shown.size.spool}″ · width {shown.size.width}″
      </p>
    </>
  );
}

export default function ReelViewer({ shown, onClose }) {
  // The last reel stays drawn while the dialog fades out.
  const [last, setLast] = useState(shown);
  if (shown && shown !== last) setLast(shown);
  return (
    <Dialog open={Boolean(shown)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex flex-col gap-3 max-sm:inset-0 max-sm:h-dvh max-sm:max-h-dvh max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:ring-0 sm:h-[min(90dvh,820px)] sm:max-w-2xl">
        {last && <Viewer key={`${last.size.id}-${last.side}`} shown={last} />}
      </DialogContent>
    </Dialog>
  );
}
