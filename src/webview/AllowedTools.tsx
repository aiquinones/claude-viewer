import { Badge } from '@/components/ui/badge';

interface AllowedToolsProps {
  tools: string[];
}

// Only renders when the frontmatter actually narrows the tools. An empty list is the default —
// the skill inherits the session — so saying so on every skill was noise, and it sits below the
// body because the restriction only means something once you've read what the skill does.
export const AllowedTools = ({ tools }: AllowedToolsProps) => {
  if (tools.length === 0) return null;

  return (
    <section className="flex flex-col gap-2 px-5 pb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Allowed tools
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {tools.map((tool) => (
          <Badge key={tool} variant="muted" className="mono">
            {tool}
          </Badge>
        ))}
      </div>
    </section>
  );
};
