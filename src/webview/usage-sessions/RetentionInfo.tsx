import { Info } from 'lucide-react';
import { Retention, RetentionSource } from '../../model/retention/types';
import { HoverCard, HoverCardBody, HoverCardTitle } from '../HoverCard';
import { plural } from '../format-size';
import { displayDirectory } from '../display-path';

interface RetentionInfoProps {
  retention: Retention;
  workspaceRoot: string | undefined;
  // How far back the oldest day with data is. Undefined when nothing is drawn.
  //
  // Not the grid's width: the minimum span already makes the grid wider than a short
  // `cleanupPeriodDays`, so width would claim a resumed session where there is none. Data older
  // than the sweep is the only thing that actually proves one.
  oldestActiveDays: number | undefined;
}

// Where each layer's value comes from, as a sentence. Same shape as the budgets card, and for the
// same reason: a window you can't argue with is a window you ignore.
const SOURCE_PHRASE: Record<RetentionSource, string> = {
  managed: 'set for this machine by your organization',
  local: "set in this workspace's local settings",
  project: "set in this workspace's settings",
  user: 'set by you',
  default: "Claude Code's default"
};

// The (i) beside the window heading. It answers the question the grid provokes on any machine used
// for more than a month: why does my history stop where it stops? The answer is never this
// extension — it's a sweep Claude Code runs at startup — so the card names the setting behind it.
export const RetentionInfo = ({
  retention,
  workspaceRoot,
  oldestActiveDays
}: RetentionInfoProps) => {
  // A day of slack, since both ends are rounded to a calendar day.
  const reachesBack: boolean =
    oldestActiveDays !== undefined && oldestActiveDays > retention.days + 1;

  return (
    <HoverCard
      card={
        <>
          <HoverCardTitle>
            Claude Code keeps transcripts for {plural(retention.days, 'day')}
          </HoverCardTitle>
          <HoverCardBody>
            <span className="mono text-[11px] text-foreground">cleanupPeriodDays</span>,{' '}
            {SOURCE_PHRASE[retention.source]}
            {retention.path ? (
              <>
                {' '}
                in{' '}
                {/* `break-words` for the same reason CodeText carries it: the card sizes to
                    max-content and clamps, so an unbreakable path runs out the side. */}
                <span className="mono break-words text-[11px]">
                  {displayDirectory({ path: retention.path, workspaceRoot })}
                </span>
              </>
            ) : null}
            . A sweep at startup deletes anything older, so this grid covers what can still be on
            disk rather than a fixed year.
            <span className="mt-2 block">
              {reachesBack
                ? 'It reaches further back here because a session you resumed kept its transcript past the sweep — resuming rewrites the file, which resets its age.'
                : 'A session you resume keeps its transcript past the sweep, since resuming rewrites the file and resets its age.'}
            </span>
          </HoverCardBody>
        </>
      }
    >
      {/* Not a button — nothing happens on click. Tabbing here opens the card the same way the
          budgets one opens. */}
      <span
        tabIndex={0}
        className="flat-focus inline-flex cursor-default text-muted-foreground hover:text-foreground"
        aria-label="Why the grid covers this window"
      >
        <Info className="size-3.5" />
      </span>
    </HoverCard>
  );
};
