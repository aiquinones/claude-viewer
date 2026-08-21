import { CircleAlert } from 'lucide-react';
import { SystemPromptFile } from '../model/types';
import { displayDirectory, fileName } from './display-path';
import { Loading } from './loading/Loading';
import { Markdown, STICKY_ROW_CLASS } from './markdown/Markdown';
import { Z } from './z-layers';

interface PromptBodyProps {
  // The selected file, or undefined when nothing is selected — in which case nothing renders.
  file: SystemPromptFile | undefined;
  // The file's text. Undefined while the host is still reading it.
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
  workspaceRoot: string | undefined;
}

// The selected CLAUDE.md, rendered whole. Unlike a SKILL.md there's no frontmatter to skip — every
// line of this file reaches the prompt, so every line is shown.
//
// `px-5` is what the sticky headings inside reach back through, so the two have to agree.
export const PromptBody = ({ file, body, error, loading, workspaceRoot }: PromptBodyProps) => {
  if (!file) return null;

  return (
    <section className="flex flex-col border-t border-border px-5 pb-8 pt-4">
      <PathTitle file={file} workspaceRoot={workspaceRoot} />
      <div className="pt-2">
        <Content file={file} body={body} error={error} loading={loading} />
      </div>
    </section>
  );
};

interface PathTitleProps {
  file: SystemPromptFile;
  workspaceRoot: string | undefined;
}

// Row 0 of the pinned stack: which file you're reading, above whichever heading you're inside.
// Nearly every file here is named CLAUDE.md, so the directory is the part that identifies it —
// which is why it takes the width and the name is what survives at the end.
const PathTitle = ({ file, workspaceRoot }: PathTitleProps) => {
  const directory: string = displayDirectory({ path: file.path, workspaceRoot });
  // `.` is the workspace root itself, where there's no directory left to print.
  const hasDirectory: boolean = directory !== '' && directory !== '.';

  return (
    <h2
      title={file.path}
      style={{ zIndex: Z.stickyTop }}
      className={`mono sticky top-0 -mx-5 flex ${STICKY_ROW_CLASS} items-center border-b border-border bg-background px-5 text-xs text-muted-foreground`}
    >
      {hasDirectory && <span className="min-w-0 truncate">{directory}/</span>}
      <span className="shrink-0 font-semibold text-foreground">{fileName(file.path)}</span>
    </h2>
  );
};

interface ContentProps {
  file: SystemPromptFile;
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
}

const Content = ({ file, body, error, loading }: ContentProps) => {
  if (error) {
    return (
      <p className="flex items-start gap-2 text-xs text-error">
        <CircleAlert className="mt-px size-3.5 shrink-0" />
        <span>could not read the file: {error}</span>
      </p>
    );
  }
  // The heading above already names the file, so the label doesn't repeat it.
  if (loading) return <Loading label="Reading…" />;

  // A row can stand for a file that isn't on disk — an unresolved import, or a cycle that stops
  // here. It has issues to explain itself, so the body says the short version.
  if (!body?.trim()) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {file.issues.length ? 'nothing is read from this file' : 'the file is empty'}
      </p>
    );
  }

  // One row is already pinned above, so every heading in here starts a slot lower.
  return <Markdown raw={body} offsetRows={1} />;
};
