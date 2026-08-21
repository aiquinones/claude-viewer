import { Result, ok, err } from './result';

// One level of nesting: `metadata:` on its own line, then indented `key: value` lines. Anything
// deeper still degrades to text rather than disappearing.
export type FieldMap = Record<string, string>;

export interface FlatFields {
  // Scalars stay strings; `a, b` lists and `- a` blocks come back as string[].
  fields: Record<string, string | string[]>;
  // Keys whose value turned out to be a map, keyed by the key that opened it. A key here is not
  // also in `fields` — it holds a map, not a value.
  maps: Record<string, FieldMap>;
}

export interface Frontmatter extends FlatFields {
  body: string;
}

const BLOCK = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const LIST_ITEM = /^\s*-\s+(.*)$/;
const PAIR = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/;
const INDENTED = /^\s+\S/;

// Splits the leading `---` block off a markdown file and reads its key/value pairs.
// Deliberately not a YAML parser: skill and agent frontmatter is flat scalars and short lists, and
// a real parser is a dependency plus a much larger surface to keep safe. Memory files nest one
// level under `metadata:`, which is the one shape below that gets read rather than folded.
export const parseFrontmatter = (raw: string): Result<Frontmatter, string> => {
  const match: RegExpExecArray | null = BLOCK.exec(raw);
  if (!match) return err('no frontmatter block');
  return ok({ ...parseFields(match[1]), body: raw.slice(match[0].length) });
};

// One logical line of the block. `nested` marks a pair that belongs to the map its key opened,
// rather than to the block itself.
interface Line {
  text: string;
  nested: boolean;
}

// A long value is usually wrapped across several indented lines. YAML joins those with a space into
// one scalar, so fold them onto their key before anything else looks at the block — quotes included,
// which is why nothing is unquoted until after this.
//
// The one indented line that isn't a continuation is a pair under a key with no value of its own:
// that's a map, and it keeps its own line.
const foldContinuations = (block: string): Line[] => {
  const lines: Line[] = [];
  // The current top-level key wrote no value, so indented pairs below it are map entries.
  let mapOpen: boolean = false;

  for (const raw of block.split(/\r?\n/)) {
    const previous: Line | undefined = lines[lines.length - 1];
    const continues: boolean = previous !== undefined && INDENTED.test(raw) && !LIST_ITEM.test(raw);

    if (continues) {
      const pair: RegExpExecArray | null = PAIR.exec(raw.trim());
      if (pair && mapOpen) {
        lines.push({ text: raw.trim(), nested: true });
        continue;
      }
      previous.text += ` ${raw.trim()}`;
      continue;
    }

    const pair: RegExpExecArray | null = PAIR.exec(raw);
    mapOpen = pair !== null && pair[2].trim() === '';
    lines.push({ text: raw, nested: false });
  }

  return lines;
};

// The same reader, over a whole file rather than a `---` block. Copilot's `workspace.yaml` is
// exactly the shape this handles — flat keys, scalar values, wrapped continuation lines — so it
// reuses this instead of adding a YAML dependency for eleven keys.
export const parseFlatFields = (block: string): Record<string, string | string[]> =>
  parseFields(block).fields;

// Everything the block holds, maps included.
export const parseFields = (block: string): FlatFields => {
  const fields: Record<string, string | string[]> = {};
  const maps: Record<string, FieldMap> = {};
  let currentKey: string | undefined;

  for (const line of foldContinuations(block)) {
    const pair: RegExpExecArray | null = PAIR.exec(line.text.trim());

    // An indented pair under a key that wrote no value: the key holds a map, not a value.
    if (line.nested && pair && currentKey) {
      delete fields[currentKey];
      maps[currentKey] = { ...maps[currentKey], [pair[1]]: unquote(pair[2].trim()) };
      continue;
    }

    const item: RegExpExecArray | null = LIST_ITEM.exec(line.text);
    if (item && currentKey) {
      const existing: string | string[] | undefined = fields[currentKey];
      const list: string[] = Array.isArray(existing) ? existing : [];
      list.push(unquote(item[1].trim()));
      fields[currentKey] = list;
      continue;
    }

    if (!pair) continue;

    currentKey = pair[1];
    const value: string = pair[2].trim();
    // An empty value opens either a `- item` block or a map on the following lines.
    fields[currentKey] = value === '' ? [] : parseScalar(value);
  }

  return { fields, maps };
};

// `[a, b]` and `a, b` both mean a list; anything else stays the string it was written as.
const parseScalar = (value: string): string | string[] => {
  if (value.startsWith('[') && value.endsWith(']')) return splitList(value.slice(1, -1));
  return unquote(value);
};

// Splits on commas, but only at the top level: tool patterns carry their own argument lists
// (`Agent(one, two)`, `Bash(git add, git commit)`) and those commas don't separate entries.
export const splitList = (value: string): string[] => {
  const parts: string[] = [];
  let current: string = '';
  let depth: number = 0;

  for (const char of value) {
    if (char === '(' || char === '[') depth += 1;
    if (char === ')' || char === ']') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  parts.push(current);

  return parts.map((part) => unquote(part.trim())).filter((part) => part.length > 0);
};

const unquote = (value: string): string => {
  const quoted: boolean =
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")));
  return quoted ? value.slice(1, -1) : value;
};
