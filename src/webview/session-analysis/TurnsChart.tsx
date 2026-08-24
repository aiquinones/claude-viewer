import { useRef, useState } from 'react';
import { UsageMetric } from '../../model/usage/types';
import { HoverBubble } from '../HoverBubble';
import { METRIC_LABEL } from '../usage-format';
import { LoadMark, TurnBar } from './turn-bars';

// How tall the bars are. A fixed height rather than a share of the pane: this is one section of a
// scrolling page, and a chart that grew with the window would push the skills list off the bottom.
const CHART_PX: number = 120;

// The narrowest a bar goes. Bars share the row, so a twenty-turn session spans the pane; past the
// point where they'd have to be thinner than this they stop shrinking and the row scrolls instead,
// because below it the bars stop being separable and the chart turns into a texture.
const MIN_BAR_PX: number = 3;

// And the widest. Without a ceiling a four-turn session draws four 200px blocks, which read as a bar
// chart of four categories rather than as four requests in a row — the row is a timeline, and a
// timeline with four fat columns doesn't look like one.
const MAX_BAR_PX: number = 14;

const BAR_GAP_PX: number = 2;

// A turn worth nothing still draws this much, because a request that happened is not the same as no
// request at all.
const FLOOR_PX: number = 1;

interface HoveredBar {
  bar: TurnBar;
  x: number;
  y: number;
  frameWidth: number;
}

interface TurnsChartProps {
  bars: TurnBar[];
  marks: LoadMark[];
  metric: UsageMetric;
  // How a value prints. Cost is dollars on a Claude session and AIU on a Copilot one, so the caller
  // passes the formatter rather than this guessing from the metric.
  format: (value: number) => string;
}

// Every request the session made, oldest first. The bar is the metric you're reading above, and the
// ticks under the axis are where a skill was loaded — so a spike and the skill that caused it line
// up, which is the whole reason the two sections sit next to each other.
export const TurnsChart = ({ bars, marks, metric, format }: TurnsChartProps) => {
  const frame = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoveredBar | undefined>(undefined);

  if (bars.length === 0) {
    return (
      <p className="px-1 py-6 text-center text-sm text-muted-foreground">
        No requests recorded for this session.
      </p>
    );
  }

  // Measured when the pointer arrives rather than worked out from the index: the row scrolls under
  // the frame, so a bar's position in the list says nothing about where it is on screen.
  const enter = (bar: TurnBar, element: HTMLElement): void => {
    const box: DOMRect = element.getBoundingClientRect();
    const frameBox: DOMRect | undefined = frame.current?.getBoundingClientRect();
    if (!frameBox) return;

    setHovered({
      bar,
      x: box.left - frameBox.left + box.width / 2,
      y: box.top - frameBox.top,
      frameWidth: frameBox.width
    });
  };

  return (
    // The bubble hangs off this frame rather than off the scrolling row: a floating child of a box
    // with `overflow-x-auto` loses whatever hangs above it, since the other axis computes to `auto`
    // along with it.
    <div ref={frame} className="relative">
      <div
        // A scroll leaves the bubble pointing at a bar it was never about, so it clears instead.
        onScroll={() => setHovered(undefined)}
        onPointerLeave={() => setHovered(undefined)}
        // `justify-start`, so once the bars hit their max width the leftover room is at the end
        // rather than spread between them — the gap says "next request", not "some time passed".
        className="flex items-end justify-start overflow-x-auto overflow-y-clip rounded-lg border border-border bg-muted/30 px-2 pb-6 pt-3"
        style={{ height: CHART_PX, gap: BAR_GAP_PX }}
      >
        {bars.map((bar, index) => (
          <Bar
            key={bar.id}
            bar={bar}
            marked={marks.some((mark) => mark.index === index)}
            active={hovered?.bar.id === bar.id}
            onEnter={enter}
          />
        ))}
      </div>

      {hovered && (
        <HoverBubble x={hovered.x} y={hovered.y} frameWidth={hovered.frameWidth}>
          <BubbleText bar={hovered.bar} metric={metric} format={format} />
        </HoverBubble>
      )}
    </div>
  );
};

interface BarProps {
  bar: TurnBar;
  // A skill was loaded at this turn. The tick sits in the row's bottom padding, under the axis.
  marked: boolean;
  active: boolean;
  onEnter: (bar: TurnBar, element: HTMLElement) => void;
}

const Bar = ({ bar, marked, active, onEnter }: BarProps) => (
  // `flex-1` between the two bounds: the bars share the row, stop shrinking at the min so a long
  // session scrolls rather than turning into a texture, and stop growing at the max so a short one
  // stays a timeline rather than becoming four fat columns.
  <div
    onPointerEnter={(event) => onEnter(bar, event.currentTarget)}
    className="relative h-full flex-1 cursor-default"
    style={{ minWidth: MIN_BAR_PX, maxWidth: MAX_BAR_PX }}
  >
    <div
      className={`absolute bottom-0 w-full rounded-sm transition-colors ${
        active ? 'bg-[var(--surface-accent,var(--foreground))]' : 'usage-fill'
      }`}
      style={{ height: `max(${FLOOR_PX}px, ${bar.height * 100}%)` }}
    />
    {marked && (
      <span
        aria-hidden
        className="absolute -bottom-3 left-1/2 h-2 w-px -translate-x-1/2 bg-muted-foreground"
      />
    )}
  </div>
);

interface BubbleTextProps {
  bar: TurnBar;
  metric: UsageMetric;
  format: (value: number) => string;
}

// The number first, since that's what the bar is. The time and the model are the context for it, and
// the skill only appears when one was running — most turns have none.
const BubbleText = ({ bar, metric, format }: BubbleTextProps) => (
  <>
    <span className="font-medium text-foreground">{format(bar.value)}</span>
    <span className="text-muted-foreground">
      {' '}
      {METRIC_LABEL[metric].toLowerCase()} · {clockTime(bar.at)}
      {bar.model ? ` · ${bar.model}` : ''}
      {bar.skill ? ` · ${bar.skill}` : ''}
    </span>
  </>
);

// Local time to the minute. The session is the reader's own and the date is on the row they came
// from, so the hour is the part that places a turn inside it.
const clockTime = (at: number): string =>
  new Date(at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
