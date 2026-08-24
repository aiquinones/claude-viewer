import { BudgetLevel } from '../../../model/settings/budget';
import { ChartGuide } from './context-guides';
import { PLOT_PAD, Scale } from './geometry';

// Where the colour changes, drawn across the plot. Not the tick the agent row's bar carries and not
// the ticks this chart's predecessor drew under its axis: those are marks on an edge, and a
// threshold is a level the whole curve is either under or over.
interface ChartGuidesProps {
  guides: ChartGuide[];
  scale: Scale;
  width: number;
}

// The same three colours `BudgetBar` and `ContextBar` paint, in their svg spelling.
const LINE: Record<BudgetLevel, string> = {
  within: 'stroke-muted-foreground',
  near: 'stroke-warn',
  over: 'stroke-error'
};

const TEXT: Record<BudgetLevel, string> = {
  within: 'fill-muted-foreground',
  near: 'fill-warn',
  over: 'fill-error'
};

// Air between the line and its label.
const LABEL_GAP: number = 4;

// Roughly the label's cap height — what it drops by when it has to sit under its line instead.
const LABEL_HEIGHT: number = 11;

export const ChartGuides = ({ guides, scale, width }: ChartGuidesProps) => (
  <g>
    {guides.map((guide) => {
      const y: number = scale.y(guide.value);
      // Above the line, unless the line is high enough that the label would leave the box.
      const above: boolean = y - LABEL_GAP - LABEL_HEIGHT > 0;

      return (
        <g key={guide.label}>
          <line
            x1={PLOT_PAD.left}
            x2={Math.max(PLOT_PAD.left, width - PLOT_PAD.right)}
            y1={y}
            y2={y}
            strokeWidth={1}
            strokeDasharray="3 3"
            className={LINE[guide.level]}
          />
          {/* `chart-label` strokes the glyphs in the panel background before filling them, so the
              text stays legible where it crosses the curve. */}
          <text
            x={Math.max(PLOT_PAD.left, width - PLOT_PAD.right)}
            y={above ? y - LABEL_GAP : y + LABEL_HEIGHT}
            textAnchor="end"
            className={`chart-label text-[10px] tabular-nums ${TEXT[guide.level]}`}
          >
            {guide.label}
          </text>
        </g>
      );
    })}
  </g>
);
