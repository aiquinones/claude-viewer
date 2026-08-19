import { marked, Token, Tokens } from 'marked';
import { uniqueSlug } from './slug';
import { isToken } from './tokens';

export interface Section {
  // Absent on the one section that holds whatever came before the first heading.
  heading?: Tokens.Heading;
  // What a link names this section by — the heading's text slugified, deduped in document order.
  // Empty on the preamble, which has no heading to name.
  slug: string;
  // Position in the tree, 1-based — not the markdown level. A file that jumps `#` → `###` nests
  // one step, so the sticky stack has no gap in it.
  depth: number;
  blocks: Token[];
  children: Section[];
}

interface OpenSection {
  // The markdown level (`##` is 2), which is what decides how much a later heading closes.
  level: number;
  section: Section;
}

// Flat token list → nested sections, one per heading, each holding its own blocks and
// sub-sections. The nesting is what makes `position: sticky` work: a heading releases when its
// section scrolls out, so a `##` can't stay pinned into the next `#`.
export const toSections = (raw: string): Section[] => {
  const roots: Section[] = [];
  // The chain of sections a new token would land in, outermost first.
  const open: OpenSection[] = [];
  // How many times each slug has been handed out, so a repeated heading gets `-2`.
  const seen: Map<string, number> = new Map();
  let preamble: Section | undefined;

  for (const token of marked.lexer(raw)) {
    if (token.type === 'space') continue;

    if (isToken(token, 'heading')) {
      while (open.length > 0 && open[open.length - 1].level >= token.depth) open.pop();
      const parent: OpenSection | undefined = open[open.length - 1];
      const section: Section = {
        heading: token,
        slug: uniqueSlug({ text: token.text, seen }),
        depth: open.length + 1,
        blocks: [],
        children: []
      };
      (parent ? parent.section.children : roots).push(section);
      open.push({ level: token.depth, section });
      continue;
    }

    const current: OpenSection | undefined = open[open.length - 1];
    if (current) {
      current.section.blocks.push(token);
      continue;
    }

    // Anything above the first heading. Rendered with no sticky bar of its own.
    if (!preamble) {
      preamble = { slug: '', depth: 0, blocks: [], children: [] };
      roots.push(preamble);
    }
    preamble.blocks.push(token);
  }

  return roots;
};
