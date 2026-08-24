import { AgentTool } from '../../model/types';
import { UsageMetric } from '../../model/usage/types';
import { formatAiu, formatUsageTokens, formatUsd } from '../usage-format';

interface FormatValueArgs {
  value: number;
  metric: UsageMetric;
  tool: AgentTool;
}

// One session ran under one CLI, so cost is one unit here rather than the two the usage surface has
// to print side by side. Which one is the CLI's, not the reader's.
export const formatValue = ({ value, metric, tool }: FormatValueArgs): string => {
  if (metric === 'output-tokens') return formatUsageTokens(value);
  return tool === 'claude' ? formatUsd(value) : formatAiu(value);
};
