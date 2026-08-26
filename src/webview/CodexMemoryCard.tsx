import { Construction } from 'lucide-react';

// Codex CLI has memory and keeps it on this machine, which makes this tab a different answer from
// Copilot's: there is something here to read, and this panel doesn't read it yet.
//
// The card deliberately doesn't describe the format. `~/.codex/memories/` is an empty directory on
// the machine this was written against and the database beside it wouldn't open read-only, so
// anything said about the shape would be a guess — and a surface whose whole point is showing the
// resolved state shouldn't guess about where the state lives.
export const CodexMemoryCard = () => (
  <section className="flex flex-col gap-2 rounded-md border border-dashed border-border p-3">
    <div className="flex items-center gap-2">
      <Construction className="size-4 shrink-0 text-muted-foreground" />
      <h2 className="text-sm font-medium">Codex CLI</h2>
      <span className="mono ml-auto shrink-0 text-xs text-muted-foreground">not read yet</span>
    </div>

    <p className="text-xs text-muted-foreground">
      Codex stores its memories on this machine, under <span className="mono">~/.codex</span>, and
      each session records whether memory was on. Claude Viewer doesn't read them yet — the Active
      Agents surface is the only place Codex is wired in so far.
    </p>

    <p className="text-xs text-muted-foreground">
      Until it is, <span className="mono">/memory</span> in a Codex session is what shows them.
    </p>
  </section>
);
