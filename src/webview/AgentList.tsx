import { AgentSession, Deliverable } from '../model/types';
import { AgentRobotRow } from './AgentRobotRow';
import { AgentRow } from './AgentRow';
import { AgentViewMode } from './agent-view-modes';
import { CollapsibleHeading } from './CollapsibleHeading';
import { plural } from './format-size';

interface AgentListProps {
  // Absent when there's only one group to show, which is the no-folder-open case — a lone
  // "Elsewhere" heading would be answering a question nobody asked.
  title?: string;
  agents: AgentSession[];
  mode: AgentViewMode;
  now: number;
  workspaceRoot: string | undefined;
  // Ignored without a title: the heading is the control, so a group that has no heading has
  // nothing to fold from and stays open.
  collapsed: boolean;
  onToggle: () => void;
  onOpen: (agent: AgentSession) => void;
  onAnalyze: (agent: AgentSession) => void;
  onOpenLog: (agent: AgentSession) => void;
  onOpenDeliverable: (deliverable: Deliverable) => void;
  onCopySessionId: (agent: AgentSession) => void;
  onKill: (agent: AgentSession) => void;
}

// One group of agents under its heading, folding from it. The count stays in the heading, so a
// folded group still says how many agents are in it.
//
// The mode picks a row component and changes nothing else — both draw the same sessions, in the
// same order, under the same headings.
export const AgentList = ({
  title,
  agents,
  mode,
  now,
  workspaceRoot,
  collapsed,
  onToggle,
  onOpen,
  onAnalyze,
  onOpenLog,
  onOpenDeliverable,
  onCopySessionId,
  onKill
}: AgentListProps) => {
  if (agents.length === 0) return null;

  const Row = mode === 'robots' ? AgentRobotRow : AgentRow;
  const hidden: boolean = Boolean(title) && collapsed;

  return (
    <section className="flex flex-col gap-1">
      {title && (
        <CollapsibleHeading
          title={title}
          note={plural(agents.length, 'agent')}
          collapsed={collapsed}
          onToggle={onToggle}
        />
      )}

      {!hidden &&
        agents.map((agent) => (
          <Row
            key={agent.sessionId}
            agent={agent}
            now={now}
            workspaceRoot={workspaceRoot}
            onOpen={onOpen}
            onAnalyze={onAnalyze}
            onOpenLog={onOpenLog}
            onOpenDeliverable={onOpenDeliverable}
            onCopySessionId={onCopySessionId}
            onKill={onKill}
          />
        ))}
    </section>
  );
};
