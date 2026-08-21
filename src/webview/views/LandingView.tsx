import { AgentSession, ConfigSnapshot } from '../../model/types';
import { UsageReport } from '../../model/usage/types';
import { PanelActions } from '../PanelActions';
import { SurfaceCard } from '../SurfaceCard';
import { useEstimate } from '../settings/SettingsContext';
import { SURFACES, Surface, SurfaceId, getDetailForSurface } from '../surfaces';

interface LandingViewProps {
  snapshot: ConfigSnapshot;
  // Separate from the snapshot, so a card can count live agents without the config being re-read.
  agents: AgentSession[];
  // Same again, and this one arrives after the page is already up.
  usage: UsageReport | undefined;
  onOpenSurface: (id: SurfaceId) => void;
  // A surface with no view yet. The host answers with a VS Code notification.
  onUnavailableSurface: (title: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
}

// The panel's home: which agent you're looking at, and one card per config surface.
export const LandingView = ({
  snapshot,
  agents,
  usage,
  onOpenSurface,
  onUnavailableSurface,
  onSearch,
  onRefresh
}: LandingViewProps) => {
  const estimate = useEstimate();

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
        <PanelActions onSearch={onSearch} onRefresh={onRefresh} />
      </header>

      {/* An explicit column count rather than auto-fit: the panel is narrow and the cards are the
          page, so they get a fixed shape instead of one that reflows with every dock width. */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-2">
        {SURFACES.map((surface) => (
          <SurfaceCard
            key={surface.id}
            surface={surface}
            detail={getDetailForSurface({ surface, snapshot, agents, usage, estimate })}
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

// The webview can't import node:path, and the last segment is all the heading needs.
const folderName = (path: string): string => path.split(/[/\\]/).filter(Boolean).pop() ?? path;
