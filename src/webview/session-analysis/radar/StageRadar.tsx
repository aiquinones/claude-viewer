import { PointerEvent, useId, useState } from 'react';
import { HoverBubble } from '../../HoverBubble';
import { plural } from '../../format-size';
import { SessionStage } from '../stages';
import {
  buildRadar,
  nearestSpoke,
  Radar,
  radarPath,
  RADAR_SIZE,
  RadarLabel,
  ringFractions,
  ringPath
} from './radar-geometry';
import { COMPACTED_NOTE } from './stage-labels';

// How many rings the grid draws. Three reads as a wheel without turning the middle into a target.
const RINGS: number = 3;

// About what one character of the label costs, at the 10px it's set in. Approximate on purpose:
// measuring text means laying it out, and being a character out only ever cuts one letter early.
const LABEL_CHAR_PX: number = 5.2;

interface StageRadarProps {
  title: string;
  stages: SessionStage[];
  // What this radar plots. The two differ only in this and in how they print — the component never
  // learns which of the two it is.
  read: (stage: SessionStage) => number;
  format: (value: number) => string;
  // What one value is, for the bubble — "output tokens", "context".
  unit: string;
}

// One session's stages on a wheel: a spoke per stage, reaching as far as that stage spent. A wheel
// rather than a third curve because a stage has no place on an axis of requests — what's being
// compared is a handful of named things, not a sequence. Never drawn empty: with no stages there is
// nothing to compare and the section says so instead, in words that depend on why.
export const StageRadar = ({ title, stages, read, format, unit }: StageRadarProps) => {
  const gradientId: string = useId();
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  // Clamped for the drawing only. A stage that gave context back reads as nothing spent rather than
  // as a spoke pointing inside out, and the bubble is where the real number still is.
  const values: number[] = stages.map((stage) => Math.max(read(stage), 0));
  const max: number = values.reduce((peak, value) => Math.max(peak, value), 0);
  const radar: Radar = buildRadar({ count: stages.length, max, size: RADAR_SIZE });

  const move = (event: PointerEvent<SVGSVGElement>): void => {
    const rect: DOMRect = event.currentTarget.getBoundingClientRect();
    setHovered(nearestSpoke({ x: event.clientX - rect.left, y: event.clientY - rect.top, radar }));
  };

  const active: SessionStage | undefined = hovered === undefined ? undefined : stages[hovered];

  // The card takes no width of its own: the svg is a fixed square and the padding goes around it,
  // so a width here would be that square *including* the padding and the plot would hang over the
  // border. The square is on the box the svg sits in instead.
  return (
    <section className="flex shrink-0 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
      <h3 className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>

      {/* The bubble hangs off this rather than off the card, so its coordinates are the svg's own. */}
      <div className="relative" style={{ width: RADAR_SIZE, height: RADAR_SIZE }}>
        <svg
          width={RADAR_SIZE}
          height={RADAR_SIZE}
          viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
          onPointerMove={move}
          onPointerLeave={() => setHovered(undefined)}
          role="img"
          aria-label={`${plural(stages.length, 'stage')}, up to ${format(max)} ${unit}`}
          className="block"
        >
          <defs>
            <radialGradient id={gradientId}>
              <stop offset="0%" className="chart-area-bottom" />
              <stop offset="100%" className="chart-area-top" />
            </radialGradient>
          </defs>

          <Grid radar={radar} />

          <path d={radarPath({ radar, values })} fill={`url(#${gradientId})`} />
          <path
            d={radarPath({ radar, values })}
            fill="none"
            strokeWidth={1.5}
            strokeLinejoin="round"
            className="chart-line"
          />

          {values.map((value, index) => (
            <circle
              key={stages[index].skill}
              cx={radar.valueAt({ index, value }).x}
              cy={radar.valueAt({ index, value }).y}
              r={index === hovered ? 4 : 2.5}
              className={index === hovered ? 'chart-cursor' : 'chart-load-core'}
            />
          ))}

          {stages.map((stage, index) => (
            <SpokeLabel
              key={stage.skill}
              label={radar.labelAt(index)}
              text={stage.label}
              lit={index === hovered}
            />
          ))}
        </svg>

        {active && hovered !== undefined && (
          <HoverBubble
            x={radar.valueAt({ index: hovered, value: values[hovered] }).x}
            y={radar.valueAt({ index: hovered, value: values[hovered] }).y}
            frameWidth={RADAR_SIZE}
          >
            <BubbleText stage={active} value={read(active)} unit={unit} format={format} />
          </HoverBubble>
        )}
      </div>
    </section>
  );
};

interface GridProps {
  radar: Radar;
}

// The rings and the spokes under the shape. Under three stages a ring is a line rather than a
// polygon, so it's drawn as a circle — the wheel still reads as a wheel with one spoke on it.
const Grid = ({ radar }: GridProps) => (
  <g className="stroke-border opacity-60" fill="none" strokeWidth={1}>
    {ringFractions({ rings: RINGS }).map((fraction) =>
      radar.count < 3 ? (
        <circle key={fraction} cx={radar.center} cy={radar.center} r={radar.radius * fraction} />
      ) : (
        <path key={fraction} d={ringPath({ radar, fraction })} />
      )
    )}

    {Array.from({ length: radar.count }, (_unused, index) => (
      <line
        key={index}
        x1={radar.center}
        y1={radar.center}
        x2={radar.pointAt({ index, fraction: 1 }).x}
        y2={radar.pointAt({ index, fraction: 1 }).y}
      />
    ))}
  </g>
);

interface SpokeLabelProps {
  label: RadarLabel;
  text: string;
  lit: boolean;
}

// One spoke's name, just outside the ring. `chart-label` outlines it in the panel background, since
// a label at the top or bottom of the wheel sits over the ring it names. It's cut to the room the
// geometry says that spoke has rather than to a fixed length — three o'clock has half the room
// twelve o'clock does, and one rule for both would either overflow one or waste the other. The
// hover carries the name in full.
const SpokeLabel = ({ label, text, lit }: SpokeLabelProps) => (
  <text
    x={label.x}
    y={label.y}
    textAnchor={label.anchor}
    dominantBaseline="middle"
    className={`chart-label text-[10px] ${lit ? 'fill-foreground' : 'fill-muted-foreground'}`}
  >
    {clip({ text, room: label.room })}
  </text>
);

interface ClipArgs {
  text: string;
  room: number;
}

const clip = ({ text, room }: ClipArgs): string => {
  const fits: number = Math.max(1, Math.floor(room / LABEL_CHAR_PX));
  return text.length > fits ? `${text.slice(0, fits - 1)}…` : text;
};

interface BubbleTextProps {
  stage: SessionStage;
  // The real value, which is what this prints — the shape is what was clamped.
  value: number;
  unit: string;
  format: (value: number) => string;
}

// The stage's name first and in full — the label on the spoke is cut to whatever room that spoke
// had, so this is the only place the whole name is. Then the number, the way the curves' bubble
// leads with it, and the skill under it: every stage is named something other than its skill now,
// so the skill is always worth saying.
const BubbleText = ({ stage, value, unit, format }: BubbleTextProps) => (
  <>
    <span className="block font-medium text-foreground">{stage.label}</span>
    <span className="font-medium text-foreground">{format(value)}</span>
    <span className="text-muted-foreground">
      {' '}
      {unit} · {plural(stage.turns, 'request')}
    </span>
    <span className="block text-muted-foreground">/{stage.skill}</span>
    {stage.stages > 1 && (
      <span className="block text-muted-foreground">{plural(stage.stages, 'stage')}</span>
    )}
    {value < 0 && <span className="block text-muted-foreground">{COMPACTED_NOTE}</span>}
  </>
);
