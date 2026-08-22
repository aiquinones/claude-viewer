import { AgentSession } from '../model/types';

// What every row on the Active Agents surface is handed. `AgentList` picks between the two row
// components by mode and gives both the same thing, so the shape lives here rather than being
// written out twice and drifting — the ternary that picks one is only type-safe while they agree.
export interface AgentRowProps {
  agent: AgentSession;
  // Passed in rather than read in the row, so every row on the surface ages against the same
  // instant.
  now: number;
  workspaceRoot: string | undefined;
  onOpen: (agent: AgentSession) => void;
  onOpenLog: (agent: AgentSession) => void;
  // The commands behind a right-click. Both go through the host: it holds the clipboard, and it
  // owns the pid the webview deliberately never names.
  onCopySessionId: (agent: AgentSession) => void;
  onKill: (agent: AgentSession) => void;
}
