import { CSSProperties, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findAgent } from '../../model/sessions/find-agent';
import { AgentSession, SkillEntry } from '../../model/types';
import {
  SessionDetail,
  SessionRef,
  SessionUsage,
  UsageBreakdown,
  UsageHistory,
  UsageMetric,
  UsageReport,
  UsageWindow
} from '../../model/usage/types';
import { WINDOW_BLURB } from '../../model/usage/window';
import { plural } from '../format-size';
import { Loading } from '../loading/Loading';
import { PanelActions } from '../PanelActions';
import { SessionAnalysisView } from '../session-analysis/SessionAnalysisView';
import { useSettings } from '../settings/SettingsContext';
import { surfaceAccent } from '../surfaces';
import { UsageCostNote } from '../UsageCostNote';
import { UsageSlices } from '../UsageSlices';
import { UsageTab, UsageTabs } from '../UsageTabs';
import { SessionsTab } from '../usage-sessions/SessionsTab';
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
  // The last session the host read, whichever one it was about, and the way to name another.
  // Picking a session opens the analysis page in place of the tabs.
  sessionDetail: SessionDetail | undefined;
  onWatchSession: (session?: SessionRef) => void;
  // The processes running right now. Only the analysis page reads them, and only to say whether the
  // session it is showing is one of them — a page whose numbers move should say why.
  agents: AgentSession[];
  // The session id onto the clipboard, from the analysis page's breadcrumb. The host holds the
  // clipboard, the same way it does for an agent row's menu.
  onCopySessionId: (sessionId: string) => void;
  // Which window the view opens on. The panel never passes it; a story does.
  initialWindow?: UsageWindow;
  // Which tab it opens on. Same deal — the panel never passes it.
  initialTab?: UsageTab;
  // Which session the analysis page opens on. Same deal — the panel always opens on the tabs.
  initialSession?: SessionUsage;
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
  sessionDetail,
  onWatchSession,
  agents,
  onCopySessionId,
  initialWindow = 'day',
  initialTab = 'sessions',
  initialSession,
  onSearch,
  onRefresh,
  onBack
}: UsageViewProps) => {
  // Component state, not a setting: which window you're looking at is a glance, where the metric is
  // a preference. Same split the skills surface makes between its selection and its budgets.
  const [window, setWindow] = useState<UsageWindow>(initialWindow);
  const [tab, setTab] = useState<UsageTab>(initialTab);
  // The session being taken apart, or none. State rather than navigation: the tabs stay mounted, so
  // coming back keeps the Sessions filter text and its scroll position.
  const [session, setSession] = useState<SessionUsage | undefined>(initialSession);
  const { metric } = useSettings().usage;

  const breakdown: UsageBreakdown | undefined = report?.windows[window];

  // A page inside this surface, not a surface of its own — which is what keeps the host polling for
  // `usage` while you're in here, and what the breadcrumb is saying.
  if (session) {
    return (
      <div
        className="flex h-full flex-col"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <SessionAnalysisView
          session={session}
          detail={sessionDetail}
          onWatch={onWatchSession}
          agent={findAgent({ agents, sessionId: session.sessionId, tool: session.tool })}
          skills={skills}
          onOpenSkill={onOpenSkill}
          onCopyId={onCopySessionId}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={() => setSession(undefined)}
        />
      </div>
    );
  }

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
            onOpenSession={setSession}
          />
        </div>
      ) : !breakdown ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading label="Reading session logs…" expectedMs={SCAN_EXPECTED_MS} />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <div className="flex flex-col gap-4 px-4 py-4">
            <UsageSlices
              summary={breakdown}
              metric={metric.value}
              // The window is named rather than called "this window", and the way out changes with
              // it: suggesting Week to someone already looking at Week is advice they've taken.
              empty={
                <>
                  No sessions found in the {WINDOW_BLURB[window].toLowerCase()}.{' '}
                  {window === 'day' ? 'Try Week, or check the scope.' : 'Check the scope.'}
                </>
              }
              skills={skills}
              onOpenSkill={onOpenSkill}
            />
            {metric.value === 'cost' && <UsageCostNote summary={breakdown} />}
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
