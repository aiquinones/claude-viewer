import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties, useState } from 'react';
import { surfaceAccent } from '@src/webview/surfaces';
import { UsageTab, UsageTabs } from '@src/webview/UsageTabs';

const meta: Meta<typeof UsageTabs> = {
  title: 'Usage/UsageTabs',
  component: UsageTabs
};

export default meta;

type Story = StoryObj<typeof UsageTabs>;

// Live, because what this component is is the moving selection. The underline is the surface accent,
// which the view sets on itself — so the story sets it too.
export const Tabs: Story = {
  render: () => {
    const [tab, setTab] = useState<UsageTab>('sessions');

    return (
      <div
        className="border-b border-border px-3"
        style={{ '--surface-accent': surfaceAccent('usage') } as CSSProperties}
      >
        <UsageTabs tab={tab} onChange={setTab} />
      </div>
    );
  }
};
