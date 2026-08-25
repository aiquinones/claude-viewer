import type { Meta, StoryObj } from '@storybook/react-vite';
import { bothClis, dayOfWork, noUsage, unpricedModel } from '../usage-fixtures';
import { UsageInfo } from '@src/webview/UsageInfo';

// The card only opens on hover, and with room above it opens upward — which is what it does on the
// usage surface, where the note is the last line of the page. Hence the padding above it here, and
// `pt-96` rather than something rounder: the card measures ~300px in Chrome, so 16rem of room isn't
// enough to hold it and every one of these stories would have demonstrated the flip instead.
// `inPane` turns the padding off for the one story that supplies its own scroll container.
const meta: Meta<typeof UsageInfo> = {
  title: 'Usage/UsageInfo',
  component: UsageInfo,
  args: { breakdown: dayOfWork.windows.day },
  decorators: [
    (Story, context) =>
      context.parameters.inPane ? (
        <Story />
      ) : (
        <div className="p-6 pt-96">
          <Story />
        </div>
      )
  ]
};

export default meta;

type Story = StoryObj<typeof UsageInfo>;

// The composition is the point: cache reads lead, because every turn re-reads the context it's
// working in and nothing on the surface counts those tokens. That's what makes the total look wrong
// next to an output figure.
export const Default: Story = {};

// Both CLIs, so the model list spans them — Copilot runs Claude models too, and only Claude Code's
// rows carry dollars.
export const BothClis: Story = { args: { breakdown: bothClis.windows.day } };

// A model with no rates. It keeps its share of the tokens and says its dollars aren't counted.
export const UnpricedModel: Story = { args: { breakdown: unpricedModel.windows.day } };

// Nothing in the window. The (i) renders nothing at all rather than opening an empty box.
export const Empty: Story = { args: { breakdown: noUsage.windows.day } };

// The session page's shape: a pane scrolling under a header, with the note near the top of it. What
// clips the card there is the pane rather than the panel, so it drops downward — pinned upward it
// went behind the breadcrumb and lost its top half.
export const InAScrolledPane: Story = {
  parameters: { inPane: true },
  decorators: [
    (Story) => (
      <div className="flex h-screen flex-col">
        <div className="border-b border-border px-4 py-3 text-sm font-semibold">
          Usage › Claude costs and metering
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <div className="flex flex-col gap-5 px-4 py-4">
            <Story />
            {/* Enough below it to scroll, so the pane is a real one. */}
            <div className="h-[80rem]" />
          </div>
        </div>
      </div>
    )
  ]
};
