import { Paperclip, SquareArrowOutUpRight } from 'lucide-react';
import { SkillEntry } from '../model/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IssueList } from './IssueList';
import { ScopeBadge } from './ScopeBadge';
import { ShadowNotice } from './ShadowNotice';
import { SkillCost } from './SkillCost';

interface SkillDetailProps {
  skill: SkillEntry;
  // The same-named skill that wins, when this one is shadowed.
  winner: SkillEntry | undefined;
  onOpenFile: (path: string) => void;
  onSelectSkill: (path: string) => void;
}

export const SkillDetail = ({
  skill,
  winner,
  onOpenFile,
  onSelectSkill
}: SkillDetailProps) => (
  <div className="flex flex-col gap-5">
    <header className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-base font-semibold">{skill.name}</h1>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          title="Open SKILL.md"
          onClick={() => onOpenFile(skill.path)}
        >
          <SquareArrowOutUpRight className="size-3.5" />
          <span className="sr-only">Open SKILL.md</span>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ScopeBadge scope={skill.scope} pluginName={skill.pluginName} />
        {skill.bundledFiles > 0 && (
          <Badge variant="muted">
            <Paperclip className="mr-1 inline size-3" />
            {skill.bundledFiles} bundled
          </Badge>
        )}
      </div>
    </header>

    <ShadowNotice winner={winner} onSelectSkill={onSelectSkill} />

    <IssueList issues={skill.issues} />

    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Description
      </h2>
      {/* Verbatim and never truncated — this string is the only thing Claude reads when deciding
          whether to use the skill. */}
      {skill.description ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{skill.description}</p>
      ) : (
        <p className="text-sm italic text-muted-foreground">none</p>
      )}
    </section>

    <SkillCost skill={skill} />
  </div>
);
