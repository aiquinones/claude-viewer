import * as path from 'path';
import * as vscode from 'vscode';
import { AGENT_TOOL_LABEL } from '../../model/types';
import { SessionUsage } from '../../model/usage/types';

interface SessionPickItem extends vscode.QuickPickItem {
  session: SessionUsage;
}

interface PickSessionArgs {
  // Most recently active first, the order the history is already in.
  sessions: SessionUsage[];
  // Prefills the search box — used when a deep link named a session that doesn't resolve.
  initialQuery?: string;
}

// createQuickPick rather than showQuickPick, for the reason `find-skill` uses it: only the former
// lets us set the initial value. Resolves undefined when dismissed.
export const pickSession = ({
  sessions,
  initialQuery
}: PickSessionArgs): Promise<SessionUsage | undefined> => {
  const picker: vscode.QuickPick<SessionPickItem> = vscode.window.createQuickPick<SessionPickItem>();
  picker.items = sessions.map(_toItem);
  picker.placeholder = 'Search sessions by name, folder, branch, or id';
  // The id is in the detail and the folder is in the description, so a session you know by either
  // is findable — which is the whole point of the command a link falls back into.
  picker.matchOnDetail = true;
  picker.matchOnDescription = true;
  if (initialQuery) picker.value = initialQuery;

  return new Promise((resolve) => {
    let chosen: SessionUsage | undefined;
    picker.onDidAccept(() => {
      chosen = picker.selectedItems[0]?.session;
      picker.hide();
    });
    picker.onDidHide(() => {
      picker.dispose();
      resolve(chosen);
    });
    picker.show();
  });
};

const _toItem = (session: SessionUsage): SessionPickItem => ({
  session,
  label: session.title || path.basename(session.cwd),
  description: _describe(session),
  detail: `${new Date(session.lastAt).toLocaleString()} · ${session.turns} turns · ${session.sessionId}`
});

// The CLI, the folder it ran in, and the branch it left off on — the three things that tell two
// sessions with the same title apart.
const _describe = (session: SessionUsage): string => {
  const branch: string = session.branch ? ` · ${session.branch}` : '';
  return `${AGENT_TOOL_LABEL[session.tool]} · ${session.cwd}${branch}`;
};
