import { useMemo } from 'react';
import { Info, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionDetail } from '../../../model/usage/types';
import { plural } from '../../format-size';
import { HoverCard } from '../../HoverCard';
import { useSetStageNames, useSettings } from '../../settings/SettingsContext';
import { ChartSection } from '../charts/ChartSection';
import { formatCost } from '../session-format';
import { invokedSkills, SessionStage, toStages } from '../stages';
import { StageNamesDialog } from '../stage-names/StageNamesDialog';
import { useStageNamesDialog } from '../stage-names/useStageNamesDialog';
import { StageRadar } from './StageRadar';
import {
  ASSIGN_NAMES,
  CONTEXT_RADAR_TITLE,
  COST_RADAR_TITLE,
  COST_UNIT,
  formatGrowth,
  GROWTH_UNIT,
  NO_SKILLS,
  STAGES_NOTE,
  STAGES_TITLE
} from './stage-labels';
import { UnsplitStages } from './UnsplitStages';

interface StageRadarsProps {
  detail: SessionDetail;
}

// The session split at the loads of the skills the reader named, drawn twice: what each stage spent
// and what each stage did to the context. Two wheels rather than two more curves — the stages are a
// handful of named things being compared, and the curves above already own the sequence.
export const StageRadars = ({ detail }: StageRadarsProps) => {
  const names: Record<string, string> = useSettings().stages.names;
  const setStageNames = useSetStageNames();
  const { stageNamesOpenedAt, openStageNames, dismissStageNames } = useStageNamesDialog();

  // Every skill the session ran, named or not. What the dialog lists, and what separates "nothing
  // to split" from "nothing named yet" — two states that both draw no wheels for opposite reasons.
  const skills: string[] = useMemo(() => invokedSkills(detail.invocations), [detail]);

  const stages: SessionStage[] = useMemo(
    () =>
      toStages({
        turns: detail.turns,
        invocations: detail.invocations,
        contexts: detail.contexts,
        names
      }),
    [detail, names]
  );

  // Saving writes the setting and closes. The labels move when the host posts the settings back,
  // not here — nothing in the webview guesses at what was written.
  const save = (next: Record<string, string>): void => {
    setStageNames(next);
    dismissStageNames();
  };

  return (
    <ChartSection
      title={STAGES_TITLE}
      note={stages.length > 0 ? plural(stages.length, 'stage') : undefined}
      info={<StagesInfo onAssignNames={openStageNames} />}
    >
      {/* Three states, and which one you're in is why the wheels aren't there. No skills ran, so
          there is nothing to split; skills ran and none is named, so there is a split to choose;
          otherwise the pair. */}
      {skills.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          {NO_SKILLS}
        </p>
      ) : stages.length === 0 ? (
        <UnsplitStages onAssignNames={openStageNames} />
      ) : (
        // Fixed squares that wrap rather than a breakpoint: a media query in here measures the
        // panel, and wrapping needs no number to be right about. `justify-center` is one rule for
        // both widths — the pair centres side by side, and each centres on its own line once they
        // wrap, since justification is per line.
        <div className="flex flex-wrap justify-center gap-3">
          <StageRadar
            title={COST_RADAR_TITLE}
            stages={stages}
            read={(stage) => stage.value}
            format={(value) => formatCost({ value, tool: detail.tool })}
            unit={COST_UNIT}
          />
          <StageRadar
            title={CONTEXT_RADAR_TITLE}
            stages={stages}
            read={(stage) => stage.growth}
            format={formatGrowth}
            unit={GROWTH_UNIT}
          />
        </div>
      )}

      {/* Keyed on the open, so a dialog reopened after saving reads the stored names back. */}
      {stageNamesOpenedAt !== undefined && (
        <StageNamesDialog
          key={stageNamesOpenedAt}
          skills={skills}
          current={names}
          onSave={save}
          onDismiss={dismissStageNames}
        />
      )}
    </ChartSection>
  );
};

interface StagesInfoProps {
  onAssignNames: () => void;
}

// The (i) beside the heading: where the splits come from, and the way to rename them. `interactive`
// because the card holds a button — that variant is what keeps it reachable with the pointer and
// out of the tab order while it's shut.
const StagesInfo = ({ onAssignNames }: StagesInfoProps) => (
  <HoverCard
    interactive
    card={
      <span className="flex flex-col gap-2">
        <span className="block">{STAGES_NOTE}</span>
        <Button
          variant="link"
          size="sm"
          className="h-auto justify-start p-0 text-xs"
          onClick={onAssignNames}
        >
          <Tags className="size-3.5" />
          {ASSIGN_NAMES}
        </Button>
      </span>
    }
  >
    {/* Not a button — nothing happens on click, and the CTA lives inside the card. Same shape as
        BudgetInfo's, so the two (i)s on this page behave alike. */}
    <span
      tabIndex={0}
      className="inline-flex cursor-default rounded-sm text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
    >
      <Info className="size-3.5" />
      <span className="sr-only">how this session is split into stages</span>
    </span>
  </HoverCard>
);
