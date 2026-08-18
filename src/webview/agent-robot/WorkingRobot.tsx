import { OpenEyes } from './Eyes';
import { RobotHead } from './RobotHead';

// Heads down and frowning at it, with a pad beside the head filling up. Three lines of scribble draw
// themselves on one after another; once the third is down the sheet lifts away and the next one is
// already there underneath. The only mood whose aside changes rather than just pulsing, which is
// right — it's the only one producing anything.
//
// The frown is a brow over the icon's own eye, which is the part that blinks. The eyes sit exactly
// where every other mood puts them and the brows come down to meet them — a brow crosses its eye's x
// at y=15.3, so its lower edge is 16.1 against an eye whose cap reaches 16. One slanted stroke doing
// both jobs was the earlier version, and it read as a single V by the time the row was 8px tall.
export const WorkingRobot = () => (
  <RobotHead
    face={
      <>
        <path className="bot-brow" strokeWidth={1.6} d="M11.8 14.9 14.2 15.7" />
        <path className="bot-brow" strokeWidth={1.6} d="M20.2 14.9 17.8 15.7" />
        <OpenEyes />
      </>
    }
    aside={
      <>
        {/* The next sheet. Invisible while there's a page in front of it, and fading up as that
            page lifts away — because the page is an outline with nothing inside, so anything drawn
            behind it shows straight through the writing. Nothing is behind it until there's nothing
            in front, which means there is only ever one sheet on screen at a time.

            It sits exactly where the page starts its cycle, so when the page comes back it lands on
            this rectangle and the two are the same outline going from 0.45 to full.

            The page's bottom edge stops at 16, which is as low as it goes: the right ear's stroke
            reaches y=19 from its centre line at 18, and the two were touching at 17.5. */}
        <rect
          className="bot-stack"
          strokeWidth={1.2}
          x={26.3}
          y={6.7}
          width={7}
          height={8.6}
          rx={0.6}
        />

        <g className="bot-page">
          <rect strokeWidth={1.2} x={25.6} y={7.4} width={7} height={8.6} rx={0.6} />
          <Scribble className="bot-scribble bot-scribble--1" top={9.2} bottom={10.4} />
          <Scribble className="bot-scribble bot-scribble--2" top={11.3} bottom={12.5} />
          <Scribble className="bot-scribble bot-scribble--3" top={13.4} bottom={14.6} />
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

// One line of handwriting: four strokes of a W across the page, inset far enough that it never
// touches the sheet's own edge — 0.7 of margin inside a border that is itself 1.2 thick.
//
// `pathLength={1}` normalises it, so the stylesheet can draw it on with a `stroke-dashoffset` from 1
// to 0 without knowing how long the path actually is.
const Scribble = ({ className, top, bottom }: ScribbleProps) => (
  <path
    className={className}
    pathLength={1}
    strokeWidth={0.7}
    d={`M26.9 ${bottom} 28 ${top} 29.1 ${bottom} 30.2 ${top} 31.3 ${bottom}`}
  />
);
