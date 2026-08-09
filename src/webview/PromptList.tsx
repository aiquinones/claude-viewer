import { SystemPromptFile } from '../model/types';
import { PromptFileRow } from './PromptFileRow';
import { alwaysLoads, conditional, formatTokens, plural, totals } from './prompt-totals';

interface PromptListProps {
  files: SystemPromptFile[];
  workspaceRoot: string | undefined;
  onOpenFile: (path: string) => void;
}

// Two sections, because they answer different questions: what every request pays for, and what
// only loads when Claude runs somewhere in particular.
export const PromptList = ({ files, workspaceRoot, onOpenFile }: PromptListProps) => {
  const always: SystemPromptFile[] = alwaysLoads(files);
  const maybe: SystemPromptFile[] = conditional(files);

  return (
    <div className="flex flex-col gap-5 py-3">
      <PromptSection
        title="Always loads"
        note={`${plural(always.length, 'file')} · ~${formatTokens(totals(always).estimatedTokens)} est. tokens`}
        files={always}
        workspaceRoot={workspaceRoot}
        onOpenFile={onOpenFile}
      />
      <PromptSection
        title="Loads conditionally"
        note={`${plural(maybe.length, 'file')} · ~${formatTokens(totals(maybe).estimatedTokens)} est. tokens, only under their own directory`}
        files={maybe}
        workspaceRoot={workspaceRoot}
        onOpenFile={onOpenFile}
      />
    </div>
  );
};

interface PromptSectionProps {
  title: string;
  note: string;
  files: SystemPromptFile[];
  workspaceRoot: string | undefined;
  onOpenFile: (path: string) => void;
}

const PromptSection = ({
  title,
  note,
  files,
  workspaceRoot,
  onOpenFile
}: PromptSectionProps) => {
  if (files.length === 0) return null;

  // Shares are per section: a conditional file's bar compares it to the other conditional ones,
  // not to a total it never contributes to.
  const groupChars: number = totals(files).chars;

  return (
    <section className="flex flex-col gap-1">
      <h2 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title} <span className="normal-case font-normal">· {note}</span>
      </h2>
      {files.map((file) => (
        <PromptFileRow
          key={`${file.order}-${file.path}`}
          file={file}
          groupChars={groupChars}
          workspaceRoot={workspaceRoot}
          onOpenFile={onOpenFile}
        />
      ))}
    </section>
  );
};
