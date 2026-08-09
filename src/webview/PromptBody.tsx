import { CircleAlert } from 'lucide-react';
import { SystemPromptFile } from '../model/types';
import { Markdown } from './markdown/Markdown';

interface PromptBodyProps {
  // The selected file, or undefined when nothing is selected — in which case nothing renders.
  file: SystemPromptFile | undefined;
  // The file's text. Undefined while the host is still reading it.
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
}

// The selected CLAUDE.md, rendered whole. Unlike a SKILL.md there's no frontmatter to skip — every
// line of this file reaches the prompt, so every line is shown.
//
// `px-5` is what the sticky headings inside reach back through, so the two have to agree.
export const PromptBody = ({ file, body, error, loading }: PromptBodyProps) => {
  if (!file) return null;

  return (
    <section className="flex flex-col gap-2 border-t border-border px-5 pb-8 pt-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {fileName(file.path)}
      </h2>
      <Content file={file} body={body} error={error} loading={loading} />
    </section>
  );
};

const Content = ({ file, body, error, loading }: PromptBodyProps) => {
  if (error) {
    return (
      <p className="flex items-start gap-2 text-xs text-error">
        <CircleAlert className="mt-px size-3.5 shrink-0" />
        <span>could not read the file: {error}</span>
      </p>
    );
  }
  if (loading) return <p className="text-sm text-muted-foreground">Reading…</p>;

  // A row can stand for a file that isn't on disk — an unresolved import, or a cycle that stops
  // here. It has issues to explain itself, so the body says the short version.
  if (!body?.trim()) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {file?.issues.length ? 'nothing is read from this file' : 'the file is empty'}
      </p>
    );
  }

  return <Markdown raw={body} />;
};

const fileName = (path: string): string => path.split(/[/\\]/).pop() ?? path;
