import { PointerEvent, useId, useRef, useState } from 'react';
import { HoverBubble } from '../../HoverBubble';
import { clockTime, loadedNames } from './chart-labels';
import { ChartGuides } from './ChartGuides';
import { ChartGuide } from './context-guides';
import {
  areaPath,
  buildScale,
  gridYs,
  linePath,
  nearestIndex,
  PLOT_HEIGHT,
  PLOT_PAD,
  PlotBox,
  Scale,
  xTickIndices
} from './geometry';
import { LoadDot } from './LoadDot';
import { LoadPoint, SeriesPoint } from './series';
import { useChartWidth } from './useChartWidth';

// How many bands the grid divides the plot into. Unlabelled — the numbers are in the hover card — so
// they're there to give the curve something to be read against, which leaves the thresholds as the
// only labelled lines on the chart.
const GRID_LINES: number = 4;

// The narrowest two clock labels sit before one of them is dropped. Sized for the widest a locale
// makes one — `10:24 AM` rather than `10:24` — since the axis can't measure its own text.
const MIN_TICK_GAP_PX: number = 100;

// About half of that, for deciding whether a label at the edge has to hang inward instead of
// centring on its point.
const LABEL_HALF_PX: number = 34;

interface SessionChartProps {
  points: SeriesPoint[];
  // Where a skill's body entered the context, by point index.
  loads: LoadPoint[];
  // Horizontal rules across the plot. The context chart's two thresholds; the metric chart has none.
  guides?: ChartGuide[];
  // What the top of the plot means. The caller's, because the two charts scale on different rules.
  max: number;
  // How a value prints. Cost is dollars on a Claude session and AIU on a Copilot one, so the caller
  // passes the formatter rather than this guessing from the series.
  format: (value: number) => string;
  // What one value is, for the hover card — "output tokens", "context".
  unit: string;
  empty: string;
}

// Every request the session made, oldest first, as a filled curve. The x axis is the request's index
// rather than its clock: the gap between two points says "next request", not "some time passed", and
// the labels under it say when each one was.
export const SessionChart = ({
  points,
  loads,
  guides = [],
  max,
  format,
  unit,
  empty
}: SessionChartProps) => {
  const frame = useRef<HTMLDivElement>(null);
  const width: number = useChartWidth(frame);
  // Two charts are on the page and each fills from its own gradient, so the id can't be a constant.
  const gradientId: string = useId();
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  const box: PlotBox = { width, height: PLOT_HEIGHT };
  const scale: Scale = buildScale({ count: points.length, max, box });
  const right: number = Math.max(PLOT_PAD.left, width - PLOT_PAD.right);

  const move = (event: PointerEvent<SVGSVGElement>): void => {
    const rect: DOMRect = event.currentTarget.getBoundingClientRect();
    setHovered(nearestIndex({ x: event.clientX - rect.left, count: points.length, scale }));
  };

  const anchorFor = (x: number): 'start' | 'middle' | 'end' =>
    x - LABEL_HALF_PX < 0 ? 'start' : x + LABEL_HALF_PX > width ? 'end' : 'middle';

  const active: SeriesPoint | undefined = hovered === undefined ? undefined : points[hovered];

  return (
    // The box is the measured frame, and it clips nothing. `clientWidth` is the content width, so
    // the svg fits it exactly rather than losing two pixels to the border — and with no overflow
    // rule the bubble is free to hang above it, which is what a clipping box would take away. The
    // svg clips its own content, so a load dot's halo at either end stays inside.
    <div
      ref={frame}
      className="relative rounded-lg border border-border bg-muted/30"
      style={{ height: PLOT_HEIGHT }}
    >
      {points.length === 0 ? (
        <p className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <>
          {width > 0 && (
            <svg
              width={width}
              height={PLOT_HEIGHT}
              viewBox={`0 0 ${width} ${PLOT_HEIGHT}`}
              onPointerMove={move}
              onPointerLeave={() => setHovered(undefined)}
              role="img"
              aria-label={`${points.length} requests, up to ${format(max)} ${unit}`}
              className="block"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" className="chart-area-top" />
                  <stop offset="100%" className="chart-area-bottom" />
                </linearGradient>
              </defs>

              {/* Solid and faint, where the thresholds are dashed and coloured — a grid that looked
                  like a guide would leave the reader counting which line meant something. */}
              {gridYs({ scale, lines: GRID_LINES }).map((y) => (
                <line
                  key={y}
                  x1={PLOT_PAD.left}
                  x2={right}
                  y1={y}
                  y2={y}
                  strokeWidth={1}
                  className="stroke-border opacity-60"
                />
              ))}

              {xTickIndices({ count: points.length, scale, minGapPx: MIN_TICK_GAP_PX }).map(
                (index) => (
                  <text
                    key={points[index].id}
                    x={scale.x(index)}
                    y={PLOT_HEIGHT - 5}
                    textAnchor={anchorFor(scale.x(index))}
                    className="fill-muted-foreground text-[10px] tabular-nums"
                  >
                    {clockTime(points[index].at)}
                  </text>
                )
              )}

              <path d={areaPath({ points, scale })} fill={`url(#${gradientId})`} />
              <path
                d={linePath({ points, scale })}
                fill="none"
                strokeWidth={1.5}
                strokeLinecap="round"
                className="chart-line"
              />

              <ChartGuides guides={guides} scale={scale} width={width} />

              {loads.map((load) => (
                <LoadDot
                  key={points[load.index].id}
                  x={scale.x(load.index)}
                  y={scale.y(points[load.index].value)}
                />
              ))}

              {active && hovered !== undefined && (
                <g>
                  <line
                    x1={scale.x(hovered)}
                    x2={scale.x(hovered)}
                    y1={PLOT_PAD.top}
                    y2={scale.baseline}
                    strokeWidth={1}
                    className="stroke-muted-foreground opacity-50"
                  />
                  <circle
                    cx={scale.x(hovered)}
                    cy={scale.y(active.value)}
                    r={3.5}
                    className="chart-cursor"
                  />
                </g>
              )}
            </svg>
          )}
        </>
      )}

      {active && hovered !== undefined && (
        <HoverBubble x={scale.x(hovered)} y={scale.y(active.value)} frameWidth={width}>
          <BubbleText
            point={active}
            unit={unit}
            format={format}
            load={loads.find((entry) => entry.index === hovered)}
          />
        </HoverBubble>
      )}
    </div>
  );
};

interface BubbleTextProps {
  point: SeriesPoint;
  unit: string;
  format: (value: number) => string;
  load: LoadPoint | undefined;
}

// The number first, since that's what the curve is, with the time beside it. The model is a line of
// its own — it's the longest thing in here and the least often looked at, so it set the width of the
// bubble while riding on the number's line. The skill names only appear where one was loaded, which
// is what the dot under the pointer is asking about; they need no label, since a name in the accent
// colour under a dot you're hovering isn't ambiguous.
const BubbleText = ({ point, unit, format, load }: BubbleTextProps) => (
  <>
    <span className="font-medium text-foreground">{format(point.value)}</span>
    <span className="text-muted-foreground">
      {' '}
      {unit} · {clockTime(point.at)}
    </span>
    {point.model && <span className="block text-muted-foreground">{point.model}</span>}
    {load && (
      <span className="mt-1 block">
        {loadedNames(load.skills).map((name) => (
          <span key={name} className="chart-load-note block">
            {name}
          </span>
        ))}
      </span>
    )}
  </>
);
