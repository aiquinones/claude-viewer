// The shape a segmented mode toggle is built from. Two lists use it — the skill Content section
// and the Active Agents surface — and neither knows the other exists.

import { LucideIcon } from 'lucide-react';

// `soon` is not drawn at all, which is the difference from a ModeBlockers entry: a blocked mode is
// one you can't pick *here*, and a `soon` mode is one that doesn't exist yet.
export type ViewModeStatus = 'ready' | 'soon';

export interface ViewModeShape {
  id: string;
  label: string;
  icon: LucideIcon;
  status: ViewModeStatus;
}

// One entry as the toggle takes it. `id` stays pinned to the caller's union so `onChange` is typed
// at the call site, and `status` is widened back out of its literal — a list where every mode is
// `ready` would otherwise narrow the field and turn every "is this one still coming" check into a
// no-overlap type error.
export type ViewModeEntry<Id extends string> = Omit<ViewModeShape, 'id'> & { id: Id };

// Why a mode can't be picked, keyed by mode. A mode with no entry is available; the string is what
// its tooltip says instead of the label.
export type ModeBlockers<Id extends string> = Partial<Record<Id, string>>;
