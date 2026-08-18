import { CSSProperties, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findSkillByName } from '../../model/shadowing';
import { SkillEntry } from '../../model/types';
import { PRICED_AT } from '../../model/usage/pricing';
import {
  UsageBreakdown,
  UsageMetric,
  UsageReport,
  UsageSlice,
  UsageWindow
} from '../../model/usage/types';
import { WINDOW_BLURB } from '../../model/usage/window';
import { plural } from '../format-size';
import { Loading } from '../loading/Loading';
import { PanelActions } from '../PanelActions';
import { useSettings, useSetUsage } from '../settings/SettingsContext';
import { surfaceAccent } from '../surfaces';
import { UsageBar } from '../UsageBar';
import { UsageInfo } from '../UsageInfo';
import { UsageMenu } from '../UsageMenu';
import { UsageChoice } from '../UsageChoice';
import { sliceLabel } from '../usage-format';
import { WINDOW_OPTIONS } from '../usage-options';
import { UsageSummary } from '../UsageSummary';

// What a first scan costs. It reads every session log on the machine, though most of them are
// skipped on their mtime — a transcript last written in June can't hold a turn from this week.
const SCAN_EXPECTED_MS: number = 1200;

interface UsageViewProps {
  // Undefined until the first scan lands. Unlike the other surfaces this one isn't sent on `ready`:
  // it reads every session log on disk, so the host starts it in the background and posts it after.
  report: UsageReport | undefined;
  // What's installed here, so a row can show what its skill is for and open it. A window covering
  // every session on the machine names plenty of skills this workspace doesn't have.
  skills: SkillEntry[];
  // Opens one on the skills surface. The panel owns navigation, so this leaves the view.
  onOpenSkill: (path: string) => void;
  // Which window the view opens on. The panel never passes it; a story does.
  initialWindow?: UsageWindow;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// What the sessions on this machine have cost, split by the skill that was running. The skill is
// read off the turn on Claude's side and inferred on Copilot's, which is what the tag on a row says.
export const UsageView = ({
  report,
  skills,
  onOpenSkill,
  initialWindow = 'day',
  onSearch,
  onRefresh,
  onBack
}: UsageViewProps) => {
  // Component state, not a setting: which window you're looking at is a glance, where the metric is
  // a preference. Same split the skills surface makes between its selection and its budgets.
  const [window, setWindow] = useState<UsageWindow>(initialWindow);
  const { metric, scope } = useSettings().usage;
  const setUsage = useSetUsage();

  const breakdown: UsageBreakdown | undefined = report?.windows[window];

  return (
    <div
      className="flex h-full flex-col"
      style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" title="Back" onClick={onBack}>
          <ChevronLeft />
        </Button>
        <div className="mr-auto flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold">Usage</span>
          <span className="truncate text-xs text-muted-foreground">
            {breakdown
              ? `${plural(breakdown.sessions, 'session')} · ${WINDOW_BLURB[window].toLowerCase()}`
              : 'reading every session log'}
          </span>
        </div>
        <UsageChoice label="Window" options={WINDOW_OPTIONS} value={window} onChange={setWindow} />
        <PanelActions onSearch={onSearch} onRefresh={onRefresh} />
      </header>

      {!breakdown ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading label="Reading session logs…" expectedMs={SCAN_EXPECTED_MS} />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <div className="flex flex-col gap-4 px-4 py-4">
            <UsageSummary
              breakdown={breakdown}
              metric={metric.value}
              scope={scope.value}
              onMetric={(next) => setUsage({ metric: next })}
              onScope={(next) => setUsage({ scope: next })}
            />
            <Slices
              breakdown={breakdown}
              metric={metric.value}
              skills={skills}
              onOpenSkill={onOpenSkill}
            />
            {metric.value === 'cost' && <CostNote breakdown={breakdown} />}
          </div>
        </div>
      )}
    </div>
  );
};

interface SlicesProps {
  breakdown: UsageBreakdown;
  metric: UsageMetric;
  skills: SkillEntry[];
  onOpenSkill: (path: string) => void;
}

const Slices = ({ breakdown, metric, skills, onOpenSkill }: SlicesProps) => {
  if (breakdown.slices.length === 0) {
    return (
      <p className="px-1 py-6 text-center text-sm text-muted-foreground">
        Nothing ran in this window. Try Week, or check the scope — it’s counting one folder’s
        sessions while it says This workspace.
      </p>
    );
  }

  // Bars are scaled to the biggest row rather than to 100%, so a window nothing dominates still has
  // something to compare. The share beside each one is the real number.
  const scale: number = Math.max(...breakdown.slices.map((slice) => slice.fraction));

  return (
    <section className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {breakdown.slices.map((slice: UsageSlice) => (
        <UsageBar
          key={sliceLabel(slice)}
          slice={slice}
          metric={metric}
          scale={scale}
          // The skill that would actually run under that name, which is the one the turn used —
          // a shadowed copy never reaches the system prompt, so it can't be what was invoked.
          skill={slice.skill ? findSkillByName({ skills, name: slice.skill }) : undefined}
          onOpenSkill={onOpenSkill}
        />
      ))}
    </section>
  );
};

interface CostNoteProps {
  breakdown: UsageBreakdown;
}

// Where the dollars came from, and where they didn't. Rates move on Anthropic's release schedule
// rather than this extension's, so the date they were read is printed instead of the figure being
// presented as current — and a model with no rates contributes its tokens and no dollars rather
// than being quietly priced at zero.
// Both controls sit *in* the sentence rather than in a flex row beside it. As flex items they were
// laid out against the whole paragraph, so a panel too narrow for the text on one line pushed them
// onto a line of their own — two icons alone above a wall of grey.
const CostNote = ({ breakdown }: CostNoteProps) => (
  <p className="px-1 text-xs leading-relaxed text-muted-foreground">
    <UsageInfo breakdown={breakdown} />
    <UsageMenu />
    <span className="ml-1.5">
      Claude Code records tokens only, so dollars are priced from a table last checked {PRICED_AT}.
      Copilot CLI writes its own billed figure, so its AIU is exact.
      {breakdown.unpricedModels.length > 0 && (
        <>
          {' '}
          No rates for {breakdown.unpricedModels.join(', ')} — those turns are in the token totals
          and not in the dollar one.
        </>
      )}
    </span>
  </p>
);
