import * as vscode from 'vscode';
import { currentSnapshot } from '../../host/config-store';
import { openPanel } from '../../host/panel';
import { ConfigSnapshot, SkillEntry } from '../../model/types';
import { pickSkill } from './quick-pick';

// Registered in package.json under contributes.commands — the two have to agree.
export const FIND_SKILL_COMMAND: string = 'claudeViewer.findSkill';

interface FindSkillArgs {
  context: vscode.ExtensionContext;
  // Prefills the picker — used when a deep link named a skill that doesn't resolve.
  initialQuery?: string;
}

// The palette command, and the fallback the URI handler drops into. Reads the shared store, so it
// works with no panel open and sees exactly what the tree sees.
export const findSkill = async ({ context, initialQuery }: FindSkillArgs): Promise<void> => {
  const snapshot: ConfigSnapshot = await currentSnapshot();

  if (snapshot.skills.length === 0) {
    void vscode.window.showInformationMessage(
      'Claude Viewer: no skills found in this workspace, ~/.claude/skills, or any installed plugin.'
    );
    return;
  }

  const skill: SkillEntry | undefined = await pickSkill({ skills: snapshot.skills, initialQuery });
  if (skill) openPanel({ context, revealPath: skill.path });
};
