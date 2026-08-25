import { CSSProperties, RefObject, useLayoutEffect, useRef, useState } from 'react';
import { ChartLine, Copy, LucideIcon, OctagonX, ScrollText } from 'lucide-react';
import { AgentSession } from '../../model/types';
import { Button } from '@/components/ui/button';
import { Z } from '../z-layers';
import {
  CANCEL_LABEL,
  KILL_CONFIRM_TITLE,
  KILL_LABEL,
  KILL_WARNING,
  MENU_ITEMS
} from './menu-labels';
import { Point, clampToViewport } from './placement';

interface AgentMenuProps {
  agent: AgentSession;
  // Where the right-click landed, in client coordinates.
  anchor: Point;
  // Whether it opens on the confirm rather than on the commands. The row never passes it — it's
  // here so a story can show the second state, which is otherwise only reachable by pressing the
  // one command you don't want to press.
  initialConfirming?: boolean;
  onClose: () => void;
  // Leaves the surface — it opens the usage surface's page for this session. The only command here
  // that goes somewhere rather than doing something, which is why it's first.
  onAnalyze: () => void;
  onOpenLog: () => void;
  onCopySessionId: () => void;
  onKill: () => void;
}

// The commands on one agent row, opened by right-clicking it. Everything here is about the session
// rather than about the config the rest of the panel shows, which is why it's a menu on the row and
// not a column of buttons: one of the four goes somewhere, two are things you do once, and the last
// ends a session.
//
// Not in here: the row colour. `ColorSwatches` and the store behind it are intact and it has no way
// in — the corner dot that used to open it came off with the log button. Putting the swatches back
// is one line in the list below.
//
// `fixed` rather than absolute, so the pane's scrollport can't clip it. That resolves against the
// `.view-pane`, which is transformed and therefore the containing block — the pane is pinned to the
// panel's own box, so a client coordinate still lands where the pointer was.
export const AgentMenu = ({
  agent,
  anchor,
  initialConfirming = false,
  onClose,
  onAnalyze,
  onOpenLog,
  onCopySessionId,
  onKill
}: AgentMenuProps) => {
  // Kill swaps the menu's contents rather than opening a second layer. The question replaces what
  // asked it, so there's nothing to mis-click behind and no second thing to dismiss.
  const [confirming, setConfirming] = useState<boolean>(initialConfirming);
  const { box, point } = usePlacement({ anchor, confirming });

  const run = (command: () => void): void => {
    command();
    onClose();
  };

  return (
    <div
      ref={box}
      role="menu"
      aria-label={`Commands for ${agent.tool} session ${agent.pid}`}
      style={{ zIndex: Z.card, left: point.x, top: point.y } as CSSProperties}
      // The row underneath opens the agent on click, and the dismiss listener closes on any press.
      // Both are stopped here, or picking an item would do the item and one other thing.
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      className="fixed flex w-64 flex-col rounded-md border border-border bg-popover p-1 text-xs shadow-lg"
    >
      {confirming ? (
        <KillConfirm onCancel={() => setConfirming(false)} onKill={() => run(onKill)} />
      ) : (
        <>
          <MenuItem
            icon={ChartLine}
            label={MENU_ITEMS.analyze.label}
            onClick={() => run(onAnalyze)}
          />
          <MenuItem icon={ScrollText} label={MENU_ITEMS.log.label} onClick={() => run(onOpenLog)} />
          <MenuItem
            icon={Copy}
            label={MENU_ITEMS.copy.label}
            note={agent.sessionId.slice(0, 8)}
            onClick={() => run(onCopySessionId)}
          />
          {/* Doesn't run anything — it asks. `run` is for the two that are done when you press
              them. */}
          <MenuItem
            icon={OctagonX}
            label={MENU_ITEMS.kill.label}
            note={String(agent.pid)}
            destructive
            onClick={() => setConfirming(true)}
          />
        </>
      )}
    </div>
  );
};

interface UsePlacementArgs {
  anchor: Point;
  // Not read — it's what re-measures when the confirm panel changes the box's height.
  confirming: boolean;
}

interface Placement {
  box: RefObject<HTMLDivElement>;
  point: Point;
}

// Measured rather than assumed: the confirm panel is a different size from the menu, so a constant
// would be right for one of them. A layout effect runs before paint, so the box is never seen at
// the un-clamped point.
const usePlacement = ({ anchor, confirming }: UsePlacementArgs): Placement => {
  const box = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<Point>(anchor);

  useLayoutEffect(() => {
    const rect: DOMRect | undefined = box.current?.getBoundingClientRect();
    setPoint(
      clampToViewport({
        point: anchor,
        size: { width: rect?.width ?? 0, height: rect?.height ?? 0 },
        viewport: { width: window.innerWidth, height: window.innerHeight }
      })
    );
  }, [anchor, confirming]);

  return { box, point };
};

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  // The value the command acts on — a pid, the head of a session id. Absent where there isn't one.
  note?: string;
  destructive?: boolean;
  onClick: () => void;
}

// One command, on one line: what it does, and what it does it to. `items-center` rather than
// `items-start` — with nothing under the label there's one line to centre the icon against, and an
// icon aligned to the top of a single line sits above it.
const MenuItem = ({ icon: Icon, label, note, destructive = false, onClick }: MenuItemProps) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-accent ${
      destructive ? 'text-error' : ''
    }`}
  >
    <Icon className="size-3.5 shrink-0" />
    <span className="truncate font-medium">{label}</span>
    {note && <span className="mono ml-auto shrink-0 text-[0.6875rem] opacity-70">{note}</span>}
  </button>
);

interface KillConfirmProps {
  onCancel: () => void;
  onKill: () => void;
}

// The second press. Cancel is first and Kill is last, so the button nearest where the pointer
// already was is the harmless one.
const KillConfirm = ({ onCancel, onKill }: KillConfirmProps) => (
  <div className="flex flex-col gap-2 p-1.5">
    <span className="flex items-center gap-2 font-medium text-error">
      <OctagonX className="size-3.5 shrink-0" />
      {KILL_CONFIRM_TITLE}
    </span>
    <p className="leading-relaxed text-muted-foreground">{KILL_WARNING}</p>
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={onCancel}>
        {CANCEL_LABEL}
      </Button>
      <Button variant="destructive" size="sm" onClick={onKill}>
        {KILL_LABEL}
      </Button>
    </div>
  </div>
);
