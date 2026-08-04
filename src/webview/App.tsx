import { useEffect, useMemo, useState } from 'react';
import { buildSearchIndex } from '../model/search/build-index';
import { Reveal, SearchDoc } from '../model/types';
import { Spotlight } from './spotlight/Spotlight';
import { useSpotlight } from './spotlight/useSpotlight';
import { SurfaceId } from './surfaces';
import { useSnapshot } from './useSnapshot';
import { ViewSlider } from './ViewSlider';
import { LandingView } from './views/LandingView';
import { SkillView } from './views/SkillView';

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
  const { openedAt, dismiss } = useSpotlight();

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

  const chooseResult = (doc: SearchDoc): void => {
    setSelected({ path: doc.id, nonce: Date.now() });
    openSurface('skills');
    dismiss();
  };

  if (!snapshot) return <Loading />;

  return (
    <>
      <ViewSlider
        showDetail={showDetail}
        home={
          <LandingView
            snapshot={snapshot}
            onOpenSurface={openSurface}
            onUnavailableSurface={reportUnavailable}
            onRefresh={refresh}
          />
        }
        detail={
          surface === 'skills' ? (
            <SkillView
              snapshot={snapshot}
              reveal={selected}
              onOpenFile={openFile}
              onRefresh={refresh}
              onBack={() => setShowDetail(false)}
            />
          ) : null
        }
      />

      {/* Keyed on the open, so hitting the chord again gives an empty box back. */}
      {openedAt !== undefined && (
        <Spotlight
          key={openedAt}
          index={searchIndex}
          onChoose={chooseResult}
          onDismiss={dismiss}
        />
      )}
    </>
  );
};

const Loading = () => (
  <div className="p-5 text-sm text-muted-foreground">Reading configuration…</div>
);
