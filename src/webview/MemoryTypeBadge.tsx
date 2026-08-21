import { MemoryType } from '../model/types';
import { Badge } from '@/components/ui/badge';

interface MemoryTypeBadgeProps {
  // Undefined for a file whose `metadata.type` is missing or unrecognised — it still gets a badge,
  // saying so.
  type: MemoryType | undefined;
  // What the file said instead, when it said something. Printed in place of the word, so a typo is
  // visible rather than folded into "untyped".
  declaredType?: string;
}

// `user` and `feedback` are about you and how to work with you; `project` and `reference` are about
// the work. The first pair reads solid, the second quiet — same split ScopeBadge draws.
const VARIANT: Record<MemoryType, 'default' | 'secondary' | 'muted'> = {
  user: 'default',
  feedback: 'default',
  project: 'secondary',
  reference: 'muted'
};

export const MemoryTypeBadge = ({ type, declaredType }: MemoryTypeBadgeProps) => {
  if (!type) return <Badge variant="muted">{declaredType ?? 'untyped'}</Badge>;

  return <Badge variant={VARIANT[type]}>{type}</Badge>;
};
