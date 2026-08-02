import * as vscode from 'vscode';
import { openPanel } from '../host/panel';
import { workspaceRoot } from '../host/workspace';
import { buildSnapshot } from '../model/snapshot';
import { ConfigSnapshot, SkillEntry } from '../model/types';
import { pickSkill } from './quick-pick';

interface OpenSkillArgs {
  context: vscode.ExtensionContext;
  // Prefills the picker — used when a deep link named a skill that doesn't resolve.
  initialQuery?: string;
}

// The palette command, and the fallback the URI handler drops into. Builds its own snapshot so it
// works with no panel open; the panel rebuilds when it opens, which costs a second read and buys
// no cache to invalidate.
export const openSkill = async ({ context, initialQuery }: OpenSkillArgs): Promise<void> => {
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
