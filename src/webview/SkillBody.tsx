import { CircleAlert } from 'lucide-react';
import { SkillGraph } from '../model/types';
import { ModeBlockers, ViewModeToggle } from './ViewModeToggle';
import { plural } from './format-size';
import { GraphView } from './graph/GraphView';
import { Loading } from './loading/Loading';
import { Markdown, STICKY_ROW_CLASS } from './markdown/Markdown';
import { SkillViewMode } from './view-modes';

interface SkillBodyProps {
  mode: SkillViewMode;
  blockers: ModeBlockers;
  onChangeMode: (mode: SkillViewMode) => void;
  // Text mode: SKILL.md below its frontmatter. Undefined while the host is still reading it.
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
  // Graph mode: who mentions whom, across every listed skill.
  graph: SkillGraph | undefined;
  viewedPath: string | undefined;
  onOpenSkill: (path: string) => void;
}

// Everything Claude reads after the description, and the other ways of looking at it. `px-5` here
// is what the sticky headings inside reach back through, so the two have to agree.
export const SkillBody = ({
  mode,
  blockers,
  onChangeMode,
  body,
  error,
  loading,
  graph,
  viewedPath,
  onOpenSkill
}: SkillBodyProps) => (
  <section className="flex flex-col px-5 pb-8">
    {/* Row 0 of the pinned stack, which is what keeps the toggle reachable however far down the
        file you are. A taller row would throw off every heading offset below it. */}
    <div
      style={{ zIndex: 30 }}
      className={`sticky top-0 -mx-5 flex ${STICKY_ROW_CLASS} items-center gap-2 border-b border-border bg-background px-5`}
    >
      <h2 className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {heading({ mode, graph })}
      </h2>
      <div className="ml-auto">
        <ViewModeToggle mode={mode} blockers={blockers} onChange={onChangeMode} />
      </div>
    </div>

    <div className="pt-3">
      {mode === 'graph' ? (
        <Graph graph={graph} viewedPath={viewedPath} onOpenSkill={onOpenSkill} />
      ) : (
        <Content body={body} error={error} loading={loading} />
      )}
    </div>
  </section>
);

interface HeadingArgs {
  mode: SkillViewMode;
  graph: SkillGraph | undefined;
}

const heading = ({ mode, graph }: HeadingArgs): string => {
  if (mode !== 'graph') return 'Content';
  if (!graph) return 'Graph';
  return `Graph · ${plural(graph.nodes.length, 'skill')} · ${plural(graph.edges.length, 'link')}`;
};

interface ContentProps {
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
}

const Content = ({ body, error, loading }: ContentProps) => {
  if (error) {
    return (
      <p className="flex items-start gap-2 text-xs text-error">
        <CircleAlert className="mt-px size-3.5 shrink-0" />
        <span>could not read the file: {error}</span>
      </p>
    );
  }
  if (loading) return <Loading label="Reading SKILL.md" />;
  if (!body?.trim()) {
    return <p className="text-sm italic text-muted-foreground">nothing below the frontmatter</p>;
  }

  // One row is already pinned above, so every heading in here starts a slot lower.
  return <Markdown raw={body} offsetRows={1} />;
};

interface GraphProps {
  graph: SkillGraph | undefined;
  viewedPath: string | undefined;
  onOpenSkill: (path: string) => void;
}

const Graph = ({ graph, viewedPath, onOpenSkill }: GraphProps) => {
  if (!graph) return <Loading label="Reading every SKILL.md" />;

  // Reachable from a story or a one-skill install; the toggle blocks it everywhere else.
  if (graph.nodes.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        no skill here names another, so there's nothing to draw
      </p>
    );
  }

  return <GraphView graph={graph} viewedPath={viewedPath} onOpenSkill={onOpenSkill} />;
};
