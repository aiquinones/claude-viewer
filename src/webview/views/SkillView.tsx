import { CSSProperties, useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { listed } from '../../model/shadowing';
import { ConfigSnapshot, Reveal, SkillEntry, SkillGraph } from '../../model/types';
import { Button } from '@/components/ui/button';
import { AllowedTools } from '../AllowedTools';
import { PanelActions } from '../PanelActions';
import { SkillBody } from '../SkillBody';
import { SkillDetail } from '../SkillDetail';
import { SkillNav } from '../SkillNav';
import { ModeBlockers } from '../ViewModeToggle';
import { formatTokens } from '../format-size';
import { useSkillGraph } from '../graph/useSkillGraph';
import { listingTotals } from '../skill-totals';
import { surfaceAccent } from '../surfaces';
import { useFileBody } from '../useFileBody';
import { DEFAULT_VIEW_MODE, SkillViewMode } from '../view-modes';

interface SkillViewProps {
  snapshot: ConfigSnapshot;
  // The palette or a vscode:// link asking for one skill.
  reveal?: Reveal;
  onOpenFile: (path: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onBack: () => void;
}

// Everything about the skills surface: which one is selected, the list, the detail. App renders
// one of these, so the next surface is a sibling view rather than another branch in App.
export const SkillView = ({
  snapshot,
  reveal,
  onOpenFile,
  onSearch,
  onRefresh,
  onBack
}: SkillViewProps) => {
  const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<SkillViewMode>(DEFAULT_VIEW_MODE);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // A reveal comes from outside the webview, so it wins over whatever was clicked in here.
  useEffect(() => {
    if (reveal) setSelectedPath(reveal.path);
  }, [reveal]);

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
  // Only the skills that are actually listed — a shadowed one costs nothing, the same way a
  // conditional CLAUDE.md stays out of the prompt surface's headline.
  const listingTokens: number = listingTotals(listed(skills)).estimatedTokens;
  const { body, error, loading } = useFileBody({
    path: selected?.path,
    loadedAt: snapshot.loadedAt
  });
  // Asked for on mount, not on opening the graph: the toggle can't say whether this skill has
  // references until the graph is in hand.
  const { graph } = useSkillGraph(snapshot.loadedAt);

  // Switching to the graph scrolls it into view — the toggle sits at the top of a section that may
  // well be below the fold when you press it.
  const openMode = (next: SkillViewMode): void => {
    setMode(next);
    if (next === 'graph') contentRef.current?.scrollIntoView({ block: 'start' });
  };

  // The panel's selection follows a link out of the graph, and reading is what you asked for.
  const openFromGraph = (path: string): void => {
    setSelectedPath(path);
    setMode('text');
  };

  return (
    <div
      className="flex h-full flex-col"
      style={{ '--surface-accent': surfaceAccent('skills') } as CSSProperties}
    >
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" title="Back" onClick={onBack}>
          <ChevronLeft />
        </Button>
        <div className="mr-auto flex flex-col gap-0.5">
          <span className="text-sm font-semibold">Skills</span>
          <span className="text-xs text-muted-foreground">
            {skills.length} found · ~{formatTokens(listingTokens)} est. tokens listed
            {shadowedCount > 0 && ` · ${shadowedCount} shadowed`}
            {!snapshot.workspaceRoot && ' · no folder open, user + plugin scopes only'}
          </span>
        </div>
        <PanelActions onSearch={onSearch} onRefresh={onRefresh} />
      </header>

      {skills.length === 0 ? (
        <Empty />
      ) : (
        // One column under `md`, where SkillNav overlays instead of sitting in the grid. `relative`
        // is what its parked-off-screen panel positions against, and `overflow-x-clip` is what
        // keeps that panel from turning into scrollable width.
        <div className="relative grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] overflow-x-clip md:grid-cols-[minmax(160px,240px)_minmax(0,1fr)]">
          <SkillNav
            skills={skills}
            selectedPath={selected?.path}
            reveal={reveal}
            onSelect={(skill) => setSelectedPath(skill.path)}
          />
          {/* The pane, not its children, is the scroll container the sticky headings resolve
              against — so the padding sits on the children and a heading bar can span the width.
              `relative z-0` makes it their stacking context too: the headings climb to z-29 to
              stack against each other, which would otherwise put them over the nav sliding in.
              `pl-4` is the one exception to padding-on-the-children: it's the rail's width, and a
              full-bleed heading bar has to stop at it rather than rule a line through the handle. */}
          <div className="relative z-0 min-w-0 overflow-y-auto overflow-x-clip pl-4 md:pl-2">
            {selected && (
              <>
                <div className="p-5">
                  <SkillDetail
                    skill={selected}
                    winner={winner}
                    shadowed={shadowed}
                    onOpenFile={onOpenFile}
                    onSelectSkill={setSelectedPath}
                  />
                </div>
                <div ref={contentRef}>
                  <SkillBody
                    mode={mode}
                    blockers={modeBlockers({ graph, path: selected.path })}
                    onChangeMode={openMode}
                    body={body}
                    error={error}
                    loading={loading}
                    graph={graph}
                    viewedPath={selected.path}
                    onOpenSkill={openFromGraph}
                  />
                </div>
                {mode === 'text' && <AllowedTools tools={selected.allowedTools} />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface ModeBlockersArgs {
  graph: SkillGraph | undefined;
  path: string;
}

// A skill has references exactly when it's a node in the graph — the graph already dropped the
// unconnected ones, so this is a lookup rather than a second rule that could drift from the first.
const modeBlockers = ({ graph, path }: ModeBlockersArgs): ModeBlockers => {
  if (!graph) return { graph: 'Building the graph…' };
  if (graph.nodes.some((node) => node.path === path)) return {};
  return { graph: 'This skill names no other, and none names it' };
};

const Empty = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No skills found in this workspace, <span className="mono mx-1">~/.claude/skills</span>, or any
    installed plugin.
  </div>
);
