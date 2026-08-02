import { useSnapshot } from './useSnapshot';
import { SkillView } from './views/SkillView';

// Holds the host bridge and picks a view. Skills is the only one so far; memory, hooks, and the
// rest arrive as siblings under views/, with the choice between them made here.
export const App = () => {
  const { snapshot, reveal, refresh, openFile } = useSnapshot();

  if (!snapshot) return <Loading />;

  return (
    <SkillView
      snapshot={snapshot}
      reveal={reveal}
      onOpenFile={openFile}
      onRefresh={refresh}
    />
  );
};

const Loading = () => (
  <div className="p-5 text-sm text-muted-foreground">Reading configuration…</div>
);
