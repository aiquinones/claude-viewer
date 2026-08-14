import { AgentActivity, TranscriptTail } from '../model/types';
import { cn } from '@/lib/utils';
import { ACTIVITY_LABEL, activityNote } from './agent-activity';

interface ActivityBadgeProps {
  activity: AgentActivity;
  // How the log ended. The badge looks the same either way; the tooltip is where a state that was
  // read differs from one that was inferred.
  tail: TranscriptTail;
}

// A dot and a word. Colors come from the editor's chart palette via styles.css, and the running dot
// is the one animated thing on the surface — a list of live agents should look live.
const DOT: Record<AgentActivity, string> = {
  running: 'bg-activity-running activity-dot--running',
  blocked: 'bg-activity-blocked',
  idle: 'bg-activity-idle'
};

const TEXT: Record<AgentActivity, string> = {
  running: 'text-activity-running',
  blocked: 'text-activity-blocked',
  idle: 'text-muted-foreground'
};

export const ActivityBadge = ({ activity, tail }: ActivityBadgeProps) => (
  <span
    className="flex shrink-0 items-center gap-1.5"
    title={`${ACTIVITY_LABEL[activity]} — ${activityNote({ activity, tail })}`}
  >
    <span className={cn('size-2 shrink-0 rounded-full', DOT[activity])} />
    <span className={cn('text-xs font-medium', TEXT[activity])}>{ACTIVITY_LABEL[activity]}</span>
  </span>
);
