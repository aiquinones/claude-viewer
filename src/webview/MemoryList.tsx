import { RefObject, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MemoryEntry, MemoryType } from '../model/types';
import { MemoryRow } from './MemoryRow';
import { formatTokens, plural } from './format-size';
import { MemoryGroup, memoryGroups, memoryTotals } from './memory-totals';

interface MemoryListProps {
  memories: MemoryEntry[];
  // Path of the memory whose text is showing, or undefined when nothing is selected.
  selectedPath: string | undefined;
  now: number;
  selectionRef: RefObject<HTMLDivElement>;
  onSelect: (memory: MemoryEntry) => void;
}

// The four types the memory instructions name is not a display order anyone would guess, so each
// heading says what its group is for as well as what it costs.
const GROUP_NOTE: Record<MemoryType, string> = {
  user: 'who you are',
  feedback: 'how to work with you',
  project: 'what the work is',
  reference: 'where things live'
};

// One group per type, each folding from its heading and keeping its subtotal folded — PromptList's
// rule, for the same reason: a collapsed group still has to say what it costs.
export const MemoryList = ({
  memories,
  selectedPath,
  now,
  selectionRef,
  onSelect
}: MemoryListProps) => {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const groups: MemoryGroup[] = memoryGroups(memories);

  const toggle = (id: string): void =>
    setCollapsed((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id]
    );

  return (
    <div className="flex flex-col gap-5 py-3">
      {groups.map((group) => {
        const id: string = group.type ?? 'untyped';

        return (
          <MemoryGroupSection
            key={id}
            id={id}
            note={group.type ? GROUP_NOTE[group.type] : 'no type Claude Code recognises'}
            group={group}
            collapsed={collapsed.includes(id)}
            selectedPath={selectedPath}
            now={now}
            selectionRef={selectionRef}
            onToggle={toggle}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
};

interface MemoryGroupSectionProps {
  id: string;
  note: string;
  group: MemoryGroup;
  collapsed: boolean;
  selectedPath: string | undefined;
  now: number;
  selectionRef: RefObject<HTMLDivElement>;
  onToggle: (id: string) => void;
  onSelect: (memory: MemoryEntry) => void;
}

const MemoryGroupSection = ({
  id,
  note,
  group,
  collapsed,
  selectedPath,
  now,
  selectionRef,
  onToggle,
  onSelect
}: MemoryGroupSectionProps) => {
  const tokens: number = memoryTotals(group.memories).estimatedTokens;

  return (
    <section className="flex flex-col gap-1">
      <h2>
        <button
          type="button"
          onClick={() => onToggle(id)}
          aria-expanded={!collapsed}
          className="flex w-full items-center gap-1 rounded-md px-3 py-1 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer hover:bg-accent"
        >
          {collapsed ? (
            <ChevronRight className="size-3.5 shrink-0" />
          ) : (
            <ChevronDown className="size-3.5 shrink-0" />
          )}
          <span>
            {id}{' '}
            <span className="normal-case font-normal">
              · {note} · {plural(group.memories.length, 'memory', 'memories')} · ~
              {formatTokens(tokens)} est. tokens if recalled
            </span>
          </span>
        </button>
      </h2>

      {!collapsed &&
        group.memories.map((memory) => (
          <MemoryRow
            key={memory.path}
            memory={memory}
            selected={memory.path === selectedPath}
            now={now}
            selectionRef={selectionRef}
            onSelect={onSelect}
          />
        ))}
    </section>
  );
};
