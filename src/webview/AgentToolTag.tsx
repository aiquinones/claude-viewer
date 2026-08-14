import { AGENT_TOOL_LABEL, AgentTool } from '../model/types';
import { cn } from '@/lib/utils';

interface AgentToolTagProps {
  tool: AgentTool;
}

// Which CLI a row belongs to. Both tools are in one list, so a row has to say which one it is —
// but it's the least interesting thing on the row, so it prints as a quiet mono tag rather than a
// second badge competing with the activity one.
const TEXT: Record<AgentTool, string> = {
  claude: 'text-agent-claude',
  copilot: 'text-agent-copilot'
};

// Short enough to sit on a narrow row. The tooltip carries the real name.
const SHORT: Record<AgentTool, string> = {
  claude: 'claude',
  copilot: 'copilot'
};

export const AgentToolTag = ({ tool }: AgentToolTagProps) => (
  <span
    title={AGENT_TOOL_LABEL[tool]}
    className={cn('mono shrink-0 text-[10px] uppercase tracking-wide', TEXT[tool])}
  >
    {SHORT[tool]}
  </span>
);
