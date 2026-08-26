import { Subagent } from '../../model/types';
import { AgentContext } from '../AgentContext';

interface SubagentRowProps {
  subagent: Subagent;
}

// One sub-agent: what kind it is, what it was asked to do, what model it runs, and how full its own
// context has grown.
//
// The purpose is the model's one-line description of the job it delegated, which is the only tool
// argument this surface prints — every other one is the agent's own work, and the row already falls
// back to the session's last prompt for its title. A sub-agent whose `task` call fell outside the
// window read has none, and then the type is all there is to say.
//
// The bar is the row's own `AgentContext`, card included: it's the same claim about the same kind of
// number, read against the same window table, so it should look identical. Absent while the
// sub-agent hasn't finished a request — an empty track would say its context was empty.
export const SubagentRow = ({ subagent }: SubagentRowProps) => (
  <li className="flex min-w-0 flex-col gap-1">
    <span className="flex w-full min-w-0 items-baseline gap-2">
      <span className="mono shrink-0 text-xs text-muted-foreground">{agentType(subagent)}</span>
      {subagent.purpose && <span className="truncate text-xs">{subagent.purpose}</span>}
      {subagent.model && (
        <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">{subagent.model}</span>
      )}
    </span>
    <AgentContext context={subagent.context} />
  </li>
);

// The agent id the session picked — `general-purpose`. The display name is the fallback rather than
// the first choice: it's a sentence-cased title where the rest of this line is mono, and the id is
// what you'd go looking for in the agent config.
const agentType = (subagent: Subagent): string =>
  subagent.name || subagent.displayName || 'subagent';
