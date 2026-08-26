import { AgentActivity, AgentSession } from '../model/types';
import { cn } from '@/lib/utils';
import { Tooltip } from './Tooltip';
import { CurrentStage, currentStage } from './stage-name';
import { stageNote } from './agent-row-text';
import { useSettings } from './settings/SettingsContext';

interface AgentStageProps {
  agent: AgentSession;
  // Whether the row is still moving. Idle rows keep the label and lose the shimmer — the stage a
  // finished session ended in is a fact, not something in progress.
  activity: AgentActivity;
}

// Which part of its work an agent is in, in the reader's own words. The names come from the same
// setting the session page's stage radars read, so a running row and the chart behind it agree.
//
// Nothing at all when the current skill has no name, which is the common case until someone has
// named one — an unnamed session shows what it always did.
export const AgentStage = ({ agent, activity }: AgentStageProps) => {
  const names: Record<string, string> = useSettings().stages.names;
  const stage: CurrentStage | undefined = currentStage({ trail: agent.skillTrail ?? [], names });

  if (!stage) return null;

  return (
    <Tooltip label={stageNote(stage)} wrap>
      {/* The shimmer only while the agent is working. The running dot is otherwise the one thing
          that animates on this surface, and a second perpetual animation on every row of a list you
          leave open is noise rather than a signal. */}
      <span
        className={cn(
          // Heavier than the row's other small text, and heavier than the title beside it: the
          // shimmer is a gradient clipped to the glyphs, so a thin face leaves it almost nothing to
          // paint. Capped and clipped, since a stage name is the reader's own and can run to a
          // sentence — the title should keep its room before this does.
          'max-w-36 truncate text-xs font-semibold',
          activity === 'idle' ? 'text-muted-foreground' : 'stage-shimmer'
        )}
      >
        {stage.label}
      </span>
    </Tooltip>
  );
};
