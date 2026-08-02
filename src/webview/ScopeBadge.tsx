import { Scope } from '../model/types';
import { Badge } from '@/components/ui/badge';

interface ScopeBadgeProps {
  scope: Scope;
  pluginName?: string;
}

// Project is the scope that wins, so it's the one that gets the solid badge.
const VARIANT: Record<Scope, 'default' | 'secondary' | 'muted'> = {
  project: 'default',
  user: 'secondary',
  plugin: 'muted'
};

export const ScopeBadge = ({ scope, pluginName }: ScopeBadgeProps) => (
  <Badge variant={VARIANT[scope]}>{pluginName ? `plugin: ${pluginName}` : scope}</Badge>
);
