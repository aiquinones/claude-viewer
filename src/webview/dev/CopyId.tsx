import { MouseEvent, useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyIdProps {
  id: string;
  className?: string;
}

const HELD_MS: number = 1200;

// The whole point of the view: grab an item's id so it can be pasted into a message. Storybook is
// served over localhost, which is a secure context, so `navigator.clipboard` is available — the
// catch is still handled, since a denied permission shouldn't take the row's click with it.
export const CopyId = ({ id, className }: CopyIdProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!copied) return;
    const timer: number = window.setTimeout(() => setCopied(false), HELD_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  // The row underneath this button opens the item; copying the id isn't asking for that.
  const copy = (event: MouseEvent): void => {
    event.stopPropagation();
    navigator.clipboard.writeText(id).then(
      () => setCopied(true),
      () => setCopied(false)
    );
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? 'Copied' : `Copy id: ${id}`}
      aria-label={`Copy id ${id}`}
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground cursor-pointer hover:bg-accent hover:text-foreground',
        // The palette has no dedicated success colour; this is its green.
        copied && 'text-activity-running',
        className
      )}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
};
