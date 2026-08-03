import { RefreshCw } from 'lucide-react';
import { ConfigSnapshot, SkillEntry } from '../../model/types';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '../SurfaceCard';
import { SURFACES, Surface, SurfaceId } from '../surfaces';

interface LandingViewProps {
  snapshot: ConfigSnapshot;
  onOpenSurface: (id: SurfaceId) => void;
  // A surface with no view yet. The host answers with a VS Code notification.
  onUnavailableSurface: (title: string) => void;
  onRefresh: () => void;
}

// The panel's home: which agent you're looking at, and one card per config surface. Adding a
// surface is adding an entry to SURFACES plus a line in `detailFor`.
export const LandingView = ({
  snapshot,
  onOpenSurface,
  onUnavailableSurface,
  onRefresh
}: LandingViewProps) => {
  const open = (surface: Surface): void =>
    surface.status === 'ready'
      ? onOpenSurface(surface.id)
      : onUnavailableSurface(surface.title);

  // overflow-x-clip is deliberate: `overflow-y-auto` alone makes the x axis compute to `auto`,
  // which quietly turns this into a horizontal scroll container too.
  return (
    <div className="flex h-full flex-col overflow-y-auto overflow-x-clip">
      <header className="flex items-start justify-between gap-3 px-6 pt-6 pb-5">
        <Heading workspaceRoot={snapshot.workspaceRoot} />
        <Button variant="ghost" size="icon" title="Refresh" onClick={onRefresh}>
          <RefreshCw />
        </Button>
      </header>

      {/* An explicit column count rather than auto-fit: the panel is narrow and the cards are the
          page, so they get a fixed shape instead of one that reflows with every dock width. */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-2">
        {SURFACES.map((surface) => (
          <SurfaceCard
            key={surface.id}
            surface={surface}
            detail={detailFor({ surface, skills: snapshot.skills })}
            onOpen={open}
          />
        ))}
      </div>
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
