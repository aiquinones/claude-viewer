import { ConfigIssue, ConfigSnapshot, Scope, SkillEntry } from '../model/types';

// Synthetic only. Never paste real config in here — working on this extension means reading your
// own ~/.claude, and that directory holds permissions, MCP env vars, and API keys.
const WORKSPACE: string = '/Users/dev/repos/example-app';
const HOME: string = '/Users/dev/.claude';

const makeSkill = (overrides: Partial<SkillEntry> & Pick<SkillEntry, 'name' | 'scope'>): SkillEntry => ({
  description: 'Does a thing. Use when the user asks for that thing.',
  allowedTools: [],
  path: `${HOME}/skills/${overrides.name}/SKILL.md`,
  bundledFiles: 0,
  issues: [],
  ...overrides
});

export const warning = (message: string): ConfigIssue => ({ severity: 'warning', message });

export const error = (message: string): ConfigIssue => ({ severity: 'error', message });

// The winner of a collision: two same-named skills at lower scopes point at it.
export const projectDeploy: SkillEntry = makeSkill({
  name: 'deploy',
  scope: 'project',
  path: `${WORKSPACE}/.claude/skills/deploy/SKILL.md`,
  description:
    'Ship the current branch. Use when the user asks to deploy, release, push to production, or cut a version.',
  allowedTools: ['Read', 'Bash(git *)', 'Bash(pnpm run deploy, pnpm run rollback)'],
  bundledFiles: 3
});

export const userDeploy: SkillEntry = makeSkill({
  name: 'deploy',
  scope: 'user',
  description: 'Deploy the app. Use when the user wants to deploy.',
  allowedTools: ['Read', 'Bash'],
  shadowedBy: projectDeploy.path
});

export const pluginDeploy: SkillEntry = makeSkill({
  name: 'deploy',
  scope: 'plugin',
  pluginName: 'shipit',
  path: `${HOME}/plugins/marketplaces/community/plugins/shipit/skills/deploy/SKILL.md`,
  shadowedBy: projectDeploy.path
});

export const plainSkill: SkillEntry = makeSkill({
  name: 'commit',
  scope: 'user',
  description:
    'Stage changes and create a well-formatted git commit. Use when the user asks to commit, save changes, stage and commit, or create a commit.',
  allowedTools: ['Read', 'Grep', 'Glob', 'Bash']
});

export const noDescription: SkillEntry = makeSkill({
  name: 'write-tests',
  scope: 'user',
  description: '',
  issues: [warning('no description — Claude has nothing to match against')]
});

export const noSkillFile: SkillEntry = makeSkill({
  name: 'half-finished',
  scope: 'user',
  description: '',
  issues: [error('no SKILL.md in this directory')]
});

export const nameMismatch: SkillEntry = makeSkill({
  name: 'writing-hookify-rules',
  scope: 'plugin',
  pluginName: 'hookify',
  path: `${HOME}/plugins/marketplaces/official/plugins/hookify/skills/writing-rules/SKILL.md`,
  issues: [warning('frontmatter name "writing-hookify-rules" differs from directory "writing-rules"')]
});

// Long enough to prove the detail pane never truncates a description.
export const longDescription: SkillEntry = makeSkill({
  name: 'math-olympiad',
  scope: 'plugin',
  pluginName: 'math-olympiad',
  path: `${HOME}/plugins/marketplaces/official/plugins/math-olympiad/skills/math-olympiad/SKILL.md`,
  description:
    "Solve competition math problems (IMO, Putnam, USAMO, AIME) with adversarial verification that catches the errors self-verification misses. Activates when asked to 'solve this IMO problem', 'prove this olympiad inequality', 'verify this competition proof', 'find a counterexample', or for any problem with 'IMO', 'Putnam', 'USAMO', 'olympiad', or 'competition math' in it. Uses pure reasoning, then a fresh-context adversarial verifier attacks the proof using specific failure patterns.",
  bundledFiles: 9
});

export const bothIssues: SkillEntry = makeSkill({
  name: 'tangled',
  scope: 'user',
  description: '',
  issues: [
    error('could not read SKILL.md: EACCES permission denied'),
    warning('no description — Claude has nothing to match against')
  ]
});

export const allSkills: SkillEntry[] = [
  projectDeploy,
  plainSkill,
  userDeploy,
  noDescription,
  noSkillFile,
  bothIssues,
  pluginDeploy,
  nameMismatch,
  longDescription
];

export const snapshot = (skills: SkillEntry[], workspaceRoot?: string): ConfigSnapshot => ({
  workspaceRoot: workspaceRoot ?? WORKSPACE,
  skills,
  loadedAt: Date.UTC(2026, 7, 1)
});

export const scopes: Scope[] = ['project', 'user', 'plugin'];
