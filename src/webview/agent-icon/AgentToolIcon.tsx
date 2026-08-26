import { ComponentType } from 'react';
import { AGENT_TOOL_LABEL, AgentTool } from '../../model/types';
import { cn } from '@/lib/utils';
import { ClaudeMark } from './ClaudeMark';
import { CodexMark } from './CodexMark';
import { CopilotMark } from './CopilotMark';

// How big the mark draws. Named rather than a className, because the four places that draw it have
// to agree — a size passed as a utility string is one that drifts per call site.
//
// `xs` is the grid's hover bubble, where every line is 11px and the icon sits in a column of counts.
// `sm` is a row in a list. `md` is the session page's own header, next to a `text-sm` title.
export const AGENT_ICON_SIZES = ['xs', 'sm', 'md'] as const;

export type AgentIconSize = (typeof AGENT_ICON_SIZES)[number];

const SIZE: Record<AgentIconSize, string> = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4'
};

const TEXT: Record<AgentTool, string> = {
  claude: 'text-agent-claude',
  copilot: 'text-agent-copilot',
  codex: 'text-agent-codex'
};

// Keyed rather than a ternary: three tools is where picking one stops reading as a choice between
// two and starts being a lookup, and a fourth would be an entry rather than a nested conditional.
const MARK: Record<AgentTool, ComponentType<{ className?: string }>> = {
  claude: ClaudeMark,
  copilot: CopilotMark,
  codex: CodexMark
};

interface AgentToolIconProps {
  tool: AgentTool;
  size?: AgentIconSize;
}

// Which CLI a row belongs to. Every tool is in one list, so a row has to say which one it is — and
// each one has a mark that says it in less room than its name does, which is what a row is short of.
//
// The colours are the ones the rest of the surface already gives each tool, so a tool is spelled and
// coloured one way everywhere. The label rides the wrapper as both `title` and `aria-label`: the
// marks are the only thing naming the tool now, so the name has to be somewhere.
export const AgentToolIcon = ({ tool, size = 'sm' }: AgentToolIconProps) => {
  const Mark = MARK[tool];

  return (
    <span
      title={AGENT_TOOL_LABEL[tool]}
      aria-label={AGENT_TOOL_LABEL[tool]}
      role="img"
      className={cn('inline-flex shrink-0 items-center', TEXT[tool])}
    >
      <Mark className={SIZE[size]} />
    </span>
  );
};
