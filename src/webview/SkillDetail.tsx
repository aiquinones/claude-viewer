import { FileText, Paperclip } from 'lucide-react';
import { SkillEntry } from '../model/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IssueList } from './IssueList';
import { ScopeBadge } from './ScopeBadge';
import { ShadowNotice } from './ShadowNotice';

interface SkillDetailProps {
  skill: SkillEntry;
  // The same-named skill that wins, when this one is shadowed.
  winner: SkillEntry | undefined;
  // The same-named skills this one wins over.
  shadowed: SkillEntry[];
  onOpenFile: (path: string) => void;
  onSelectSkill: (path: string) => void;
}

export const SkillDetail = ({
  skill,
  winner,
  shadowed,
  onOpenFile,
  onSelectSkill
}: SkillDetailProps) => (
  <div className="flex flex-col gap-5">
    <header className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-base font-semibold">{skill.name}</h1>
        <ScopeBadge scope={skill.scope} pluginName={skill.pluginName} />
        {skill.bundledFiles > 0 && (
          <Badge variant="muted">
            <Paperclip className="mr-1 inline size-3" />
            {skill.bundledFiles} bundled
          </Badge>
        )}
      </div>
      <Button
        variant="link"
        size="sm"
        className="h-auto justify-start p-0 text-xs"
        onClick={() => onOpenFile(skill.path)}
      >
        <FileText className="size-3.5" />
        <span className="mono break-all">{skill.path}</span>
      </Button>
    </header>

    <ShadowNotice winner={winner} shadowed={shadowed} onSelectSkill={onSelectSkill} />

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

    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Allowed tools
      </h2>
      {skill.allowedTools.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skill.allowedTools.map((tool) => (
            <Badge key={tool} variant="muted" className="mono">
              {tool}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-muted-foreground">unrestricted — inherits the session</p>
      )}
    </section>
  </div>
);
