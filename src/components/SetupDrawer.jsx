import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LINE_PRESETS, LINE_TYPES, REEL_COLORS, REELS, findById, hexOf, lineColorway, nameOf, presetForLine } from '../data/catalog.js';
import { totalLength, zoneRanges } from '../lib/geometry.js';
import { STYLES, displayName } from '../lib/rack.js';
import { SIDES } from '../lib/reelFrames.js';
import { STAGE } from '../lib/theme.js';
import Button from './Button.jsx';
import Checks from './Checks.jsx';
import PreviewModeToggle from './PreviewModeToggle.jsx';
import ReelPreview from './ReelPreview.jsx';
import Segmented from './Segmented.jsx';

const ft = (n) => `${Math.round(n * 10) / 10} ft`;

const Dot = ({ hex }) => <span className="inline-block size-3.5 flex-none rounded-full border border-swatch-ring" style={{ background: hex }} aria-hidden="true" />;

// A labelled block of details: a small heading over its rows.
function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-2 border-t border-border px-4 pt-3.5">
      <h3 className="font-heading text-[13px] font-bold tracking-[0.06em] text-muted-foreground uppercase">{title}</h3>
      <dl className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-1.5 text-[14px]">{children}</dl>
    </section>
  );
}

const Row = ({ label, children }) => (
  <>
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">{children}</dd>
  </>
);

function SetupDetails({ setup, theme, onOpenCopy }) {
  const [side, setSide] = useState('drag');
  const [mode, setMode] = useState('reel');
  const name = displayName(setup);
  const reel = findById(REELS, setup.reel.model);
  const reelColor = findById(REEL_COLORS, setup.reel.color);
  const preset = findById(LINE_PRESETS, presetForLine(setup.line));
  const colorway = lineColorway(preset, setup.line);
  const type = findById(LINE_TYPES, setup.line.type);
  const styles = STYLES.filter((s) => setup.styles?.includes(s.id));
  const { front, body, back, running } = setup.line.taper;

  return (
    <>
      <SheetHeader className="pr-12">
        <SheetTitle className="font-heading text-[20px] leading-tight font-bold tracking-[0.04em] uppercase">{name}</SheetTitle>
        <SheetDescription>
          {reel?.name ?? 'Reel'} · {setup.line.weight} wt{styles.length > 0 && ` · ${styles.map((s) => s.name).join(', ')}`}
        </SheetDescription>
      </SheetHeader>

      {/* The preview on top, as in the designer: side and view toggles, then the checks. */}
      <div className="mx-4 flex flex-col items-center gap-2 rounded-panel bg-stage p-3 text-stage-foreground">
        <div className="flex flex-wrap justify-end gap-2 self-stretch">
          <Segmented label="Reel side" options={SIDES} value={side} onChange={setSide} />
          <PreviewModeToggle value={mode} onChange={setMode} />
        </div>
        <ReelPreview setup={setup} mode={mode} side={side} background={STAGE[theme]} title={`${name} preview`} className="w-full max-w-[340px]" />
        <Checks setup={setup} />
      </div>

      {setup.notes && <p className="px-4 text-[14px] whitespace-pre-line">{setup.notes}</p>}

      <Section title="Reel">
        <Row label="Model">{reel?.name ?? setup.reel.model}</Row>
        <Row label="Color">
          {reelColor && <Dot hex={reelColor.hex} />}
          {reelColor?.name ?? setup.reel.color}
        </Row>
      </Section>

      <Section title="Fly line">
        <Row label="Line">{preset?.name ?? 'Custom line'}</Row>
        <Row label="Type">
          {type?.name ?? setup.line.type} · {setup.line.weight} wt
        </Row>
        <Row label="Colors">
          <span className="flex flex-col gap-1">
            {zoneRanges(setup.line).map((z) => (
              <span key={z.index} className="flex items-center gap-2">
                <Dot hex={hexOf(z.color)} />
                {nameOf(z.color)}
                <span className="text-muted-foreground">{ft(z.length)}</span>
              </span>
            ))}
            {colorway && <span className="text-[13px] text-muted-foreground">{colorway.name} colorway</span>}
          </span>
        </Row>
        <Row label="Taper (ft)">
          <span className="grid w-full max-w-72 grid-cols-4 gap-1 text-center">
            {[
              ['Front', front],
              ['Body', body],
              ['Back', back],
              ['Running', running],
            ].map(([label, length]) => (
              <span key={label} className="flex flex-col rounded-md bg-muted px-1 py-1">
                <span className="font-mono text-[13px] tabular-nums">{Math.round(length * 10) / 10}</span>
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </span>
            ))}
          </span>
        </Row>
        <Row label="Length">{ft(totalLength(setup.line))}</Row>
      </Section>

      <Section title="Backing">
        <Row label="Color">
          <Dot hex={hexOf(setup.backing.color)} />
          {nameOf(setup.backing.color)}
        </Row>
        <Row label="Amount">
          {setup.backing.yards} yd of {setup.backing.pounds} lb
        </Row>
      </Section>

      {onOpenCopy && (
        <SheetFooter className="border-t border-border">
          <Button variant="primary" onClick={() => onOpenCopy(setup)}>
            Open a copy in the designer
          </Button>
        </SheetFooter>
      )}
    </>
  );
}

// A setup's preview and full details, in a drawer from the right. The last setup stays drawn while the
// drawer slides closed.
export default function SetupDrawer({ setup, theme, onOpenCopy, onClose }) {
  const [shown, setShown] = useState(setup);
  if (setup && setup !== shown) setShown(setup);

  return (
    <Sheet open={Boolean(setup)} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="right" className="w-full gap-3.5 overflow-y-auto pb-4 sm:max-w-md">
        {shown && <SetupDetails key={shown.id} setup={shown} theme={theme} onOpenCopy={onOpenCopy} />}
      </SheetContent>
    </Sheet>
  );
}
