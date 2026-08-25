import * as vscode from 'vscode';
import { openPanel } from '../../host/panel';
import { currentSessions } from '../../host/usage-history-store';
import { SessionUsage } from '../../model/usage/types';
import { pickSession } from './quick-pick';

// Registered in package.json under contributes.commands — the two have to agree.
export const ANALYZE_SESSION_COMMAND: string = 'claudeViewer.analyzeSession';

interface AnalyzeSessionArgs {
  context: vscode.ExtensionContext;
  // Prefills the picker — used when a deep link named a session that doesn't resolve.
  initialQuery?: string;
}

// The palette command, and the fallback a vscode:// link drops into. Reads the shared store, so it
// works with no panel open and sees exactly what the Sessions tab sees.
//
// The first run pays for a scan over every session log on the machine, since nothing has started
// that store unless the usage surface has been open — hence the progress, which resolves before it
// draws anything once the store is warm.
export const analyzeSession = async ({
  context,
  initialQuery
}: AnalyzeSessionArgs): Promise<void> => {
  const sessions: SessionUsage[] = await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Window, title: 'Claude Viewer: reading session logs…' },
    () => currentSessions()
  );

  if (sessions.length === 0) {
    void vscode.window.showInformationMessage(
      'Claude Viewer: no sessions on record. A session is counted once it has finished a turn.'
    );
    return;
  }

  const session: SessionUsage | undefined = await pickSession({ sessions, initialQuery });
  if (session) openSessionAnalysis({ context, session });
};

interface OpenSessionAnalysisArgs {
  context: vscode.ExtensionContext;
  session: SessionUsage;
}

// One session's page, from a session the host itself resolved. Exported for the URI handler, which
// resolves an id against the same list rather than passing one through.
export const openSessionAnalysis = ({ context, session }: OpenSessionAnalysisArgs): void =>
  openPanel({
    context,
    target: { to: 'session', sessionId: session.sessionId, tool: session.tool }
  });
