import { useMemo } from 'react';
import { Blocks } from './Blocks';
import { Inline } from './Inline';
import { Section, toSections } from './sections';

// Every pinned row is exactly this tall, which is what lets the offsets be multiples of it. The
// two have to agree, so anything stacking a bar of its own on top wears the same class.
const ROW_REM: number = 1.75;
export const STICKY_ROW_CLASS: string = 'h-7';

// Past this the bars would eat the pane, so deeper headings share the last level's slot.
const MAX_DEPTH: number = 4;

const HEADING_CLASS: Record<number, string> = {
  1: 'text-sm font-semibold',
  2: 'text-xs font-semibold',
  3: 'text-xs font-medium text-muted-foreground',
  4: 'text-xs font-medium text-muted-foreground'
};

interface MarkdownProps {
  raw: string;
  // Rows already pinned above this markdown, if the caller stacks its own bar on top. Each one
  // pushes every heading down a slot; the caller has to stay above `30 - MAX_DEPTH` in z-index.
  offsetRows?: number;
}

// A markdown file with its headings pinned: the current `#` at the top of the scroll container,
// the current `##` under it, and so on. Pure CSS — see markdown/sections.ts for why the section
// nesting is what makes it work.
export const Markdown = ({ raw, offsetRows = 0 }: MarkdownProps) => {
  const sections: Section[] = useMemo(() => toSections(raw), [raw]);

  return (
    <div className="text-sm leading-relaxed">
      {sections.map((section, index) => (
        <SectionView key={index} section={section} offsetRows={offsetRows} />
      ))}
    </div>
  );
};

interface SectionViewProps {
  section: Section;
  offsetRows: number;
}

const SectionView = ({ section, offsetRows }: SectionViewProps) => (
  <section>
    {section.heading && <StickyHeading section={section} offsetRows={offsetRows} />}
    <Blocks tokens={section.blocks} />
    {section.children.map((child, index) => (
      <SectionView key={index} section={child} offsetRows={offsetRows} />
    ))}
  </section>
);

// The bar spans the pane's own padding (`-mx-5 px-5`) so scrolling content passes behind it
// rather than beside it, and truncates rather than growing — a taller bar would throw off every
// offset below it.
const StickyHeading = ({ section, offsetRows }: SectionViewProps) => {
  const depth: number = Math.min(section.depth, MAX_DEPTH);
  const heading = section.heading;
  if (!heading) return null;

  const Tag = `h${Math.min(heading.depth, 6)}` as 'h1';

  return (
    <Tag
      title={heading.text}
      style={{ top: `${(depth - 1 + offsetRows) * ROW_REM}rem`, zIndex: 30 - depth }}
      className={`sticky -mx-5 flex ${STICKY_ROW_CLASS} items-center border-b border-border bg-background px-5 ${HEADING_CLASS[depth]}`}
    >
      {/* The span, not the heading, does the truncating: a flex item needs min-w-0 before it
          will shrink far enough to show an ellipsis. */}
      <span className="min-w-0 truncate">
        <Inline tokens={heading.tokens} />
      </span>
    </Tag>
  );
};
