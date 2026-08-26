import * as vscode from 'vscode';
import { AgentSession } from '../../model/types';
import { processChain, readProcessTree } from './process-tree';

// The Claude Code extension's own command. Given a session id it reveals that session's panel —
// `createPanel` looks the id up in its `sessionPanels` map before it considers making anything.
// Its sibling `claude-vscode.editor.open` would reveal too, but it writes the extension's
// preferred-location state on the way past, which isn't ours to move.
const CLAUDE_REVEAL_COMMAND: string = 'claude-vscode.primaryEditor.open';

// Bring the agent itself to the front: the Claude Code tab it lives in, or the terminal it was
// started from. False when it's out of this window's reach — a session in another window, a
// terminal in iTerm, Windows, or one whose CLI names no pid to walk up from — and the caller opens
// the log instead.
export const focusAgent = async (agent: AgentSession): Promise<boolean> => {
  if (!agent.pid) return false;

  const chain: number[] = processChain({ tree: await readProcessTree(), pid: agent.pid });

  if (await _revealClaudePanel({ agent, chain })) return true;
  return _showTerminal(chain);
};

interface RevealArgs {
  agent: AgentSession;
  chain: number[];
}

// A `claude-vscode` session is spawned by the extension host it belongs to, so ours being in the
// chain is what says the panel is in *this* window. Without that check the command takes its other
// branch and opens a second tab resuming a session that is live somewhere else.
//
// The chain is the whole test, not `entrypoint`: a Claude session started in a terminal descends
// from the shell and the pty host, never from the extension host, so the two cases can't be
// confused.
const _revealClaudePanel = async ({ agent, chain }: RevealArgs): Promise<boolean> => {
  if (agent.tool !== 'claude') return false;
  if (!chain.includes(process.pid)) return false;

  // The command id belongs to another extension. It can be absent — not installed, renamed on
  // their release schedule — and either way this degrades to the log.
  const commands: string[] = await vscode.commands.getCommands(true);
  if (!commands.includes(CLAUDE_REVEAL_COMMAND)) return false;

  try {
    await vscode.commands.executeCommand(CLAUDE_REVEAL_COMMAND, agent.sessionId);
    return true;
  } catch {
    return false;
  }
};

// `Terminal.processId` is the shell's pid, and an agent started in one is a descendant of it —
// often a couple of levels down, since a shell running a shell is ordinary. `window.terminals` is
// this window's terminals only, which is exactly the question being asked.
const _showTerminal = async (chain: number[]): Promise<boolean> => {
  for (const terminal of vscode.window.terminals) {
    const shell: number | undefined = await terminal.processId;
    if (shell !== undefined && chain.includes(shell)) {
      terminal.show();
      return true;
    }
  }

  return false;
};
