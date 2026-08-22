import { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CodeText } from '@src/webview/CodeText';

interface BoxFacts {
  title: string;
  entry: string;
  bundle: string;
  accent: string;
  // What this box is allowed to touch. The rule the whole architecture is arranged around.
  reaches: string;
}

const HOST: BoxFacts = {
  title: 'Host',
  entry: 'src/extension.ts',
  bundle: 'CJS · `vscode` external',
  accent: 'var(--vscode-charts-blue, #3794ff)',
  reaches: 'The VS Code API and the filesystem'
};

const WEBVIEW: BoxFacts = {
  title: 'Webview',
  entry: 'src/webview/main.tsx',
  bundle: 'IIFE · React 18',
  accent: 'var(--vscode-charts-green, #89d185)',
  reaches: 'The DOM. Never a file'
};

const MODEL: BoxFacts = {
  title: 'Model',
  entry: 'src/model/ · src/config/',
  bundle: 'Compiled into both bundles',
  accent: 'var(--vscode-charts-purple, #b180d7)',
  reaches: 'Neither. Pure — which is what lets both sides run the same rule'
};

// The top of the map: two bundles that share no memory, one typed wire, and a pure middle that
// belongs to both. Counts are the members of the two unions in model/types.ts.
export const Boundary = () => (
  <div className="flex flex-col gap-3">
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
      <Box facts={HOST} />
      <Wire />
      <Box facts={WEBVIEW} />
    </div>

    <Box facts={MODEL}>
      <span className="text-xs text-muted-foreground">
        Imported by both sides, so a rule like{' '}
        <CodeText text="`activity.ts`" /> runs on the host and in the panel without being written
        twice.
      </span>
    </Box>
  </div>
);

interface BoxProps {
  facts: BoxFacts;
  children?: ReactNode;
}

const Box = ({ facts, children }: BoxProps) => (
  <div
    style={
      {
        '--surface-accent': facts.accent,
        borderColor: `color-mix(in srgb, ${facts.accent} 35%, transparent)`,
        background: `color-mix(in srgb, ${facts.accent} 8%, var(--background))`
      } as CSSProperties
    }
    className="flex min-w-0 flex-col gap-1.5 rounded-xl border p-4"
  >
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-sm font-semibold">{facts.title}</span>
      <span className="mono truncate text-xs text-muted-foreground">{facts.entry}</span>
    </div>
    <span className="text-xs text-muted-foreground">
      <CodeText text={facts.bundle} />
    </span>
    <span className="text-xs">
      <span className="text-muted-foreground">Reaches: </span>
      {facts.reaches}
    </span>
    {children}
  </div>
);

// The only thing crossing. Both directions are labelled with what carries them, since the counts
// are the whole protocol — there is no other channel between the two boxes.
const Wire = () => (
  <div className="flex flex-col gap-2 py-1 md:px-1">
    <WireLeg
      direction="forward"
      label="HostMessage"
      detail="7 kinds — snapshot, settings, agents, usage…"
    />
    <WireLeg
      direction="back"
      label="WebviewMessage"
      detail="11 kinds — ready, refresh, openFile, requestBody…"
    />
  </div>
);

interface WireLegProps {
  direction: 'forward' | 'back';
  label: string;
  detail: string;
}

const WireLeg = ({ direction, label, detail }: WireLegProps) => {
  const Arrow = direction === 'forward' ? ArrowRight : ArrowLeft;

  return (
    <div className="flex items-center gap-2" title={detail}>
      {direction === 'back' && <Arrow className="size-4 shrink-0 text-muted-foreground" />}
      <div className="flex min-w-0 flex-col md:w-40">
        <span className="mono truncate text-xs font-semibold">{label}</span>
        <span className="truncate text-[0.7rem] text-muted-foreground">{detail}</span>
      </div>
      {direction === 'forward' && <Arrow className="size-4 shrink-0 text-muted-foreground" />}
    </div>
  );
};
