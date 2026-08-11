import { estimateTokens } from '../model/estimate-tokens';
import { buildSearchIndex } from '../model/search/build-index';
import { searchIndex } from '../model/search/search';
import {
  ConfigIssue,
  ConfigSnapshot,
  Reveal,
  SearchDoc,
  SearchHit,
  SkillEntry,
  SystemPromptFile
} from '../model/types';

// Synthetic only. Never paste real config in here — working on this extension means reading your
// own ~/.claude, and that directory holds permissions, MCP env vars, and API keys.
const WORKSPACE: string = '/Users/dev/repos/example-app';
const HOME: string = '/Users/dev/.claude';

// `chars` is the SKILL.md's size and the listing is derived from the name and description, both
// the way the loader does it — a fixture carrying its own token counts would sooner or later
// disagree with the text it sits next to.
const makeSkill = (
  overrides: Partial<SkillEntry> & Pick<SkillEntry, 'name' | 'scope'>
): SkillEntry => {
  const chars: number = overrides.chars ?? 3240;
  const listing: string = `${overrides.name}: ${overrides.description ?? DEFAULT_DESCRIPTION}`;

  return {
    description: DEFAULT_DESCRIPTION,
    allowedTools: [],
    path: `${HOME}/skills/${overrides.name}/SKILL.md`,
    bundledFiles: 0,
    issues: [],
    ...overrides,
    chars,
    estimatedTokens: estimateTokens(chars),
    listingChars: listing.length,
    listingEstimatedTokens: estimateTokens(listing.length)
  };
};

const DEFAULT_DESCRIPTION: string = 'Does a thing. Use when the user asks for that thing.';

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
  bundledFiles: 3,
  chars: 9120
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

// Nothing was read, so it costs nothing — the zero case the cost lines have to survive.
export const noSkillFile: SkillEntry = makeSkill({
  name: 'half-finished',
  scope: 'user',
  description: '',
  chars: 0,
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
  chars: 0,
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

// One CLAUDE.md. `chars` drives the size, the token estimate, and the share bar, so the stories
// derive it the same way the loader does rather than carrying two numbers that can disagree.
const makePromptFile = (
  overrides: Partial<SystemPromptFile> & Pick<SystemPromptFile, 'path' | 'scope' | 'chars'>
): SystemPromptFile => ({
  order: 0,
  estimatedTokens: estimateTokens(overrides.chars),
  depth: 0,
  issues: [],
  ...overrides
});

export const userPrompt: SystemPromptFile = makePromptFile({
  path: `${HOME}/CLAUDE.md`,
  scope: 'user',
  chars: 4180
});

export const projectPrompt: SystemPromptFile = makePromptFile({
  path: `${WORKSPACE}/CLAUDE.md`,
  scope: 'project',
  chars: 12480
});

// What `@AGENTS.md` on line 1 of the project CLAUDE.md pulls in.
export const importedAgents: SystemPromptFile = makePromptFile({
  path: `${WORKSPACE}/AGENTS.md`,
  scope: 'project',
  chars: 2040,
  importedBy: projectPrompt.path,
  depth: 1
});

// An import two hops down, to prove the indent keeps working past one level.
export const importedStyle: SystemPromptFile = makePromptFile({
  path: `${HOME}/house-style.md`,
  scope: 'project',
  chars: 860,
  importedBy: importedAgents.path,
  depth: 2
});

export const localPrompt: SystemPromptFile = makePromptFile({
  path: `${WORKSPACE}/CLAUDE.local.md`,
  scope: 'local',
  chars: 620
});

export const nestedPrompt: SystemPromptFile = makePromptFile({
  path: `${WORKSPACE}/packages/api/CLAUDE.md`,
  scope: 'nested',
  chars: 2380,
  conditionalOn: 'packages/api'
});

export const missingImport: SystemPromptFile = makePromptFile({
  path: `${WORKSPACE}/docs/CONVENTIONS.md`,
  scope: 'project',
  chars: 0,
  importedBy: projectPrompt.path,
  depth: 1,
  issues: [error('imported but not found — nothing is added to the prompt')]
});

export const circularImport: SystemPromptFile = makePromptFile({
  path: `${WORKSPACE}/AGENTS.md`,
  scope: 'project',
  chars: 0,
  importedBy: importedStyle.path,
  depth: 3,
  issues: [warning('circular import — already open further up this chain, so it stops here')]
});

// Numbered the way the loader numbers them: the flattened walk, in order.
const inLoadOrder = (files: SystemPromptFile[]): SystemPromptFile[] =>
  files.map((file, index) => ({ ...file, order: index + 1 }));

export const allPromptFiles: SystemPromptFile[] = inLoadOrder([
  userPrompt,
  projectPrompt,
  importedAgents,
  importedStyle,
  localPrompt,
  nestedPrompt
]);

export const brokenPromptFiles: SystemPromptFile[] = inLoadOrder([
  userPrompt,
  projectPrompt,
  importedAgents,
  importedStyle,
  circularImport,
  missingImport
]);

// No project scope at all — what the panel shows with no folder open.
export const userOnlyPromptFiles: SystemPromptFile[] = inLoadOrder([userPrompt]);

interface SnapshotArgs {
  skills: SkillEntry[];
  systemPrompt?: SystemPromptFile[];
  workspaceRoot?: string;
}

export const snapshot = ({ skills, systemPrompt, workspaceRoot }: SnapshotArgs): ConfigSnapshot => ({
  workspaceRoot: workspaceRoot ?? WORKSPACE,
  skills,
  systemPrompt: systemPrompt ?? allPromptFiles,
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

// The spotlight's input: the real index, over the same synthetic skills.
export const searchDocs: SearchDoc[] = buildSearchIndex(snapshot({ skills: allSkills }));

export const hitsFor = (query: string): SearchHit[] => searchIndex({ index: searchDocs, query });

// A CLAUDE.md body — synthetic, like everything here. Unlike skillMarkdown it has no frontmatter,
// which is the whole difference between the two bodies the panel renders.
export const promptMarkdown: string = `# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A synthetic example app, used to exercise the panel. Nothing here describes a real project.

## Conventions

- TypeScript strict mode, always
- Named exports only — no default exports
- Files under ~200 lines; split when one grows past it

## Imports

@./docs/style.md pulls the house style in. A line like that inside a fenced block is an
example rather than an import:

\`\`\`
@not-an-import.md
\`\`\`

## Gotchas

Nested CLAUDE.md files load only when Claude is working under their directory, so what the
model actually sees depends on where it was started.
`;
