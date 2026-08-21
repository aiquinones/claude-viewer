import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { listed } from '../../model/shadowing';
import { ConfigSnapshot, Reveal, SkillEntry, SkillGraph } from '../../model/types';
import { Button } from '@/components/ui/button';
import { AllowedTools } from '../AllowedTools';
import { PanelActions } from '../PanelActions';
import { SkillBody } from '../SkillBody';
import { SkillDetail } from '../SkillDetail';
import { SkillNav } from '../SkillNav';
import { ModeBlockers } from '../view-mode';
import { SkillFlow, toSkillFlow } from '../flow/steps';
import { TokenEstimate } from '../TokenEstimate';
import { useSkillGraph } from '../graph/useSkillGraph';
import { resolveSection, SectionTarget } from '../markdown/find-section';
import { Section, toSections } from '../markdown/sections';
import { trailTo } from '../flow/find-step';
import { listingTotals } from '../skill-totals';
import { surfaceAccent } from '../surfaces';
import { useFileBody } from '../useFileBody';
import { DEFAULT_VIEW_MODE, SkillViewMode } from '../view-modes';
import { Z } from '../z-layers';

// What a link named, before the file it names it in has been read.
interface Asked {
  slug: string;
  nonce: number;
}

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
  // A heading a vscode:// link named, exactly as it named it. Resolving has to wait for the file,
  // which arrives later — so what's held here is the ask, not the answer.
  const [asked, setAsked] = useState<Asked | undefined>(undefined);

  // A reveal comes from outside the webview, so it wins over whatever was clicked in here.
  useEffect(() => {
    if (!reveal) return;
    setSelectedPath(reveal.path);
    setAsked(reveal.section ? { slug: reveal.section, nonce: reveal.nonce } : undefined);
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
  const listingChars: number = listingTotals(listed(skills)).chars;
  const { body, error, loading } = useFileBody({
    path: selected?.path,
    loadedAt: snapshot.loadedAt
  });
  // Asked for on mount, not on opening the graph: the toggle can't say whether this skill has
  // references until the graph is in hand.
  const { graph } = useSkillGraph(snapshot.loadedAt);
  // Unlike the graph, the flow needs nothing from the host — it's this one body, which is already
  // here, plus the names of the other skills to spot references to.
  const flow: SkillFlow | undefined = useMemo(
    () => (body === undefined ? undefined : toSkillFlow({ raw: body, skills, selfPath: selected?.path })),
    [body, skills, selected?.path]
  );

  // The heading the link actually landed on. Resolved here rather than inside the views, so the
  // three loose-matching rules have one home and both modes agree on the answer.
  const target: SectionTarget | undefined = useMemo(() => {
    if (!asked || body === undefined) return undefined;

    const sections: Section[] = toSections(body);
    const slug: string | undefined = resolveSection({ sections, target: asked.slug });
    return slug ? { slug, nonce: asked.nonce } : undefined;
  }, [asked, body]);

  // Which mode a link lands in is a question about what the link named. A heading that's a step —
  // or a section inside one — is better read as a step, with the flow around it saying where in the
  // sequence you are; a heading that isn't in the sequence has nowhere to go but the text.
  useEffect(() => {
    if (!target) return;
    const inFlow: boolean = Boolean(flow && trailTo({ steps: flow.steps, slug: target.slug }));
    setMode(inFlow ? 'flow' : 'text');
  }, [target, flow]);

  // Picking a skill in here is a fresh read of it, so a section a link asked for doesn't follow it
  // into the next file — where the same slug could well match something.
  const selectSkill = (path: string): void => {
    setSelectedPath(path);
    setAsked(undefined);
  };

  // The panel's selection follows a link out of the graph or a chip in the flow, and reading is
  // what you asked for either way.
  const openSkill = (path: string): void => {
    selectSkill(path);
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
            {skills.length} found · <TokenEstimate chars={listingChars} long /> listed
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
            onSelect={(skill) => selectSkill(skill.path)}
          />
          {/* The pane, not its children, is the scroll container the sticky headings resolve
              against — so the padding sits on the children and a heading bar can span the width.
              `Z.contained` makes it their stacking context too: the pinned rows stack against each
              other, which without it would put them over the nav sliding in.
              `pl-4` is the one exception to padding-on-the-children: it's the rail's width, and a
              full-bleed heading bar has to stop at it rather than rule a line through the handle. */}
          <div
            style={{ zIndex: Z.contained }}
            className="relative min-w-0 overflow-y-auto overflow-x-clip pl-4 md:pl-2"
          >
            {selected && (
              <>
                <div className="p-5">
                  <SkillDetail
                    skill={selected}
                    winner={winner}
                    shadowed={shadowed}
                    onOpenFile={onOpenFile}
                    onSelectSkill={selectSkill}
                  />
                </div>
                <SkillBody
                  mode={mode}
                  blockers={modeBlockers({ graph, path: selected.path, flow, loading })}
                  onChangeMode={setMode}
                  body={body}
                  error={error}
                  loading={loading}
                  graph={graph}
                  flow={flow}
                  target={target}
                  viewedPath={selected.path}
                  onOpenSkill={openSkill}
                />
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
  flow: SkillFlow | undefined;
  loading: boolean;
}

// Each mode is blocked by a lookup into the thing it would render, rather than a second rule that
// could drift from the first: a skill has references exactly when it's a node in the graph, and it
// has steps exactly when `toSkillFlow` found some.
const modeBlockers = ({
  graph,
  path,
  flow,
  loading
}: ModeBlockersArgs): ModeBlockers<SkillViewMode> => ({
  ...graphBlocker({ graph, path }),
  ...flowBlocker({ flow, loading })
});

const graphBlocker = ({
  graph,
  path
}: Omit<ModeBlockersArgs, 'flow' | 'loading'>): ModeBlockers<SkillViewMode> => {
  if (!graph) return { graph: 'Building the graph…' };
  if (graph.nodes.some((node) => node.path === path)) return {};
  return { graph: 'This skill names no other, and none names it' };
};

const flowBlocker = ({
  flow,
  loading
}: Omit<ModeBlockersArgs, 'graph' | 'path'>): ModeBlockers<SkillViewMode> => {
  if (loading) return { flow: 'Reading SKILL.md…' };
  if (flow) return {};
  return { flow: "This skill isn't written as a sequence of steps" };
};

const Empty = () => (
  <div className="flex flex-1 items-center justify-center p-5 text-center text-sm text-muted-foreground">
    No skills found in this workspace, <span className="mono mx-1">~/.claude/skills</span>, or any
    installed plugin.
  </div>
);
