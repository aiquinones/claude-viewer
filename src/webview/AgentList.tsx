import { AgentSession } from '../model/types';
import { AgentRobotRow } from './AgentRobotRow';
import { AgentRow } from './AgentRow';
import { AgentViewMode } from './agent-view-modes';
import { plural } from './format-size';

interface AgentListProps {
  // Absent when there's only one group to show, which is the no-folder-open case — a lone
  // "Elsewhere" heading would be answering a question nobody asked.
  title?: string;
  agents: AgentSession[];
  mode: AgentViewMode;
  now: number;
  workspaceRoot: string | undefined;
  onOpen: (agent: AgentSession) => void;
}

// One group of agents under its heading. No folding: the whole surface is usually four rows, and
// there's nothing here to fold away from.
//
// The mode picks a row component and changes nothing else — both draw the same sessions, in the
// same order, under the same headings.
export const AgentList = ({
  title,
  agents,
  mode,
  now,
  workspaceRoot,
  onOpen
}: AgentListProps) => {
  if (agents.length === 0) return null;

  const Row = mode === 'robots' ? AgentRobotRow : AgentRow;

  return (
    <section className="flex flex-col gap-1">
      {title && (
        <h2 className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title} <span className="normal-case font-normal">· {plural(agents.length, 'agent')}</span>
        </h2>
      )}

      {agents.map((agent) => (
        <Row
          key={agent.sessionId}
          agent={agent}
          now={now}
          workspaceRoot={workspaceRoot}
          onOpen={onOpen}
        />
      ))}
    </section>
  );
};
