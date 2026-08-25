import { useMemo } from 'react';
import { Info, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionDetail, UsageMetric } from '../../../model/usage/types';
import { plural } from '../../format-size';
import { HoverCard } from '../../HoverCard';
import { useSetStageNames, useSettings } from '../../settings/SettingsContext';
import { METRIC_LABEL } from '../../usage-format';
import { ChartSection } from '../charts/ChartSection';
import { formatValue } from '../session-format';
import { SessionStage, stageSkills, toStages } from '../stages';
import { StageNamesDialog } from '../stage-names/StageNamesDialog';
import { useStageNamesDialog } from '../stage-names/useStageNamesDialog';
import { StageRadar } from './StageRadar';
import {
  ASSIGN_NAMES,
  CONTEXT_RADAR_TITLE,
  EMPTY_STAGES,
  formatGrowth,
  GROWTH_UNIT,
  STAGES_NOTE,
  STAGES_TITLE
} from './stage-labels';

interface StageRadarsProps {
  detail: SessionDetail;
  metric: UsageMetric;
}

// The session split at its skill loads, drawn twice: what each stage spent, and what each stage did
// to the context. Two wheels rather than two more curves — the stages are a handful of named things
// being compared, and the curves above already own the sequence.
export const StageRadars = ({ detail, metric }: StageRadarsProps) => {
  const names: Record<string, string> = useSettings().stages.names;
  const setStageNames = useSetStageNames();
  const { stageNamesOpenedAt, openStageNames, dismissStageNames } = useStageNamesDialog();

  const stages: SessionStage[] = useMemo(
    () =>
      toStages({
        turns: detail.turns,
        invocations: detail.invocations,
        contexts: detail.contexts,
        metric,
        names
      }),
    [detail, metric, names]
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
      note={plural(stages.length, 'stage')}
      info={<StagesInfo onAssignNames={openStageNames} />}
    >
      {stages.length === 0 ? (
        // One message rather than two empty wheels saying the same sentence — with nothing to
        // compare there is no pair, and the same words in two boxes read as a mistake.
        <p className="rounded-lg border border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          {EMPTY_STAGES}
        </p>
      ) : (
        // Fixed squares that wrap rather than a breakpoint: a media query in here measures the
        // panel, and wrapping needs no number to be right about.
        <div className="flex flex-wrap gap-3">
          <StageRadar
            title={`${METRIC_LABEL[metric]} per stage`}
            stages={stages}
            read={(stage) => stage.value}
            format={(value) => formatValue({ value, metric, tool: detail.tool })}
            unit={METRIC_LABEL[metric].toLowerCase()}
            empty={EMPTY_STAGES}
          />
          <StageRadar
            title={CONTEXT_RADAR_TITLE}
            stages={stages}
            read={(stage) => stage.growth}
            format={formatGrowth}
            unit={GROWTH_UNIT}
            empty={EMPTY_STAGES}
          />
        </div>
      )}

      {/* Keyed on the open, so a dialog reopened after saving reads the stored names back. */}
      {stageNamesOpenedAt !== undefined && (
        <StageNamesDialog
          key={stageNamesOpenedAt}
          skills={stageSkills(stages)}
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
