import { AgentSession, Deliverable } from '../model/types';

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
  // Leaves the surface for the usage one, which is the only command here that does. It carries the
  // whole session because the resolution needs the tool as well as the id.
  onAnalyze: (agent: AgentSession) => void;
  onOpenLog: (agent: AgentSession) => void;
  // Opens something the session said it produced. Only a `file` deliverable reaches this — one with
  // a url is an `<a href>` and never asks anyone.
  onOpenDeliverable: (deliverable: Deliverable) => void;
  // The commands behind a right-click. Both go through the host: it holds the clipboard, and it
  // owns the pid the webview deliberately never names.
  onCopySessionId: (agent: AgentSession) => void;
  onKill: (agent: AgentSession) => void;
}
