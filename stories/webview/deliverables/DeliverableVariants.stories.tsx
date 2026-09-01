import type { Meta, StoryObj } from '@storybook/react-vite';
import { DELIVERABLE_KINDS, Deliverable, DeliverableKind } from '@src/model/types';
import { AgentRowFooter } from '@src/webview/AgentRowFooter';
import { DeliverableList } from '@src/webview/deliverables/DeliverableList';
import {
  CHIP_VARIANTS,
  ChipVariant,
  chipVariantStyle
} from '@src/webview/deliverables/chip-variants';
import { deliverableAgent, deliverables } from '../../agent-fixtures';

// Six looks for the deliverable chip, drawn together so one can be picked. This page is the whole
// point of the branch — everything under `Agents/DeliverableList` still shows the shipped default.
const meta: Meta = { title: 'Agents/Deliverable chip styles', parameters: { layout: 'padded' } };

export default meta;

// Titles a session would plausibly write, rather than the kind's own name — a chip's width comes
// from its title, and four identical short words hide how these actually sit next to each other.
const KIND_TITLE: Record<DeliverableKind, string> = {
  storybook: 'Storybook',
  link: 'Preview',
  file: 'Plan',
  pr: 'PR #418'
};

// Every kind at once, so a look is judged on all four colors rather than on Storybook's pink alone.
const everyKind: Deliverable[] = DELIVERABLE_KINDS.map((kind) => ({
  kind,
  title: KIND_TITLE[kind],
  url: `https://example.com/${kind}`
}));

interface VariantBlockProps {
  variant: ChipVariant;
  rows: readonly Deliverable[];
}

const VariantBlock = ({ variant, rows }: VariantBlockProps) => {
  const { label, note } = chipVariantStyle(variant);

  return (
    <section className="flex flex-col gap-2 border-b border-border pb-5 last:border-0">
      <header className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        <p className="text-xs text-muted-foreground">{note}</p>
      </header>
      <DeliverableList deliverables={rows} onOpen={() => undefined} variant={variant} />
    </section>
  );
};

// The comparison. One block per look, each drawn over the same four chips.
export const AllVariants: StoryObj = {
  render: () => (
    <div className="flex w-full max-w-[560px] flex-col gap-5 bg-background p-6">
      {CHIP_VARIANTS.map((variant) => (
        <VariantBlock key={variant} variant={variant} rows={everyKind} />
      ))}
    </div>
  )
};

// The same six over what a session actually declares — a Storybook, a plan on disk, a preview URL.
// Fewer chips and mixed widths, which is the case the real surface has.
export const RealDeclarations: StoryObj = {
  render: () => (
    <div className="flex w-full max-w-[560px] flex-col gap-5 bg-background p-6">
      {CHIP_VARIANTS.map((variant) => (
        <VariantBlock key={variant} variant={variant} rows={deliverables} />
      ))}
    </div>
  )
};

// In place: the footer of a real agent row, where a chip sits next to the PR link the panel found
// on its own and the subagent toggle. A look that reads well alone can still fight those two.
export const InTheRow: StoryObj = {
  render: () => (
    <div className="flex w-full max-w-[560px] flex-col gap-4 bg-background py-4">
      {CHIP_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0">
          <span className="px-3 pl-6 text-xs text-muted-foreground">
            {chipVariantStyle(variant).label}
          </span>
          <AgentRowFooter
            agent={deliverableAgent}
            onOpenDeliverable={() => undefined}
            deliverableVariant={variant}
          />
        </div>
      ))}
    </div>
  )
};
