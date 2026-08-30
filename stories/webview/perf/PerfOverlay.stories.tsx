import type { Meta, StoryObj } from '@storybook/react-vite';
import { PerfReport } from '@src/model/perf/types';
import { PerfOverlay } from '@src/webview/perf/PerfOverlay';
import { fastLaunch, slowLaunch } from '../../perf-fixtures';

const meta: Meta<typeof PerfOverlay> = {
  title: 'Perf/PerfOverlay',
  component: PerfOverlay,
  args: {
    report: fastLaunch,
    // A 214ms launch: the panel is created, the bundle boots for 90ms, the page is up 50ms after
    // the host answers.
    marks: { readyAt: fastLaunch.openedAt + 90, paintedAt: fastLaunch.openedAt + 214 },
    workspaceRoot: '/Users/dev/repos/claude-viewer',
    onDismiss: () => {}
  },
  // The component is `fixed`, so it needs a page under it to sit in the corner of.
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full bg-background p-6">
        <p className="text-sm text-muted-foreground">The landing page goes here.</p>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PerfOverlay>;

// The state you actually see: a pill in the corner, saying what the launch cost and nothing else.
export const Collapsed: Story = {};

const openCard = ({ canvasElement }: { canvasElement: HTMLElement }): void => {
  const chevron: HTMLElement | null = canvasElement.querySelector('[aria-expanded]');
  chevron?.click();
};

export const Expanded: Story = { play: openCard };

// A launch worth investigating — a workspace walk that found 900 directories and a transcript that
// took a fifth of a second on its own.
export const SlowLaunch: Story = {
  args: {
    report: slowLaunch,
    marks: { readyAt: slowLaunch.openedAt + 140, paintedAt: slowLaunch.openedAt + 3_180 }
  },
  play: openCard
};

// The first report of a launch: the page is up and almost nothing has finished reading. Every
// outstanding stage's row is absent rather than zero, and the card names each one — this is what
// makes a launch watchable rather than something you only see the end of.
export const StillReading: Story = {
  args: {
    report: {
      ...fastLaunch,
      running: ['snapshot', 'skills', 'system-prompt', 'usage'],
      phases: fastLaunch.phases.filter(
        (phase) => !['snapshot', 'skills', 'system-prompt', 'usage'].includes(phase.phase)
      )
    } satisfies PerfReport
  },
  play: openCard
};

// The last thing still out, which is where a launch spends most of its visible life: the config is
// in and the scan behind it is still walking every transcript on the machine.
export const StillScanning: Story = {
  args: {
    report: {
      ...fastLaunch,
      running: ['usage'],
      phases: fastLaunch.phases.filter((phase) => phase.phase !== 'usage')
    } satisfies PerfReport
  },
  play: openCard
};

// Nothing read at all — no folder open, no agents running. The stages are still worth showing:
// this is the launch that proves the config read wasn't what cost the time.
export const NothingRead: Story = {
  args: {
    report: {
      ...fastLaunch,
      files: 0,
      directories: 0,
      bytes: 0,
      ioMs: 0,
      slowest: [],
      phases: fastLaunch.phases.map((phase) => ({
        ...phase,
        files: 0,
        directories: 0,
        bytes: 0,
        ioMs: 0
      }))
    } satisfies PerfReport
  },
  play: openCard
};
