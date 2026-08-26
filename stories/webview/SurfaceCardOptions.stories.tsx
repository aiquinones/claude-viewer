import type { Meta, StoryObj } from '@storybook/react-vite';
import { SurfaceCard } from '@src/webview/SurfaceCard';
import { SURFACES, SurfaceId } from '@src/webview/surfaces';
import './surface-card-options.css';

// Five repaints of the landing card, to pick between. The card component, the glow and the 4:3
// shape are untouched in all of them — only the ground under the tint and how much tint changes.
//
// Look at each one four ways: the panel toolbar switches the palette (Auto / Panel dark / Panel
// light / Editor's color) and the theme toolbar switches the editor underneath it. The complaint
// these answer — too dark in dark, too washed in light — is a light/dark pair, so a variant that
// only fixes one half hasn't fixed it.
const meta: Meta = {
  title: 'Landing/Card options'
};

export default meta;

interface CardOption {
  id: string;
  name: string;
  // One line on what this one does differently, printed above its grid.
  note: string;
}

const OPTIONS: CardOption[] = [
  { id: 'a', name: 'A · Current', note: '8% accent over the page background. What ships today.' },
  {
    id: 'b',
    name: 'B · Card ground',
    note: 'Same tint, over --card — the panel’s raised ground, which already lifts in dark and settles in light.'
  },
  {
    id: 'c',
    name: 'C · Deeper wash',
    note: 'Page background still, 18% accent. The tint does the whole job, and corrects both polarities at once.'
  },
  {
    id: 'd',
    name: 'D · Card ground, deeper wash',
    note: 'B and C together — raised ground and a 16% tint. The most separated of the five.'
  },
  {
    id: 'e',
    name: 'E · Directional',
    note: 'B’s ground with the tint raked from the top-left, so the glow travels against a light direction. Its hover snaps rather than eases.'
  }
];

// What each card counts, roughly what a real machine shows — the numbers aren't the point here, but
// a card with no second line is a different shape and would compare badly.
const DETAILS: Record<SurfaceId, string> = {
  skills: '37 found · ~2.1k est. tokens',
  'system-prompt': '4 files · ~9.4k est. tokens',
  'active-agents': '3 sessions running',
  usage: '~184k output tokens today',
  memory: '4 memories · ~120 est. tokens'
};

interface CardGridProps {
  option: string;
}

// The grid LandingView really puts the cards in, so an option is judged at the size and spacing it
// would actually get — five accents at once is the case a stronger tint has to survive.
const CardGrid = ({ option }: CardGridProps) => (
  <div className={`card-opt-${option} grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2`}>
    {SURFACES.map((surface) => (
      <SurfaceCard
        key={surface.id}
        surface={surface}
        detail={DETAILS[surface.id]}
        onOpen={() => undefined}
      />
    ))}
  </div>
);

type Story = StoryObj;

// All five stacked, which is the story to open first: the differences are small enough that the
// only honest way to see them is with the previous one still on screen.
export const AllOptions: Story = {
  render: () => (
    <div className="flex h-screen flex-col gap-10 overflow-y-auto overflow-x-clip bg-background p-6">
      {OPTIONS.map((option) => (
        <section key={option.id} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-foreground">{option.name}</h2>
            <span className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {option.note}
            </span>
          </div>
          <CardGrid option={option.id} />
        </section>
      ))}
    </div>
  )
};

// One option at a time, on an empty page — the stacked story puts a label above every grid, and a
// heading two lines up changes how separated a card looks.
const only = (option: string): Story => ({
  render: () => (
    <div className="flex h-screen flex-col overflow-y-auto overflow-x-clip bg-background p-6">
      <CardGrid option={option} />
    </div>
  )
});

export const OptionACurrent: Story = only('a');
export const OptionBCardGround: Story = only('b');
export const OptionCDeeperWash: Story = only('c');
export const OptionDCardGroundDeep: Story = only('d');
export const OptionEDirectional: Story = only('e');
