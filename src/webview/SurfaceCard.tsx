import { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useCursorGlow } from './glow/useCursorGlow';
import { Surface } from './surfaces';

interface SurfaceCardProps {
  surface: Surface;
  // One line under the blurb — whatever this surface counts, already formatted.
  detail: string;
  onOpen: (surface: Surface) => void;
}

// A card holding three lines of text is this big on purpose: the space is what the glow moves
// through. The accent arrives as --surface-accent, so one component covers every surface and
// styles.css does the mixing.
export const SurfaceCard = ({ surface, detail, onOpen }: SurfaceCardProps) => {
  const soon: boolean = surface.status === 'soon';
  const { cardRef, glowRef } = useCursorGlow<HTMLButtonElement>();

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onOpen(surface)}
      style={{ '--surface-accent': surface.accent } as CSSProperties}
      className={cn(
        // The 4:3 shape only holds two-across. Stacked, the card is the full panel width and the
        // ratio would make it as tall as the panel is wide, so below `sm:` it keeps the floor.
        'surface-card group relative flex min-h-44 cursor-pointer flex-col justify-between sm:aspect-[4/3]',
        // `overflow-clip` rather than hidden: hidden keeps a scrollport, and a glow sitting past
        // the bottom-right corner extends it — a focus inside the card could then scroll it.
        'overflow-clip rounded-xl border p-5 text-left transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        soon && 'opacity-75'
      )}
    >
      {/* Parked in the corner, and pulled to the cursor by useCursorGlow while you're over the
          card. No `transition-transform` — in v4 that covers `translate` too, and a CSS transition
          on the property the frame loop writes fights it every frame. Scale eases in styles.css. */}
      <div
        ref={glowRef}
        aria-hidden
        className="surface-glow pointer-events-none absolute -right-10 -top-10 size-40 rounded-full blur-2xl group-hover:scale-125"
      />

      <div className="relative flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{surface.title}</span>
          {soon && <Badge variant="muted">Soon</Badge>}
        </div>
        <span className="text-xs leading-relaxed text-muted-foreground">{surface.blurb}</span>
      </div>

      <div className="relative flex w-full items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{detail}</span>
        {!soon && (
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
    </button>
  );
};
