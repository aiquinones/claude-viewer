import { isAbsolute, relative, resolve, sep } from 'path';
import { z } from 'zod';
import { DELIVERABLE_KINDS, Deliverable, DeliverableKind } from '../types';

// What a session says it produced, read off the text of a shell command it ran. CLI-agnostic: each
// tool's own reader finds the commands, this decides what one of them declares.
//
// The marker is echoed rather than sent anywhere — there is no URI and no handler. A tool call is
// already written into exactly one transcript, so the line that declares a deliverable is the line
// that says whose it is, and nothing has to fetch a session id to say so.
export const DELIVERABLE_MARKER: string = 'claude-viewer:deliverable';

// How many a session keeps. A declaration replaces one of the same kind and title rather than
// stacking, so re-running a step doesn't grow the row and this only binds on a session that really
// did produce eight different things. Past that the oldest go.
const DELIVERABLE_LIMIT: number = 8;

// The schemes a `url` may use. An agent writes this string, so `javascript:` is the hole to close
// and the list is what's allowed rather than what isn't.
const URL_SCHEMES: readonly string[] = ['http:', 'https:'];

// What the chip says when the declaration didn't give a title. A word rather than a sentence — the
// icon beside it already says which kind it is.
const FALLBACK_TITLE: Record<DeliverableKind, string> = {
  storybook: 'Storybook',
  link: 'Link',
  file: 'File',
  pr: 'Pull request'
};

// The wire shape, which says `type` where the model says `kind`. `type` is what a JSON tag is
// called and what an agent writes without being told; `kind` is what this repo names a
// discriminator. Converted here so nothing downstream knows there were ever two spellings.
const payloadSchema = z.object({
  type: z.string(),
  title: z.string().optional(),
  url: z.string().optional(),
  path: z.string().optional()
});

interface DeliverablesInCommandArgs {
  // One shell command, as the CLI recorded it. Not a whole line: a raw scan would find the marker
  // in the instructions file's own examples the moment an agent read them.
  command: string;
  // Where the session is working. A relative path is resolved against it and an absolute one has to
  // be under it — a deliverable is something this session produced, and a session produces things
  // where it is running.
  cwd: string;
}

// What makes a marker part of a file being written rather than a declaration. A heredoc (`<<`) or a
// redirect (`>`) earlier in the same command means the text after it is going to disk — which is
// how the instructions file gets written, examples and all.
//
// This is the second half of the rule, and real data is what found it: keying on the `Bash` tool
// call alone stops a *read* of that file declaring its examples, and does nothing about a
// `cat > deliverables.md <<'EOF'` that writes them. Measured on the session that built this feature
// — two real declarations against seven written into files.
const WRITING: readonly string[] = ['<<', '>'];

// Every deliverable declared in one command, in the order they were written. A command holding no
// marker, bad JSON, or a payload that doesn't validate yields none — the same degrade-don't-crash
// rule the config loaders follow.
export const deliverablesInCommand = ({
  command,
  cwd
}: DeliverablesInCommandArgs): Deliverable[] => {
  const found: Deliverable[] = [];
  let at: number = command.indexOf(DELIVERABLE_MARKER);

  while (at !== -1) {
    if (!writesToFile(command.slice(0, at))) {
      const json: string | undefined = objectAfter(command, at + DELIVERABLE_MARKER.length);
      const declared: Deliverable | undefined = json ? toDeliverable({ json, cwd }) : undefined;
      if (declared) found.push(declared);
    }

    at = command.indexOf(DELIVERABLE_MARKER, at + DELIVERABLE_MARKER.length);
  }

  return found;
};

// Checked against what comes *before* this occurrence rather than the whole command, so one `echo`
// declaring a deliverable still counts when a later part of the same line redirects something else.
const writesToFile = (before: string): boolean =>
  WRITING.some((token) => before.includes(token));

// Folds a pass's findings into what a session already had. Same kind and title replaces in place,
// so a step that reruns updates its chip rather than adding a second one beside it.
export const mergeDeliverables = (
  held: readonly Deliverable[],
  found: readonly Deliverable[]
): Deliverable[] => {
  const merged: Deliverable[] = [...held];

  for (const one of found) {
    const at: number = merged.findIndex(
      (already) => already.kind === one.kind && already.title === one.title
    );
    if (at === -1) merged.push(one);
    else merged[at] = one;
  }

  return merged.slice(-DELIVERABLE_LIMIT);
};

interface ToDeliverableArgs {
  json: string;
  cwd: string;
}

// One payload → a deliverable, or nothing. A declaration naming neither a url nor a path points
// nowhere and isn't one; naming both is ambiguous about what the chip opens, so the url wins and
// the path is ignored rather than the whole thing being dropped.
const toDeliverable = ({ json, cwd }: ToDeliverableArgs): Deliverable | undefined => {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return undefined;
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) return undefined;

  const kind: DeliverableKind = toKind(parsed.data.type);
  const title: string = parsed.data.title?.trim() || FALLBACK_TITLE[kind];

  const url: string | undefined = safeUrl(parsed.data.url);
  if (url) return { kind, title, url };

  const path: string | undefined = safePath({ declared: parsed.data.path, cwd });
  if (path) return { kind, title, path };

  return undefined;
};

// An unrecognised kind degrades to `link` rather than being dropped: the panel can always draw a
// generic chip, and a deliverable that vanishes because a newer format named a kind this version
// hasn't heard of is worse than one drawn with the wrong icon.
const toKind = (declared: string): DeliverableKind => {
  const found = DELIVERABLE_KINDS.find((kind) => kind === declared.trim().toLowerCase());
  return found ?? 'link';
};

const safeUrl = (declared: string | undefined): string | undefined => {
  if (!declared) return undefined;

  try {
    const parsed: URL = new URL(declared);
    return URL_SCHEMES.includes(parsed.protocol) ? parsed.href : undefined;
  } catch {
    return undefined;
  }
};

interface SafePathArgs {
  declared: string | undefined;
  cwd: string;
}

// Absolute, and under the session's cwd. The containment check is what makes the path safe to hand
// the host later: `_isKnownFile` accepts a deliverable's path, and this is the only thing standing
// between an agent naming a file and the panel opening it.
const safePath = ({ declared, cwd }: SafePathArgs): string | undefined => {
  if (!declared || !cwd) return undefined;

  const full: string = isAbsolute(declared) ? resolve(declared) : resolve(cwd, declared);
  const inside: string = relative(resolve(cwd), full);

  // Empty means the path *is* the cwd, which names a directory rather than a file. Both the escape
  // checks are on a whole first segment rather than a prefix: `relative` yields `..foo` for a
  // directory called that sitting inside the cwd, and a bare `startsWith('..')` would drop it.
  if (inside === '') return undefined;
  if (inside === '..' || inside.startsWith(`..${sep}`) || isAbsolute(inside)) return undefined;

  return full;
};

// The JSON object starting at the first `{` after `from`, matched by depth rather than by the last
// `}` in the string — a command can echo two declarations, and the first must not swallow the
// second. String-aware, since a title may hold a brace and an escaped quote.
const objectAfter = (text: string, from: number): string | undefined => {
  const start: number = text.indexOf('{', from);
  if (start === -1) return undefined;

  let depth: number = 0;
  let inString: boolean = false;
  let escaped: boolean = false;

  for (let index = start; index < text.length; index++) {
    const char: string = text[index];

    if (escaped) escaped = false;
    else if (char === '\\') escaped = true;
    else if (char === '"') inString = !inString;
    else if (inString) continue;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return text.slice(start, index + 1);
  }

  return undefined;
};
