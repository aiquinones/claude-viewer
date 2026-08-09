import { SkillEntry } from '../model/types';
import { Button } from '@/components/ui/button';

interface SkillLinkProps {
  skill: SkillEntry;
  onSelectSkill: (path: string) => void;
}

// Jumps to the other skill's detail inside the panel rather than opening the file.
export const SkillLink = ({ skill, onSelectSkill }: SkillLinkProps) => (
  <Button
    variant="link"
    size="sm"
    className="h-auto justify-start p-0 text-xs"
    onClick={() => onSelectSkill(skill.path)}
  >
    <span className="mono break-all text-left">{skill.path}</span>
  </Button>
);
