import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { surfaceAccent } from '@src/webview/surfaces';
import { toLoadMarks, toTurnBars } from '@src/webview/session-analysis/turn-bars';
import { TurnsChart } from '@src/webview/session-analysis/TurnsChart';
import { formatUsageTokens } from '@src/webview/usage-format';
import { claudeDetail, copilotDetail } from '../../session-detail-fixtures';

// Run through the real builders rather than written out by hand, so the heights, the ticks and the
// bubble agree with each other the way they do in the panel.
const bars = toTurnBars({
  turns: claudeDetail.turns,
  metric: 'output-tokens',
  costBasis: 'all'
});

const meta: Meta<typeof TurnsChart> = {
  title: 'Usage/TurnsChart',
  component: TurnsChart,
  args: {
    bars,
    marks: toLoadMarks({ bars, invocations: claudeDetail.invocations }),
    metric: 'output-tokens',
    format: formatUsageTokens
  },
  decorators: [
    (Story) => (
      <div
        className="w-[42rem] max-w-full p-4"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof TurnsChart>;

// Fifty-odd turns. The bars share the row, and the ticks under the axis are where a skill was
// loaded — hovering one says the number, the time and the model.
export const Session: Story = {};

// A short session, where the bars grow to fill the row rather than staying hairlines in a wide pane.
export const Short: Story = {
  args: {
    bars: bars.slice(0, 8),
    marks: toLoadMarks({ bars: bars.slice(0, 8), invocations: claudeDetail.invocations })
  }
};

// Copilot's double load lands on one turn, so the two `skill.invoked` events five seconds apart draw
// one tick. Two marks a pixel apart would read as two separate places in the session.
export const CopilotDoubleLoad: Story = {
  args: (() => {
    const copilotBars = toTurnBars({
      turns: copilotDetail.turns,
      metric: 'output-tokens',
      costBasis: 'all'
    });
    return {
      bars: copilotBars,
      marks: toLoadMarks({ bars: copilotBars, invocations: copilotDetail.invocations })
    };
  })()
};

// No requests at all — a session directory that exists and never got prompted.
export const Empty: Story = { args: { bars: [], marks: [] } };
