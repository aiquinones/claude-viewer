import { ReactNode } from 'react';
import { SkillEntry } from '../model/types';

interface SkillHoverCardProps {
  skill: SkillEntry;
  // Extra classes for the wrapper. A name in a table row has to be allowed to shrink; a chip in a
  // wrapping row must not.
  className?: string;
  children: ReactNode;
}

// What a skill is for, on hover. Wraps whatever names the skill — a chip in the flow view, a row
// label on the usage surface — so both get the same card and neither owns it.
//
// Not `Tooltip`: that one is `whitespace-nowrap` because it holds a label and a key cap, and a
// description is a paragraph. Same hover mechanics, a box that wraps.
export const SkillHoverCard = ({ skill, className = '', children }: SkillHoverCardProps) => (
  <span className={`group relative inline-flex ${className}`}>
    {children}

    <span
      role="tooltip"
      className="pointer-events-none absolute left-0 top-full z-30 mt-1 w-64 rounded-md border border-border bg-popover p-2 text-xs leading-relaxed text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
    >
      <span className="mono block font-semibold text-foreground">{skill.name}</span>
      <span className="mt-1 block text-muted-foreground">
        {skill.description || 'no description'}
      </span>
    </span>
  </span>
);
