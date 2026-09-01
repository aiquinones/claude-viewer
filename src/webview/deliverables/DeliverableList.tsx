import { Deliverable } from '../../model/types';
import { DeliverableChip } from './DeliverableChip';

interface DeliverableListProps {
  deliverables: readonly Deliverable[];
  onOpen: (deliverable: Deliverable) => void;
}

// What a session announced it produced, as a row of chips. Wraps rather than scrolls: the cap is
// eight and a row is already short of width, so a second line is better than a thing you have to
// find by dragging.
//
// Keyed on kind and title because that pair is what the loader dedupes on — two chips can't share
// it, and a chip keeps its identity across the poll when its target changes.
export const DeliverableList = ({ deliverables, onOpen }: DeliverableListProps) => (
  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
    {deliverables.map((deliverable) => (
      <DeliverableChip
        key={`${deliverable.kind}:${deliverable.title}`}
        deliverable={deliverable}
        onOpen={onOpen}
      />
    ))}
  </div>
);
