import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { AGENT_COLORS, AgentColor } from '../../model/types';
import { AGENT_COLOR_LABEL, AGENT_COLOR_VAR } from '../agent-color/agent-colors';
import { AgentRobot } from './AgentRobot';
import { ROBOT_MOODS, RobotMood, ROBOT_MOOD_LABEL } from './moods';

// Four robots and six colours is twenty-four combinations, and the only way to see them in the real
// extension is to start four agents and wait for one to fall asleep.
const meta: Meta<typeof AgentRobot> = {
  title: 'Agents/AgentRobot',
  component: AgentRobot,
  args: { mood: 'working', className: 'size-24' },
  argTypes: {
    mood: { control: 'inline-radio', options: ROBOT_MOODS }
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center p-10">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof AgentRobot>;

// Heads down at the keyboard. The one row on the surface where something is actually happening.
export const Working: Story = { args: { mood: 'working' } };

// A tool call is out. The dots are the wait; the hand drums whether or not anything comes back.
export const Waiting: Story = { args: { mood: 'waiting' } };

// The same agent state as Waiting — `blocked` — split on `pendingTool`. These two sit next to each
// other on purpose: the badge says Waiting for both and can't do better, and this is the difference
// it can't show.
export const Asking: Story = { args: { mood: 'asking' } };

// The last turn ended and nobody has answered. Breathing, and shedding Zs.
export const Sleeping: Story = { args: { mood: 'sleeping' } };

// All four at once, which is the only way to tell whether they read as one robot in four moods
// rather than four robots.
export const EveryMood: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {ROBOT_MOODS.map((mood) => (
        <figure key={mood} className="flex flex-col items-center gap-2">
          <AgentRobot {...args} mood={mood} />
          <figcaption className="text-xs text-muted-foreground">
            {mood} — {ROBOT_MOOD_LABEL[mood]}
          </figcaption>
        </figure>
      ))}
    </div>
  )
};

// Every mood in every colour. A row's colour wins over the one the mood would have picked, which
// is what this grid is checking — nothing here should still be green.
export const EveryColour: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {AGENT_COLORS.map((color) => (
        <div key={color} className="flex items-center gap-6">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">
            {AGENT_COLOR_LABEL[color]}
          </span>
          {ROBOT_MOODS.map((mood) => (
            <Tinted key={mood} color={color} mood={mood} tickMs={args.tickMs} />
          ))}
        </div>
      ))}
      <div className="flex items-center gap-6">
        <span className="w-16 shrink-0 text-xs text-muted-foreground">unset</span>
        {ROBOT_MOODS.map((mood) => (
          <AgentRobot key={mood} mood={mood} tickMs={args.tickMs} className="size-14" />
        ))}
      </div>
    </div>
  )
};

interface TintedProps {
  color: AgentColor;
  mood: RobotMood;
  tickMs: number | undefined;
}

// `--row-color` is set by the row in the panel, so a story that wants one sets it the same way.
const Tinted = ({ color, mood, tickMs }: TintedProps) => (
  <span style={{ '--row-color': AGENT_COLOR_VAR[color] } as CSSProperties}>
    <AgentRobot mood={mood} tickMs={tickMs} className="size-14" />
  </span>
);

// The tick every mood is timed against. Slow enough to watch one gesture at a time.
export const SlowTick: Story = { args: { tickMs: 2400, mood: 'asking' } };

// Row size — 44px, which is what nine of them on a surface actually look like.
export const RowSize: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {ROBOT_MOODS.map((mood) => (
        <AgentRobot key={mood} {...args} mood={mood} className="size-11" />
      ))}
    </div>
  )
};
