// Finding one skill's name in another skill's text. Pure — no disk, no vscode.
//
// The naive scan is a disaster: skills are named `run`, `test`, `commit`, `design`, so every skill
// that uses the English word would collect an edge. A match therefore has to be *marked* as a
// reference, unless the name is a thing prose wouldn't say on its own.

// What continues a name. A hit with one of these on either side is part of a longer word.
const NAME_CHAR: RegExp = /[a-z0-9-]/;

interface FindMentionsArgs {
  text: string;
  // Lowercase skill names to look for.
  names: string[];
}

// name → how many times the text refers to it. The count is the edge's weight.
export const findMentions = ({ text, names }: FindMentionsArgs): Map<string, number> => {
  const haystack: string = text.toLowerCase();
  const found: Map<string, number> = new Map();

  for (const name of names) {
    const count: number = countMentions({ haystack, name });
    if (count > 0) found.set(name, count);
  }

  return found;
};

interface CountMentionsArgs {
  // Already lowercased.
  haystack: string;
  name: string;
}

// `indexOf` rather than a regex per name: 37 names over 37 bodies is 1400 passes, and compiling a
// pattern for each one is the part that would cost something.
const countMentions = ({ haystack, name }: CountMentionsArgs): number => {
  if (!name) return 0;
  // Two words joined by a hyphen is already a reference — nobody writes `post-mortem` by accident.
  // A single word needs a marker around it.
  const standsAlone: boolean = name.includes('-');

  let count: number = 0;
  let at: number = haystack.indexOf(name);

  while (at !== -1) {
    const end: number = at + name.length;
    const before: string = haystack[at - 1] ?? '';
    const after: string = haystack[end] ?? '';

    const whole: boolean = !NAME_CHAR.test(before) && !NAME_CHAR.test(after);
    const marked: boolean = isMarked({ before, after, beforeMarker: haystack[at - 2] ?? '' });
    if (whole && (standsAlone || marked)) count += 1;

    at = haystack.indexOf(name, end);
  }

  return count;
};

interface IsMarkedArgs {
  before: string;
  after: string;
  // The character before the marker, which is what tells a slash command from a prose slash.
  beforeMarker: string;
}

// The three ways a skill points at another: `/name`, `` `name` ``, and `[[name]]` — the last of
// which also catches a markdown link whose text is the name.
//
// The slash has to start something. Written as `before === '/'` alone, "spec/design doc" claims a
// mention of the `design` skill, and so does every other and/or in a body.
const isMarked = ({ before, after, beforeMarker }: IsMarkedArgs): boolean =>
  (before === '/' && !NAME_CHAR.test(beforeMarker)) ||
  before === '`' ||
  after === '`' ||
  (before === '[' && after === ']');
