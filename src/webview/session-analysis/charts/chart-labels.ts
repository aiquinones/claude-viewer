// The words on the session charts. Here rather than inline for the reason `agent-context-labels.ts`
// exists: the prose is the part that gets rewritten, and it shouldn't mean opening a component.

// What the hover card gains where a skill's body entered the context, over the names under it.
export const LOADED_HERE: string = 'Called here';

// Those names, one per line rather than joined into a sentence — several skills land on one point
// often enough, and the bubble is `whitespace-nowrap`, so a joined list grew wider than the panel.
// Named as the slash command because that's how you'd have asked for it, whichever of the three
// routes actually loaded it.
export const loadedNames = (skills: string[]): string[] => skills.map((skill) => `/${skill}`);

// Local time to the minute. The session is the reader's own and the date is on the row they came
// from, so the hour is the part that places a request inside it.
export const clockTime = (at: number): string =>
  new Date(at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export const EMPTY_TURNS: string = 'No requests recorded for this session.';

// Said when the session ran but nothing recorded how full its context was. On the Claude side that's
// a transcript with no finished assistant turn; on the Copilot side it's a machine whose usage
// database couldn't be read, since the event log never carries the figure.
export const EMPTY_CONTEXT: string = 'No context size recorded for this session.';
