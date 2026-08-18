// The two ways to read the Active Agents surface. Both are lists of the same sessions — Details is
// the dense row that answers "what is running and should I care", Robots acts the same states out.

import { Bot, List } from 'lucide-react';
import { ViewModeShape } from './view-mode';

// Deliberately not annotated: a type here would widen `id` to string, and `AgentViewMode` would
// then derive from nothing.
export const AGENT_VIEW_MODES = [
  { id: 'details', label: 'Details', icon: List, status: 'ready' },
  { id: 'robots', label: 'Robots', icon: Bot, status: 'ready' }
] as const satisfies readonly ViewModeShape[];

export type AgentViewMode = (typeof AGENT_VIEW_MODES)[number]['id'];

export const DEFAULT_AGENT_VIEW_MODE: AgentViewMode = 'details';
