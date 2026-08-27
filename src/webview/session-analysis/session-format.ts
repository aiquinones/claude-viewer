import { AgentTool } from '../../model/types';
import { formatAiu, formatUsd } from '../usage-format';

interface FormatCostArgs {
  value: number;
  tool: AgentTool;
}

// One session ran under one CLI, so cost is one unit here rather than the two the usage surface has
// to print side by side. Which one is the CLI's, not the reader's.
export const formatCost = ({ value, tool }: FormatCostArgs): string =>
  tool === 'claude' ? formatUsd(value) : formatAiu(value);
