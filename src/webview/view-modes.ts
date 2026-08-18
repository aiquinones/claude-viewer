// The ways the Content section can render one skill. Webview-only — none of it crosses to the
// host, the same reason `surfaces.ts` lives here rather than in model/types.ts.

import { FileText, LucideIcon, Waypoints, Workflow } from 'lucide-react';

export type ViewModeStatus = 'ready' | 'soon';

interface ViewModeShape {
  id: string;
  label: string;
  icon: LucideIcon;
  status: ViewModeStatus;
}

// Deliberately not annotated: a type here would widen `id` to string, and `SkillViewMode` would
// then derive from nothing.
export const VIEW_MODES = [
  { id: 'text', label: 'Text', icon: FileText, status: 'ready' },
  { id: 'graph', label: 'Graph', icon: Waypoints, status: 'ready' },
  { id: 'flow', label: 'Flow', icon: Workflow, status: 'ready' }
] as const satisfies readonly ViewModeShape[];

// `status` is widened back out of its literal, the way `Surface` does it: pinned to the values that
// happen to be here, every "is this one still coming" check turns into a no-overlap type error the
// day the last `soon` mode ships.
export type ViewMode = Omit<(typeof VIEW_MODES)[number], 'status'> & { status: ViewModeStatus };

export type SkillViewMode = ViewMode['id'];

export const DEFAULT_VIEW_MODE: SkillViewMode = 'text';
