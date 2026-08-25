import { ReactNode } from 'react';

interface ChartSectionProps {
  title: string;
  // What the chart is of, beside the heading — the request count, or how full the context got. Set
  // in normal case against the uppercase title, the same shape every grouped list here uses.
  note: ReactNode;
  // Anything that floats out of the heading — an (i) and the card it opens. Its own slot because
  // the note truncates, and `truncate` is `overflow: hidden`: a card hung inside it opens below a
  // one-line box and is clipped away entirely, with nothing on screen to say why.
  info?: ReactNode;
  children: ReactNode;
}

// The heading a chart sits under. Both charts have to keep looking like each other and like the
// sections above them, which is why it isn't written out twice.
export const ChartSection = ({ title, note, info, children }: ChartSectionProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
      <span className="truncate font-normal normal-case tracking-normal">{note}</span>
      {/* `self-center`: the row is baseline-aligned for the text, and an icon isn't text. A box
          holding an svg and an `sr-only` span has no in-flow line box — `sr-only` is absolute — so
          it baselines on its bottom edge and the icon rides above the letters beside it. */}
      {info && <span className="inline-flex self-center">{info}</span>}
    </h2>
    {children}
  </section>
);
