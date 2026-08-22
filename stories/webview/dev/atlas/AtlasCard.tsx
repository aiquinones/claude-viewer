import { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@src/webview/lib/utils';
import { Badge } from '@src/webview/components/ui/badge';
import { useCursorGlow } from '@src/webview/glow/useCursorGlow';
import { AtlasNode } from './atlas-nodes';

interface AtlasCardProps {
  node: AtlasNode;
  onOpen: (node: AtlasNode) => void;
}

// One piece of the architecture, as a card. The landing page's card in every respect that shows —
// same .surface-card mixing, same glow — because a node here is the same act of opening a surface.
export const AtlasCard = ({ node, onOpen }: AtlasCardProps) => {
  const { cardRef, glowRef } = useCursorGlow<HTMLButtonElement>();
  const children: number = node.children?.length ?? 0;

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onOpen(node)}
      style={{ '--surface-accent': node.accent } as CSSProperties}
      className={cn(
        'surface-card group relative flex min-h-36 cursor-pointer flex-col justify-between',
        // clip, not hidden: hidden keeps a scrollport and the glow sits past the corner.
        'overflow-clip rounded-xl border p-4 text-left transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
      )}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="surface-glow pointer-events-none absolute -right-10 -top-10 size-32 rounded-full blur-2xl group-hover:scale-125"
      />

      <div className="relative flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">{node.title}</span>
          {node.diagram && <Badge variant="muted">Drawn</Badge>}
        </div>
        <span className="text-xs leading-relaxed text-muted-foreground">{node.blurb}</span>
      </div>

      <div className="relative flex w-full items-center justify-between gap-2 pt-3">
        <span className="text-xs text-muted-foreground">
          {children === 0 ? 'Nothing under it yet' : `${children} inside`}
        </span>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
};
