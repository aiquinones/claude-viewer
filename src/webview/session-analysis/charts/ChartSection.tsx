import { ReactNode } from 'react';

interface ChartSectionProps {
  title: string;
  // What the chart is of, beside the heading — the request count, or how full the context got. Set
  // in normal case against the uppercase title, the same shape every grouped list here uses.
  note: ReactNode;
  children: ReactNode;
}

// The heading a chart sits under. Both charts have to keep looking like each other and like the
// sections above them, which is why it isn't written out twice.
export const ChartSection = ({ title, note, children }: ChartSectionProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
      <span className="truncate font-normal normal-case tracking-normal">{note}</span>
    </h2>
    {children}
  </section>
);
