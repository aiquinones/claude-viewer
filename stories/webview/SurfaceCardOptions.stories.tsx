import type { Meta, StoryObj } from '@storybook/react-vite';
import { SurfaceCard } from '@src/webview/SurfaceCard';
import { SURFACES, SurfaceId } from '@src/webview/surfaces';
import './surface-card-options.css';

// Option C — an accent tint over the page background — and how heavy that tint should be in the
// light palette. Dark is settled at 18% and every step below leaves it alone, so flipping the
// paintbrush toolbar to Panel dark should show four identical grids. That's the check, not a
// side effect: a step that changes dark has changed the half that was already right.
// The palette comes from the paintbrush toolbar, deliberately not pinned here: a story-level
// `globals` wins over a toolbar selection *and* disables the control, which would lock these to
// one palette — the opposite of what a story comparing two palettes needs.
const meta: Meta = {
  title: 'Landing/Card options'
};

export default meta;

interface TintStep {
  id: string;
  name: string;
  // One line on what this step changes, printed above its grid.
  note: string;
}

const STEPS: TintStep[] = [
  { id: 'a', name: '1 · As shipped', note: '18% accent over the page background. What C is now.' },
  {
    id: 'b',
    name: '2 · More accent',
    note: 'Same ground, 26%. Darker and more saturated together — against a near-white page the accent carries both.'
  },
  {
    id: 'c',
    name: '3 · Lower ground',
    note: 'Still 18%, over --card rather than the page. Drops the brightness without adding colour.'
  },
  {
    id: 'd',
    name: '4 · Both',
    note: '26% over --card. The far end — if this is too much, the answer is between 2 and 3.'
  }
];

// What each card counts, roughly what a real machine shows — a card with no second line is a
// different shape and would compare badly.
const DETAILS: Record<SurfaceId, string> = {
  skills: '37 found · ~2.1k est. tokens',
  'system-prompt': '4 files · ~9.4k est. tokens',
  'active-agents': '3 sessions running',
  usage: '~184k output tokens today',
  memory: '4 memories · ~120 est. tokens'
};

interface CardGridProps {
  step: string;
}

// The grid LandingView really puts the cards in, so a step is judged at the size and spacing it
// would actually get — five accents at once is the case a heavier tint has to survive.
const CardGrid = ({ step }: CardGridProps) => (
  <div className={`card-lc-${step} grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2`}>
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

// All four stacked, which is the story to open first: the steps are close enough that the only
// honest way to see one is with the one above it still on screen.
export const LightSteps: Story = {
  render: () => (
    <div className="flex h-screen flex-col gap-10 overflow-y-auto overflow-x-clip bg-background p-6">
      {STEPS.map((step) => (
        <section key={step.id} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-foreground">{step.name}</h2>
            <span className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {step.note}
            </span>
          </div>
          <CardGrid step={step.id} />
        </section>
      ))}
    </div>
  )
};

// One step at a time, on an empty page — the stacked story puts a label above every grid, and a
// heading two lines up changes how separated a card looks.
const only = (step: string): Story => ({
  render: () => (
    <div className="flex h-screen flex-col overflow-y-auto overflow-x-clip bg-background p-6">
      <CardGrid step={step} />
    </div>
  )
});

export const StepAsShipped: Story = only('a');
export const StepMoreAccent: Story = only('b');
export const StepLowerGround: Story = only('c');
export const StepBoth: Story = only('d');
