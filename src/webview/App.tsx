import { useEffect, useState } from 'react';
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

  const openSurface = (id: SurfaceId): void => {
    setSurface(id);
    setShowDetail(true);
  };

  // The palette and vscode:// links name one skill, so a reveal has to open the skills surface.
  // Otherwise it lands behind the landing page and looks like nothing happened.
  useEffect(() => {
    if (reveal) openSurface('skills');
  }, [reveal]);

  if (!snapshot) return <Loading />;

  return (
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
            reveal={reveal}
            onOpenFile={openFile}
            onRefresh={refresh}
            onBack={() => setShowDetail(false)}
          />
        ) : null
      }
    />
  );
};

const Loading = () => (
  <div className="p-5 text-sm text-muted-foreground">Reading configuration…</div>
);
