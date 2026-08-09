import { EyeOff } from 'lucide-react';
import { SkillEntry } from '../model/types';
import { SkillLink } from './SkillLink';

interface ShadowNoticeProps {
  // The same-named skill that wins, when the selected one is shadowed.
  winner: SkillEntry | undefined;
  onSelectSkill: (path: string) => void;
}

// The losing side of a name collision. It stays a full-width box rather than an icon, because
// "Claude runs that one, not this" is the one thing about the skill you can't afford to miss —
// the winning side is a crown in the header, where it's a footnote instead.
export const ShadowNotice = ({ winner, onSelectSkill }: ShadowNoticeProps) => {
  if (!winner) return null;

  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-muted p-3 text-xs">
      <EyeOff className="mt-0.5 size-3.5 shrink-0" />
      <div className="flex flex-col items-start gap-1">
        <span>
          Shadowed by the <strong>{winner.scope}</strong> skill of the same name. Claude runs that
          one, not this.
        </span>
        <SkillLink skill={winner} onSelectSkill={onSelectSkill} />
      </div>
    </div>
  );
};
