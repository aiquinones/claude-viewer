import { ReactNode } from 'react';
import { SkillEntry } from '../model/types';
import { HoverCard, HoverCardBody, HoverCardTitle } from './HoverCard';

interface SkillHoverCardProps {
  skill: SkillEntry;
  // Extra classes for the wrapper. A name in a table row has to be allowed to shrink; a chip in a
  // wrapping row must not.
  className?: string;
  children: ReactNode;
}

// What a skill is for, on hover. Wraps whatever names the skill — a chip in the flow view, a row
// label on the usage surface — so both get the same card and neither owns it.
export const SkillHoverCard = ({ skill, className, children }: SkillHoverCardProps) => (
  <HoverCard
    className={className}
    card={
      <>
        <HoverCardTitle mono>{skill.name}</HoverCardTitle>
        <HoverCardBody>{skill.description || 'no description'}</HoverCardBody>
      </>
    }
  >
    {children}
  </HoverCard>
);
