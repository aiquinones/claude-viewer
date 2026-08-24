// The words on the session charts. Here rather than inline for the reason `agent-context-labels.ts`
// exists: the prose is the part that gets rewritten, and it shouldn't mean opening a component.

// The line the hover card gains where a skill's body entered the context. Named as the slash command
// because that's how you'd have asked for it, whichever of the three routes actually loaded it.
export const loadedHere = (skills: string[]): string => {
  const names: string[] = skills.map((skill) => `/${skill}`);
  const verb: string = skills.length === 1 ? 'was' : 'were';
  return `${joinNames(names)} ${verb} called here`;
};

// "a", "a and b", "a, b and c".
const joinNames = (names: string[]): string =>
  names.length <= 1
    ? (names[0] ?? '')
    : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

// Local time to the minute. The session is the reader's own and the date is on the row they came
// from, so the hour is the part that places a request inside it.
export const clockTime = (at: number): string =>
  new Date(at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export const EMPTY_TURNS: string = 'No requests recorded for this session.';

// Said when the session ran but nothing recorded how full its context was. On the Claude side that's
// a transcript with no finished assistant turn; on the Copilot side it's a machine whose usage
// database couldn't be read, since the event log never carries the figure.
export const EMPTY_CONTEXT: string = 'No context size recorded for this session.';
