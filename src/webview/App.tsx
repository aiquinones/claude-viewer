import { useEffect, useMemo, useState } from 'react';
import { buildSearchIndex } from '../model/search/build-index';
import { AgentSession, ConfigSnapshot, Reveal, SearchDoc } from '../model/types';
import { UsageReport } from '../model/usage/types';
import { TokenEstimator } from '../model/estimate-tokens';
import { AgentColorProvider } from './agent-color/AgentColorContext';
import { EstimatorDialog } from './EstimatorDialog';
import { useEstimatorDialog } from './useEstimatorDialog';
import { Loading } from './loading/Loading';
import { SettingsProvider } from './settings/SettingsContext';
import { Spotlight } from './spotlight/Spotlight';
import { kindForSurface, surfaceForKind } from './spotlight/surface-kind';
import { useSpotlight } from './spotlight/useSpotlight';
import { SurfaceId } from './surfaces';
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
    changeUsage,
    changeEstimator,
    settings,
    agentColors,
    setAgentColor,
    reveal,
    refresh,
    openFile,
    openAgent,
    reportSurface,
    reportUnavailable,
    openSettings
  } = useSnapshot();
  // Which surface the detail pane renders, and whether the slider is showing it. Separate signals
  // because the surface has to outlive the slide home — clearing it would blank the pane mid-exit.
  const [surface, setSurface] = useState<SurfaceId | undefined>(undefined);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // A skill picked in here. Same shape as the host's reveal, so SkillView takes one prop either way.
  const [selected, setSelected] = useState<Reveal | undefined>(undefined);
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

  // The palette and vscode:// links name one skill, so a reveal has to open the skills surface.
  // Otherwise it lands behind the landing page and looks like nothing happened.
  useEffect(() => {
    if (!reveal) return;
    setSelected(reveal);
    openSurface('skills');
  }, [reveal]);

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
              onUnavailableSurface={reportUnavailable}
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
              onOpenSkill={openSkill}
              reveal={selected}
              onOpenAgent={openAgent}
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
  // A skill named on another surface — the usage rows do this. Opens it on the skills surface.
  onOpenSkill: (path: string) => void;
  reveal?: Reveal;
  // Active Agents only: a row goes to the running agent, and the host works out where that is.
  onOpenAgent: (sessionId: string) => void;
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
  onOpenSkill,
  reveal,
  onOpenAgent,
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
          skills={snapshot.skills}
          onOpenSkill={onOpenSkill}
          onSearch={onSearch}
          onRefresh={onRefresh}
          onBack={onBack}
        />
      );
  }
};
