import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from '@src/webview/loading/Loading';

const meta: Meta<typeof Loading> = {
  title: 'Loading/Loading',
  component: Loading,
  args: { label: 'Reading configuration…' },
  decorators: [
    (Story) => (
      <div className="flex h-72 items-center justify-center">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Loading>;

// The common case: no real signal, so the bar crawls to 90% over the expectation.
export const Crawling: Story = {};

// What a load that outruns its estimate settles into. The expectation is set to nothing so the
// story is already sweeping by the time you look at it.
export const Sweeping: Story = {
  args: { label: 'Reading configuration…', expectedMs: 1, delayMs: 0 }
};

// Nothing supplies a real fraction today — this is the branch waiting for one.
export const RealProgress: Story = {
  args: { label: 'Scanned 1,240 of 3,000 directories', progress: 0.41 }
};

// A read slow enough to watch the whole curve.
export const SlowExpectation: Story = { args: { expectedMs: 8000 } };

export const SlowTick: Story = { args: { tickMs: 2000 } };

// Inside a section rather than an empty panel — the layout a body read gets.
export const InASection: Story = {
  args: { label: 'Reading SKILL.md' },
  decorators: [
    (Story) => (
      <section className="flex flex-col gap-2 px-5 pb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Content
        </h2>
        <Story />
      </section>
    )
  ]
};
