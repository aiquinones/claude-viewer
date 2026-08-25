import { useEffect, useMemo, useState } from 'react';
import { buildSearchIndex } from '../model/search/build-index';
import { AgentSession, ConfigSnapshot, Reveal, SearchDoc } from '../model/types';
import { SessionDetail, SessionRef, UsageHistory, UsageReport } from '../model/usage/types';
import { TokenEstimator } from '../model/estimate-tokens';
import { AgentColorProvider } from './agent-color/AgentColorContext';
import { EstimatorDialog } from './EstimatorDialog';
import { useEstimatorDialog } from './useEstimatorDialog';
import { Loading } from './loading/Loading';
import { SettingsProvider } from './settings/SettingsContext';
import { useThemeMode } from './settings/useThemeMode';
import { SessionRequest, SessionTarget } from './session-analysis/session-target';
import { Spotlight } from './spotlight/Spotlight';
import { kindForSurface, surfaceForKind } from './spotlight/surface-kind';
import { useSpotlight } from './spotlight/useSpotlight';
import { asSurfaceId, SurfaceId } from './surfaces';
import { useSnapshot } from './useSnapshot';
import { ViewSlider } from './ViewSlider';
import { AgentsView } from './views/AgentsView';
import { LandingView } from './views/LandingView';
import { MemoryView } from './views/MemoryView';
import { UsageView } from './views/UsageView';
import { SkillView } from './views/SkillView';
import { SystemPromptView } from './views/SystemPromptView';

// What the first snapshot usually costs. Longer than a file read: it walks the workspace for
// nested CLAUDE.md files, which on a big repo is seconds — past this the bar stops guessing.
const SNAPSHOT_EXPECTED_MS: number = 1500;

// Holds the host bridge and owns navigation. The views know nothing about it, so the next surface
// is a sibling under views/ plus an entry in SURFACES.
export const App = () => {
  const {
    snapshot,
    agents,
    usage,
    usageHistory,
    sessionDetail,
    watchSession,
    changeUsage,
    changeEstimator,
    changeTheme,
    settings,
    agentColors,
    setAgentColor,
    navigation,
    refresh,
    openFile,
    openAgent,
    copySessionId,
    killAgent,
    reportSurface,
    reportNotBuilt,
    openSettings
  } = useSnapshot();
  // The picked palette onto the body, where the CSS rules that draw it can see it. Above the
  // loading return below, so the panel waits in the palette it will render in.
  useThemeMode(settings.theme.mode.value);
  // Which surface the detail pane renders, and whether the slider is showing it. Separate signals
  // because the surface has to outlive the slide home — clearing it would blank the pane mid-exit.
  const [surface, setSurface] = useState<SurfaceId | undefined>(undefined);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // A skill picked in here, and the one a `skill` target names. One shape either way, so SkillView
  // takes one prop.
  const [selected, setSelected] = useState<Reveal | undefined>(undefined);
  // A session named on the agents surface, to be opened on the usage one. Held here because it
  // crosses surfaces — the asker has never read the history, and the surface that has can't be
  // reached from a row.
  const [sessionRequest, setSessionRequest] = useState<SessionRequest | undefined>(undefined);
  const { spotlightOpenedAt, openSpotlight, dismissSpotlight } = useSpotlight();
  // Opened from any number in the panel, so it lives here rather than on a surface.
  const { estimatorOpenedAt, openEstimator, dismissEstimator } = useEstimatorDialog();

  // Applying writes the setting and closes. The number on screen moves when the host posts the
  // settings back, not here — nothing in the webview guesses at what was written.
  const applyEstimator = (estimator: TokenEstimator): void => {
    changeEstimator(estimator);
    dismissEstimator();
  };

  const openSurface = (id: SurfaceId): void => {
    setSurface(id);
    setShowDetail(true);
  };

  // An agent row's Analyze session. The nonce is what makes naming the same session twice a second
  // event rather than a no-op — the same rule `openSkill` follows, and for the same reason: you can
  // go back to the row you came from and press it again.
  //
  // `from` is what makes that trip reversible: the page's back arrow retraces it rather than landing
  // on the tabs of a surface the reader never chose.
  const analyzeSession = (target: SessionTarget): void => {
    setSessionRequest({ ...target, nonce: Date.now(), from: 'active-agents' });
    openSurface('usage');
  };

  // Everything that points the panel from outside it — the palette, the tree, a vscode:// link.
  // Each target names the surface that renders it, since anything landing behind the landing page
  // looks like nothing happened. No `from` on a session: there is no surface to go back to.
  useEffect(() => {
    if (!navigation) return;
    const { target, nonce } = navigation;

    if (target.to === 'skill') {
      setSelected({ path: target.path, section: target.section, nonce });
      return openSurface('skills');
    }

    if (target.to === 'session') {
      setSessionRequest({ sessionId: target.sessionId, tool: target.tool, nonce });
      return openSurface('usage');
    }

    // Nothing here matches the host's copy of the surface ids against SURFACES, so a name it holds
    // and this doesn't lands on the landing page rather than on a blank pane.
    const asked: SurfaceId | undefined = asSurfaceId(target.surface);
    if (asked) openSurface(asked);
  }, [navigation]);

  // A request is spent once the surface it was for is gone. `UsageView` unmounts when another
  // surface opens and forgets which session it resolved, so without this, coming back to usage
  // through the landing card would re-resolve the old request and open a page nobody asked for.
  useEffect(() => {
    if (surface !== 'usage') setSessionRequest(undefined);
  }, [surface]);

  // The host reads some surfaces off disk faster while they're being looked at, so it needs to know
  // which one that is. Sent on the way home as well — `undefined` is the landing page, and a
  // surface nobody is on is the case worth reporting.
  useEffect(() => {
    reportSurface(showDetail ? surface : undefined);
  }, [showDetail, surface]);

  // Everything the spotlight can find. Rebuilt only when the host pushes a new snapshot.
  const searchIndex: SearchDoc[] = useMemo(
    () => (snapshot ? buildSearchIndex(snapshot) : []),
    [snapshot]
  );

  // Selects one skill and shows it, wherever the ask came from. The nonce is what makes naming the
  // same skill twice a second event rather than a no-op.
  const openSkill = (path: string): void => {
    setSelected({ path, nonce: Date.now() });
    openSurface('skills');
  };

  // A result knows its kind, and the kind names the surface that renders it.
  const chooseResult = (doc: SearchDoc): void => {
    const target: SurfaceId | undefined = surfaceForKind(doc.kind);
    if (!target) return dismissSpotlight();

    setSelected({ path: doc.id, nonce: Date.now() });
    openSurface(target);
    dismissSpotlight();
  };

  // `h-screen`, not `h-full`: this returns before ViewSlider, which is what otherwise gives the
  // tree a resolved height to be a percentage of.
  if (!snapshot) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading label="Reading configuration…" expectedMs={SNAPSHOT_EXPECTED_MS} />
      </div>
    );
  }

  return (
    <SettingsProvider
      settings={settings}
      openSettings={openSettings}
      setUsage={changeUsage}
      openEstimator={openEstimator}
      setEstimator={changeEstimator}
      setTheme={changeTheme}
    >
      <AgentColorProvider colors={agentColors} setColor={setAgentColor}>
        <ViewSlider
          showDetail={showDetail}
          home={
            <LandingView
              snapshot={snapshot}
              agents={agents}
              usage={usage}
              onOpenSurface={openSurface}
              onUnavailableSurface={reportNotBuilt}
              onSearch={openSpotlight}
              onRefresh={refresh}
            />
          }
          detail={
            <Detail
              surface={surface}
              snapshot={snapshot}
              agents={agents}
              usage={usage}
              usageHistory={usageHistory}
              sessionDetail={sessionDetail}
              onWatchSession={watchSession}
              onOpenSkill={openSkill}
              onUnavailable={reportNotBuilt}
              reveal={selected}
              onOpenAgent={openAgent}
              onAnalyzeSession={analyzeSession}
              sessionRequest={sessionRequest}
              onClearSessionRequest={() => setSessionRequest(undefined)}
              onOpenSurface={openSurface}
              onCopySessionId={copySessionId}
              onKillAgent={killAgent}
              onOpenFile={openFile}
              onSearch={openSpotlight}
              onRefresh={refresh}
              onBack={() => setShowDetail(false)}
            />
          }
        />

        {/* Keyed on the open, so hitting the chord again gives an empty box back. */}
        {spotlightOpenedAt !== undefined && (
          <Spotlight
            key={spotlightOpenedAt}
            index={searchIndex}
            initialFilters={kindForSurface(showDetail ? surface : undefined)}
            onChoose={chooseResult}
            onDismiss={dismissSpotlight}
          />
        )}

        {/* Keyed on the open, so a dialog reopened after applying starts from a fresh draft. */}
        {estimatorOpenedAt !== undefined && (
          <EstimatorDialog
            key={estimatorOpenedAt}
            current={settings.tokens.estimator.value}
            onApply={applyEstimator}
            onDismiss={dismissEstimator}
          />
        )}
      </AgentColorProvider>
    </SettingsProvider>
  );
};

interface DetailProps {
  surface: SurfaceId | undefined;
  snapshot: ConfigSnapshot;
  agents: AgentSession[];
  usage: UsageReport | undefined;
  usageHistory: UsageHistory | undefined;
  // One session read whole, and the way to name another. The usage surface names one when a session
  // row is clicked; nothing else on the panel reads it.
  sessionDetail: SessionDetail | undefined;
  onWatchSession: (session?: SessionRef) => void;
  // A skill named on another surface — the usage rows do this. Opens it on the skills surface.
  onOpenSkill: (path: string) => void;
  // Something the panel can't show yet. The host owns the sentence, the same way it does for a
  // surface that isn't built — a session row is the second thing to say it.
  onUnavailable: (title: string) => void;
  reveal?: Reveal;
  // Active Agents only: a row goes to the running agent, and the host works out where that is.
  // Two of its menu's commands take a session id for the same reason; the third stays in the panel
  // and is the pair below.
  onOpenAgent: (sessionId: string) => void;
  // The one row command that leaves the agents surface, and the session it asked for waiting on the
  // usage one. Two props rather than one, because the two surfaces are the two ends of it.
  onAnalyzeSession: (target: SessionTarget) => void;
  sessionRequest: SessionRequest | undefined;
  onClearSessionRequest: () => void;
  // The way back out of a session page to the surface that asked for it.
  onOpenSurface: (id: SurfaceId) => void;
  onCopySessionId: (sessionId: string) => void;
  onKillAgent: (sessionId: string) => void;
  onOpenFile: (path: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// Which surface is in the detail pane. Switching on the id means a new SURFACES entry without a
// view here is a type error rather than a blank pane.
const Detail = ({
  surface,
  snapshot,
  agents,
  usage,
  usageHistory,
  sessionDetail,
  onWatchSession,
  onOpenSkill,
  onUnavailable,
  reveal,
  onOpenAgent,
  onAnalyzeSession,
  sessionRequest,
  onClearSessionRequest,
  onOpenSurface,
  onCopySessionId,
  onKillAgent,
  onOpenFile,
  onSearch,
  onRefresh,
  onBack
}: DetailProps) => {
  switch (surface) {
    case undefined:
      return null;
    case 'skills':
      return (
        <SkillView
          snapshot={snapshot}
          reveal={reveal}
          onOpenFile={onOpenFile}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={onBack}
        />
      );
    case 'system-prompt':
      return (
        <SystemPromptView
          snapshot={snapshot}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={onBack}
        />
      );
    // Routed while its card is still `soon`, so the landing page never reaches it. Flipping that
    // one field is the whole of turning the surface on.
    case 'active-agents':
      return (
        <AgentsView
          agents={agents}
          snapshot={snapshot}
          onOpenAgent={onOpenAgent}
          onOpenFile={onOpenFile}
          onAnalyzeSession={onAnalyzeSession}
          onCopySessionId={onCopySessionId}
          onKillAgent={onKillAgent}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={onBack}
        />
      );
    case 'memory':
      return (
        <MemoryView
          snapshot={snapshot}
          reveal={reveal}
          onOpenFile={onOpenFile}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={onBack}
        />
      );
    case 'usage':
      return (
        <UsageView
          report={usage}
          history={usageHistory}
          skills={snapshot.skills}
          workspaceRoot={snapshot.workspaceRoot}
          onOpenSkill={onOpenSkill}
          sessionDetail={sessionDetail}
          onWatchSession={onWatchSession}
          agents={agents}
          request={sessionRequest}
          onClearRequest={onClearSessionRequest}
          onOpenSurface={onOpenSurface}
          onCopySessionId={onCopySessionId}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={onBack}
        />
      );
  }
};
