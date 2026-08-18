import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Ban } from 'lucide-react';
import { AGENT_COLORS, AgentColor } from '../../model/types';
import { cn } from '@/lib/utils';
import { AGENT_COLOR_LABEL, AGENT_COLOR_VAR } from './agent-colors';

interface AgentColorPickerProps {
  color: AgentColor | undefined;
  onPick: (color: AgentColor | undefined) => void;
}

// The swatch at the end of a row, and the six behind it. A plain absolutely-positioned div rather
// than a popover library, the same call `Tooltip` made for one bubble.
//
// Every click in here stops bubbling: the row's own click opens the transcript, and picking a
// colour would otherwise open a file behind the panel.
export const AgentColorPicker = ({ color, onPick }: AgentColorPickerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const box = useRef<HTMLDivElement>(null);

  useDismiss({ open, box, onDismiss: () => setOpen(false) });

  return (
    <div ref={box} className="relative" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        aria-label={color ? `Row colour: ${AGENT_COLOR_LABEL[color]}` : 'Set a row colour'}
        aria-expanded={open}
        onClick={() => setOpen((shown) => !shown)}
        // Invisible until you go looking, unless the row already has a colour — but always laid
        // out, so a row doesn't jump sideways as the pointer crosses it.
        className={cn(
          'flat-focus flex size-5 cursor-pointer items-center justify-center rounded-full border border-border transition-opacity',
          !color && !open && 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
        )}
        style={{ background: color ? AGENT_COLOR_VAR[color] : 'transparent' }}
      >
        {!color && <span className="size-2 rounded-full bg-muted-foreground" />}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Row colour"
          className="absolute right-0 top-full z-30 mt-1 flex items-center gap-1 rounded-md border border-border bg-popover p-1.5 shadow-lg"
        >
          {AGENT_COLORS.map((entry) => (
            <Swatch
              key={entry}
              color={entry}
              selected={entry === color}
              onPick={() => {
                onPick(entry);
                setOpen(false);
              }}
            />
          ))}
          <button
            type="button"
            role="option"
            aria-selected={!color}
            title="No colour"
            onClick={() => {
              onPick(undefined);
              setOpen(false);
            }}
            className="flex size-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <Ban className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

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

interface UseDismissArgs {
  open: boolean;
  box: React.RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
}

// Escape, or a press anywhere else. `pointerdown` rather than `click`, so the picker is gone before
// whatever you pressed on gets its turn.
const useDismiss = ({ open, box, onDismiss }: UseDismissArgs): void => {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent): void => {
      if (!box.current?.contains(event.target as Node)) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
};
