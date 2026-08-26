import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AgentSession } from '../../model/types';
import { SessionUsage } from '../../model/usage/types';
import { plural } from '../format-size';
import { useNow } from '../useNow';
import { SessionRow } from './SessionRow';
import { filterSessions } from './session-filter';

interface SessionListProps {
  sessions: SessionUsage[];
  agents: AgentSession[];
  now: number;
  onOpen: (session: SessionUsage) => void;
}

// Every session on record, filtered by name. The box has a height and the rows scroll inside it:
// this list runs to dozens and the grid above it is what the tab is for — a list that pushed the
// grid off the top would invert that.
export const SessionList = ({ sessions, agents, now, onOpen }: SessionListProps) => {
  const [query, setQuery] = useState<string>('');
  const activityNow: number = useNow(1000);

  const shown: SessionUsage[] = useMemo(
    () => filterSessions(sessions, query),
    [sessions, query]
  );

  return (
    <section className="flex flex-col rounded-lg border border-border">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter sessions by name"
          aria-label="Filter sessions by name"
          // `flat-focus` opts out of the focus ring VS Code injects into every webview — an unlayered
          // rule no Tailwind utility can outrank.
          className={
            'flat-focus min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none ' +
            'placeholder:text-muted-foreground'
          }
        />
        <span className="mono shrink-0 text-[10px] text-muted-foreground">
          {shown.length === sessions.length
            ? plural(sessions.length, 'session')
            : `${shown.length} of ${sessions.length}`}
        </span>
      </div>

      <div className="max-h-72 min-h-0 divide-y divide-border overflow-y-auto overflow-x-clip">
        {shown.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            {sessions.length === 0
              ? 'No sessions on record. Check the scope.'
              : 'No session matches that name.'}
          </p>
        ) : (
          shown.map((session: SessionUsage) => (
            <SessionRow
              key={`${session.tool}:${session.sessionId}`}
              session={session}
              agent={agents.find(
                (agent: AgentSession) =>
                  agent.sessionId === session.sessionId && agent.tool === session.tool
              )}
              activityNow={activityNow}
              now={now}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </section>
  );
};
