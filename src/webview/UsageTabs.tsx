import { cn } from '@/lib/utils';

// The two halves of the usage surface. Sessions comes first: it's the whole corpus, and the Skills
// tab is a window inside it.
//
// Deliberately not annotated: a type here would erase the literals UsageTab derives from.
export const USAGE_TABS = ['sessions', 'skills'] as const;

export type UsageTab = (typeof USAGE_TABS)[number];

export const USAGE_TAB_LABEL: Record<UsageTab, string> = {
  sessions: 'Sessions',
  skills: 'Skills'
};

interface UsageTabsProps {
  tab: UsageTab;
  onChange: (tab: UsageTab) => void;
}

// Text tabs, like the memory surface's — the name is the entire content of the choice, so there's
// nothing for an icon to say. They split the header controls too: the Day / Week toggle belongs to
// the Skills tab alone, since the grid spans a year and the list spans everything.
export const UsageTabs = ({ tab, onChange }: UsageTabsProps) => (
  <div role="tablist" aria-label="Usage view" className="flex shrink-0 items-center gap-1">
    {USAGE_TABS.map((entry) => (
      <button
        key={entry}
        type="button"
        role="tab"
        aria-selected={entry === tab}
        onClick={() => onChange(entry)}
        className={cn(
          'cursor-pointer border-b-2 px-3 py-1.5 text-xs font-medium transition-colors',
          entry === tab
            ? 'border-[var(--surface-accent)] text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        )}
      >
        {USAGE_TAB_LABEL[entry]}
      </button>
    ))}
  </div>
);
