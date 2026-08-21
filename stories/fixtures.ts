import { buildSearchIndex } from '@src/model/search/build-index';
import { searchIndex } from '@src/model/search/search';
import { listed } from '@src/model/shadowing';
import { buildSkillGraph } from '@src/model/skill-graph/build-graph';
import { SkillFlow, toSkillFlow } from '@src/webview/flow/steps';
import {
  BudgetValue,
  DEFAULT_SETTINGS,
  SkillBudgetOverride,
  ViewerSettings
} from '@src/model/settings/settings';
import { memorySet } from './memory-fixtures';
import {
  ConfigIssue,
  ConfigSnapshot,
  MemorySet,
  Reveal,
  SearchDoc,
  SearchHit,
  SkillEntry,
  SkillGraph,
  SystemPromptFile
} from '@src/model/types';

// Synthetic only. Never paste real config in here — working on this extension means reading your
// own ~/.claude, and that directory holds permissions, MCP env vars, and API keys.
// Exported because a story rendering a single row or body has to pass the root the paths below are
// relative to — without it every path renders as an absolute one.
export const WORKSPACE: string = '/Users/dev/repos/example-app';
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
    listingChars: listing.length
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

// One CLAUDE.md. `chars` is the whole measurement — the size, the estimate and the share bar all
// come off it, the same way the loader reports it.
const makePromptFile = (
  overrides: Partial<SystemPromptFile> & Pick<SystemPromptFile, 'path' | 'scope' | 'chars'>
): SystemPromptFile => ({
  order: 0,
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

// A path with no chance of fitting, so the body title has to decide what to drop. Everything in
// this surface is named CLAUDE.md, which is what makes the directory the part worth keeping.
export const deepNestedPrompt: SystemPromptFile = makePromptFile({
  path: `${WORKSPACE}/packages/integrations/salesforce/connectors/webhooks/CLAUDE.md`,
  scope: 'nested',
  chars: 1120,
  conditionalOn: 'packages/integrations/salesforce/connectors/webhooks'
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

// Synthetic SKILL.md bodies that name each other. The graph fixture is built from these by the
// real scanner, so a story can't show edges the rule wouldn't actually draw.
const GRAPH_BODIES: Record<string, string> = {
  deploy: 'Check `write-tests` passed, then /commit the version bump. A bad deploy means /commit.',
  commit: 'Stage and write the message. Ship it with /deploy once the branch is green.',
  'write-tests': 'Cover the new branches, then /commit. Never /deploy on a red run.',
  'writing-hookify-rules': 'A rule that fires on every /commit.'
};

export const skillGraph: SkillGraph = buildSkillGraph({
  texts: listed(allSkills).map((skill) => ({ skill, body: GRAPH_BODIES[skill.name] ?? '' })),
  loadedAt: Date.UTC(2026, 7, 1)
});

// Nobody names anybody — what an install of unrelated skills draws.
export const emptyGraph: SkillGraph = buildSkillGraph({
  texts: [],
  loadedAt: Date.UTC(2026, 7, 1)
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
  // `null` is no folder open, which is the one state where there is no memory directory at all.
  // Undefined just means the story didn't care and gets the usual set.
  memory?: MemorySet | null;
  workspaceRoot?: string;
}

// Live agents aren't in here, the same way they aren't in the real snapshot — a story that wants
// them passes them as their own prop, from agent-fixtures.ts.
export const snapshot = ({
  skills,
  systemPrompt,
  memory,
  workspaceRoot
}: SnapshotArgs): ConfigSnapshot => ({
  workspaceRoot: workspaceRoot ?? WORKSPACE,
  skills,
  systemPrompt: systemPrompt ?? allPromptFiles,
  memory: memory === null ? undefined : (memory ?? memorySet),
  loadedAt: Date.UTC(2026, 7, 1)
});

// What the host posts when the palette or a deep link names a skill.
export const reveal = (skill: SkillEntry): Reveal => ({ path: skill.path, nonce: 1 });

interface BudgetSettingsArgs {
  description?: BudgetValue;
  content?: BudgetValue;
  overrides?: Record<string, SkillBudgetOverride>;
}

// Budgets as the host resolves them: a number plus the layer that set it. Anything left out falls
// back to the shipped default, which is also what a panel with nothing configured shows.
export const budgetSettings = ({
  description,
  content,
  overrides
}: BudgetSettingsArgs = {}): ViewerSettings => ({
  tokens: DEFAULT_SETTINGS.tokens,
  budgets: {
    skills: {
      description: description ?? DEFAULT_SETTINGS.budgets.skills.description,
      content: content ?? DEFAULT_SETTINGS.budgets.skills.content,
      overrides: overrides ?? {}
    }
  },
  usage: DEFAULT_SETTINGS.usage,
  context: DEFAULT_SETTINGS.context
});

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

// A SKILL.md written as a numbered sequence — the shape ten of the thirteen real skills have, and
// what the flow view is built to read. The skill names in it are the ones above, in all four
// marker forms, so the chips and the hover counts have something true to show.
export const stepMarkdown: string = `# Release Flow

Cut a release. Nine steps, and the loop back from the last one is the part worth seeing.

## 1. Read the state

Check what's already on the branch before touching anything.

### The working tree

A dirty tree is the one state that makes every later step lie. Run \`git status\` first.

### The remote

- Fetch, don't pull
- Compare against \`origin/main\`

## 2. Write the tests

Anything shipping without a test is a thing you'll debug in production instead. Use
[[write-tests]] on whatever changed.

## 3. Commit

Stage in pieces and let /commit write the message — one commit per idea, not one per file.

### What not to stage

\`\`\`bash
git add -p          # never git add -A
git status --short  # read it before you commit
\`\`\`

### The message

| Part | Rule |
|------|------|
| Subject | imperative, under 60 chars |
| Body | why, not what |

## 4. Ship it

Run \`deploy\` once the tests are green. It is **not** idempotent — a second run cuts a second
version.

### If it fails

Freeze first, then roll back. Never roll forward through a failed deploy.

#### The freeze window

Ten minutes, and it holds every other deploy on the account. Say so in the channel before you
take it.

## 5. Report back

Post the version and the diff URL. If step 4 failed, go back to step 1 rather than patching
over it — the \`deploy\` log and the /commit that cut it are both linked from the release page.
`;

// Built by the real parser over the body above, the way skillGraph is built by the real scanner —
// steps written out by hand would sooner or later disagree with the markdown next to them.
const flowFor = (raw: string): SkillFlow =>
  toSkillFlow({ raw, skills: allSkills, selfPath: undefined }) ?? { steps: [], source: 'numbered' };

// Five numbered steps, sub-sections three deep, and skills named in all four marker forms.
export const stepFlow: SkillFlow = flowFor(stepMarkdown);

// Nothing numbered: the steps are the sections one level under the single `#` title.
export const sectionFlow: SkillFlow = flowFor(skillMarkdown);

// Twelve steps, which is taller than the panel — the case the box's height is read against. Real
// skills reach this: /dev-feature is nine and the sequence is what you scroll.
export const longStepMarkdown: string = `# Long Release Flow

The same release, written out the way a real skill writes it.

## 1. Read the state

\`git status\` first — a dirty tree makes every later step lie.

## 2. Fetch the remote

Fetch, don't pull. Compare against \`origin/main\` before deciding anything.

## 3. Pick the version

Patch unless the API moved. The changelog is what decides it, not the diff size.

## 4. Write the tests

Anything shipping without a test is a thing you'll debug in production. [[write-tests]] covers it.

### What to cover

The empty case and the error case — the two real config won't reliably show you.

## 5. Run the suite

Green locally before anything is pushed.

## 6. Commit

Stage in pieces and let /commit write the message — one commit per idea, not one per file.

### What not to stage

\`\`\`bash
git add -p          # never git add -A
\`\`\`

## 7. Open the PR

Body says why, not what. Link the issue it closes.

## 8. Review it

Read your own diff first. Half the comments you'd get are ones you'd have caught.

## 9. Ship it

Run \`deploy\` once the checks are green. It is **not** idempotent.

### If it fails

Freeze first, then roll back. Never roll forward through a failed deploy.

## 10. Watch the logs

Ten minutes of error rate. Leaving early is how a bad release stays out.

## 11. Report back

Post the version and the diff URL where the team reads it.

## 12. Close the loop

If step 9 failed, go back to step 1 rather than patching over it.
`;

export const longFlow: SkillFlow = flowFor(longStepMarkdown);

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

// A memory's body — what's left of the file once the host strips its frontmatter. The `[[link]]`
// is what the body pane turns into a chip, and the two bold lines are the shape the memory
// instructions ask for.
export const memoryMarkdown: string = `The integration tests run against a real database, and the
schema they expect is whatever the migration folder describes — not whatever the last branch left
behind.

**Why:** a stale local database fails the suite in ways that look like application bugs.

**How to apply:** run the migration step before the suite, then seed. See
[[seed-the-test-database]] for where the fixture data comes from.
`;

// MEMORY.md, matching the entries `memoryIndex` carries. Flat, one line per memory — this is the
// only file in the directory that reaches a session unasked, so the body pane shows it whole.
export const memoryIndexMarkdown: string = `- [Keeps pull requests small](prefers-small-pull-requests.md) — a few hundred lines, and say so in review.
- [Migrate before the suite](run-migrations-before-the-suite.md) — the tests assume a migrated database.
- [Seed from the script](seed-the-test-database.md) — never from a snapshot of the dev database.
- [The checkout flag](checkout-flow-is-flagged.md) — both paths keep working until it lands.
- [Payment contract](payment-provider-contract.md) — where it lives and what it settles.
- [Unfinished](half-written-note.md) — no type, no description.
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
