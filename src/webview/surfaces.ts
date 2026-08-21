// The config surfaces the landing page offers. SCOPE.md lists nine; the ones without a view yet
// are 'soon' and render dimmed rather than being hidden, so the panel says what's coming.
//
// Webview-only, so it lives here rather than in model/types.ts — none of it crosses to the host.

import {
  AgentSession,
  ConfigSnapshot,
  MemorySet,
  SkillEntry,
  SystemPromptFile
} from '../model/types';
import { UsageReport } from '../model/usage/types';
import { formatUsageTokens } from './usage-format';
import { formatTokens, plural } from './format-size';
import { alwaysLoads, totals } from './prompt-totals';
import { listed } from '../model/shadowing';
import { listingTotals } from './skill-totals';

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
    status: 'ready'
  },
  {
    id: 'active-agents',
    title: 'Active Agents',
    blurb: 'Claude Code and Copilot CLI sessions running right now, and what each is doing.',
    accent: 'var(--vscode-charts-green, #89d185)',
    status: 'ready'
  },
  {
    id: 'usage',
    title: 'Usage',
    blurb: 'What your sessions cost, split by the skill that was running.',
    accent: 'var(--vscode-charts-orange, #d18616)',
    status: 'ready'
  },
  {
    id: 'memory',
    title: 'Memory',
    blurb: 'What Claude wrote down about you here, and which of it any session will read.',
    accent: 'var(--vscode-charts-yellow, #cca700)',
    status: 'ready'
  }
] as const satisfies readonly SurfaceShape[];

// `status` is widened back out of the literal types on purpose. The rest of them are what SurfaceId
// derives from, but a status pinned to 'ready' turns every "is this one still coming" check into a
// no-overlap type error the day the last `soon` surface ships.
export type Surface = Omit<(typeof SURFACES)[number], 'status'> & { status: SurfaceStatus };

export type SurfaceId = Surface['id'];

interface DetailForSurfaceArgs {
  surface: Surface;
  snapshot: ConfigSnapshot;
  // Not on the snapshot: live agents ride their own message. See host/agents-store.ts.
  agents: AgentSession[];
  // Nor is this one, and it arrives later than the rest — the scan behind it reads every session
  // log on the machine. Undefined means it hasn't landed yet.
  usage: UsageReport | undefined;
  // Chars → est. tokens under the estimator that's set. Passed in rather than read here: this file
  // is plain data plus a switch, and a hook would make it a component's dependency.
  estimate: (chars: number) => number;
}

// The line under a card's blurb: whatever that surface counts. Switching on the id means adding a
// surface without a count here is a type error rather than a blank card.
export const getDetailForSurface = ({
  surface,
  snapshot,
  agents,
  usage,
  estimate
}: DetailForSurfaceArgs): string => {
  switch (surface.id) {
    case 'skills':
      return skillsDetail({ skills: snapshot.skills, estimate });
    case 'system-prompt':
      return promptDetail({ files: snapshot.systemPrompt, estimate });
    case 'active-agents':
      return agentsDetail(agents);
    case 'usage':
      return usageDetail(usage);
    case 'memory':
      return memoryDetail({ memory: snapshot.memory, estimate });
  }
};

interface MemoryDetailArgs {
  memory: MemorySet | undefined;
  estimate: (chars: number) => number;
}

// The index cost, which is what memory adds to every session whether or not anything is recalled —
// the same question the prompt card answers.
const memoryDetail = ({ memory, estimate }: MemoryDetailArgs): string => {
  if (!memory) return 'No folder open';
  if (memory.memories.length === 0) return 'None written yet';

  const tokens: number = estimate(memory.index.chars);
  return `${plural(memory.memories.length, 'memory', 'memories')} · ~${formatTokens(tokens)} est. tokens`;
};

// The day's output tokens, which is the default metric and the one figure both CLIs measure. No
// number at all until the scan lands — a zero would be a claim about a window nothing has read yet.
const usageDetail = (usage: UsageReport | undefined): string => {
  if (!usage) return 'Reading session logs…';

  const day = usage.windows.day;
  if (day.total.turns === 0) return 'Nothing in the last 24 hours';

  return `~${formatUsageTokens(day.total.outputTokens)} output tokens today`;
};

// Counted, not measured: an agent costs nothing per request, it's either there or it isn't. The
// card is dimmed while the surface is `soon`, but the number is real and read from disk.
const agentsDetail = (agents: AgentSession[]): string =>
  agents.length === 0 ? 'None running' : `${plural(agents.length, 'session')} running`;

// A surface's accent, for a view that wants to match the card it was opened from.
export const surfaceAccent = (id: SurfaceId): string =>
  SURFACES.find((surface) => surface.id === id)?.accent ?? 'var(--vscode-foreground)';

interface PromptDetailArgs {
  files: SystemPromptFile[];
  estimate: (chars: number) => number;
}

// Only the files that always load, matching the surface's own headline number.
const promptDetail = ({ files, estimate }: PromptDetailArgs): string => {
  const always = totals(alwaysLoads(files));
  if (always.files === 0) return 'None found';

  return `${plural(always.files, 'file')} · ~${formatTokens(estimate(always.chars))} est. tokens`;
};

interface SkillsDetailArgs {
  skills: SkillEntry[];
  estimate: (chars: number) => number;
}

// Tokens here are the listing cost — what having these skills installed adds to every request,
// which is the same question the prompt card answers. Shadowing is a detail for the surface, not
// for a card whose job is to say whether it's worth opening.
const skillsDetail = ({ skills, estimate }: SkillsDetailArgs): string => {
  if (skills.length === 0) return 'None found';

  const tokens: number = estimate(listingTotals(listed(skills)).chars);
  return `${skills.length} found · ~${formatTokens(tokens)} est. tokens`;
};
