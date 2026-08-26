import { useId } from 'react';

interface CodexMarkProps {
  className?: string;
}

// Codex's own mark — the rounded square with a `>_` prompt knocked out of it, which is what the
// Codex app and the CLI are badged with. Deliberately not OpenAI's blossom: the ChatGPT extension
// ships that as its view-container icon, but it says "OpenAI" where the other two marks here say
// Claude and Copilot.
//
// The one mark in this folder not copied off disk, because there is no vector of it to copy. The
// extension carries it only as `webview/assets/codex-app-ga-logo-*.png` — 104px and gradient-filled
// — and every SVG beside it is the blossom. So the geometry is drawn to match that raster, which a
// flat single-colour mark has to be anyway.
//
// The square is inset to ~77% of the box rather than filling it, the same correction `CopilotMark`
// makes with its padded viewBox and for the same reason: a solid shape reads heavier than Claude's
// thin spokes at an equal box.
const BLOB: string =
  'M8.6 2.8H15.4C18.3 2.8 21.2 5.7 21.2 8.6V15.4C21.2 18.3 18.3 21.2 15.4 21.2H8.6C5.7 21.2 2.8 18.3 2.8 15.4V8.6C2.8 5.7 5.7 2.8 8.6 2.8Z';

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
        <g fill="none" stroke="black" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.6 9.1 11.5 12 8.6 14.9" />
          <path d="M13.2 14.9h2.6" />
        </g>
      </mask>
      <path fill="currentColor" mask={`url(#${maskId})`} d={BLOB} />
    </svg>
  );
};
