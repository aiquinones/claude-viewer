import { AGENT_TOOLS, AGENT_TOOL_LABEL, AgentTool } from '../model/types';
import { cn } from '@/lib/utils';

interface MemoryTabsProps {
  tool: AgentTool;
  onChange: (tool: AgentTool) => void;
}

// The active tab wears the colour its CLI already wears on an agent row, so the two surfaces name
// the same tool the same way.
const ACTIVE: Record<AgentTool, string> = {
  claude: 'border-agent-claude text-agent-claude',
  copilot: 'border-agent-copilot text-agent-copilot',
  codex: 'border-agent-codex text-agent-codex'
};

// Which CLI's memory is on screen. Tabs rather than one merged list — unlike the agents surface,
// where every tool puts rows on disk, only Claude's memories are local files this panel reads.
// Halves that answer different questions don't belong in one column.
//
// Text, not icons: the tool's name is the entire content of the choice.
export const MemoryTabs = ({ tool, onChange }: MemoryTabsProps) => (
  <div role="tablist" aria-label="Memory source" className="flex shrink-0 items-center gap-1">
    {AGENT_TOOLS.map((entry) => (
      <button
        key={entry}
        type="button"
        role="tab"
        aria-selected={entry === tool}
        onClick={() => onChange(entry)}
        className={cn(
          'cursor-pointer border-b-2 px-3 py-1.5 text-xs font-medium transition-colors',
          entry === tool
            ? ACTIVE[entry]
            : 'border-transparent text-muted-foreground hover:text-foreground'
        )}
      >
        {AGENT_TOOL_LABEL[entry]}
      </button>
    ))}
  </div>
);
