import type { Meta, StoryObj } from '@storybook/react-vite';
import { ViewerSettings } from '../model/settings/settings';
import { BudgetInfo } from './BudgetInfo';
import { budgetSettings, projectDeploy } from './fixtures';
import { SettingsProvider } from './settings/SettingsContext';

const meta: Meta<typeof BudgetInfo> = {
  title: 'Skills/BudgetInfo',
  component: BudgetInfo,
  args: { skill: projectDeploy },
  // Room below for the card, and the Cost heading beside it at the size it really sits at.
  decorators: [
    (Story) => (
      <div className="flex items-center gap-1.5 p-6 pb-64">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cost</h2>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof BudgetInfo>;

// Focus is the keyboard half of the same disclosure, so focusing the icon shows what a hover shows.
const openCard = ({ canvasElement }: { canvasElement: HTMLElement }): void => {
  const trigger: HTMLElement | null = canvasElement.querySelector('[aria-describedby]');
  trigger?.focus();
};

// Wraps a story in one set of budgets. Without a provider the component reads the defaults, which
// is the Default story below.
const withSettings = (settings: ViewerSettings) => {
  const Decorator = (Story: () => JSX.Element) => (
    <SettingsProvider settings={settings}>
      <Story />
    </SettingsProvider>
  );
  return Decorator;
};

// The icon alone. The card is hover-only, so the stories below focus it instead.
export const Closed: Story = {};

// Nothing configured — both limits are the shipped defaults.
export const Default: Story = {
  play: openCard
};

export const SetByYou: Story = {
  decorators: [
    withSettings(budgetSettings({ content: { tokens: 4000, source: 'user' } }))
  ],
  play: openCard
};

// The case the overrides map exists for: this one skill gets its own limit.
export const Overridden: Story = {
  decorators: [
    withSettings(budgetSettings({ overrides: { [projectDeploy.name]: { content: 12000 } } }))
  ],
  play: openCard
};

// A budget turned off. The card says so rather than printing a limit of zero.
export const TurnedOff: Story = {
  decorators: [
    withSettings(budgetSettings({ description: { tokens: 0, source: 'workspace' } }))
  ],
  play: openCard
};

// The card is as wide as its two paragraphs, and its max-width is the panel less the skills list —
// so a panel this narrow is where the clip is real rather than theoretical.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } },
  play: openCard
};
