// When a skill was loaded into a Copilot session's context. One event, `skill.invoked`, and unlike
// anything on Claude's side it carries the whole `content` it loaded.
//
// It fires twice for one `/skill`, and that isn't the reading being wrong. Measured on one session,
// both carrying 3,592 chars of `dev-feature` five seconds apart: the CLI injects the skill because
// you typed its name, and then the model — reading an instruction that says to follow the skill —
// calls the `skill` tool to fetch what it has already been given. The body genuinely enters the
// context twice.
//
// So `tool.execution_start` with `toolName: 'skill'` is not counted. It is the same event seen from
// the other side, and counting both would double the double.

import { SkillInvocation } from '../types';
import { parseUsageEvent, UsageEvent } from './usage-events';

export const parseCopilotInvocations = (text: string): SkillInvocation[] => {
  const found: SkillInvocation[] = [];

  for (const line of text.split('\n')) {
    const event: UsageEvent | undefined = parseUsageEvent(line);
    if (!event || event.type !== 'skill.invoked') continue;

    const skill: string | undefined = event.data?.name;
    const at: number = Date.parse(event.timestamp ?? '');
    if (!skill || Number.isNaN(at)) continue;

    const content: string | undefined = event.data?.content;
    found.push({
      skill,
      at,
      via: 'event',
      ...(content ? { chars: content.length } : {})
    });
  }

  return found;
};
