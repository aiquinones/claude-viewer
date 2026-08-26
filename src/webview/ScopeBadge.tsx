import { Scope } from '../model/types';
import { Folder, FolderTree, GitBranch, Puzzle, UserRound } from 'lucide-react';

interface ScopeBadgeProps {
  scope: Scope;
  pluginName?: string;
}

// An origin is metadata, not a second headline. The icon gives each scope a visual anchor while
// the plain label stays quiet beside a file or skill name.
const SCOPE: Record<
  Scope,
  { icon: typeof Folder; label: string; title: string }
> = {
  project: { icon: Folder, label: 'project', title: 'Project scope' },
  user: { icon: UserRound, label: 'user', title: 'User scope' },
  plugin: { icon: Puzzle, label: 'plugin', title: 'Plugin scope' },
  local: { icon: GitBranch, label: 'local', title: 'Local scope' },
  nested: { icon: FolderTree, label: 'nested', title: 'Nested scope' }
};

export const ScopeBadge = ({ scope, pluginName }: ScopeBadgeProps) => {
  const { icon: Icon, label, title } = SCOPE[scope];
  const text: string = pluginName ?? label;

  return (
    <span
      title={pluginName ? `${pluginName} plugin` : title}
      className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
};
