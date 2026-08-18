import { Section } from '../markdown/sections';

// One section's markdown, subtree and all. The `raw` text rather than the rendered words, because
// `findMentions` reads the markers around a name — a backtick or a leading slash is the whole
// difference between a reference to /commit and the English word.
export const sectionText = (section: Section): string => {
  const parts: string[] = [];

  if (section.heading) parts.push(section.heading.raw);
  for (const block of section.blocks) parts.push('raw' in block ? block.raw : '');
  for (const child of section.children) parts.push(sectionText(child));

  return parts.join('\n');
};
