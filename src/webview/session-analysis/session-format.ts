import { AgentTool } from '../../model/types';
import { costUnitOf } from '../../model/usage/cost-unit';
import { formatAiu, formatUsd } from '../usage-format';

interface FormatCostArgs {
  value: number;
  tool: AgentTool;
}

// One session ran under one CLI, so cost is one unit here rather than the two the usage surface has
// to print side by side. Which one is the CLI's, not the reader's — and a CLI can have none, in
// which case nothing reaches this: the series is empty and the section draws its empty line instead.
export const formatCost = ({ value, tool }: FormatCostArgs): string =>
  costUnitOf(tool) === 'aiu' ? formatAiu(value) : formatUsd(value);
