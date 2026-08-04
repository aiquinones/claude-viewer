// The config surfaces the landing page offers. SCOPE.md lists nine; the ones without a view yet
// are 'soon' and render dimmed rather than being hidden, so the panel says what's coming.
//
// Webview-only, so it lives here rather than in model/types.ts — none of it crosses to the host.

import { ConfigSnapshot, SkillEntry } from '../model/types';

export type SurfaceStatus = 'ready' | 'soon';

interface SurfaceShape {
  id: string;
  title: string;
  blurb: string;
  // A CSS color, read from the editor's chart palette so each card follows the active theme.
  accent: string;
  status: SurfaceStatus;
}

// Deliberately not annotated: annotating would widen `id` to string, and `SurfaceId` would then
// derive from nothing.
export const SURFACES = [
  {
    id: 'skills',
    title: 'Skills',
    blurb: 'What Claude can invoke here, and which copy wins a name collision.',
    accent: 'var(--vscode-charts-blue, #3794ff)',
    status: 'ready'
  },
  {
    id: 'system-prompt',
    title: 'System Prompt',
    blurb: 'The CLAUDE.md files that load, in order, and what they cost per request.',
    accent: 'var(--vscode-charts-purple, #b180d7)',
    status: 'soon'
  }
] as const satisfies readonly SurfaceShape[];

export type Surface = (typeof SURFACES)[number];

export type SurfaceId = Surface['id'];

interface DetailForSurfaceArgs {
  surface: Surface;
  snapshot: ConfigSnapshot;
}

// The line under a card's blurb: whatever that surface counts. Switching on the id means adding a
// surface without a count here is a type error rather than a blank card.
export const getDetailForSurface = ({ surface, snapshot }: DetailForSurfaceArgs): string => {
  switch (surface.id) {
    case 'skills':
      return skillsDetail(snapshot.skills);
    case 'system-prompt':
      return 'Not built yet';
  }
};

const skillsDetail = (skills: SkillEntry[]): string => {
  if (skills.length === 0) return 'None found';

  const shadowed: number = skills.filter((skill) => skill.shadowedBy).length;
  const found: string = `${skills.length} found`;
  return shadowed > 0 ? `${found} · ${shadowed} shadowed` : found;
};
