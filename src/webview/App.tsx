import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { SkillEntry } from '../model/types';
import { Button } from '@/components/ui/button';
import { SkillDetail } from './SkillDetail';
import { SkillList } from './SkillList';
import { useSnapshot } from './useSnapshot';

export const App = () => {
  const { snapshot, refresh, openFile } = useSnapshot();
  const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);

  if (!snapshot) return <Loading />;

  const skills: SkillEntry[] = snapshot.skills;
  const selected: SkillEntry | undefined =
    skills.find((skill) => skill.path === selectedPath) ?? skills[0];
  const winner: SkillEntry | undefined = selected?.shadowedBy
    ? skills.find((skill) => skill.path === selected.shadowedBy)
    : undefined;
  const shadowedCount: number = skills.filter((skill) => skill.shadowedBy).length;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">Skills</span>
          <span className="text-xs text-muted-foreground">
            {skills.length} found
            {shadowedCount > 0 && ` · ${shadowedCount} shadowed`}
            {!snapshot.workspaceRoot && ' · no folder open, user + plugin scopes only'}
          </span>
        </div>
        <Button variant="ghost" size="icon" title="Refresh" onClick={refresh}>
          <RefreshCw />
        </Button>
      </header>

      {skills.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(200px,300px)_1fr]">
          <div className="overflow-y-auto border-r border-border py-3">
            <SkillList
              skills={skills}
              selectedPath={selected?.path}
              onSelect={(skill) => setSelectedPath(skill.path)}
            />
          </div>
          <div className="overflow-y-auto p-5">
            {selected && (
              <SkillDetail skill={selected} winner={winner} onOpenFile={openFile} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Loading = () => (
  <div className="p-5 text-sm text-muted-foreground">Reading configuration…</div>
);

const Empty = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No skills found in this workspace, <span className="mono mx-1">~/.claude/skills</span>, or any
    installed plugin.
  </div>
);
