import { useEffect } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ConfigSnapshot } from '../model/types';
import { App } from './App';
import { allSkills, snapshot } from './fixtures';

// The host normally posts the snapshot; here the story does. App registers its listener on mount,
// and a parent's effect runs after its children's, so the message can't arrive too early.
const withSnapshot =
  (value: ConfigSnapshot | undefined): Decorator =>
  (Story) => {
    useEffect(() => {
      if (value) window.postMessage({ type: 'snapshot', snapshot: value }, '*');
    }, []);
    return <Story />;
  };

const meta: Meta<typeof App> = {
  title: 'Skills/App',
  component: App
};

export default meta;

type Story = StoryObj<typeof App>;

export const Loaded: Story = {
  decorators: [withSnapshot(snapshot(allSkills))]
};

// No folder open — project scope is absent and the header says so.
export const NoWorkspace: Story = {
  decorators: [
    withSnapshot({
      ...snapshot(allSkills.filter((skill) => skill.scope !== 'project')),
      workspaceRoot: undefined
    })
  ]
};

export const NoSkills: Story = {
  decorators: [withSnapshot(snapshot([]))]
};

// Before the host answers. Real, but it should be brief.
export const Loading: Story = {
  decorators: [withSnapshot(undefined)]
};
