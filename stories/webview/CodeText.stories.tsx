import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeText } from '@src/webview/CodeText';
import { HoverCardBody } from '@src/webview/HoverCard';

const meta: Meta<typeof CodeText> = {
  title: 'Usage/CodeText',
  component: CodeText
};

export default meta;

type Story = StoryObj<typeof CodeText>;

// The card these actually live in: `w-max` with a 16rem clamp, which is the width the wrapping has
// to survive.
const InCard = ({ text }: { text: string }) => (
  <span className="block w-max max-w-[16rem] rounded-md border border-border bg-popover p-2 text-xs leading-relaxed text-popover-foreground shadow-lg">
    <HoverCardBody>
      <CodeText text={text} />
    </HoverCardBody>
  </span>
);

// A setting name in the middle of a sentence — short, so nothing wraps and the mono face is the
// only difference.
export const SettingName: Story = {
  render: () => <InCard text="The window comes from `cleanupPeriodDays`." />
};

// A path longer than the card is wide. Without `break-words` this is the thing that decides the
// card's width: it hits the clamp, finds no break opportunity, and runs out the side.
export const LongPath: Story = {
  render: () => (
    <InCard text="Sessions under `~/.copilot/session-state`. No documented retention period, so the window is whatever was found." />
  )
};

// Two ticked runs and prose between them, which is the Claude Code hint verbatim.
export const TwoRuns: Story = {
  render: () => (
    <InCard text="Sessions under `~/.claude/projects`. The window comes from `cleanupPeriodDays`." />
  )
};

// No backticks at all — every other hint on the surface. It has to come through as plain text
// rather than as a string that lost something in the parse.
export const NoTicks: Story = {
  render: () => <InCard text="Every session found on this machine." />
};

// An unmatched backtick. Nothing closes it, so the character is what the sentence meant and it
// stays where it was written.
export const UnmatchedTick: Story = {
  render: () => <InCard text="A stray ` in the middle of a sentence." />
};
