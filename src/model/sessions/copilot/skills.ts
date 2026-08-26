// Which skills a run of event lines loaded, oldest first. One event says so, and unlike anything on
// Claude's side it carries the whole body it loaded — which is why these lines sit hundreds of KB
// back in a log and a tail read never finds them.
//
// It fires twice for one `/skill`: the CLI injects the body because you typed the name, and the
// model then calls the tool to fetch what it has already been given. Both loads are the same stage,
// and `readSkillTrail` collapses the run.

import { CopilotEvent, parseEvent } from './event-schema';

const SKILL_EVENT: string = 'skill.invoked';

// Cheap enough to run over every line of a megabyte log, which is the point — one `system.message`
// in these files is 77KB of JSON, and only the lines that can match are worth a parse.
const SKILL_HINT: string = '"skill.invoked"';

export const copilotSkillsIn = (lines: readonly string[]): string[] => {
  const found: string[] = [];

  for (const line of lines) {
    if (!line.includes(SKILL_HINT)) continue;

    const event: CopilotEvent | undefined = parseEvent(line);
    if (event?.type !== SKILL_EVENT) continue;

    const skill: string | undefined = event.data?.name;
    if (skill) found.push(skill);
  }

  return found;
};
