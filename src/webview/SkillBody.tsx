import { CircleAlert } from 'lucide-react';
import { Markdown } from './markdown/Markdown';

interface SkillBodyProps {
  // SKILL.md below its frontmatter. Undefined while the host is still reading it.
  body: string | undefined;
  error: string | undefined;
  loading: boolean;
}

// Everything Claude reads after the description. `px-5` here is what the sticky headings inside
// reach back through, so the two have to agree.
export const SkillBody = ({ body, error, loading }: SkillBodyProps) => (
  <section className="flex flex-col gap-2 px-5 pb-8">
    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content</h2>
    <Content body={body} error={error} loading={loading} />
  </section>
);

const Content = ({ body, error, loading }: SkillBodyProps) => {
  if (error) {
    return (
      <p className="flex items-start gap-2 text-xs text-error">
        <CircleAlert className="mt-px size-3.5 shrink-0" />
        <span>could not read the file: {error}</span>
      </p>
    );
  }
  if (loading) return <p className="text-sm text-muted-foreground">Reading…</p>;
  if (!body?.trim()) {
    return <p className="text-sm italic text-muted-foreground">nothing below the frontmatter</p>;
  }

  return <Markdown raw={body} />;
};
