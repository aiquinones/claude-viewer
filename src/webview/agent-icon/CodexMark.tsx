import { useId } from 'react';

interface CodexMarkProps {
  className?: string;
}

interface Lobe {
  cx: number;
  cy: number;
  r: number;
}

// Codex's own mark — the scalloped cloud with a `>_` prompt knocked out of it. Deliberately not
// OpenAI's blossom: the ChatGPT extension ships that as its view-container icon, but it says
// "OpenAI" where the other two marks here say Claude and Copilot.
//
// The one mark in this folder not copied off disk, because there is no vector of it to copy. The
// extension carries it only as `webview/assets/codex-app-ga-logo-*.png` — 104px and gradient-filled
// — and every SVG beside it is the blossom. So the geometry is measured off that raster: the blob
// is its alpha bounding box, and the prompt is the near-neutral bright pixels inside it, which the
// blue separates cleanly. Everything below is stated as a fraction of the blob's own box, which is
// what makes those two readings comparable.

// The cloud is a union of circles rather than one outline: that's what the shape is, and drawing it
// as circles needs no path arithmetic and nothing to check that arithmetic against. They merge on
// sight because every one of them is the same opaque `currentColor`.
//
// Seven lobes at 5.96 from the centre, radius 3.84, so the mark reaches 9.8 of the 12 available —
// a wider box than a solid shape would take, because a scalloped one covers about a third of it
// where a rounded square covers half. CENTRE fills the middle at 6.53, well inside the 8.55 valley
// between two adjacent lobes, so it never reaches the outline.
//
// The lobes start at -100° rather than straddling the vertical. The real mark is asymmetric, and a
// rosette symmetric about its own centre line reads as a gear.
const CENTRE: Lobe = { cx: 12, cy: 12, r: 6.53 };

const LOBES: Lobe[] = [
  { cx: 10.97, cy: 6.13, r: 3.84 },
  { cx: 15.94, cy: 7.53, r: 3.84 },
  { cx: 17.95, cy: 12.3, r: 3.84 },
  { cx: 15.48, cy: 16.84, r: 3.84 },
  { cx: 10.39, cy: 17.74, r: 3.84 },
  { cx: 6.51, cy: 14.32, r: 3.84 },
  { cx: 6.77, cy: 9.15, r: 3.84 }
];

// The prompt sits where the measurement puts it on the vertical axis and on the underscore, and
// departs from it twice on the horizontal — both times for the same reason, that this draws at
// 12–16px where the logo was drawn for an app icon.
//
// The real stroke is 0.066 of the blob's width, which is half a device pixel at the 12px size and
// washes out; STROKE is 2, about 0.102. That thickening eats into the space between the two glyphs,
// so the underscore moves right by exactly what the caps gained — the *clear gap* is the measured
// 0.099 of blob width, rather than the centres being the measured distance apart.
//
// The chevron is measured at 1 wide to 1.92 tall, which at 12px is 0.65px of horizontal travel and
// reads as a vertical bar. Its run is 1.9 here rather than 1.29, so 1 to 1.29 — still clearly
// taller than wide, which is the part of its character that survives being small.
const STROKE: number = 2;
const CHEVRON: string = 'M7.2 9.45 9.1 11.9 7.2 14.35';
const UNDERSCORE: string = 'M13.04 14.45h3.66';

// Knocked out through a mask rather than an even-odd path: the prompt is two round-capped strokes,
// and outlining those by hand is arithmetic with nothing to check it against. The id is per-instance
// because a list draws many of these — `useId`'s colons come out, since they aren't worth relying on
// inside a `url(#…)`.
//
// `aria-hidden` because the icon never names itself. `AgentToolIcon` wraps it in the element that
// carries the label, so the name is said once.
export const CodexMark = ({ className }: CodexMarkProps) => {
  const maskId: string = `codex-prompt-${useId().replace(/:/g, '')}`;

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <g
          fill="none"
          stroke="black"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={CHEVRON} />
          <path d={UNDERSCORE} />
        </g>
      </mask>
      <g fill="currentColor" mask={`url(#${maskId})`}>
        <circle cx={CENTRE.cx} cy={CENTRE.cy} r={CENTRE.r} />
        {LOBES.map((lobe) => (
          <circle key={`${lobe.cx},${lobe.cy}`} cx={lobe.cx} cy={lobe.cy} r={lobe.r} />
        ))}
      </g>
    </svg>
  );
};
