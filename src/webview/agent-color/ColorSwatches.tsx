import { CSSProperties } from 'react';
import { Ban } from 'lucide-react';
import { AGENT_COLORS, AgentColor } from '../../model/types';
import { cn } from '@/lib/utils';
import { AGENT_COLOR_LABEL, AGENT_COLOR_VAR } from './agent-colors';

interface ColorSwatchesProps {
  color: AgentColor | undefined;
  onPick: (color: AgentColor | undefined) => void;
}

// The six colours and the way back to none. A row of swatches with no trigger of its own: it used
// to live behind a dot in the corner of every agent row, and it sits in that row's command menu
// now — which is already open, already dismisses itself, and already stops its own clicks.
export const ColorSwatches = ({ color, onPick }: ColorSwatchesProps) => (
  <div role="listbox" aria-label="Row color" className="flex items-center gap-1 px-1 py-0.5">
    {AGENT_COLORS.map((entry) => (
      <Swatch
        key={entry}
        color={entry}
        selected={entry === color}
        onPick={() => onPick(entry === color ? undefined : entry)}
      />
    ))}
    {/* Picking the colour a row already has clears it too, so this is the discoverable way rather
        than the only one. */}
    <button
      type="button"
      role="option"
      aria-selected={!color}
      title="No color"
      onClick={() => onPick(undefined)}
      className="ml-auto flex size-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
    >
      <Ban className="size-3.5" />
    </button>
  </div>
);

interface SwatchProps {
  color: AgentColor;
  selected: boolean;
  onPick: () => void;
}

const Swatch = ({ color, selected, onPick }: SwatchProps) => (
  <button
    type="button"
    role="option"
    aria-selected={selected}
    title={AGENT_COLOR_LABEL[color]}
    onClick={onPick}
    style={{ '--swatch': AGENT_COLOR_VAR[color] } as CSSProperties}
    className={cn(
      'size-5 cursor-pointer rounded-full bg-[var(--swatch)] transition-transform hover:scale-110',
      selected && 'ring-2 ring-foreground ring-offset-2 ring-offset-popover'
    )}
  />
);
