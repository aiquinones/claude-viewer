import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuButton } from '@src/webview/menu/MenuButton';

// The `...` and the box it opens, with nothing in it but the trigger, the placement and the
// dismiss. Click to open; escape or a press outside closes it. It opens down and to the left,
// because it always sits at the right end of a header — the decorator gives it that corner.
const meta: Meta<typeof MenuButton> = {
  title: 'Chrome/MenuButton',
  component: MenuButton,
  decorators: [
    (Story) => (
      <div className="flex h-[24rem] justify-end p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof MenuButton>;

// The plain case: some rows and a close that shuts the menu behind them.
export const Default: Story = {
  render: () => (
    <MenuButton label="Example options">
      {(close) => (
        <div className="flex flex-col gap-1 py-1.5 first:pt-0 last:pb-0">
          {['First', 'Second', 'Third'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={close}
              className="cursor-pointer rounded px-1.5 py-1 text-left transition-colors hover:bg-accent"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </MenuButton>
  )
};

// A label long enough to test the box's `max-w`. It wraps rather than pushing the panel wide, and
// the menu still hangs off the trigger's right edge.
export const LongContent: Story = {
  render: () => (
    <MenuButton label="Example options">
      {() => (
        <p className="px-1.5 py-1 text-muted-foreground">
          A menu wide enough to reach the cap, so the box wraps its own contents instead of running
          off the edge of a narrow panel.
        </p>
      )}
    </MenuButton>
  )
};
