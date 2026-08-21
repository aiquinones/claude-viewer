import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { SkillGraph } from '../model/types';
import { ViewModeToggle } from './ViewModeToggle';
import { ModeBlockers } from './view-mode';
import { plural } from './format-size';
import { FlowCanvas } from './flow/FlowCanvas';
import { SkillFlow } from './flow/steps';
import { GraphView } from './graph/GraphView';
import { neighborhood } from './graph/neighborhood';
import { Loading } from './loading/Loading';
import { SectionTarget } from './markdown/find-section';
import { Markdown, STICKY_ROW_CLASS } from './markdown/Markdown';
import { SkillViewMode, VIEW_MODES } from './view-modes';
import { Z } from './z-layers';

interface SkillBodyProps {
  mode: SkillViewMode;
  blockers: ModeBlockers<SkillViewMode>;
  onChangeMode: (mode: SkillViewMode) => void;
  // Text mode: SKILL.md below its frontmatter. Undefined while the host is still reading it.
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
  // Graph mode: who mentions whom, across every listed skill. Narrowed to the viewed skill's own
  // neighbourhood before anything draws it.
  graph: SkillGraph | undefined;
  // Flow mode: this skill's own steps. Built from the same body text the markdown renders, so it
  // arrives and goes stale with it.
  flow: SkillFlow | undefined;
  // A heading a vscode:// link landed on, already resolved. Text mode lights it, flow mode opens
  // the step holding it — SkillView has already picked whichever of those the heading supports.
  target?: SectionTarget;
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
  flow,
  target,
  viewedPath,
  onOpenSkill
}: SkillBodyProps) => {
  const shown: SkillGraph | undefined = useMemo(
    () => (graph ? neighborhood({ graph, path: viewedPath }) : undefined),
    [graph, viewedPath]
  );

  return (
    <section className="flex flex-col px-5 pb-8">
      {/* Rows 0 and 1 of the pinned stack — the heading and the toggle on one line — which is what
          keeps the toggle reachable however far down the file you are. Its height has to stay an
          exact multiple of the pinned row, or every heading offset below it lands wrong: that's the
          `offsetRows={2}` the markdown gets, and the two have to agree. */}
      <div
        style={{ zIndex: Z.stickyTop }}
        className={`sticky top-0 -mx-5 flex ${STICKY_ROWS_CLASS} items-center justify-between gap-3 border-b border-border bg-background px-5`}
      >
        <h2 className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {heading({ mode, graph: shown, flow })}
        </h2>
        <ViewModeToggle modes={VIEW_MODES} mode={mode} blockers={blockers} onChange={onChangeMode} />
      </div>

      {/* Three guards rather than nested ternaries — the modes are exclusive, so each one reads on
          its own line. */}
      <div className="pt-3">
        {mode === 'text' && (
          <Content body={body} error={error} loading={loading} target={target} />
        )}
        {mode === 'graph' && (
          <Graph graph={shown} viewedPath={viewedPath} onOpenSkill={onOpenSkill} />
        )}
        {mode === 'flow' && (
          <Flow
            flow={flow}
            error={error}
            loading={loading}
            target={target}
            viewedPath={viewedPath}
            onOpenSkill={onOpenSkill}
          />
        )}
      </div>
    </section>
  );
};

// Two of the markdown's pinned rows, to the pixel: STICKY_ROW_CLASS is h-7, so the block is h-14.
// One row of content centres in that height, and the 38px toggle is the tallest it can hold.
const STICKY_ROWS: number = 2;
const STICKY_ROWS_CLASS: string = 'h-14';

interface HeadingArgs {
  mode: SkillViewMode;
  graph: SkillGraph | undefined;
  flow: SkillFlow | undefined;
}

const heading = ({ mode, graph, flow }: HeadingArgs): string => {
  if (mode === 'graph') {
    if (!graph) return 'Graph';
    // Counts the picture, not the whole install: `graph` is already the neighbourhood by here.
    return `Graph · ${plural(graph.nodes.length, 'skill')} · ${plural(graph.edges.length, 'link')}`;
  }
  if (mode === 'flow') {
    return flow ? `Flow · ${plural(flow.steps.length, 'step')}` : 'Flow';
  }
  return 'Content';
};

interface ContentProps {
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
  target?: SectionTarget;
}

const Content = ({ body, error, loading, target }: ContentProps) => {
  if (error) return <ReadError error={error} />;
  if (loading) return <Loading label="Reading SKILL.md" />;
  if (!body?.trim()) {
    return <p className="text-sm italic text-muted-foreground">nothing below the frontmatter</p>;
  }

  // The toggle and the heading are pinned above, so every heading in here starts two slots lower.
  return <Markdown raw={body} offsetRows={STICKY_ROWS} target={target} />;
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

interface FlowProps {
  flow: SkillFlow | undefined;
  error: string | undefined;
  loading: boolean;
  target?: SectionTarget;
  viewedPath: string | undefined;
  onOpenSkill: (path: string) => void;
}

const Flow = ({ flow, error, loading, target, viewedPath, onOpenSkill }: FlowProps) => {
  if (error) return <ReadError error={error} />;
  if (loading) return <Loading label="Reading SKILL.md" />;

  // Reachable by staying in flow mode while selecting a skill that has no sequence — the toggle
  // blocks picking it in the first place.
  if (!flow) {
    return (
      <p className="text-sm italic text-muted-foreground">
        this skill isn't written as a sequence, so there's nothing to lay out
      </p>
    );
  }

  // Keyed on the skill, so selecting another one starts with nothing open. The trail holds nodes
  // from the flow it was opened on, and those don't exist in the next skill's.
  return <FlowCanvas key={viewedPath} flow={flow} target={target} onOpenSkill={onOpenSkill} />;
};

interface ReadErrorProps {
  error: string;
}

const ReadError = ({ error }: ReadErrorProps) => (
  <p className="flex items-start gap-2 text-xs text-error">
    <CircleAlert className="mt-px size-3.5 shrink-0" />
    <span>could not read the file: {error}</span>
  </p>
);
