import { ConfigIssue, ConfigSnapshot, Reveal, Scope, SkillEntry } from '../model/types';

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

interface SnapshotArgs {
  skills: SkillEntry[];
  workspaceRoot?: string;
}

export const snapshot = ({ skills, workspaceRoot }: SnapshotArgs): ConfigSnapshot => ({
  workspaceRoot: workspaceRoot ?? WORKSPACE,
  skills,
  loadedAt: Date.UTC(2026, 7, 1)
});

// What the host posts when the palette or a deep link names a skill.
export const reveal = (skill: SkillEntry): Reveal => ({ path: skill.path, nonce: 1 });

// A SKILL.md body, shaped like a real one and long enough that the headings actually stack while
// you scroll. Covers every token the renderer handles.
export const skillMarkdown: string = `# Deploy

Ship the current branch. Everything below is what Claude reads once the skill is chosen.

## Before you start

Check the branch is clean and the tests pass. Deploying a dirty tree is how a half-finished
migration reaches production.

### Requirements

- A clean working tree
- A green run on \`main\`
- Push access to the remote
  - the token in \`.env.local\`, not the one in your shell

### Checks that can be skipped

1. The changelog entry
2. The screenshot refresh

> A skipped check is a decision, not an oversight. Say which one you skipped.

## Running it

\`\`\`bash
pnpm run build
pnpm run deploy --env production
\`\`\`

The command is **not** idempotent — a second run cuts a second version. See
[the runbook](https://example.com/runbook) or the local [notes](./notes.md).

## Rollback

| Step | Command | Safe to repeat |
|------|---------|:---------------:|
| Freeze | \`pnpm run freeze\` | yes |
| Revert | \`pnpm run rollback <version>\` | no |
| Thaw | \`pnpm run thaw\` | yes |

### After a rollback

- [x] Post in the deploy channel
- [ ] File the follow-up

---

## A heading long enough that it has to truncate rather than wrap onto a second line

Two lines of heading would be two rows tall, and every offset below it would be wrong.
`;

// No headings at all — everything lands in the section that has no sticky bar.
export const headinglessMarkdown: string = `Just a paragraph and a list, with no headings anywhere.

- one
- two
`;

// Jumps a level. The stack has to nest by position, not by the number of hashes.
export const skippedLevelMarkdown: string = `# Top

### Straight to three

Body text under a heading whose parent was never written.
`;
