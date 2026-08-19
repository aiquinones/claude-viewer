import { useState } from 'react';
import { CollapsibleHeading } from '../CollapsibleHeading';
import { TrackedRow } from './TrackedRow';
import { TRACKED_GROUPS, TrackedGroup, TrackedItem, sortTracked } from './tracked-items';

interface TrackedListProps {
  items: TrackedItem[];
  selectedId: string | undefined;
  onSelect: (item: TrackedItem) => void;
}

const GROUP_LABEL: Record<TrackedGroup, string> = {
  open: 'Open',
  closed: 'Closed'
};

// Open first, closed folded under it. Closed items are the ones you stop reading and start
// checking, so the group collapses the same way plugin scope does in the skills list.
export const TrackedList = ({ items, selectedId, onSelect }: TrackedListProps) => {
  const [collapsed, setCollapsed] = useState<TrackedGroup[]>([]);

  const toggle = (group: TrackedGroup): void =>
    setCollapsed((previous) =>
      previous.includes(group)
        ? previous.filter((entry) => entry !== group)
        : [...previous, group]
    );

  return (
    <div className="flex flex-col gap-4 px-2 py-3">
      {TRACKED_GROUPS.map((group) => {
        const inGroup: TrackedItem[] = sortTracked(items.filter((item) => item.group === group));
        if (inGroup.length === 0) return null;

        const isCollapsed: boolean = collapsed.includes(group);

        return (
          <section key={group} className="flex flex-col gap-1">
            <CollapsibleHeading
              title={`${GROUP_LABEL[group]} · ${inGroup.length}`}
              collapsed={isCollapsed}
              onToggle={() => toggle(group)}
            />

            {!isCollapsed &&
              inGroup.map((item) => (
                <TrackedRow
                  key={item.id}
                  item={item}
                  selected={item.id === selectedId}
                  onSelect={onSelect}
                />
              ))}
          </section>
        );
      })}
    </div>
  );
};
