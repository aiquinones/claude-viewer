import { useEffect, useMemo, useRef, useState } from 'react';
import { scrollBehavior } from '../scroll-behavior';
import { STICKY_TOP_Z } from '../z-layers';
import { Blocks } from './Blocks';
import { SectionTarget } from './find-section';
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
  // pushes every heading down a slot; the caller's own bar sits at STICKY_TOP_Z, above all of them.
  offsetRows?: number;
  // A heading a link asked for, already matched against this document by the caller — see
  // markdown/find-section.ts. The section is scrolled to and stays lit until you click elsewhere.
  target?: SectionTarget;
}

// A markdown file with its headings pinned: the current `#` at the top of the scroll container,
// the current `##` under it, and so on. Pure CSS — see markdown/sections.ts for why the section
// nesting is what makes it work.
export const Markdown = ({ raw, offsetRows = 0, target }: MarkdownProps) => {
  const sections: Section[] = useMemo(() => toSections(raw), [raw]);

  return (
    <div className="text-sm leading-relaxed">
      {sections.map((section, index) => (
        <SectionView key={index} section={section} offsetRows={offsetRows} target={target} />
      ))}
    </div>
  );
};

interface SectionViewProps {
  section: Section;
  offsetRows: number;
  target?: SectionTarget;
}

// Where this section's own heading pins, which is also where the section has to stop when it's
// scrolled to — otherwise it lands behind the bars already sitting there.
const stickyTop = (depth: number, offsetRows: number): string =>
  `${(Math.min(depth, MAX_DEPTH) - 1 + offsetRows) * ROW_REM}rem`;

const SectionView = ({ section, offsetRows, target }: SectionViewProps) => {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState<boolean>(false);
  const active: boolean = Boolean(section.heading) && section.slug === target?.slug;

  // The wrapper is what scrolls, not the heading: a sticky element that's part-way stuck reports a
  // box that isn't its natural one, and this one never moves. No race with the file's arrival —
  // the caller renders no Markdown until the text is in hand, so mounting *is* the cue. Keyed on
  // the nonce as well, so the same link twice re-lights a heading you dismissed.
  useEffect(() => {
    if (!active) return;

    ref.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    setLit(true);
  }, [active, target?.nonce]);

  // The highlight is a selection, so it behaves like one: it stays until you go somewhere else,
  // rather than fading on a timer while you're still reading your way to it.
  useEffect(() => {
    if (!lit) return;

    const clear = (): void => setLit(false);
    document.addEventListener('pointerdown', clear);
    return () => document.removeEventListener('pointerdown', clear);
  }, [lit]);

  return (
    <section ref={ref} style={{ scrollMarginTop: stickyTop(section.depth, offsetRows) }}>
      {section.heading && <StickyHeading section={section} offsetRows={offsetRows} lit={lit} />}
      <Blocks tokens={section.blocks} />
      {section.children.map((child, index) => (
        <SectionView key={index} section={child} offsetRows={offsetRows} target={target} />
      ))}
    </section>
  );
};

interface StickyHeadingProps {
  section: Section;
  offsetRows: number;
  lit: boolean;
}

// The bar spans the pane's own padding (`-mx-5 px-5`) so scrolling content passes behind it
// rather than beside it, and truncates rather than growing — a taller bar would throw off every
// offset below it.
const StickyHeading = ({ section, offsetRows, lit }: StickyHeadingProps) => {
  const depth: number = Math.min(section.depth, MAX_DEPTH);
  const heading = section.heading;
  if (!heading) return null;

  const Tag = `h${Math.min(heading.depth, 6)}` as 'h1';

  return (
    <Tag
      id={section.slug || undefined}
      title={heading.text}
      style={{ top: stickyTop(section.depth, offsetRows), zIndex: STICKY_TOP_Z - depth }}
      className={`sticky -mx-5 flex ${STICKY_ROW_CLASS} items-center border-b border-border bg-background px-5 ${HEADING_CLASS[depth]} ${lit ? 'section-lit' : ''}`}
    >
      {/* The span, not the heading, does the truncating: a flex item needs min-w-0 before it
          will shrink far enough to show an ellipsis. */}
      <span className="min-w-0 truncate">
        <Inline tokens={heading.tokens} />
      </span>
    </Tag>
  );
};
