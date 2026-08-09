import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { FilterToken, takeFilterToken } from '../../model/search/filters';
import { searchIndex } from '../../model/search/search';
import { SEARCH_KINDS, SearchDoc, SearchHit, SearchKind } from '../../model/types';
import { FilterPill } from './FilterPill';
import { SpotlightRow } from './SpotlightRow';

interface SpotlightProps {
  index: SearchDoc[];
  // Kinds it opens narrowed to — whichever surface you were looking at. Empty from the landing page.
  initialFilters?: SearchKind[];
  // Prefills the box. Only stories pass it today; a deep link that carries a query would too.
  initialQuery?: string;
  onChoose: (doc: SearchDoc) => void;
  onDismiss: () => void;
}

// -1 is the input itself: nothing is highlighted yet, but Enter still opens the first result.
const INPUT: number = -1;

const optionId = (index: number): string => `spotlight-option-${index}`;

// A search box floating over whatever view is up. Focus never leaves the input — the active row is
// a highlight and an aria-activedescendant, so you can keep typing after arrowing into the list.
export const Spotlight = ({
  index,
  initialFilters = [],
  initialQuery,
  onChoose,
  onDismiss
}: SpotlightProps) => {
  const [query, setQuery] = useState<string>(initialQuery ?? '');
  const [filters, setFilters] = useState<SearchKind[]>(initialFilters);
  const [activeIndex, setActiveIndex] = useState<number>(INPUT);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const hits: SearchHit[] = useMemo(
    () => searchIndex({ index, query, kinds: filters }),
    [index, query, filters]
  );
  const active: SearchHit | undefined = hits[Math.max(activeIndex, 0)];
  // The next kind you could narrow to, printed under an empty box. Nothing else advertises the
  // syntax, and a filter you can't discover is one nobody uses.
  const suggestion: SearchKind | undefined = SEARCH_KINDS.find((kind) => !filters.includes(kind));

  // Typing a complete `filter:<kind>` lifts it out of the text and into a pill.
  const onChange = (value: string): void => {
    setActiveIndex(INPUT);

    const token: FilterToken | undefined = takeFilterToken(value);
    if (!token) return setQuery(value);

    setQuery(token.rest);
    setFilters((previous) =>
      previous.includes(token.kind) ? previous : [...previous, token.kind]
    );
  };

  const removeFilter = (kind: SearchKind): void => {
    setFilters((previous) => previous.filter((entry) => entry !== kind));
    setActiveIndex(INPUT);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') return onDismiss();
    if (event.key === 'Enter') {
      event.preventDefault();
      if (active) onChoose(active.doc);
      return;
    }
    // Backspace at the start of an empty box eats the last pill, the way a token field does.
    if (event.key === 'Backspace' && query.length === 0 && filters.length > 0) {
      event.preventDefault();
      return setFilters((previous) => previous.slice(0, -1));
    }
    // Down walks into the list and stops at the end; up walks back out to the bare input.
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      return setActiveIndex(Math.min(activeIndex + 1, hits.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      return setActiveIndex(Math.max(activeIndex - 1, INPUT));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-scrim px-4 pt-[15vh]"
      onMouseDown={onDismiss}
    >
      <div
        className="flex h-fit w-full max-w-lg flex-col overflow-clip rounded-xl border border-border bg-popover shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          {filters.map((kind) => (
            <FilterPill key={kind} kind={kind} onRemove={() => removeFilter(kind)} />
          ))}
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls="spotlight-results"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-autocomplete="list"
            placeholder="Search"
            value={query}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            className="flat-focus w-full min-w-0 bg-transparent py-3 text-sm placeholder:text-muted-foreground"
          />
        </div>

        {hits.length > 0 && (
          <div
            id="spotlight-results"
            role="listbox"
            className="flex flex-col gap-0.5 border-t border-border p-1.5"
          >
            {hits.map((hit, position) => (
              <SpotlightRow
                key={hit.doc.id}
                hit={hit}
                active={position === activeIndex}
                optionId={optionId(position)}
                onChoose={() => onChoose(hit.doc)}
                onHover={() => setActiveIndex(position)}
              />
            ))}
          </div>
        )}

        {query.trim().length === 0 && suggestion && (
          <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Type to search · <span className="mono">filter:{suggestion}</span> narrows it
          </p>
        )}

        {query.trim().length > 0 && hits.length === 0 && (
          <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Nothing matches <span className="mono">{query}</span>
            {filters.length > 0 && ' in that filter'}
          </p>
        )}
      </div>
    </div>
  );
};
