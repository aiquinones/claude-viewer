import { ScrollText } from 'lucide-react';

interface AgentLogButtonProps {
  onOpen: () => void;
}

// The way to the transcript, now that the row's own click goes to the running agent instead.
//
// Invisible until you go looking and always laid out — the same deal the colour picker beside it
// makes, and for the same reason: a row must not reflow as the pointer crosses it. The click stops
// bubbling, or opening the log would focus the agent behind it.
export const AgentLogButton = ({ onOpen }: AgentLogButtonProps) => (
  <button
    type="button"
    aria-label="Open the session log"
    title="Open the session log"
    onClick={(event) => {
      event.stopPropagation();
      onOpen();
    }}
    className="flat-focus flex size-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
  >
    <ScrollText className="size-3.5" />
  </button>
);
