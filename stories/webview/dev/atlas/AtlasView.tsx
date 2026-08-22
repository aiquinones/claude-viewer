import { CSSProperties, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@src/webview/components/ui/button';
import { Z } from '@src/webview/z-layers';
import { AtlasCard } from './AtlasCard';
import { AtlasNode, trailNodes } from './atlas-nodes';
import { Boundary } from './Boundary';

interface AtlasViewProps {
  // Where to open, as ids under the root: `host/stores`. How a URL arg lands you on one node.
  initialPath?: string;
}

const toTrail = (path: string | undefined): string[] =>
  (path ?? '').split('/').filter((id) => id.length > 0);

// The architecture, one node at a time. A dev tool: it lives in a story, and the extension's
// esbuild bundles never reach it.
//
// `h-screen` rather than `h-full` — nothing outside ViewSlider sets a height in this webview.
export const AtlasView = ({ initialPath }: AtlasViewProps) => {
  const [trail, setTrail] = useState<string[]>(toTrail(initialPath));

  // The URL is allowed to change under a live story, and it wins over whatever was clicked.
  useEffect(() => setTrail(toTrail(initialPath)), [initialPath]);

  const nodes: AtlasNode[] = trailNodes(trail);
  const node: AtlasNode = nodes[nodes.length - 1];

  return (
    <div className="flex h-screen flex-col" style={{ '--surface-accent': node.accent } as CSSProperties}>
      <Header nodes={nodes} onGo={(depth) => setTrail(trail.slice(0, depth))} />

      <div
        style={{ zIndex: Z.contained }}
        className="relative min-h-0 flex-1 overflow-y-auto overflow-x-clip px-5 pb-10 pt-4"
      >
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{node.blurb}</p>

        {node.diagram === 'boundary' && (
          <div className="pt-5">
            <Boundary />
          </div>
        )}

        <Children node={node} onOpen={(child) => setTrail([...trail, child.id])} />
      </div>
    </div>
  );
};

interface HeaderProps {
  nodes: AtlasNode[];
  // The depth to cut the trail to — 0 is the root.
  onGo: (depth: number) => void;
}

const Header = ({ nodes, onGo }: HeaderProps) => (
  <header className="flex flex-col gap-1 border-b border-border px-4 py-3">
    <nav className="flex flex-wrap items-center gap-0.5 text-xs">
      {nodes.map((node: AtlasNode, index: number) => {
        const last: boolean = index === nodes.length - 1;
        return (
          <span key={node.id} className="flex items-center gap-0.5">
            {index > 0 && <ChevronRight className="size-3 text-muted-foreground" />}
            <Button
              variant="link"
              size="sm"
              onClick={() => onGo(index)}
              disabled={last}
              className={last ? 'px-1 font-semibold text-foreground disabled:opacity-100' : 'px-1'}
            >
              {node.title}
            </Button>
          </span>
        );
      })}
    </nav>
    <span className="px-1 text-xs text-muted-foreground">
      Architecture atlas · docs/architecture-map.md
    </span>
  </header>
);

interface ChildrenProps {
  node: AtlasNode;
  onOpen: (child: AtlasNode) => void;
}

const Children = ({ node, onOpen }: ChildrenProps) => {
  const children: AtlasNode[] = node.children ?? [];

  if (children.length === 0) {
    return (
      <p className="pt-6 text-sm italic text-muted-foreground">
        Not drawn yet — give this node children or a diagram in{' '}
        <span className="mono not-italic">atlas-nodes.ts</span>.
      </p>
    );
  }

  return (
    <div className="grid gap-3 pt-5 sm:grid-cols-2 xl:grid-cols-3">
      {children.map((child: AtlasNode) => (
        <AtlasCard key={child.id} node={child} onOpen={onOpen} />
      ))}
    </div>
  );
};
