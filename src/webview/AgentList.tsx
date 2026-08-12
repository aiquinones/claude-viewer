import { AgentSession } from '../model/types';
import { AgentRow } from './AgentRow';
import { plural } from './format-size';

interface AgentListProps {
  // Absent when there's only one group to show, which is the no-folder-open case — a lone
  // "Elsewhere" heading would be answering a question nobody asked.
  title?: string;
  agents: AgentSession[];
  now: number;
  workspaceRoot: string | undefined;
  onOpen: (agent: AgentSession) => void;
}

// One group of agents under its heading. No folding: the whole surface is usually four rows, and
// there's nothing here to fold away from.
export const AgentList = ({ title, agents, now, workspaceRoot, onOpen }: AgentListProps) => {
  if (agents.length === 0) return null;

  return (
    <section className="flex flex-col gap-1">
      {title && (
        <h2 className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title} <span className="normal-case font-normal">· {plural(agents.length, 'agent')}</span>
        </h2>
      )}

      {agents.map((agent) => (
        <AgentRow
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
