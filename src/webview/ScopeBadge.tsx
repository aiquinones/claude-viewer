import { Scope } from '../model/types';
import { Badge } from '@/components/ui/badge';

interface ScopeBadgeProps {
  scope: Scope;
  pluginName?: string;
}

// Project is the scope that wins a skill collision, so it's the one that gets the solid badge.
// The two system-prompt-only scopes sit at the quiet end: nothing wins there, and `nested` is the
// one that might not load at all.
const VARIANT: Record<Scope, 'default' | 'secondary' | 'muted'> = {
  project: 'default',
  user: 'secondary',
  plugin: 'muted',
  local: 'secondary',
  nested: 'muted'
};

export const ScopeBadge = ({ scope, pluginName }: ScopeBadgeProps) => (
  <Badge variant={VARIANT[scope]}>{pluginName ? `plugin: ${pluginName}` : scope}</Badge>
);
