// What each colour actually paints with. The editor's chart palette, so a row follows the theme
// like everything else here, and every value is opaque — a tinted row and a coloured robot both
// stack strokes, and a colour carrying alpha doubles up wherever they meet.

import { AgentColor } from '../../model/types';

export const AGENT_COLOR_VAR: Record<AgentColor, string> = {
  blue: 'var(--chart-blue)',
  green: 'var(--chart-green)',
  purple: 'var(--chart-purple)',
  orange: 'var(--chart-orange)',
  red: 'var(--chart-red)',
  yellow: 'var(--chart-yellow)'
};

export const AGENT_COLOR_LABEL: Record<AgentColor, string> = {
  blue: 'Blue',
  green: 'Green',
  purple: 'Purple',
  orange: 'Orange',
  red: 'Red',
  yellow: 'Yellow'
};
