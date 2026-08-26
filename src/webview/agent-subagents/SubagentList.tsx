import { Subagent } from '../../model/types';
import { SubagentRow } from './SubagentRow';

interface SubagentListProps {
  subagents: Subagent[];
}

// The sub-agents a session has out, in the order it started them. The left rule is what says they
// belong to the row above rather than being rows of their own — they aren't processes, and nothing
// in the row's menu applies to one.
export const SubagentList = ({ subagents }: SubagentListProps) => (
  <ul className="flex min-w-0 flex-col gap-2 border-l border-border pl-3">
    {subagents.map((subagent) => (
      <SubagentRow key={subagent.id} subagent={subagent} />
    ))}
  </ul>
);
