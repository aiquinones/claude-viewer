import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ConfigSnapshot, SkillEntry } from '../../model/types';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '../SurfaceCard';
import { SURFACES, Surface, SurfaceId } from '../surfaces';

interface LandingViewProps {
  snapshot: ConfigSnapshot;
  onOpenSurface: (id: SurfaceId) => void;
  onRefresh: () => void;
}

// The panel's home: which agent you're looking at, and one card per config surface. Adding a
// surface is adding an entry to SURFACES plus a line in `detailFor`.
export const LandingView = ({ snapshot, onOpenSurface, onRefresh }: LandingViewProps) => {
  const [note, setNote] = useState<string | undefined>(undefined);

  const open = (surface: Surface): void => {
    if (surface.status === 'ready') return onOpenSurface(surface.id);
    setNote(`${surface.title} is coming soon — ${surface.blurb}`);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <header className="flex items-start justify-between gap-3 px-6 pt-6 pb-5">
        <Heading workspaceRoot={snapshot.workspaceRoot} />
        <Button variant="ghost" size="icon" title="Refresh" onClick={onRefresh}>
          <RefreshCw />
        </Button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 px-6 pb-6 md:max-w-3xl">
        {SURFACES.map((surface) => (
          <SurfaceCard
            key={surface.id}
            surface={surface}
            detail={detailFor({ surface, skills: snapshot.skills })}
            onOpen={open}
          />
        ))}
      </div>

      {note && (
        <p className="px-6 pb-6 text-xs text-muted-foreground" role="status">
          {note}
        </p>
      )}
    </div>
  );
};

interface HeadingProps {
  workspaceRoot: string | undefined;
}

// No folder open is a normal state, not an error — say which scopes still resolve rather than
// leaving the line blank.
const Heading = ({ workspaceRoot }: HeadingProps) => {
  if (!workspaceRoot) {
    return (
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold">Viewing agent</h1>
        <span className="text-xs text-muted-foreground">
          No folder open — user and plugin scopes only
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h1 className="truncate text-base font-semibold">
        Viewing agent on <span className="mono">{folderName(workspaceRoot)}</span>
      </h1>
      <span className="mono truncate text-xs text-muted-foreground" title={workspaceRoot}>
        {workspaceRoot}
      </span>
    </div>
  );
};

interface DetailForArgs {
  surface: Surface;
  skills: SkillEntry[];
}

const detailFor = ({ surface, skills }: DetailForArgs): string => {
  if (surface.status === 'soon') return 'Not built yet';
  if (skills.length === 0) return 'None found';

  const shadowed: number = skills.filter((skill) => skill.shadowedBy).length;
  const found: string = `${skills.length} found`;
  return shadowed > 0 ? `${found} · ${shadowed} shadowed` : found;
};

// The webview can't import node:path, and the last segment is all the heading needs.
const folderName = (path: string): string => path.split(/[/\\]/).filter(Boolean).pop() ?? path;
