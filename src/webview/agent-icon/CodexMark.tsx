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
// — and every SVG beside it is the blossom. So the geometry is drawn to match that raster, which a
// flat single-colour mark has to be anyway.

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
        <g fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.8 8.4 10 11.4 6.8 14.4" />
          <path d="M12.6 14.4h4.3" />
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
