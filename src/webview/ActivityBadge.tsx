import { ReactNode } from 'react';
import { AgentActivity, TranscriptTail } from '../model/types';
import { cn } from '@/lib/utils';
import { ACTIVITY_LABEL, activityNote } from './agent-activity';

interface ActivityBadgeProps {
  activity: AgentActivity;
  // How the log ended. The badge looks the same either way; the tooltip is where a state that was
  // read differs from one that was inferred.
  tail: TranscriptTail;
  // Makes the badge a button that goes to the Active Agents list. Absent on an agent row, whose
  // badge is already inside the row's own button — a button can't hold another one.
  onSelect?: () => void;
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

const BADGE_CLASS: string = 'flex shrink-0 items-center gap-1.5';

// What the clickable one promises, on the same `title` as the state it describes. A wrapper around
// the badge can't say this: the badge's own title is what the pointer lands on.
const SELECT_HINT: string = 'Show in Active Agents';

export const ActivityBadge = ({ activity, tail, onSelect }: ActivityBadgeProps) => {
  const title: string = `${ACTIVITY_LABEL[activity]} — ${activityNote({ activity, tail })}`;
  const body: ReactNode = (
    <>
      <span className={cn('size-2 shrink-0 rounded-full', DOT[activity])} />
      <span className={cn('text-xs font-medium', TEXT[activity])}>{ACTIVITY_LABEL[activity]}</span>
    </>
  );

  if (!onSelect) {
    return (
      <span className={BADGE_CLASS} title={title}>
        {body}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      title={`${title}\n${SELECT_HINT}`}
      className={cn(
        BADGE_CLASS,
        '-mx-1 cursor-pointer rounded px-1 py-0.5 transition-colors hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring'
      )}
    >
      {body}
      <span className="sr-only">{SELECT_HINT}</span>
    </button>
  );
};
