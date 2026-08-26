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
import { SessionNotFound } from '../session-analysis/SessionNotFound';
import { SessionOrigin, SessionRequest } from '../session-analysis/session-target';
import { SessionTargetState, useSessionTarget } from '../session-analysis/useSessionTarget';
import { useSettings } from '../settings/SettingsContext';
import { SurfaceId, surfaceAccent, surfaceTitle } from '../surfaces';
import { UsageCostNote } from '../UsageCostNote';
import { UsageSlices } from '../UsageSlices';
import { UsageTab, UsageTabs } from '../UsageTabs';
import { HISTORY_EXPECTED_MS, SessionsTab } from '../usage-sessions/SessionsTab';
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
  // A session asked for from off this surface, by id. An agent row's menu is the only asker, and it
  // can't hand over a `SessionUsage` — it has never read the history. Resolved here instead.
  request?: SessionRequest;
  // Drops that request, from the note shown when it names a session the history doesn't hold. The
  // panel owns it, so clearing it is the panel's to do.
  onClearRequest: () => void;
  // Leaves for another surface. Two things ask for it: a session opened from an agent row getting
  // back to the row it came from, and the analysis page's activity badge going to the list of
  // running agents. The panel owns navigation, so this leaves the view the way `onOpenSkill` does.
  onOpenSurface: (id: SurfaceId) => void;
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
  request,
  onClearRequest,
  onOpenSurface,
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
  const { metric, scope } = useSettings().usage;
  // A session named by id from off this surface. Resolving one sets the same state a Sessions row
  // sets, so once it lands there is nothing different about how it was opened.
  const targetState: SessionTargetState = useSessionTarget({
    request,
    sessions: history?.sessions,
    onResolve: setSession
  });

  // Where the reader came from, while a request is still the reason this page is up. The back arrow
  // retraces it; the crumb beside it still says Usage, which is where the page lives either way.
  // A request with no `from` came from outside the panel, so there is nothing to retrace.
  const from: SurfaceId | undefined = request?.from;
  const origin: SessionOrigin | undefined = from && {
    label: surfaceTitle(from),
    onReturn: () => onOpenSurface(from)
  };

  // Going up to the tabs ends the request as well as the page. Without that, a session picked off
  // the list afterwards would inherit an arrow pointing at a surface it was never opened from.
  const upToTabs = (): void => {
    setSession(undefined);
    onClearRequest();
  };

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
          workspaceRoot={workspaceRoot}
          detail={sessionDetail}
          onWatch={onWatchSession}
          agent={findAgent({ agents, sessionId: session.sessionId, tool: session.tool })}
          skills={skills}
          onOpenSkill={onOpenSkill}
          onOpenAgents={() => onOpenSurface('active-agents')}
          onCopyId={onCopySessionId}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={upToTabs}
          origin={origin}
        />
      </div>
    );
  }

  // Asked for one session and not there yet. The tabs are deliberately not drawn behind this: the
  // reader asked for a page rather than for the surface it lives on, and a grid nobody asked for
  // arriving first reads as the wrong thing having opened.
  if (request && targetState !== 'idle') {
    return (
      <div
        className="flex h-full flex-col"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        {/* The arrow retraces the ask rather than going home: there is nothing above this yet to
            go up to, and the surface the reader left is one press behind them. A link had no
            surface behind it, so that one goes home like every other header's does. */}
        <UsageHeader
          subtitle="finding one session"
          backLabel={origin && `Back to ${origin.label}`}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={origin ? origin.onReturn : onBack}
        />
        {targetState === 'pending' ? (
          <div className="flex flex-1 items-center justify-center">
            <Loading label="Finding this session…" expectedMs={HISTORY_EXPECTED_MS} />
          </div>
        ) : (
          <SessionNotFound
            target={request}
            scoped={scope.value === 'workspace'}
            onDismiss={onClearRequest}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
    >
      <UsageHeader
        subtitle={subtitle({ tab, breakdown, history })}
        onSearch={onSearch}
        onRefresh={onRefresh}
        onBack={onBack}
      />

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
            agents={agents}
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

interface UsageHeaderProps {
  subtitle: string;
  // What the arrow's tooltip says, when it doesn't go home.
  backLabel?: string;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// The surface's own header. Two branches draw it — the tabs, and the wait in front of a session
// asked for by id — differing in the line under the title and in where the arrow goes: home from
// the tabs, and back to whoever asked from the wait.
const UsageHeader = ({
  subtitle,
  backLabel = 'Back',
  onSearch,
  onRefresh,
  onBack
}: UsageHeaderProps) => (
  <header className="flex items-center gap-2 border-b border-border px-4 py-3">
    <Button variant="ghost" size="icon" title={backLabel} onClick={onBack}>
      <ChevronLeft />
    </Button>
    <div className="mr-auto flex min-w-0 flex-col gap-0.5">
      <span className="text-sm font-semibold">Usage</span>
      <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
    </div>
    <PanelActions onSearch={onSearch} onRefresh={onRefresh} />
  </header>
);

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
