import { Crown, EyeOff } from 'lucide-react';
import { SkillEntry } from '../model/types';
import { Button } from '@/components/ui/button';

interface ShadowNoticeProps {
  // The same-named skill that wins, when the selected one is shadowed.
  winner: SkillEntry | undefined;
  // The same-named skills the selected one wins over.
  shadowed: SkillEntry[];
  onSelectSkill: (path: string) => void;
}

// Both halves of a name collision, from whichever side you're standing on. The loser points at
// the winner and the winner points back — otherwise the winning skill looks unremarkable and you
// never learn a copy of it is being ignored.
export const ShadowNotice = ({ winner, shadowed, onSelectSkill }: ShadowNoticeProps) => {
  if (!winner && shadowed.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-muted p-3 text-xs">
      {winner && (
        <div className="flex items-start gap-2">
          <EyeOff className="mt-0.5 size-3.5 shrink-0" />
          <div className="flex flex-col items-start gap-1">
            <span>
              Shadowed by the <strong>{winner.scope}</strong> skill of the same name. Claude runs
              that one, not this.
            </span>
            <SkillLink skill={winner} onSelectSkill={onSelectSkill} />
          </div>
        </div>
      )}

      {shadowed.length > 0 && (
        <div className="flex items-start gap-2">
          <Crown className="mt-0.5 size-3.5 shrink-0" />
          <div className="flex flex-col items-start gap-1">
            <span>
              Wins over {shadowed.length} same-named{' '}
              {shadowed.length === 1 ? 'skill' : 'skills'}. Claude runs this one.
            </span>
            {shadowed.map((other) => (
              <SkillLink key={other.path} skill={other} onSelectSkill={onSelectSkill} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Jumps to the other skill's detail inside the panel rather than opening the file.
const SkillLink = ({
  skill,
  onSelectSkill
}: {
  skill: SkillEntry;
  onSelectSkill: (path: string) => void;
}) => (
  <Button
    variant="link"
    size="sm"
    className="h-auto justify-start p-0 text-xs"
    onClick={() => onSelectSkill(skill.path)}
  >
    <span className="mono break-all text-left">{skill.path}</span>
  </Button>
);
