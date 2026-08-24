import { CSSProperties, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findSkillByName } from '../../model/shadowing';
import { SkillEntry } from '../../model/types';
import { PRICED_AT } from '../../model/usage/pricing';
import {
  SessionUsage,
  UsageBreakdown,
  UsageHistory,
  UsageMetric,
  UsageReport,
  UsageSlice,
  UsageWindow
} from '../../model/usage/types';
import { WINDOW_BLURB } from '../../model/usage/window';
import { plural } from '../format-size';
import { Loading } from '../loading/Loading';
import { PanelActions } from '../PanelActions';
import { useSettings } from '../settings/SettingsContext';
import { surfaceAccent } from '../surfaces';
import { UsageBar } from '../UsageBar';
import { UsageInfo } from '../UsageInfo';
import { UsageTab, UsageTabs } from '../UsageTabs';
import { SessionsTab } from '../usage-sessions/SessionsTab';
import { sliceLabel } from '../usage-format';
import { UsageSummary } from '../UsageSummary';

// What a first scan costs. It reads every session log on the machine, though most of them are
// skipped on their mtime — a transcript last written in June can't hold a turn from this week.
const SCAN_EXPECTED_MS: number = 1200;

interface UsageViewProps {
  // Undefined until the first scan lands. Unlike the other surfaces this one isn't sent on `ready`:
  // it reads every session log on disk, so the host starts it in the background and posts it after.
  report: UsageReport | undefined;
  // Every session on disk, for the Sessions tab. Its own message, and it arrives later than the
  // report — the tab that shows it is what starts the pass behind it.
  history: UsageHistory | undefined;
  // What's installed here, so a row can show what its skill is for and open it. A window covering
  // every session on the machine names plenty of skills this workspace doesn't have.
  skills: SkillEntry[];
  // Where the open folder is, so a session row can print its cwd against it.
  workspaceRoot: string | undefined;
  // Opens one on the skills surface. The panel owns navigation, so this leaves the view.
  onOpenSkill: (path: string) => void;
  // Picking one session. There's nothing to show for it yet, so the host says so — the sentence is
  // the host's, the same way it is for a surface that isn't built.
  onOpenSession: (session: SessionUsage) => void;
  // Which window the view opens on. The panel never passes it; a story does.
  initialWindow?: UsageWindow;
  // Which tab it opens on. Same deal — the panel never passes it.
  initialTab?: UsageTab;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// What the sessions on this machine have cost, two ways. Sessions is every session on disk — a year
// of days as a grid, and a list you can search. Skills is a window inside that, split by the skill
// that was running: read off the turn on Claude's side and inferred on Copilot's.
//
// The headline sits above the tabs rather than inside one, since it's a total of the same sessions
// either tab is showing you.
export const UsageView = ({
  report,
  history,
  skills,
  workspaceRoot,
  onOpenSkill,
  onOpenSession,
  initialWindow = 'day',
  initialTab = 'sessions',
  onSearch,
  onRefresh,
  onBack
}: UsageViewProps) => {
  // Component state, not a setting: which window you're looking at is a glance, where the metric is
  // a preference. Same split the skills surface makes between its selection and its budgets.
  const [window, setWindow] = useState<UsageWindow>(initialWindow);
  const [tab, setTab] = useState<UsageTab>(initialTab);
  const { metric } = useSettings().usage;

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
            {subtitle({ tab, breakdown, history })}
          </span>
        </div>
        <PanelActions onSearch={onSearch} onRefresh={onRefresh} />
      </header>

      <UsageSummary
        breakdown={breakdown}
        metric={metric.value}
        window={window}
        onWindow={setWindow}
      />

      <div className="border-b border-border px-3">
        <UsageTabs tab={tab} onChange={setTab} />
      </div>

      {tab === 'sessions' ? (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <SessionsTab
            history={history}
            workspaceRoot={workspaceRoot}
            onOpenSession={onOpenSession}
          />
        </div>
      ) : !breakdown ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading label="Reading session logs…" expectedMs={SCAN_EXPECTED_MS} />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Slices
              breakdown={breakdown}
              metric={metric.value}
              window={window}
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

interface SubtitleArgs {
  tab: UsageTab;
  breakdown: UsageBreakdown | undefined;
  history: UsageHistory | undefined;
}

// What the header says under "Usage", which is a different sentence per tab: one counts a window,
// the other counts everything. Both say "reading" rather than nothing while their scan is out —
// they're separate passes and either can be the one you're waiting on.
//
// Neither names the window. The headline under it already does, beside the toggle that changes it.
const subtitle = ({ tab, breakdown, history }: SubtitleArgs): string => {
  if (tab === 'sessions') {
    return history
      ? `${plural(history.sessions.length, 'session')} on record`
      : 'reading every session on disk';
  }

  return breakdown
    ? `${plural(breakdown.sessions, 'session')} in the window`
    : 'reading every session log';
};

interface SlicesProps {
  breakdown: UsageBreakdown;
  metric: UsageMetric;
  // Which window is empty. Only the empty state reads it — the rows themselves are already the
  // window's, so nothing below needs to know which one it was.
  window: UsageWindow;
  skills: SkillEntry[];
  onOpenSkill: (path: string) => void;
}

const Slices = ({ breakdown, metric, window, skills, onOpenSkill }: SlicesProps) => {
  if (breakdown.slices.length === 0) {
    // The window is named rather than called "this window", and the way out changes with it:
    // suggesting Week to someone already looking at Week is advice they've taken.
    return (
      <p className="px-1 py-6 text-center text-sm text-muted-foreground">
        No sessions found in the {WINDOW_BLURB[window].toLowerCase()}.{' '}
        {window === 'day' ? 'Try Week, or check the scope.' : 'Check the scope.'}
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
//
// The (i) sits *in* the sentence rather than in a flex row beside it. As a flex item it was laid out
// against the whole paragraph, so a panel too narrow for the text on one line pushed it onto a line
// of its own — an icon alone above a wall of grey. The `...` used to sit next to it and is in the
// header now, beside the figures it changes.
const CostNote = ({ breakdown }: CostNoteProps) => (
  <p className="px-1 text-xs leading-relaxed text-muted-foreground">
    <UsageInfo breakdown={breakdown} />
    <span className="ml-1.5">
      Claude Code reports tokens usage only, so USD is estimated from the pricing table (last
      checked: {PRICED_AT}). Copilot CLI reports AIU directly.
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
