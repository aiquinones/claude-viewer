import { Cloud } from 'lucide-react';

// Where a reader goes to see the memories this panel can't. GitHub's own docs rather than the
// settings page: the page moves, the doc that names it doesn't.
const COPILOT_MEMORY_DOCS: string =
  'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory';

// Copilot CLI has memory too, and none of it is on this machine. The card says so rather than the
// surface staying silent — a reader who uses both CLIs would otherwise read the empty half as
// "Copilot doesn't do this".
//
// Measured, not assumed: the CLI holds memories in an in-process cache it re-fetches from GitHub,
// and the event that announces a change is marked `ephemeral: true`, so it never reaches
// `events.jsonl`. There is nothing under `~/.copilot` to read, and this extension makes no network
// calls.
export const CopilotMemoryCard = () => (
  <section className="flex flex-col gap-2 rounded-md border border-dashed border-border p-3">
    <div className="flex items-center gap-2">
      <Cloud className="size-4 shrink-0 text-muted-foreground" />
      <h2 className="text-sm font-medium">Copilot CLI</h2>
      <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">stored on GitHub</span>
    </div>

    <p className="text-xs text-muted-foreground">
      Copilot keeps its memories on GitHub, scoped to a repository or to your account, and fetches
      them per session — nothing is written to <span className="mono">~/.copilot</span>, so there is
      nothing here to list. Claude Viewer reads local files only.
    </p>

    <p className="text-xs text-muted-foreground">
      In a session, <span className="mono">/memory show</span> says whether it's on, and{' '}
      <span className="mono">/memory on</span> · <span className="mono">off</span> switches it. The
      stored facts are at Settings → Copilot → Memory for your account, and under a repository's
      Copilot settings for its own.
    </p>

    <a
      href={COPILOT_MEMORY_DOCS}
      className="text-xs text-[var(--surface-accent)] hover:underline"
      target="_blank"
      rel="noreferrer"
    >
      GitHub's Copilot Memory docs
    </a>
  </section>
);
