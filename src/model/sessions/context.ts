// A session's context, read against the model's window and against the two sizes at which a long
// conversation stops being trustworthy. Pure, and the webview is the only caller — the host has no
// opinion about any of it.

import { BudgetLevel, readThresholds } from '../settings/budget';
import { ContextSettings } from '../settings/settings';
import { AgentContext } from '../types';
import { tableWindowFor } from './context-window';

// Where the window came from, most specific first. The array is the order `resolveWindow` walks and
// the card prints whichever won — the same stance the budgets card takes, because a number you can't
// argue with is a number you ignore, and this one is a table entry that can go stale.
//
// `stated` is the CLI's own figure, off the log. It sits under `override` because an explicit
// setting is still you overruling what was read, and over `table` because a number the CLI wrote
// beats one this repo maintains by hand.
//
// Deliberately not annotated: a type here would erase the literals `ContextWindowSource` derives
// from.
export const CONTEXT_WINDOW_SOURCES = ['override', 'stated', 'table', 'fallback'] as const;

export type ContextWindowSource = (typeof CONTEXT_WINDOW_SOURCES)[number];

export interface ContextWindow {
  tokens: number;
  source: ContextWindowSource;
}

export interface ContextReading {
  tokens: number;
  window: ContextWindow;
  model: string;
  // How much of the window is used, uncapped — the bar clamps its own fill.
  fraction: number;
  // From the two absolute thresholds, not from `fraction`. The bar is how much room is left; the
  // level is whether the conversation has grown big enough to go wrong, and those differ: 200k in a
  // 1M window is a fifth of a bar painted yellow.
  level: BudgetLevel;
  // The thresholds that produced that level. On the reading rather than looked up again by whoever
  // draws it: the bar marks them on its track, and a mark in a different place from the colour it
  // explains is worse than no mark.
  warnAt: number;
  errorAt: number;
  // The session is bigger than the window we assumed it had, which can only mean the table is wrong
  // for this model. Said out loud rather than clamped quietly — a wrong denominator that hides
  // itself makes every bar on the surface a guess nobody can check.
  overWindow: boolean;
}

interface ReadContextArgs {
  context: AgentContext;
  settings: ContextSettings;
}

export const readContext = ({ context, settings }: ReadContextArgs): ContextReading => {
  const window: ContextWindow = resolveWindow({
    model: context.model,
    stated: context.window,
    settings
  });

  return {
    tokens: context.tokens,
    window,
    model: context.model,
    fraction: context.tokens / window.tokens,
    level: readThresholds({
      value: context.tokens,
      warnAt: settings.warnAt.value,
      errorAt: settings.errorAt.value
    }),
    warnAt: settings.warnAt.value,
    errorAt: settings.errorAt.value,
    overWindow: context.tokens > window.tokens
  };
};

interface ResolveWindowArgs {
  model: string;
  // What the log said the window was, when the CLI records one.
  stated: number | undefined;
  settings: ContextSettings;
}

// Your setting for this model → what the CLI stated → the built-in table → your fallback. The
// fallback is last because it's the only one of the four that knows nothing about which model ran.
const resolveWindow = ({ model, stated, settings }: ResolveWindowArgs): ContextWindow => {
  const override: number | undefined = settings.windows[model];
  if (override !== undefined) return { tokens: override, source: 'override' };

  if (stated !== undefined && stated > 0) return { tokens: stated, source: 'stated' };

  const table: number | undefined = tableWindowFor(model);
  if (table !== undefined) return { tokens: table, source: 'table' };

  return { tokens: settings.windowFallback.value, source: 'fallback' };
};
