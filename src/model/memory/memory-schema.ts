import { z } from 'zod';
import { FieldMap } from '../../config/frontmatter';
import { MEMORY_TYPES, MemoryType } from '../types';

// A memory's frontmatter. Claude writes these, not a person, but the shape still drifts with the
// instructions that produce them — so every field is optional and unknown keys pass through. A file
// that doesn't match still becomes a row carrying an issue.
const field = z.union([z.string(), z.array(z.string())]);

// `type` and `modified` are read here as well as out of `metadata`, because both shapes are on
// disk: older memories write them flat at the top level, newer ones nest them under `metadata:`.
// Nested wins where a file has both.
export const memoryFrontmatterSchema = z
  .object({
    name: field.optional(),
    description: field.optional(),
    type: field.optional(),
    modified: field.optional()
  })
  .passthrough();

// The nested `metadata:` block, which `parseFields` hands over as a flat map of scalars.
export const memoryMetadataSchema = z
  .object({
    type: z.string().optional(),
    node_type: z.string().optional(),
    originSessionId: z.string().optional(),
    modified: z.string().optional()
  })
  .passthrough();

export interface MemoryFrontmatter {
  name: string | undefined;
  description: string | undefined;
  // One of the four, when it is one of the four.
  type: MemoryType | undefined;
  // What `metadata.type` actually said, whether or not it's known.
  declaredType: string | undefined;
  // `metadata.modified` as epoch ms. Undefined when absent or unparseable — the caller falls back
  // to the file's own mtime rather than showing a memory written in 1970.
  modifiedAt: number | undefined;
}

interface ParseArgs {
  fields: Record<string, string | string[]>;
  metadata: FieldMap | undefined;
}

export const parseMemoryFrontmatter = ({
  fields,
  metadata
}: ParseArgs): MemoryFrontmatter | undefined => {
  const parsed = memoryFrontmatterSchema.safeParse(fields);
  if (!parsed.success) return undefined;

  const meta = memoryMetadataSchema.safeParse(metadata ?? {});
  const declaredType: string | undefined =
    (meta.success ? asText(meta.data.type) : undefined) ?? asText(parsed.data.type);
  const modified: string | undefined =
    (meta.success ? asText(meta.data.modified) : undefined) ?? asText(parsed.data.modified);

  return {
    name: asText(parsed.data.name),
    description: asText(parsed.data.description),
    type: asMemoryType(declaredType),
    declaredType,
    modifiedAt: asTimestamp(modified)
  };
};

const asMemoryType = (value: string | undefined): MemoryType | undefined =>
  MEMORY_TYPES.find((type) => type === value);

const asTimestamp = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed: number = Date.parse(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

// A scalar written as a list still has to render as one line.
const asText = (value: string | string[] | undefined): string | undefined => {
  if (value === undefined) return undefined;
  const text: string = Array.isArray(value) ? value.join(', ') : value;
  return text.trim() === '' ? undefined : text;
};
