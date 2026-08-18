import { createContext, ReactNode, useContext, useState } from 'react';
import { AgentColor, AgentColors } from '../../model/types';

export interface SetAgentColorArgs {
  sessionId: string;
  // Absent clears the row.
  color?: AgentColor;
}

export interface AgentColorBridge {
  colors: AgentColors;
  setColor: (args: SetAgentColorArgs) => void;
}

const AgentColorContext = createContext<AgentColorBridge | undefined>(undefined);

interface AgentColorProviderProps extends AgentColorBridge {
  children: ReactNode;
}

// The panel's provider: colours come from the host and go back to it, so a choice survives the
// panel closing.
export const AgentColorProvider = ({ colors, setColor, children }: AgentColorProviderProps) => (
  <AgentColorContext.Provider value={{ colors, setColor }}>{children}</AgentColorContext.Provider>
);

// With no provider this keeps the colours in local state rather than dropping them. `SettingsContext`
// falls back to its defaults for the same reason — it's what keeps the stories decorator-free — and
// a working fallback goes one better here: every colour story is fully interactive with no host.
export const useAgentColors = (): AgentColorBridge => {
  const provided = useContext(AgentColorContext);
  const [local, setLocal] = useState<AgentColors>({});

  return (
    provided ?? {
      colors: local,
      setColor: ({ sessionId, color }: SetAgentColorArgs) =>
        setLocal((current) => {
          const next: AgentColors = { ...current };
          if (color) next[sessionId] = color;
          else delete next[sessionId];
          return next;
        })
    }
  );
};
