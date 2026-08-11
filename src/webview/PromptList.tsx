import { RefObject, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SystemPromptFile } from '../model/types';
import { PromptFileRow } from './PromptFileRow';
import { formatTokens, plural } from './format-size';
import { alwaysLoads, conditional, totals } from './prompt-totals';

// The two sections, keyed so collapsing one doesn't have to know about the other.
type PromptSectionId = 'always' | 'conditional';

interface PromptListProps {
  files: SystemPromptFile[];
  // `order` of the file whose body is showing, or undefined when nothing is selected. Order rather
  // than path: a path can appear twice — imported by two files, or as the entry that ends a cycle.
  selectedOrder: number | undefined;
  workspaceRoot: string | undefined;
  // Attached to the selected row, so the view can scroll back to it from down in the body.
  selectionRef: RefObject<HTMLDivElement>;
  onSelect: (file: SystemPromptFile) => void;
}

// Two sections, because they answer different questions: what every request pays for, and what
// only loads when Claude runs somewhere in particular.
export const PromptList = ({
  files,
  selectedOrder,
  workspaceRoot,
  selectionRef,
  onSelect
}: PromptListProps) => {
  const always: SystemPromptFile[] = alwaysLoads(files);
  const maybe: SystemPromptFile[] = conditional(files);
  const [collapsed, setCollapsed] = useState<PromptSectionId[]>([]);

  const toggle = (id: PromptSectionId): void =>
    setCollapsed((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id]
    );

  return (
    <div className="flex flex-col gap-5 py-3">
      <PromptSection
        id="always"
        title="Always loads"
        note={`${plural(always.length, 'file')} · ~${formatTokens(totals(always).estimatedTokens)} est. tokens`}
        files={always}
        collapsed={collapsed.includes('always')}
        selectedOrder={selectedOrder}
        workspaceRoot={workspaceRoot}
        selectionRef={selectionRef}
        onToggle={toggle}
        onSelect={onSelect}
      />
      <PromptSection
        id="conditional"
        title="Loads conditionally"
        note={`${plural(maybe.length, 'file')} · ~${formatTokens(totals(maybe).estimatedTokens)} est. tokens, only under their own directory`}
        files={maybe}
        collapsed={collapsed.includes('conditional')}
        selectedOrder={selectedOrder}
        workspaceRoot={workspaceRoot}
        selectionRef={selectionRef}
        onToggle={toggle}
        onSelect={onSelect}
      />
    </div>
  );
};

interface PromptSectionProps {
  id: PromptSectionId;
  title: string;
  note: string;
  files: SystemPromptFile[];
  collapsed: boolean;
  selectedOrder: number | undefined;
  workspaceRoot: string | undefined;
  selectionRef: RefObject<HTMLDivElement>;
  onToggle: (id: PromptSectionId) => void;
  onSelect: (file: SystemPromptFile) => void;
}

const PromptSection = ({
  id,
  title,
  note,
  files,
  collapsed,
  selectedOrder,
  workspaceRoot,
  selectionRef,
  onToggle,
  onSelect
}: PromptSectionProps) => {
  if (files.length === 0) return null;

  // Shares are per section: a conditional file's bar compares it to the other conditional ones,
  // not to a total it never contributes to.
  const groupChars: number = totals(files).chars;

  return (
    <section className="flex flex-col gap-1">
      {/* The subtotal stays in the heading, so a collapsed section still says what it costs. */}
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
            {title} <span className="normal-case font-normal">· {note}</span>
          </span>
        </button>
      </h2>

      {!collapsed &&
        files.map((file) => (
          <PromptFileRow
            key={`${file.order}-${file.path}`}
            file={file}
            groupChars={groupChars}
            selected={file.order === selectedOrder}
            workspaceRoot={workspaceRoot}
            selectionRef={selectionRef}
            onSelect={onSelect}
          />
        ))}
    </section>
  );
};
