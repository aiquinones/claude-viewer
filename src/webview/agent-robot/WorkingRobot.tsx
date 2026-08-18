import { RobotHead } from './RobotHead';

// Heads down and frowning at it, with a page beside the head filling up. Three lines of scribble
// draw themselves one after another; once the third is down the sheet slides away and a blank one
// drops in from the stack behind, and it starts again. The only mood where something is actually
// being produced, so it's the only one whose aside changes rather than just pulsing.
//
// The eyes lean towards each other — the frown — and blink on the same clock as everyone else's.
// This is the pair that fuses into a single V by the time the row is 8px tall; see the Working eyes
// story, which keeps the alternatives around to look at.
export const WorkingRobot = () => (
  <RobotHead
    face={
      <>
        <path className="bot-eye bot-eye-left" d="M12.6 16.6 13.8 19" />
        <path className="bot-eye bot-eye-right" d="M19.4 16.6 18.2 19" />
      </>
    }
    aside={
      <>
        {/* The next sheet, showing as two edges behind the top right corner of the current one.
            Drawn first so it stays behind, and it never moves — it's the stack, not a page.

            The page's bottom edge stops at 16, which is as low as it goes: the right ear's stroke
            reaches y=19 from its centre line at 18, and the two were touching at 17.5. */}
        <path className="bot-stack" strokeWidth={1.2} d="M26.1 6.9H33.4V15.5" />

        <g className="bot-page">
          <rect strokeWidth={1.2} x={25.6} y={7.4} width={7.6} height={8.6} rx={0.6} />
          <Scribble className="bot-scribble bot-scribble--1" top={8.9} bottom={10.3} />
          <Scribble className="bot-scribble bot-scribble--2" top={11.3} bottom={12.7} />
          <Scribble className="bot-scribble bot-scribble--3" top={13.7} bottom={15.1} />
        </g>
      </>
    }
  />
);

interface ScribbleProps {
  className: string;
  // The two heights the zigzag alternates between. Naming them beats six near-identical numbers in
  // a `d` string that has to stay in sync with the two lines above and below it.
  //
  // Keep them at least twice `strokeWidth` apart. A wave shallower than the pen drawing it fills
  // itself in and the line reads as a solid bar rather than as handwriting.
  top: number;
  bottom: number;
}

// One line of handwriting: four strokes of a W across the page. `pathLength={1}` normalises it, so
// the stylesheet can draw it on with a `stroke-dashoffset` from 1 to 0 without knowing how long the
// path actually is — and all three lines use the same numbers despite being different lengths.
const Scribble = ({ className, top, bottom }: ScribbleProps) => (
  <path
    className={className}
    pathLength={1}
    strokeWidth={0.7}
    d={`M26.4 ${bottom} 27.9 ${top} 29.4 ${bottom} 30.9 ${top} 32.4 ${bottom}`}
  />
);
