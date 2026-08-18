import { CSSProperties } from 'react';
import { AgentColor } from '../../model/types';
import { AGENT_COLOR_VAR } from './agent-colors';
import { useAgentColors } from './AgentColorContext';

export interface RowColor {
  color: AgentColor | undefined;
  // `--row-color` is what the tint and the robot both read, so setting it once on the row is the
  // whole of applying a colour.
  style: CSSProperties;
  tintClass: string;
  pick: (color: AgentColor | undefined) => void;
}

// One row's colour, however it's drawn. Both row components read it the same way, which is what
// keeps a colour meaning the same thing in either mode.
export const useRowColor = (sessionId: string): RowColor => {
  const { colors, setColor } = useAgentColors();
  const color: AgentColor | undefined = colors[sessionId];

  return {
    color,
    style: color ? ({ '--row-color': AGENT_COLOR_VAR[color] } as CSSProperties) : {},
    // Not a `color-mix` down to transparent: an unlayered background declaration would beat the
    // `hover:bg-accent` an uncoloured row still wants.
    tintClass: color ? 'agent-row--tinted' : '',
    pick: (next: AgentColor | undefined) => setColor({ sessionId, color: next })
  };
};
