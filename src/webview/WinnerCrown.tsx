import { Crown } from 'lucide-react';
import { SkillEntry } from '../model/types';
import { SkillLink } from './SkillLink';
import { Z } from './z-layers';

interface WinnerCrownProps {
  // The same-named skills the selected one wins over.
  shadowed: SkillEntry[];
  onSelectSkill: (path: string) => void;
}

// The winning side of a name collision, as a crown beside the name. Hover or focus opens the card
// naming what it beat — otherwise the winning skill looks unremarkable and you never learn a copy
// of it is being ignored.
export const WinnerCrown = ({ shadowed, onSelectSkill }: WinnerCrownProps) => {
  if (shadowed.length === 0) return null;

  return (
    <span className="group relative inline-flex">
      {/* Not a button: nothing happens on click, and the links live inside the card. Tabbing here
          opens it via group-has-focus-visible, and tabbing on walks into those links. */}
      <span
        tabIndex={0}
        aria-describedby={CARD_ID}
        className="inline-flex cursor-default rounded-sm text-muted-foreground group-hover:text-foreground group-has-focus-visible:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Crown className="size-4" />
        <span className="sr-only">
          wins over {shadowed.length} same-named {plural(shadowed.length)}
        </span>
      </span>

      {/* `pt-1.5` rather than a margin, so the gap under the crown is still inside the group and
          the card survives the mouse crossing it. The width backs off in a narrow panel: the pane
          is the viewport less the list and the padding, and `overflow-x-clip` would cut the
          rest. */}
      <div
        id={CARD_ID}
        style={{ zIndex: Z.card }}
        className="invisible absolute left-0 top-full w-[min(24rem,calc(100vw-22rem))] pt-1.5 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-has-focus-visible:visible group-has-focus-visible:opacity-100"
      >
        <div className="flex flex-col items-start gap-1 rounded-md border border-border bg-popover p-3 text-xs shadow-lg">
          <span>
            Wins over {shadowed.length} same-named {plural(shadowed.length)}. Claude runs this one.
          </span>
          {shadowed.map((other) => (
            <SkillLink key={other.path} skill={other} onSelectSkill={onSelectSkill} />
          ))}
        </div>
      </div>
    </span>
  );
};

// One card per detail pane — only the selected skill ever renders a crown.
const CARD_ID: string = 'winner-crown-card';

const plural = (count: number): string => (count === 1 ? 'skill' : 'skills');
