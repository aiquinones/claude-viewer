import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Reveal, SkillEntry } from '../model/types';
import { cn } from './lib/utils';
import { SkillList } from './SkillList';

// What the collapsed nav leaves behind on the left edge. Which one reads best is a look-at-it
// question, so all three are here and SkillNav.stories.tsx puts them side by side.
export const RAIL_VARIANTS = ['line', 'grip', 'chevron'] as const;
export type RailVariant = (typeof RAIL_VARIANTS)[number];

interface SkillNavProps {
  skills: SkillEntry[];
  selectedPath: string | undefined;
  reveal?: Reveal;
  onSelect: (skill: SkillEntry) => void;
  rail?: RailVariant;
}

// The strip you aim at when the panel is parked.
const RAIL_WIDTH: string = 'w-2.5';

// The skills list. At `md` and up it's a column of SkillView's grid; under that it lifts out of the
// grid, parks off the left edge and slides back when you hover the rail — so a narrow panel spends
// its width on the skill body. `focus-within` is the same door for the keyboard.
//
// Rail and panel are siblings rather than a wrapped pair: `peer-hover` reads across siblings, and
// a wrapper under `md` would have to be `display: contents` to stay out of the grid.
export const SkillNav = ({
  skills,
  selectedPath,
  reveal,
  onSelect,
  rail = 'line'
}: SkillNavProps) => {
  const [pinned, setPinned] = useState<boolean>(false);

  return (
    <>
      <Rail variant={rail} pinned={pinned} onToggle={() => setPinned(!pinned)} />

      <div
        data-pinned={pinned}
        className={cn(
          'skill-nav absolute inset-y-0 left-0 z-20 w-60 -translate-x-full',
          'overflow-y-auto overflow-x-clip border-r border-border bg-background py-3 shadow-lg',
          'hover:translate-x-0 focus-within:translate-x-0 peer-hover/rail:translate-x-0',
          'data-[pinned=true]:translate-x-0',
          // Back to an ordinary grid column, and the rail stops existing.
          'md:static md:h-full md:w-auto md:min-w-0 md:translate-x-0 md:shadow-none'
        )}
      >
        <SkillList
          skills={skills}
          selectedPath={selectedPath}
          reveal={reveal}
          onSelect={onSelect}
        />
      </div>
    </>
  );
};

interface RailProps {
  variant: RailVariant;
  pinned: boolean;
  onToggle: () => void;
}

// Line and grip sit under the panel, so sliding it out hides them and their border can never draw
// a line down the list. The chevron has to stay clickable to un-pin, so it rides above instead —
// over the list's left padding, and without a border for the same reason.
const Rail = ({ variant, pinned, onToggle }: RailProps) => {
  const base: string = cn('peer/rail absolute inset-y-0 left-0 md:hidden', RAIL_WIDTH);

  if (variant === 'chevron') {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={pinned}
        aria-label={pinned ? 'Unpin the skills list' : 'Pin the skills list open'}
        className={cn(
          base,
          'z-30 flex cursor-pointer items-center justify-center',
          'text-muted-foreground hover:text-foreground'
        )}
      >
        <ChevronRight className={cn('size-3.5 transition-transform', pinned && 'rotate-180')} />
      </button>
    );
  }

  return (
    <div className={cn(base, 'z-10 flex items-center justify-center border-r border-border')}>
      {variant === 'grip' && <span className="h-8 w-px rounded-full bg-muted-foreground/50" />}
    </div>
  );
};
