import { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Surface } from './surfaces';

interface SurfaceCardProps {
  surface: Surface;
  // One line under the blurb — whatever this surface counts, already formatted.
  detail: string;
  onOpen: (surface: Surface) => void;
}

// A card holding three lines of text is this big on purpose: the space is for the per-surface
// background animation that lands later. The accent arrives as --surface-accent, so one component
// covers every surface and styles.css does the mixing.
export const SurfaceCard = ({ surface, detail, onOpen }: SurfaceCardProps) => {
  const soon: boolean = surface.status === 'soon';

  return (
    <button
      type="button"
      onClick={() => onOpen(surface)}
      style={{ '--surface-accent': surface.accent } as CSSProperties}
      className={cn(
        'surface-card group relative flex aspect-[4/3] min-h-44 cursor-pointer flex-col justify-between',
        'overflow-hidden rounded-xl border p-5 text-left transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        soon && 'opacity-75'
      )}
    >
      {/* Stands in for the real animation — a soft accent wash that drifts on hover. */}
      <div
        aria-hidden
        className="surface-glow pointer-events-none absolute -right-10 -top-10 size-40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125"
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
