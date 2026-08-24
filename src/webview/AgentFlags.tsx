import { ReactNode } from 'react';
import { AlertTriangle, CircleAlert } from 'lucide-react';
import { AgentSession, IssueSeverity } from '../model/types';
import { Tooltip } from './Tooltip';
import { duplicatePidNote } from './agent-row-text';

interface AgentFlagsProps {
  agent: AgentSession;
}

// Everything wrong with one row, as icons beside its badge. The messages are sentences — "no event
// log on disk yet", "2 extra processes hold this session" — and a row that prints them costs three
// lines to say something that is usually fine, so the sentence moves into the hover and the icon
// keeps the place.
//
// Same icons `IssueList` uses, so a warning reads the same wherever it's drawn. That one still
// spells its messages out: a skill's issues are why you opened the skill, and an agent's are a
// footnote on a row you opened for something else.
export const AgentFlags = ({ agent }: AgentFlagsProps) => {
  if (agent.issues.length === 0 && agent.otherPids.length === 0) return null;

  return (
    <span className="flex shrink-0 items-center gap-1">
      {agent.otherPids.length > 0 && (
        <Flag label={duplicatePidNote(agent)} severity="error">
          <CircleAlert className="size-3.5" />
        </Flag>
      )}
      {agent.issues.map((issue) => (
        <Flag key={issue.message} label={issue.message} severity={issue.severity}>
          {issue.severity === 'error' ? (
            <CircleAlert className="size-3.5" />
          ) : (
            <AlertTriangle className="size-3.5" />
          )}
        </Flag>
      ))}
    </span>
  );
};

interface FlagProps {
  label: string;
  severity: IssueSeverity;
  children: ReactNode;
}

// One icon and the sentence behind it. `wrap`, because every label here is prose rather than a
// name, and a nowrap bubble on a row would run past the panel's edge. `align="left"` for the same
// reason from the other side: these sit near the row's left edge, and the default bubble hangs
// leftwards off it.
const Flag = ({ label, severity, children }: FlagProps) => (
  <Tooltip label={label} wrap align="left">
    <span
      role="img"
      aria-label={label}
      className={`flex items-center ${severity === 'error' ? 'text-error' : 'text-warn'}`}
    >
      {children}
    </span>
  </Tooltip>
);
