import { CSSProperties } from 'react';

interface RobotProps {
  // How long between one gesture and the next. A tick passes and it blinks, a tick passes and it
  // looks to the sides — so a full round trip is two of these.
  tickMs?: number;
  className?: string;
}

// Fast enough to read as awake without being twitchy. The animation is one variable, so this is
// the only number to change.
const DEFAULT_TICK_MS: number = 1000;

// The extension's own icon, inline. Same paths as `resources/activity-bar.svg` — that file is the
// one VS Code draws, this is the one React does, and only this one can take a tick from a prop.
export const Robot = ({ tickMs = DEFAULT_TICK_MS, className = 'size-12' }: RobotProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={`robot ${className}`}
    style={{ '--robot-tick': `${tickMs}ms` } as CSSProperties}
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path className="robot-eye robot-eye-left" d="M9 13v2" />
    <path className="robot-eye robot-eye-right" d="M15 13v2" />
  </svg>
);
