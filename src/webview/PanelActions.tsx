import { CornerLeftUp, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from './Tooltip';
import { CHORD_HINT } from './spotlight/chord';

interface PanelActionsProps {
  // Only passed while there's somewhere to go back to — a view with nothing selected omits it and
  // the button isn't rendered at all.
  onGoToSelection?: () => void;
  onSearch: () => void;
  onRefresh: () => void;
}

// The buttons every view's header ends with. The magnifier is there because a chord nobody presses
// is a feature nobody has — the tooltip is what teaches the chord.
export const PanelActions = ({ onGoToSelection, onSearch, onRefresh }: PanelActionsProps) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = (): void => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      {onGoToSelection && (
        <Tooltip label="Go to selection">
          <Button variant="ghost" size="icon" aria-label="Go to selection" onClick={onGoToSelection}>
            <CornerLeftUp />
          </Button>
        </Tooltip>
      )}
      <Tooltip label="Search" hint={CHORD_HINT}>
        <Button variant="ghost" size="icon" aria-label="Search" onClick={onSearch}>
          <Search />
        </Button>
      </Tooltip>
      <Tooltip label="Refresh">
        <Button variant="ghost" size="icon" aria-label="Refresh" onClick={handleRefresh}>
          <RefreshCw className={isRefreshing ? 'refresh-rotating' : ''} />
        </Button>
      </Tooltip>
    </div>
  );
};
