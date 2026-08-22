import * as vscode from 'vscode';
import { AgentSession } from '../model/types';
import { cachedAgents, refreshAgents } from './agents-store';

// What a row's context menu can do beyond opening a file. Both take a session id and look the
// session up here — the webview never names a pid or a string to copy, so a stale row can't reach
// a process the host doesn't currently list.

// How long the status bar holds the confirmation. Long enough to read, short enough that it's gone
// before you paste.
const COPIED_MS: number = 2000;

export const copySessionId = async (sessionId: string): Promise<void> => {
  const agent: AgentSession | undefined = _find(sessionId);
  if (!agent) return;

  await vscode.env.clipboard.writeText(agent.sessionId);
  // The status bar rather than a notification: this is feedback for something you asked for and
  // already know the result of, and a modal-ish toast for a copy is noise.
  vscode.window.setStatusBarMessage(`Copied session id ${agent.sessionId}`, COPIED_MS);
};

// SIGTERM, not SIGKILL: the CLI cleans up its session file and its lock on the way out, and a
// killed-but-not-cleaned process leaves a row that only disappears once something notices the pid
// is gone. The webview has already asked whether you meant it.
export const killAgent = async (sessionId: string): Promise<void> => {
  const agent: AgentSession | undefined = _find(sessionId);
  if (!agent) return;

  try {
    process.kill(agent.pid, 'SIGTERM');
  } catch (error) {
    // ESRCH is a process that already exited — the row is stale, and the refresh below is the whole
    // fix. EPERM is someone else's process, which is worth saying out loud.
    const code: string | undefined = (error as NodeJS.ErrnoException).code;
    if (code !== 'ESRCH') {
      void vscode.window.showWarningMessage(
        `Couldn't stop ${agent.tool} session ${agent.pid}: ${code ?? 'unknown error'}`
      );
    }
  }

  // Either way the list is now wrong about something. The poll would catch up on its own, but the
  // row you just acted on is the one thing that should not take two seconds to answer.
  await refreshAgents();
};

const _find = (sessionId: string): AgentSession | undefined =>
  cachedAgents().find((agent) => agent.sessionId === sessionId);
