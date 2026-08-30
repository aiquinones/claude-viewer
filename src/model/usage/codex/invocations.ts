// When a skill was loaded into a Codex session's context. Unlike the other two CLIs there is no
// event for it: Codex has no skill tool, so it loads a skill by *reading the file*, and the record
// is the shell command that did it — `sed -n '1,200p' ~/.codex/skills/tiny-mock/SKILL.md`.
//
// That makes the rule a path rule rather than an event rule, and the risk is the opposite of
// Claude's. There, the question is whether a `<command-name>` names a skill at all; here, a command
// mentioning a SKILL.md may not be reading one. Three kinds of decoy appear in real rollouts, and
// all three are commands the agent ran while *looking* for skills rather than following one:
//
//   * a glob   — `rg --files -g 'SKILL.md'`, `find -path '*/dev-feature/SKILL.md'`
//   * a patch  — `apply_patch` writing a SKILL.md, which is a skill being edited, not loaded
//   * a shell variable — `.claude/skills/$skill/SKILL.md`, whose name isn't in the text
//
// Measured over the 8 rollouts on this machine that mention a SKILL.md: 19 loads found, every decoy
// above rejected, and one miss — the `$skill` loop, which read four skills in one command. Three of
// those four were also read literally later in the same session, so the set is right and only the
// count is short.

import { SkillInvocation } from '../types';
import { CodexUsageLine, parseCodexUsageLine } from './usage-line';

// The two payload types a tool call arrives as. `custom_tool_call` is what current Codex writes;
// `function_call` is the older shape, still present in rollouts from a few releases back.
const TOOL_CALL_TYPES: readonly string[] = ['custom_tool_call', 'function_call'];

// A path-shaped run ending in `/SKILL.md`. The glob and variable characters are deliberately *in*
// the class so a decoy is captured whole and can then be rejected — leaving them out would slice a
// clean-looking tail off `'*/dev-feature/SKILL.md'` and count it as a load.
const SKILL_PATH = /[\w~./$*?{}\\-]*\/SKILL\.md/g;

// What makes a captured run a path rather than a pattern. Any of these and the text never named one
// file, so there is nothing to count.
const NOT_A_PATH = /[*?${}\\]/;

// A skill's directory name. Rules out `.` and `..` from a relative path, which are the parent of a
// `./SKILL.md` and name no skill.
const SKILL_NAME = /^[A-Za-z0-9][\w.-]*$/;

// The tool that edits rather than reads. A rollout writes the whole patch into the same `input`
// field an exec command uses, so the SKILL.md path is there and means the opposite.
const PATCH_TOOL: string = 'apply_patch';

export const parseCodexInvocations = (lines: string[]): SkillInvocation[] => {
  const found: SkillInvocation[] = [];

  for (const line of lines) {
    // The cheap gate first — a rollout line runs to kilobytes and most hold no path at all.
    if (!line.includes('SKILL.md')) continue;

    const parsed: CodexUsageLine | undefined = parseCodexUsageLine(line);
    if (!parsed) continue;

    const at: number = Date.parse(parsed.timestamp ?? '');
    if (Number.isNaN(at)) continue;

    for (const { skill, path } of skillReads(parsed)) {
      found.push({ skill, at, via: 'read', path });
    }
  }

  return found;
};

interface SkillRead {
  skill: string;
  path: string;
}

// The skills one line read, deduped by name. The dedupe is what a guarded read needs: an
// `if [ -f A ]; then sed A; else sed B; fi` names one skill by two paths and loaded it at most once.
//
// Exported because `sessions/codex/skills.ts` asks the same question of a live session's rollout,
// and what counts as a load has one home.
export const skillReads = (line: CodexUsageLine): SkillRead[] => {
  if (!TOOL_CALL_TYPES.includes(line.payload?.type ?? '')) return [];

  const input: string = line.payload?.input ?? line.payload?.arguments ?? '';
  if (!input.includes('SKILL.md') || input.includes(PATCH_TOOL)) return [];

  const byName: Map<string, SkillRead> = new Map();

  for (const match of input.matchAll(SKILL_PATH)) {
    const path: string = match[0];
    if (NOT_A_PATH.test(path)) continue;

    const skill: string | undefined = path.split('/').at(-2);
    if (!skill || !SKILL_NAME.test(skill) || byName.has(skill)) continue;

    byName.set(skill, { skill, path });
  }

  return [...byName.values()];
};
