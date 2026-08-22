// The architecture map as data — docs/architecture-map.md, in the shape the view walks.
//
// One node per piece worth explaining, nested the way the code is. A node with `children` is
// something you can open; a node with a `diagram` draws itself rather than only listing what's
// under it.

export type AtlasDiagram = 'boundary';

export interface AtlasNode {
  id: string;
  title: string;
  // One line. What this piece does, not what it is made of — the children say that.
  blurb: string;
  // A CSS color from the editor's chart palette, so a subtree keeps one colour as you go down.
  accent: string;
  diagram?: AtlasDiagram;
  children?: AtlasNode[];
}

const HOST_ACCENT: string = 'var(--vscode-charts-blue, #3794ff)';
const MODEL_ACCENT: string = 'var(--vscode-charts-purple, #b180d7)';
const WEBVIEW_ACCENT: string = 'var(--vscode-charts-green, #89d185)';
const SYSTEM_ACCENT: string = 'var(--vscode-charts-orange, #d18616)';

const host: AtlasNode = {
  id: 'host',
  title: 'Host',
  blurb: 'The node half. Reads the disk, talks to VS Code, and owns every cache.',
  accent: HOST_ACCENT,
  children: [
    {
      id: 'entry-points',
      title: 'Entry points',
      blurb: 'Four ways in — the launch command, Find Skill, a vscode:// link, and the tree.',
      accent: HOST_ACCENT
    },
    {
      id: 'panel',
      title: 'panel.ts',
      blurb: 'Panel lifecycle, the message router, six store subscriptions, and the poll modes.',
      accent: HOST_ACCENT
    },
    {
      id: 'stores',
      title: 'Stores',
      blurb: 'Seven caches, each with its own emitter and its own reason not to be the snapshot.',
      accent: HOST_ACCENT
    },
    {
      id: 'focus-agent',
      title: 'focus-agent/',
      blurb: 'Reads the OS process tree to find the tab or terminal a clicked agent row runs in.',
      accent: HOST_ACCENT
    }
  ]
};

const model: AtlasNode = {
  id: 'model',
  title: 'Model',
  blurb: 'Pure. No vscode, no DOM — compiled into both bundles, which is what lets rules be shared.',
  accent: MODEL_ACCENT,
  children: [
    {
      id: 'config',
      title: 'config/',
      blurb: 'The foundation: typed results, file reads, where things live, frontmatter.',
      accent: MODEL_ACCENT
    },
    {
      id: 'loaders',
      title: 'Loaders',
      blurb: 'Six of them, all the same shape: locate → parse → validate → typed entries.',
      accent: MODEL_ACCENT
    },
    {
      id: 'derived',
      title: 'Derived',
      blurb: 'What is computed from what was loaded — the graph, search, budgets, estimates.',
      accent: MODEL_ACCENT
    },
    {
      id: 'snapshot',
      title: 'The snapshot',
      blurb: 'Exactly three loaders. Everything else rides its own channel, and that is the point.',
      accent: MODEL_ACCENT
    }
  ]
};

const webview: AtlasNode = {
  id: 'webview',
  title: 'Webview',
  blurb: 'React in an iframe. Renders what it is posted and posts intents back; never reads a file.',
  accent: WEBVIEW_ACCENT,
  children: [
    {
      id: 'shell',
      title: 'App + ViewSlider',
      blurb: 'The bridge, which surface is open, and two panes on one track that both stay mounted.',
      accent: WEBVIEW_ACCENT
    },
    {
      id: 'views',
      title: 'The six views',
      blurb: 'Landing, Skills, System Prompt, Active Agents, Usage, Memory — one per SURFACES entry.',
      accent: WEBVIEW_ACCENT
    },
    {
      id: 'cross-cutting',
      title: 'Shared pieces',
      blurb: 'Spotlight, the markdown renderer, loading robots, token estimates, the z scale.',
      accent: WEBVIEW_ACCENT
    }
  ]
};

const systems: AtlasNode[] = [
  {
    id: 'freshness',
    title: 'Freshness',
    blurb: 'Three clocks: watchers that fire on start and exit, four poll rates, and a 1s tick.',
    accent: SYSTEM_ACCENT
  },
  {
    id: 'two-clis',
    title: 'Two CLIs, one row',
    blurb: 'claude/ and copilot/ are peers under sessions/ and usage/. The merge is one file.',
    accent: SYSTEM_ACCENT
  },
  {
    id: 'read-vs-computed',
    title: 'Read vs computed',
    blurb: 'chars crosses the wire; chars / 4 does not. The same rule in three places.',
    accent: SYSTEM_ACCENT
  }
];

export const ATLAS_ROOT: AtlasNode = {
  id: 'viewer',
  title: 'Claude Viewer',
  blurb:
    'Two bundles and one typed wire. The host reads the disk, the webview draws it, and the model ' +
    'in between belongs to both.',
  accent: 'var(--vscode-foreground)',
  diagram: 'boundary',
  children: [host, model, webview, ...systems]
};

// The nodes named by a trail of ids, root first. Stops at the first id that isn't there, so a stale
// trail lands on the deepest node it can rather than on nothing.
export const trailNodes = (trail: string[]): AtlasNode[] => {
  const nodes: AtlasNode[] = [ATLAS_ROOT];

  for (const id of trail) {
    const next: AtlasNode | undefined = nodes[nodes.length - 1]?.children?.find(
      (child) => child.id === id
    );
    if (!next) break;
    nodes.push(next);
  }

  return nodes;
};
