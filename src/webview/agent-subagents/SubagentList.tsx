import { Subagent } from '../../model/types';
import { SubagentRow } from './SubagentRow';

interface SubagentListProps {
  subagents: Subagent[];
}

// The sub-agents a session has out, in the order it started them. The left rule is what says they
// belong to the row above rather than being rows of their own — they aren't processes, and nothing
// in the row's menu applies to one.
//
// Loosely spaced on purpose. The list is closed until you ask for it, so it isn't competing with
// anything for the room, and a stack of three-line entries a hair apart reads as one block rather
// than as three sub-agents.
export const SubagentList = ({ subagents }: SubagentListProps) => (
  <ul className="flex min-w-0 flex-col gap-4 border-l border-border py-1 pl-4">
    {subagents.map((subagent) => (
      <SubagentRow key={subagent.id} subagent={subagent} />
    ))}
  </ul>
);
