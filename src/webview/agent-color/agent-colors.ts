// What each colour actually paints with. The editor's chart palette, so a row follows the theme
// like everything else here, and every value is opaque — a tinted row and a coloured robot both
// stack strokes, and a colour carrying alpha doubles up wherever they meet.

import { AgentColor } from '../../model/types';

export const AGENT_COLOR_VAR: Record<AgentColor, string> = {
  blue: 'var(--vscode-charts-blue, #3794ff)',
  green: 'var(--vscode-charts-green, #89d185)',
  purple: 'var(--vscode-charts-purple, #b180d7)',
  orange: 'var(--vscode-charts-orange, #d18616)',
  red: 'var(--vscode-charts-red, #f14c4c)',
  yellow: 'var(--vscode-charts-yellow, #cca700)'
};

export const AGENT_COLOR_LABEL: Record<AgentColor, string> = {
  blue: 'Blue',
  green: 'Green',
  purple: 'Purple',
  orange: 'Orange',
  red: 'Red',
  yellow: 'Yellow'
};
