import { useEffect, useState } from 'react';
import { SurfaceId } from './surfaces';
import { useSnapshot } from './useSnapshot';
import { ViewSlider } from './ViewSlider';
import { LandingView } from './views/LandingView';
import { SkillView } from './views/SkillView';

// Holds the host bridge and owns which surface is open — undefined means the landing page. The
// views know nothing about navigation, so the next surface is a sibling under views/ plus an
// entry in SURFACES.
export const App = () => {
  const { snapshot, reveal, refresh, openFile, reportUnavailable } = useSnapshot();
  const [openSurface, setOpenSurface] = useState<SurfaceId | undefined>(undefined);

  // The palette and vscode:// links name one skill, so a reveal has to open the skills surface.
  // Otherwise it lands behind the landing page and looks like nothing happened.
  useEffect(() => {
    if (reveal) setOpenSurface('skills');
  }, [reveal]);

  if (!snapshot) return <Loading />;

  return (
    <ViewSlider
      showDetail={openSurface !== undefined}
      home={
        <LandingView
          snapshot={snapshot}
          onOpenSurface={setOpenSurface}
          onUnavailableSurface={reportUnavailable}
          onRefresh={refresh}
        />
      }
      // Skills is the only built surface, and it stays mounted rather than switching on
      // `openSurface`: unmounting would drop the selection and blank the pane mid-slide.
      detail={
        <SkillView
          snapshot={snapshot}
          reveal={reveal}
          onOpenFile={openFile}
          onRefresh={refresh}
          onBack={() => setOpenSurface(undefined)}
        />
      }
    />
  );
};

const Loading = () => (
  <div className="p-5 text-sm text-muted-foreground">Reading configuration…</div>
);
