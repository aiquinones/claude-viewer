import * as vscode from 'vscode';
import { scopeRank } from '../model/shadowing';
import { SkillEntry } from '../model/types';

interface SkillPickItem extends vscode.QuickPickItem {
  skill: SkillEntry;
}

interface PickSkillArgs {
  skills: SkillEntry[];
  // Prefills the search box — used when a deep link named a skill that doesn't resolve.
  initialQuery?: string;
}

// createQuickPick rather than showQuickPick, because only the former lets us set the initial
// value. Resolves undefined when dismissed.
export const pickSkill = ({ skills, initialQuery }: PickSkillArgs): Promise<SkillEntry | undefined> => {
  const picker: vscode.QuickPick<SkillPickItem> = vscode.window.createQuickPick<SkillPickItem>();
  picker.items = [...skills].sort(_bySalience).map(_toItem);
  picker.placeholder = 'Search skills by name or description';
  // The description is the string Claude matches against, so searching it finds a skill you know
  // by what it does rather than by what it's called.
  picker.matchOnDetail = true;
  picker.matchOnDescription = true;
  if (initialQuery) picker.value = initialQuery;

  return new Promise((resolve) => {
    let chosen: SkillEntry | undefined;
    picker.onDidAccept(() => {
      chosen = picker.selectedItems[0]?.skill;
      picker.hide();
    });
    picker.onDidHide(() => {
      picker.dispose();
      resolve(chosen);
    });
    picker.show();
  });
};

const _toItem = (skill: SkillEntry): SkillPickItem => ({
  skill,
  label: skill.shadowedBy ? `$(eye-closed) ${skill.name}` : skill.name,
  description: _describeScope(skill),
  detail: skill.description || _worstIssue(skill) || 'no description'
});

const _describeScope = (skill: SkillEntry): string => {
  const scope: string = skill.pluginName ? `plugin · ${skill.pluginName}` : skill.scope;
  return skill.shadowedBy ? `${scope} · shadowed` : scope;
};

const _worstIssue = (skill: SkillEntry): string | undefined =>
  (skill.issues.find((issue) => issue.severity === 'error') ?? skill.issues[0])?.message;

// Skills that actually run come first, then by scope precedence, then alphabetically — the same
// order the panel's list shows, so the two views don't disagree.
const _bySalience = (left: SkillEntry, right: SkillEntry): number => {
  const shadowing: number = Number(Boolean(left.shadowedBy)) - Number(Boolean(right.shadowedBy));
  if (shadowing !== 0) return shadowing;

  const scope: number = scopeRank(left.scope) - scopeRank(right.scope);
  if (scope !== 0) return scope;

  return left.name.localeCompare(right.name);
};
