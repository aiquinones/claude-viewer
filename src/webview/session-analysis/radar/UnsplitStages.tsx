import { Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SPLIT_SESSION, UNSPLIT_STAGES } from './stage-labels';

interface UnsplitStagesProps {
  onAssignNames: () => void;
}

// What stands where the wheels would be while nothing is named. Skills ran, so there is a split to
// be had — it just hasn't been chosen — which makes this an invitation rather than an empty state.
// The CTA is on the card rather than only in the (i): a reader in this state has no reason to hover
// an icon, and the state itself is the question the dialog answers.
export const UnsplitStages = ({ onAssignNames }: UnsplitStagesProps) => (
  <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-8 text-center">
    <p className="max-w-sm text-sm text-muted-foreground">{UNSPLIT_STAGES}</p>
    <Button variant="secondary" size="sm" onClick={onAssignNames}>
      <Tags className="size-3.5" />
      {SPLIT_SESSION}
    </Button>
  </div>
);
