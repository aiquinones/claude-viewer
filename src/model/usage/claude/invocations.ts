// When a skill was loaded into a Claude session's context. Two routes, and they're alternatives
// rather than a pair — measured across 102 transcripts, the explicit events match the contiguous
// runs of `attributionSkill` for 149 of 152 file-and-skill pairs.
//
//   * The model asked for it — an `assistant` line holding a `tool_use` block named `Skill`.
//   * You typed it — a `user` line carrying `<command-name>/dev-feature</command-name>`.
//
// The three that don't match are all one explicit invocation against zero stamped turns: a skill
// invoked at the end of a session that then produced nothing. Reading the event catches those and
// counting runs can't, which is why this is what ships.

import { SkillInvocation } from '../types';
import { parseInvocationLine, InvocationLine } from './usage-schema';

// The Skill tool's own name, as it appears on the tool_use block.
const SKILL_TOOL: string = 'Skill';

// A slash command's name, as the CLI writes it into the user line it expands to. Nothing in the
// markup distinguishes a skill from a built-in — `/clear` and `/dev-feature` are written
// identically, `<command-message>` and `<command-args>` included.
const COMMAND_NAME = /<command-name>\/([^<\s]+)<\/command-name>/g;

// Turns whose `attributionSkill` names a skill are the only proof a transcript carries that a slash
// command named one. So a command counts once its name has been seen stamped on a turn somewhere in
// the same file, which is what a slash command naming a skill always looks like.
export const parseClaudeInvocations = (lines: string[]): SkillInvocation[] => {
  const found: SkillInvocation[] = [];
  const stamped: Set<string> = new Set();

  for (const line of lines) {
    const parsed: InvocationLine | undefined = parseInvocationLine(line);
    if (!parsed) continue;

    if (parsed.attributionSkill) stamped.add(parsed.attributionSkill);

    const at: number = Date.parse(parsed.timestamp ?? '');
    if (Number.isNaN(at)) continue;

    for (const skill of skillToolLoads(parsed)) {
      found.push({ skill, at, via: 'tool' });
    }

    for (const skill of slashCommandNames(parsed)) {
      found.push({ skill, at, via: 'command' });
    }
  }

  return found.filter((load) => load.via === 'tool' || stamped.has(load.skill));
};

// The `Skill` tool_use blocks on one line. A block with no `skill` in its input names nothing and
// isn't a load.
//
// Exported because `sessions/claude/skills.ts` asks the same question of a live session's log, and
// what counts as a load has one home.
export const skillToolLoads = (line: InvocationLine): string[] => {
  const content = line.message?.content;
  if (!Array.isArray(content)) return [];

  return content
    .filter((block) => block.type === 'tool_use' && block.name === SKILL_TOOL)
    .map((block) => block.input?.skill)
    .filter((skill): skill is string => typeof skill === 'string' && skill.length > 0);
};

// The slash commands on one line. A user line's content is a plain string when it's a prompt and an
// array of blocks when it's a tool result, and only the first kind carries these. Exported for the
// same reason `skillToolLoads` is.
export const slashCommandNames = (line: InvocationLine): string[] => {
  const content = line.message?.content;
  if (typeof content !== 'string') return [];

  return [...content.matchAll(COMMAND_NAME)].map((match) => match[1]);
};
