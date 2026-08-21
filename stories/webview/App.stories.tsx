import { useEffect } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { ConfigSnapshot, Reveal } from '@src/model/types';
import { App } from '@src/webview/App';
import { allSkills, pluginDeploy, reveal, snapshot, userOnlyPromptFiles } from '../fixtures';

// The host normally posts the snapshot; here the story does. App registers its listener on mount,
// and a parent's effect runs after its children's, so the message can't arrive too early.
const withSnapshot =
  (value: ConfigSnapshot | undefined, revealed?: Reveal): Decorator =>
  (Story) => {
    useEffect(() => {
      if (value) window.postMessage({ type: 'snapshot', snapshot: value }, '*');
      if (revealed) window.postMessage({ type: 'reveal', ...revealed }, '*');
    }, []);
    return <Story />;
  };

const meta: Meta<typeof App> = {
  title: 'App/App',
  component: App
};

export default meta;

type Story = StoryObj<typeof App>;

// The panel opens here. Skills is one click away; the arrow keys and Tab shouldn't reach it.
//
// This is also the story that catches a pane overflowing its share of the slider track — the
// fixtures carry long paths and descriptions, and the hidden skills pane has to stay exactly one
// panel wide anyway. NoSkills below renders an empty pane, so it can't show that.
export const Landing: Story = {
  decorators: [withSnapshot(snapshot({ skills: allSkills }))]
};

// No folder open — project scope is absent from both surfaces and the heading says so.
export const NoWorkspace: Story = {
  decorators: [
    withSnapshot({
      ...snapshot({
        skills: allSkills.filter((skill) => skill.scope !== 'project'),
        systemPrompt: userOnlyPromptFiles
      }),
      workspaceRoot: undefined
    })
  ]
};

// Neither surface finds anything. Both cards keep their slot and say so.
export const NothingConfigured: Story = {
  decorators: [withSnapshot(snapshot({ skills: [], systemPrompt: [] }))]
};

// A deep link names one skill, so the panel has to slide past the landing page on its own.
export const RevealOpensSkills: Story = {
  decorators: [withSnapshot(snapshot({ skills: allSkills }), reveal(pluginDeploy))]
};

// Before the host answers. Real, but it should be brief.
export const Loading: Story = {
  decorators: [withSnapshot(undefined)]
};
