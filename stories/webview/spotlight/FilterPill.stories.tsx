import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterPill } from '@src/webview/spotlight/FilterPill';

const meta: Meta<typeof FilterPill> = {
  title: 'Spotlight/FilterPill',
  component: FilterPill,
  args: { onRemove: () => undefined }
};

export default meta;

type Story = StoryObj<typeof FilterPill>;

export const Skill: Story = {
  args: { kind: 'skill' }
};
