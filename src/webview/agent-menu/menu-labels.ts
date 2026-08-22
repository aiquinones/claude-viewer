import { AGENT_TOOL_LABEL, AgentTool } from '../../model/types';

// Everything the row menu says, in one place — the kill command names itself twice, once as an item
// and once as the question it opens, and the two have to agree about what pressing it does.

export const MENU_ITEMS = {
  log: {
    label: 'Open the session log',
    hint: 'The transcript this agent is writing.'
  },
  copy: {
    label: 'Copy session id',
    hint: 'For resuming it, or grepping for it.'
  },
  kill: {
    label: 'Kill the process',
    hint: 'Stops the agent where it is.'
  }
} as const;

export const KILL_CONFIRM_TITLE: string = 'Kill this agent?';

export const KILL_LABEL: string = 'Kill';
export const CANCEL_LABEL: string = 'Cancel';

interface KillWarningArgs {
  tool: AgentTool;
  pid: number;
}

// What actually happens, rather than a warning that only says the action is serious. The CLI is
// named because the two behave differently on the way out, and the pid because it's the thing being
// signalled and the thing you'd check afterwards.
export const killWarning = ({ tool, pid }: KillWarningArgs): string =>
  `SIGTERM goes to process ${pid}. ${AGENT_TOOL_LABEL[tool]} exits, and whatever it was part-way through is lost. The transcript it has already written stays on disk.`;
