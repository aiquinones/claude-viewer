import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ConfigSnapshot, SkillEntry } from '../../model/types';
import { Button } from '@/components/ui/button';
import { SkillDetail } from '../SkillDetail';
import { SkillList } from '../SkillList';

interface SkillViewProps {
  snapshot: ConfigSnapshot;
  onOpenFile: (path: string) => void;
  onRefresh: () => void;
}

// Everything about the skills surface: which one is selected, the list, the detail. App renders
// one of these, so the next surface is a sibling view rather than another branch in App.
export const SkillView = ({ snapshot, onOpenFile, onRefresh }: SkillViewProps) => {
  const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);

  const skills: SkillEntry[] = snapshot.skills;
  const selected: SkillEntry | undefined =
    skills.find((skill) => skill.path === selectedPath) ?? skills[0];
  const winner: SkillEntry | undefined = selected?.shadowedBy
    ? skills.find((skill) => skill.path === selected.shadowedBy)
    : undefined;
  // The other side of the collision: the skills this one wins over.
  const shadowed: SkillEntry[] = selected
    ? skills.filter((skill) => skill.shadowedBy === selected.path)
    : [];
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
        <Button variant="ghost" size="icon" title="Refresh" onClick={onRefresh}>
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
              <SkillDetail
                skill={selected}
                winner={winner}
                shadowed={shadowed}
                onOpenFile={onOpenFile}
                onSelectSkill={setSelectedPath}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Empty = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No skills found in this workspace, <span className="mono mx-1">~/.claude/skills</span>, or any
    installed plugin.
  </div>
);
