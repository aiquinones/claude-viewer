import { EllipsisVertical } from 'lucide-react';
import { Reveal, SkillEntry } from '../model/types';
import { cn } from './lib/utils';
import { SkillList } from './SkillList';

interface SkillNavProps {
  skills: SkillEntry[];
  selectedPath: string | undefined;
  reveal?: Reveal;
  onSelect: (skill: SkillEntry) => void;
}

// The strip you aim at when the panel is parked. Wide enough to hit without care.
const RAIL_WIDTH: string = 'w-4';

// The skills list. At `md` and up it's a column of SkillView's grid; under that it lifts out of the
// grid, parks off the left edge and slides back when you hover the rail — so a narrow panel spends
// its width on the skill body. `focus-within` is the same door for the keyboard.
//
// Rail and panel are siblings rather than a wrapped pair: `peer-hover` reads across siblings, and
// a wrapper under `md` would have to be `display: contents` to stay out of the grid.
export const SkillNav = ({ skills, selectedPath, reveal, onSelect }: SkillNavProps) => (
  <>
    <Rail />

    <div
      className={cn(
        'skill-nav absolute inset-y-0 left-0 z-20 w-60 -translate-x-full',
        'overflow-y-auto overflow-x-clip border-r border-border bg-background py-3 shadow-lg',
        'hover:translate-x-0 focus-within:translate-x-0 peer-hover/rail:translate-x-0',
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

// Sits under the panel, so sliding the list over hides the rail and its border can never draw a
// line down the middle of the list.
const Rail = () => (
  <div
    className={cn(
      'peer/rail absolute inset-y-0 left-0 z-10 flex items-center justify-center md:hidden',
      'border-r border-border text-muted-foreground',
      RAIL_WIDTH
    )}
  >
    <EllipsisVertical className="size-4" />
  </div>
);
