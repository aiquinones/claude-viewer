import type { Meta, StoryObj } from '@storybook/react-vite';
import { SpotlightRow } from '@src/webview/spotlight/SpotlightRow';
import { hitsFor } from '../../fixtures';

const meta: Meta<typeof SpotlightRow> = {
  title: 'Spotlight/SpotlightRow',
  component: SpotlightRow,
  args: { optionId: 'spotlight-option-0', onChoose: () => undefined, onHover: () => undefined },
  decorators: [(Story) => <div className="w-96 rounded-xl bg-popover p-1.5"><Story /></div>]
};

export default meta;

type Story = StoryObj<typeof SpotlightRow>;

// `com` lands on three scattered characters — the highlight is per character, not a range.
export const Scattered: Story = {
  args: { hit: hitsFor('com')[0], active: false }
};

// On the selection color the match color loses contrast, so the highlight is weight alone.
export const Active: Story = {
  args: { hit: hitsFor('com')[0], active: true }
};

// A skill that loses its name to another scope: dimmed, with the same icon the skills list uses.
export const Shadowed: Story = {
  args: { hit: hitsFor('deploy').filter((hit) => hit.doc.inactive)[0], active: false }
};

// Every character matched, which is the case where the highlight has to still read as a word.
export const WholeName: Story = {
  args: { hit: hitsFor('commit')[0], active: false }
};

// The longest name in the fixtures, to prove the row truncates rather than pushing the kind tag off.
export const LongName: Story = {
  args: { hit: hitsFor('mathol')[0], active: false }
};
