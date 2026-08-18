interface EyesProps {
  // Extra classes for the pair, so a mood that draws both sets can tell them apart in CSS.
  className?: string;
}

// The icon's own eyes: two pills, 2 units wide and 4 tall including their round caps. Every mood
// that isn't saying something with its eyes uses these.
//
// The left/right classes are what a blink needs — under `transform-box: view-box` a
// `transform-origin` is a position in the picture, so each eye's own middle has to be named.
export const OpenEyes = ({ className = '' }: EyesProps) => (
  <>
    <path className={`bot-eye bot-eye-left ${className}`} d="M13 17v2" />
    <path className={`bot-eye bot-eye-right ${className}`} d="M19 17v2" />
  </>
);

// Shut: two deep Us. Cubics rather than quadratics, 3 units wide rather than 2, and drawn at 1.5
// rather than the icon's 2 — all three are the same problem. A stroke bent through 180 degrees lays
// three times the ink of a straight tick over the same span, so at the icon's width the two sides
// overlap for their whole length and the round caps leave a notch between them at the top, which is
// a heart. A cubic with both handles straight down also gets a belly of three quarters of the
// control offset where a quadratic gets half.
//
// 3 is as wide as they go: the eyes sit 6 apart and the head's inside is 14 across, so any wider
// and the two strokes meet in the middle.
export const ShutEyes = ({ className = '' }: EyesProps) => (
  <>
    <path
      className={`bot-eye ${className}`}
      strokeWidth={1.5}
      d="M11.5 16.2C11.5 19.2 14.5 19.2 14.5 16.2"
    />
    <path
      className={`bot-eye ${className}`}
      strokeWidth={1.5}
      d="M17.5 16.2C17.5 19.2 20.5 19.2 20.5 16.2"
    />
  </>
);

// The icon's eyes, shorter and dropped a unit — heads down, looking at the work rather than out at
// you. Their middle is y=19 where every other pair's is 18, so whichever mood uses these has to move
// the blink's `transform-origin` down with them, or the eye scales about a point above itself and
// climbs as it shuts.
export const LoweredEyes = ({ className = '' }: EyesProps) => (
  <>
    <path className={`bot-eye bot-eye-left ${className}`} d="M13 18.2v1.6" />
    <path className={`bot-eye bot-eye-right ${className}`} d="M19 18.2v1.6" />
  </>
);
