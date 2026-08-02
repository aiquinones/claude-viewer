import { Result, ok, err } from './result';

export interface Frontmatter {
  // Scalars stay strings; `a, b` lists and `- a` blocks come back as string[].
  fields: Record<string, string | string[]>;
  body: string;
}

const BLOCK = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const LIST_ITEM = /^\s*-\s+(.*)$/;
const PAIR = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/;
const INDENTED = /^\s+\S/;

// Splits the leading `---` block off a markdown file and reads its flat key/value pairs.
// Deliberately not a YAML parser: skill and agent frontmatter is flat scalars and short lists,
// and a real parser is a dependency plus a much larger surface to keep safe. A nested map
// (`key:` then `  sub: value`) is not understood — it degrades to the literal text rather than
// disappearing.
export const parseFrontmatter = (raw: string): Result<Frontmatter, string> => {
  const match: RegExpExecArray | null = BLOCK.exec(raw);
  if (!match) return err('no frontmatter block');
  return ok({ fields: parseFields(match[1]), body: raw.slice(match[0].length) });
};

// A long description is usually wrapped across several indented lines. YAML joins those with a
// space into one scalar, so fold them onto their key before anything else looks at the block.
const foldContinuations = (block: string): string[] => {
  const lines: string[] = [];

  for (const line of block.split(/\r?\n/)) {
    const continues: boolean =
      lines.length > 0 && INDENTED.test(line) && !LIST_ITEM.test(line);
    if (continues) {
      lines[lines.length - 1] += ` ${line.trim()}`;
      continue;
    }
    lines.push(line);
  }

  return lines;
};

const parseFields = (block: string): Record<string, string | string[]> => {
  const fields: Record<string, string | string[]> = {};
  let currentKey: string | undefined;

  for (const line of foldContinuations(block)) {
    const item: RegExpExecArray | null = LIST_ITEM.exec(line);
    if (item && currentKey) {
      const existing: string | string[] | undefined = fields[currentKey];
      const list: string[] = Array.isArray(existing) ? existing : [];
      list.push(unquote(item[1].trim()));
      fields[currentKey] = list;
      continue;
    }

    const pair: RegExpExecArray | null = PAIR.exec(line);
    if (!pair) continue;

    currentKey = pair[1];
    const value: string = pair[2].trim();
    // An empty value opens a `- item` block on the following lines.
    fields[currentKey] = value === '' ? [] : parseScalar(value);
  }

  return fields;
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
