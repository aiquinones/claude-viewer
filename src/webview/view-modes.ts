// The ways the Content section can render one skill. Webview-only — none of it crosses to the
// host, the same reason `surfaces.ts` lives here rather than in model/types.ts.

import { FileText, Waypoints, Workflow } from 'lucide-react';
import { ViewModeShape } from './view-mode';

// Deliberately not annotated: a type here would widen `id` to string, and `SkillViewMode` would
// then derive from nothing.
export const VIEW_MODES = [
  { id: 'text', label: 'Text', icon: FileText, status: 'ready' },
  { id: 'graph', label: 'Graph', icon: Waypoints, status: 'ready' },
  { id: 'flow', label: 'Flow', icon: Workflow, status: 'soon' }
] as const satisfies readonly ViewModeShape[];

export type SkillViewMode = (typeof VIEW_MODES)[number]['id'];

export const DEFAULT_VIEW_MODE: SkillViewMode = 'text';
