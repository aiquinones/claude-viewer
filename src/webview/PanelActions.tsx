import { RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from './Tooltip';
import { CHORD_HINT } from './spotlight/chord';

interface PanelActionsProps {
  onSearch: () => void;
  onRefresh: () => void;
}

// The buttons every view's header ends with. The magnifier is there because a chord nobody presses
// is a feature nobody has — the tooltip is what teaches the chord.
export const PanelActions = ({ onSearch, onRefresh }: PanelActionsProps) => (
  <div className="flex shrink-0 items-center gap-1">
    <Tooltip label="Search" hint={CHORD_HINT}>
      <Button variant="ghost" size="icon" aria-label="Search" onClick={onSearch}>
        <Search />
      </Button>
    </Tooltip>
    <Tooltip label="Refresh">
      <Button variant="ghost" size="icon" aria-label="Refresh" onClick={onRefresh}>
        <RefreshCw />
      </Button>
    </Tooltip>
  </div>
);
