import { SlidersHorizontal } from 'lucide-react';
import { ContextReading, readContext } from '../model/sessions/context';
import { WINDOWS_READ_AT } from '../model/sessions/context-window';
import { AgentSession } from '../model/types';
import { Button } from '@/components/ui/button';
import { ContextBar } from './ContextBar';
import {
  CONTEXT_FALLBACK_NOTE,
  CONTEXT_LABELS,
  CONTEXT_NOTE,
  CONTEXT_OVER_WINDOW_NOTE,
  CONTEXT_SOURCE_LABELS
} from './agent-context-labels';
import { formatContextTokens } from './format-size';
import { budgetTextClass } from './BudgetBar';
import { useOpenSettings, useSettings } from './settings/SettingsContext';
import { Z } from './z-layers';

interface AgentContextProps {
  agent: AgentSession;
  className?: string;
}

// How full this agent's context is, and what the two numbers behind that mean. Both row modes
// render this and nothing else of the feature.
//
// Absent rather than empty when there's nothing to measure: a session of either CLI that hasn't
// finished an assistant turn, and a Copilot one whose usage database couldn't be read. An empty
// track would be a claim that the session is empty.
//
// The bar is the trigger — there's no (i) beside it. An info icon would be a second thing to aim at
// for one thing to read, and the bar is already the only part of a row whose meaning isn't spelled
// out in words.
export const AgentContext = ({ agent, className = '' }: AgentContextProps) => {
  const { context: settings } = useSettings();
  if (!agent.context) return null;

  const reading: ContextReading = readContext({ context: agent.context, settings });

  return (
    <span className={`group/context relative block ${className}`}>
      {/* Not a button — nothing happens on click, and the CTA lives inside the card. Tabbing here
          opens it, and tabbing on walks into that button. Its own group name: this sits inside the
          row's `group`, and an unnamed one here would answer to the row's hover as well. */}
      <span
        tabIndex={0}
        aria-describedby={CARD_ID}
        className="block cursor-default rounded-sm focus-visible:ring-1 focus-visible:ring-ring"
      >
        <ContextBar reading={reading} />
      </span>

      {/* `pt-1.5` rather than a margin: the gap stays inside the group, so the card survives the
          pointer crossing it on the way down. */}
      <div
        id={CARD_ID}
        style={{ zIndex: Z.card }}
        className="invisible absolute left-0 top-full pt-1.5 opacity-0 transition-opacity group-hover/context:visible group-hover/context:opacity-100 group-focus-within/context:visible group-focus-within/context:opacity-100"
      >
        <div className="flex w-max max-w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 rounded-md border border-border bg-popover p-3 text-left text-xs shadow-lg">
          <Headline reading={reading} />
          <Thresholds reading={reading} />
          <p className="max-w-[42ch] text-muted-foreground">{CONTEXT_NOTE}</p>
          <WindowNote reading={reading} />
          <Customize />
        </div>
      </div>
    </span>
  );
};

// One card per row, and several rows are on screen at once — so this is not unique in the document.
// It's `aria-describedby` rather than a lookup, and a duplicate id there costs a screen reader
// nothing: the first match is the right card in every row that isn't hovered anyway.
const CARD_ID: string = 'agent-context-card';

interface ReadingProps {
  reading: ContextReading;
}

// The measurement and the model it belongs to. Where the window came from used to be spelled out
// here for all three sources, which said nothing on the two where the number is fine — so only the
// cases that need explaining say anything now, and they say it at the foot of the card.
const Headline = ({ reading }: ReadingProps) => (
  <div className="flex flex-col gap-1 border-b border-border pb-2">
    <div className="flex items-baseline justify-between gap-6">
      <span className="font-semibold text-foreground">Context</span>
      <span className={`mono tabular-nums ${budgetTextClass(reading.level)}`}>
        {formatContextTokens(reading.tokens)} of {formatContextTokens(reading.window.tokens)}
      </span>
    </div>
    {reading.model && <span className="mono text-muted-foreground">{reading.model}</span>}
  </div>
);

// The window is a claim rather than a reading, and these are the two states where that matters. The
// date rides the over-window note rather than sitting on every card: a table entry being three
// months old is only interesting once the session has proved it wrong.
const WindowNote = ({ reading }: ReadingProps) => {
  if (reading.overWindow) {
    return (
      <p className="max-w-[42ch] text-error">
        {CONTEXT_OVER_WINDOW_NOTE}
        {reading.window.source === 'table' && ` The built-in figure is as of ${WINDOWS_READ_AT}.`}
      </p>
    );
  }

  if (reading.window.source === 'fallback') {
    return <p className="max-w-[42ch] text-muted-foreground">{CONTEXT_FALLBACK_NOTE}</p>;
  }

  return null;
};

// Where the colours change. Both are printed even when one is off, because "off" is the answer to
// why a bar that should be red isn't.
const Thresholds = ({ reading }: ReadingProps) => {
  const { context } = useSettings();

  return (
    <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1">
      <Line
        label={CONTEXT_LABELS.warnAt}
        tokens={reading.warnAt}
        source={CONTEXT_SOURCE_LABELS[context.warnAt.source]}
      />
      <Line
        label={CONTEXT_LABELS.errorAt}
        tokens={reading.errorAt}
        source={CONTEXT_SOURCE_LABELS[context.errorAt.source]}
      />
    </dl>
  );
};

interface LineProps {
  label: string;
  tokens: number;
  source: string;
}

// A fragment, not a wrapper: dt and dd have to be direct children of the grid or the two rows stop
// sharing a column and the labels no longer line up.
const Line = ({ label, tokens, source }: LineProps) => (
  <>
    <dt className="text-muted-foreground">{label}</dt>
    <dd>
      <span className="mono tabular-nums">
        {tokens === 0 ? 'off' : `${formatContextTokens(tokens)} tokens`}
      </span>
      <span className="text-muted-foreground"> · {source}</span>
    </dd>
  </>
);

// The way to change the two numbers above. At the foot rather than in a header rule: the card is
// read top-down as a fact, and changing it is what you do after reading it.
const Customize = () => {
  const openSettings = useOpenSettings();

  return (
    <div className="flex justify-end border-t border-border pt-2">
      <Button
        variant="link"
        size="sm"
        className="h-auto p-0 text-xs"
        // The whole row is a click surface, so this has to stop the bubble or opening the settings
        // focuses the agent behind them — the same trap the PR link is already dodging.
        onClick={(event) => {
          event.stopPropagation();
          openSettings('context');
        }}
      >
        <SlidersHorizontal className="size-3.5" />
        Customize warning levels
      </Button>
    </div>
  );
};
