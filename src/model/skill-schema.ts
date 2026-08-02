import { z } from 'zod';
import { splitList } from '../config/frontmatter';

// Frontmatter is user- and plugin-authored and its schema drifts between Claude Code releases,
// so every field is optional and unknown keys pass through untouched. A file that doesn't match
// still produces a row — it just carries an issue.
const field = z.union([z.string(), z.array(z.string())]);

export const skillFrontmatterSchema = z
  .object({
    name: field.optional(),
    description: field.optional(),
    'allowed-tools': field.optional()
  })
  .passthrough();

export interface SkillFrontmatter {
  name: string | undefined;
  description: string | undefined;
  allowedTools: string[];
}

export const parseSkillFrontmatter = (
  fields: Record<string, string | string[]>
): SkillFrontmatter | undefined => {
  const parsed = skillFrontmatterSchema.safeParse(fields);
  if (!parsed.success) return undefined;

  return {
    name: asText(parsed.data.name),
    description: asText(parsed.data.description),
    allowedTools: asList(parsed.data['allowed-tools'])
  };
};

// A scalar written as a list still has to render as one line.
const asText = (value: string | string[] | undefined): string | undefined => {
  if (value === undefined) return undefined;
  const text: string = Array.isArray(value) ? value.join(', ') : value;
  return text.trim() === '' ? undefined : text;
};

// `Read, Grep` and a `- Read` block both mean the same list.
const asList = (value: string | string[] | undefined): string[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : splitList(value);
};
