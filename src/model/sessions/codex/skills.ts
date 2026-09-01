// Which skills a run of rollout lines loaded, oldest first. The rule is `usage/codex/invocations.ts`
// and is imported rather than restated: Codex has no skill event, so a load is a command that read a
// SKILL.md, and everything that makes that reading honest — the globs, the patches, the shell
// variables it has to reject — lives there.
//
// Unlike Claude's reader there is no gate to leave behind. That one drops a slash command until the
// name turns up stamped on a turn, because `/clear` and `/dev-feature` are written identically; a
// path naming a skill directory needs no second opinion.

import { skillReads } from '../../usage/codex/invocations';
import { CodexUsageLine, parseCodexUsageLine } from '../../usage/codex/usage-line';

export const codexSkillsIn = (lines: readonly string[]): string[] => {
  const found: string[] = [];

  for (const line of lines) {
    // The same cheap gate the usage reader uses. A rollout inlines whole system prompts, so most
    // lines run to kilobytes and a full parse of every one is the cost worth avoiding.
    if (!line.includes('SKILL.md')) continue;

    const parsed: CodexUsageLine | undefined = parseCodexUsageLine(line);
    if (!parsed) continue;

    found.push(...skillReads(parsed).map((read) => read.skill));
  }

  return found;
};
