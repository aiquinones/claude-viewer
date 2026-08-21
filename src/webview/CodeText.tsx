import { Fragment } from 'react';

// A backticked run inside a sentence. One rule, not a markdown parser: it exists so the strings it
// reads — option hints, card prose — stay plain data in `.ts` files instead of becoming `.tsx`.
const TICKED: RegExp = /`([^`]+)`/g;

interface Segment {
  text: string;
  code: boolean;
}

interface CodeTextProps {
  text: string;
}

// `~/.claude/projects` and `cleanupPeriodDays` set in the editor's mono face, the way RetentionInfo
// already sets them by hand. 11px against the 12px around it, because the mono face runs optically
// larger — matching the number makes the token look bigger than the sentence holding it.
//
// `break-words` because most of these are paths. A hover card sizes to max-content and clamps at
// 16rem, so an unbreakable path is what decides the card's width: it hits the clamp and then has no
// opportunity to wrap, and runs out the side.
export const CodeText = ({ text }: CodeTextProps) => (
  <>
    {segments(text).map((segment: Segment, index: number) => (
      <Fragment key={index}>
        {segment.code ? (
          <span className="mono break-words text-[11px] text-foreground">{segment.text}</span>
        ) : (
          segment.text
        )}
      </Fragment>
    ))}
  </>
);

// The string split on its backtick pairs. An unmatched backtick stays in the plain text — nothing
// closes it, so the character is what the sentence meant.
const segments = (text: string): Segment[] => {
  const parts: Segment[] = [];
  let last: number = 0;

  for (const match of text.matchAll(TICKED)) {
    const start: number = match.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), code: false });
    parts.push({ text: match[1], code: true });
    last = start + match[0].length;
  }

  if (last < text.length) parts.push({ text: text.slice(last), code: false });
  return parts;
};
