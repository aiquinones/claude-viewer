import { useEffect, useMemo, useState } from 'react';
import { buildSearchIndex } from '../model/search/build-index';
import { ConfigSnapshot, Reveal, SearchDoc } from '../model/types';
import { Loading } from './loading/Loading';
import { Spotlight } from './spotlight/Spotlight';
import { kindForSurface, surfaceForKind } from './spotlight/surface-kind';
import { useSpotlight } from './spotlight/useSpotlight';
import { SurfaceId } from './surfaces';
import { useSnapshot } from './useSnapshot';
import { ViewSlider } from './ViewSlider';
import { LandingView } from './views/LandingView';
import { SkillView } from './views/SkillView';
import { SystemPromptView } from './views/SystemPromptView';

// What the first snapshot usually costs. Longer than a file read: it walks the workspace for
// nested CLAUDE.md files, which on a big repo is seconds — past this the bar stops guessing.
const SNAPSHOT_EXPECTED_MS: number = 1500;

// Holds the host bridge and owns navigation. The views know nothing about it, so the next surface
// is a sibling under views/ plus an entry in SURFACES.
export const App = () => {
  const { snapshot, reveal, refresh, openFile, reportUnavailable } = useSnapshot();
  // Which surface the detail pane renders, and whether the slider is showing it. Separate signals
  // because the surface has to outlive the slide home — clearing it would blank the pane mid-exit.
  const [surface, setSurface] = useState<SurfaceId | undefined>(undefined);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // A skill picked in here. Same shape as the host's reveal, so SkillView takes one prop either way.
  const [selected, setSelected] = useState<Reveal | undefined>(undefined);
  const { spotlightOpenedAt, openSpotlight, dismissSpotlight } = useSpotlight();

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

  // Everything the spotlight can find. Rebuilt only when the host pushes a new snapshot.
  const searchIndex: SearchDoc[] = useMemo(
    () => (snapshot ? buildSearchIndex(snapshot) : []),
    [snapshot]
  );

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
    <>
      <ViewSlider
        showDetail={showDetail}
        home={
          <LandingView
            snapshot={snapshot}
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
            reveal={selected}
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
    </>
  );
};

interface DetailProps {
  surface: SurfaceId | undefined;
  snapshot: ConfigSnapshot;
  reveal?: Reveal;
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
  reveal,
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
  }
};
