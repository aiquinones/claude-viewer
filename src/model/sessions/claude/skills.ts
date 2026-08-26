// Which skills a run of transcript lines loaded, oldest first. The two routes are the pair
// `usage/claude/invocations.ts` reads, and both rules are imported from it rather than restated:
// the model asked for one (a `Skill` tool_use block), or you typed one (a `<command-name>` line).
//
// What isn't imported is that reader's gate — a slash command counts there only once its name has
// also been stamped as an `attributionSkill`, which is how `/dev-feature` is told from `/clear`.
// The stamp arrives on the next turn, so a poll landing between the two would drop the command for
// good. It costs nothing to skip: a name nobody typed into the stage-naming dialog opens no stage.

import { skillToolLoads, slashCommandNames } from '../../usage/claude/invocations';
import { InvocationLine, parseInvocationLine } from '../../usage/claude/usage-schema';

// Two of the three markers `parseInvocationLine` prefilters on. The third is `attributionSkill`,
// which that reader needs for its gate and this one doesn't — and it sits on roughly a quarter of
// the assistant lines in a transcript, each of them kilobytes, so letting it through would cost a
// full JSON parse per turn on the pass that walks the whole file.
const SKILL_MARKERS: readonly string[] = ['"Skill"', '<command-name>'];

export const claudeSkillsIn = (lines: readonly string[]): string[] => {
  const found: string[] = [];

  for (const line of lines) {
    if (!SKILL_MARKERS.some((marker) => line.includes(marker))) continue;

    const parsed: InvocationLine | undefined = parseInvocationLine(line);
    if (!parsed) continue;

    found.push(...skillToolLoads(parsed), ...slashCommandNames(parsed));
  }

  return found;
};
