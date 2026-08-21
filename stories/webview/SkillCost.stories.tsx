import type { Meta, StoryObj } from '@storybook/react-vite';
import { ViewerSettings } from '@src/model/settings/settings';
import {
  budgetSettings,
  longDescription,
  noSkillFile,
  projectDeploy,
  userDeploy
} from '../fixtures';
import { SettingsProvider } from '@src/webview/settings/SettingsContext';
import { SkillCost } from '@src/webview/SkillCost';

const meta: Meta<typeof SkillCost> = {
  title: 'Skills/SkillCost',
  component: SkillCost,
  decorators: [
    (Story) => (
      <div className="w-[560px] p-6">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SkillCost>;

const withSettings = (settings: ViewerSettings) => {
  const Decorator = (Story: () => JSX.Element) => (
    <SettingsProvider settings={settings}>
      <Story />
    </SettingsProvider>
  );
  return Decorator;
};

// No provider, so both budgets are the shipped defaults — what a panel with nothing configured
// shows.
export const Default: Story = {
  args: { skill: projectDeploy }
};

// A long description is the case worth seeing: it's paid on every request, unlike the body. Against
// the default budget it's the one that goes red.
export const LongDescription: Story = {
  args: { skill: longDescription }
};

// Tight enough that both bars are past 75% without being over — the middle level, which is the one
// you'd otherwise never catch.
export const Near: Story = {
  args: { skill: projectDeploy },
  decorators: [
    withSettings(
      budgetSettings({
        description: { tokens: 36, source: 'user' },
        content: { tokens: 2900, source: 'user' }
      })
    )
  ]
};

// An override generous enough to bring this skill back under. Same skill, same numbers, different
// answer — which is the whole reason overrides exist.
export const Overridden: Story = {
  args: { skill: longDescription },
  decorators: [
    withSettings(budgetSettings({ overrides: { [longDescription.name]: { description: 400 } } }))
  ]
};

// Budgets off. The numbers stay, the bars and the limits go.
export const NoBudgets: Story = {
  args: { skill: projectDeploy },
  decorators: [
    withSettings(
      budgetSettings({
        description: { tokens: 0, source: 'user' },
        content: { tokens: 0, source: 'user' }
      })
    )
  ]
};

// Shadowed, so the description line is struck through and has no bar — this skill's description
// never reaches Claude, so there's no cost to measure.
export const Shadowed: Story = {
  args: { skill: userDeploy }
};

// Nothing was read. Both numbers are zero and neither row disappears.
export const Unreadable: Story = {
  args: { skill: noSkillFile }
};
