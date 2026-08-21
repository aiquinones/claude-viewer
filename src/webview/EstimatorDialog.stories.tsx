import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TokenEstimator } from '../model/estimate-tokens';
import { EstimatorDialog } from './EstimatorDialog';

// The dialog every "est. tokens" in the panel can open. It holds a draft, so Apply is the only
// thing that writes — which is what these stories are mostly checking.
const meta: Meta<typeof EstimatorDialog> = {
  title: 'Settings/EstimatorDialog',
  component: EstimatorDialog,
  args: {
    current: 'standard',
    onApply: () => undefined,
    onDismiss: () => undefined
  }
};

export default meta;

type Story = StoryObj<typeof EstimatorDialog>;

// Opened on what's already set: the draft matches, so Apply is dead until you pick the other one.
export const Standard: Story = {};

// Opened while the Anthropic adjustment is the one in force. Same disabled Apply, other radio.
export const Anthropic: Story = { args: { current: 'anthropic' } };

// Picking the other option is what wakes Apply up — and moves the picture. The whole point of the
// dialog is being able to do this without committing to it.
export const PickingTheOther: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const options = canvasElement.querySelectorAll<HTMLElement>('[role="radio"]');
    options[1]?.click();
  }
};

// Applying, wired to state the way App wires it: the draft becomes the current, and Apply goes
// back to disabled because there's nothing left to write.
export const Applying: Story = {
  render: () => {
    const [current, setCurrent] = useState<TokenEstimator>('standard');

    return (
      <EstimatorDialog current={current} onApply={setCurrent} onDismiss={() => undefined} />
    );
  }
};

// The panel is the viewport in a webview, so a narrow dock is where the dialog's max width and its
// two paragraphs of prose actually meet.
export const NarrowPanel: Story = {
  globals: { viewport: { value: 'narrowPanel' } }
};
