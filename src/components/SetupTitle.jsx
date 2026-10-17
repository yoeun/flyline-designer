import Icon from './Icon.jsx';

// Top-left of the preview: the setup's name with a notes button, the reel under it, and "Unsaved" for a new setup.
export default function SetupTitle({ name, subtitle, isNew, detailsChanged, onOpenDetails }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5 text-left">
      <div className="flex max-w-full items-center gap-1.5">
        <h2 className="truncate font-heading text-[20px] leading-tight font-bold tracking-[0.04em] uppercase" title={name}>
          {name}
        </h2>
        <button
          type="button"
          onClick={onOpenDetails}
          aria-label="Edit title, styles and notes"
          title="Title, styles and notes"
          className="relative flex-none cursor-pointer rounded-md p-1 pointer-coarse:grid pointer-coarse:size-11 pointer-coarse:place-items-center text-stage-foreground/80 hover:bg-white/10 hover:text-stage-foreground"
        >
          <Icon name="sticky_note_2" />
          {detailsChanged && <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-orange-500" aria-label="Changed" />}
        </button>
      </div>
      <p className="max-w-full truncate text-[13px] text-stage-foreground/70">{subtitle}</p>
      {isNew && <p className="text-[12px] text-stage-foreground/60">Unsaved</p>}
    </div>
  );
}
