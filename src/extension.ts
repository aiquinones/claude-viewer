import * as vscode from 'vscode';
import { DeepLink, parseDeepLink } from './deep-link';
import { findByName } from './model/shadowing';
import { buildSnapshot } from './model/snapshot';
import { ConfigSnapshot, SkillEntry } from './model/types';
import { openPanel, stopWatching } from './panel';
import { pickSkill } from './quick-pick';
import { workspaceRoot } from './workspace';

export const activate = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand('claudeViewer.open', () => openPanel({ context })),
    vscode.commands.registerCommand('claudeViewer.openSkill', () => _openSkill({ context })),
    vscode.window.registerUriHandler({ handleUri: (uri) => void _handleUri({ context, uri }) })
  );
};

export const deactivate = (): void => stopWatching();

interface OpenSkillArgs {
  context: vscode.ExtensionContext;
  initialQuery?: string;
}

// The palette path. Builds its own snapshot, so it works with no panel open — and rebuilds when
// the panel opens, which keeps both views current at the cost of a second read.
const _openSkill = async ({ context, initialQuery }: OpenSkillArgs): Promise<void> => {
  const snapshot: ConfigSnapshot = await buildSnapshot(workspaceRoot());

  if (snapshot.skills.length === 0) {
    void vscode.window.showInformationMessage(
      'Claude Viewer: no skills found in this workspace, ~/.claude/skills, or any installed plugin.'
    );
    return;
  }

  const skill: SkillEntry | undefined = await pickSkill({ skills: snapshot.skills, initialQuery });
  if (skill) openPanel({ context, revealPath: skill.path });
};

interface HandleUriArgs {
  context: vscode.ExtensionContext;
  uri: vscode.Uri;
}

// vscode://canoq.claude-viewer/skill/<name>. The name is resolved against the snapshot and the
// host's own path is used — a link never carries a path, so it can't reach a file we didn't find.
const _handleUri = async ({ context, uri }: HandleUriArgs): Promise<void> => {
  const link: DeepLink = parseDeepLink({ path: uri.path, query: uri.query });

  if (link.kind === 'panel') return openPanel({ context });
  if (link.kind === 'pick') return _openSkill({ context, initialQuery: link.query });

  const snapshot: ConfigSnapshot = await buildSnapshot(workspaceRoot());
  const match: SkillEntry | undefined = findByName({
    skills: snapshot.skills,
    name: link.name,
    scope: link.scope
  });

  // A link arrives from somewhere the reader can't see, so a miss says so and drops them into the
  // picker with the name typed in rather than doing nothing.
  if (!match) {
    const where: string = link.scope ? ` at ${link.scope} scope` : '';
    void vscode.window.showWarningMessage(
      `Claude Viewer: no skill named "${link.name}"${where}.`
    );
    return _openSkill({ context, initialQuery: link.name });
  }

  openPanel({ context, revealPath: match.path });
};
