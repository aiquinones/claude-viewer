import { CSSProperties, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { AgentSession, ConfigSnapshot } from '../../model/types';
import { Button } from '@/components/ui/button';
import { AgentList } from '../AgentList';
import { AGENT_VIEW_MODES, AgentViewMode, DEFAULT_AGENT_VIEW_MODE } from '../agent-view-modes';
import { PanelActions } from '../PanelActions';
import { ViewModeToggle } from '../ViewModeToggle';
import { activityOf } from '../agent-activity';
import { AgentGroups, groupByWorkspace } from '../agent-groups';
import { plural } from '../format-size';
import { surfaceAccent } from '../surfaces';
import { useNow } from '../useNow';

// How often the rows re-age. Everything under a minute is printed in seconds, so anything slower
// than this would visibly stall.
//
// This is not the refresh. Nothing is re-read on this tick — `now` changes and every value on
// screen is recomputed from agent data already in memory, which only a poll in the host can
// replace. The two rates are independent and answer different questions: this one keeps the age
// honest about time passing, AGENT_POLL_MS keeps it honest about the agent.
const TICK_MS: number = 1000;

interface AgentsViewProps {
  // The live processes, on their own message. The snapshot is here only for the workspace root,
  // which is what "this workspace" is measured against.
  agents: AgentSession[];
  snapshot: ConfigSnapshot;
  // Which list the toggle opens on. The panel never passes it — it's here so a story can open on
  // either one, since the mode is state and nothing outside can reach in and set it.
  initialMode?: AgentViewMode;
  onOpenFile: (path: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// Every agent session running right now — Claude Code and Copilot CLI both — grouped by where it's
// working rather than by which tool it is. The only surface whose rows change without the disk
// changing, hence the clock.
export const AgentsView = ({
  agents,
  snapshot,
  initialMode = DEFAULT_AGENT_VIEW_MODE,
  onOpenFile,
  onSearch,
  onRefresh,
  onBack
}: AgentsViewProps) => {
  const now: number = useNow(TICK_MS);
  // Which of the two lists is up. React state, like the skills toggle: it survives a round trip to
  // the landing page and nothing more.
  const [mode, setMode] = useState<AgentViewMode>(initialMode);
  const { here, elsewhere }: AgentGroups = groupByWorkspace({
    agents,
    workspaceRoot: snapshot.workspaceRoot
  });

  // Every agent listed is a live process; this is how many are mid-turn rather than waiting on you.
  const busy: number = agents.filter((agent) => activityOf({ agent, now }) !== 'idle').length;

  return (
    <div
      className="flex h-full flex-col"
      style={{ '--surface-accent': surfaceAccent('active-agents') } as CSSProperties}
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" title="Back" onClick={onBack}>
          <ChevronLeft />
        </Button>
        <div className="mr-auto flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold">Active Agents</span>
          <span className="truncate text-xs text-muted-foreground">
            {agents.length === 0
              ? 'nothing running'
              : `${plural(agents.length, 'session')} · ${busy} working`}
          </span>
        </div>
        <ViewModeToggle modes={AGENT_VIEW_MODES} mode={mode} onChange={setMode} />
        <PanelActions onSearch={onSearch} onRefresh={onRefresh} />
      </header>

      {agents.length === 0 ? (
        <Empty />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <div className="flex flex-col gap-5 px-2 py-3">
            <AgentList
              title="This workspace"
              agents={here}
              mode={mode}
              now={now}
              workspaceRoot={snapshot.workspaceRoot}
              onOpen={(agent) => onOpenFile(agent.transcriptPath)}
            />
            <AgentList
              title={snapshot.workspaceRoot ? 'Elsewhere' : undefined}
              agents={elsewhere}
              mode={mode}
              now={now}
              workspaceRoot={snapshot.workspaceRoot}
              onOpen={(agent) => onOpenFile(agent.transcriptPath)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Empty = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No agent sessions running. A Claude Code or Copilot CLI session appears here as soon as you start
    it — anywhere on this machine, not only in this folder.
  </div>
);
