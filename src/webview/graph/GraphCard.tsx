import { X } from 'lucide-react';
import { SkillGraphNode } from '../../model/types';
import { Button } from '@/components/ui/button';
import { ScopeBadge } from '../ScopeBadge';

interface GraphCardProps {
  node: SkillGraphNode;
  setElement: (element: HTMLDivElement | null) => void;
  // Selects the skill in the panel and goes back to reading it, which is what opening one means
  // from here.
  onOpenSkill: (path: string) => void;
  onClose: () => void;
}

// Pops out of the node you clicked and stays stuck to it while the graph settles — the wrapper's
// `translate` is written by the frame loop, so nothing inside may use that property.
export const GraphCard = ({ node, setElement, onOpenSkill, onClose }: GraphCardProps) => (
  <div ref={setElement} className="pointer-events-none absolute left-0 top-0 z-10">
    <div className="pointer-events-auto absolute left-1/2 top-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 shadow-xl">
      <div className="flex items-start gap-2">
        <Button
          variant="link"
          size="sm"
          className="h-auto min-w-0 justify-start p-0 text-xs font-semibold text-foreground"
          onClick={() => onOpenSkill(node.path)}
        >
          <span className="truncate">{node.name}</span>
        </Button>
        <ScopeBadge scope={node.scope} pluginName={node.pluginName} />
        <button
          type="button"
          aria-label="Close"
          className="ml-auto cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="size-3.5" />
        </button>
      </div>
      <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
        {node.description || 'no description'}
      </p>
    </div>
  </div>
);
