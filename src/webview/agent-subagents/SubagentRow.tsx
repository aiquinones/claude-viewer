import { Subagent } from '../../model/types';
import { AgentContext } from '../AgentContext';

interface SubagentRowProps {
  subagent: Subagent;
}

// One sub-agent: what kind it is, what it was asked to do, what model it runs, and how full its own
// context has grown.
//
// It takes the room a dense row can't: nothing here is drawn until you open the list, so a
// sub-agent gets three lines where the session it belongs to gets one.
//
// The purpose is the model's one-line description of the job it delegated, which is the only tool
// argument this surface prints — every other one is the agent's own work, and the row already falls
// back to the session's last prompt for its title. A sub-agent whose `task` call fell outside the
// window read has none, and then the type is all there is to say.
//
// The bar is the row's own `AgentContext`, card included: it's the same claim about the same kind of
// number, read against the same window table, so it should look identical.
export const SubagentRow = ({ subagent }: SubagentRowProps) => (
  <li className="flex min-w-0 flex-col gap-1.5">
    {/* On its own line, and clamped rather than truncated: this is the half of the entry worth
        reading, and a sentence sharing a line with the tags below loses most of itself to the
        ellipsis. Nothing here is on screen unless you opened it, so the room is free. */}
    {subagent.purpose && (
      <span className="line-clamp-2 text-xs leading-relaxed">{subagent.purpose}</span>
    )}
    {/* The two kept together rather than pushed to opposite edges: they're one fact — which agent
        on which model — and on a wide panel an `ml-auto` model is a stretch of empty row to read
        across. The row above puts its age on the right because that one *is* a separate column. */}
    <span className="mono min-w-0 truncate text-xs text-muted-foreground">
      {agentType(subagent)}
      {subagent.model && ` · ${subagent.model}`}
    </span>
    {subagent.context ? (
      <AgentContext context={subagent.context} />
    ) : (
      <span className="text-xs text-muted-foreground">{NOT_MEASURED}</span>
    )}
  </li>
);

// What stands where the bar would be. Still not an empty track — that would claim the context was
// empty — but not nothing either: every entry ending on the same line is what separates one
// sub-agent from the next, and this says why there's no bar rather than leaving a hole.
const NOT_MEASURED: string = 'no requests of its own yet';

// The agent id the session picked — `general-purpose`. The display name is the fallback rather than
// the first choice: it's a sentence-cased title where the rest of this line is mono, and the id is
// what you'd go looking for in the agent config.
const agentType = (subagent: Subagent): string =>
  subagent.name || subagent.displayName || 'subagent';
