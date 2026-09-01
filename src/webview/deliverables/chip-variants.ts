import { DeliverableKindColor } from './deliverable-kinds';

// Six looks for one chip, drawn side by side so one can be chosen. `link` is what shipped, kept as
// the baseline the other five are argued against and as the default nothing has to change to keep.
//
// Scaffolding: once a look is picked this file goes and its classes move back inline. Deliberately
// not annotated — a type here would widen the literals `ChipVariant` derives from.
export const CHIP_VARIANTS = ['link', 'ink', 'pill', 'outline', 'rule', 'solid'] as const;

export type ChipVariant = (typeof CHIP_VARIANTS)[number];

export const DEFAULT_CHIP_VARIANT: ChipVariant = 'link';

export interface ChipVariantStyle {
  // What the comparison page calls it, and the one line under it.
  label: string;
  note: string;
  // The chip's own box. Takes the kind's color because most of these paint with it.
  root: (color: DeliverableKindColor) => string;
  // `null` draws no icon — `rule` names the kind in words instead, which is the whole difference.
  icon: ((color: DeliverableKindColor) => string) | null;
  // A short bar in the kind's color, before everything else.
  rail: ((color: DeliverableKindColor) => string) | null;
  // Whether the kind says its own name beside the title.
  showKind: boolean;
}

const CHIP_VARIANT_STYLE: Record<ChipVariant, ChipVariantStyle> = {
  link: {
    label: 'Current',
    note: 'What ships today: everything is link-blue, including the Storybook mark.',
    root: () => 'text-link hover:underline',
    icon: () => '',
    rail: null,
    showKind: false
  },
  ink: {
    label: 'Brand ink',
    note: "Same shape, but the icon takes its kind's color and the title reads as text.",
    root: () => 'text-foreground/90 hover:text-foreground hover:underline',
    icon: (color) => color.text,
    rail: null,
    showKind: false
  },
  pill: {
    label: 'Tinted pill',
    note: "The kind's color as a soft ground. Reads as a badge rather than as a link.",
    root: (color) =>
      `rounded-full px-2 py-0.5 text-foreground ${color.tint} ${color.tintHover} transition-colors`,
    icon: (color) => color.text,
    rail: null,
    showKind: false
  },
  outline: {
    label: 'Outlined',
    note: "A bordered box on the panel's own radius, color carried by the icon alone.",
    root: () =>
      'rounded-md border border-border px-2 py-0.5 text-foreground hover:bg-accent transition-colors',
    icon: (color) => color.text,
    rail: null,
    showKind: false
  },
  rule: {
    label: 'Kind rule',
    note: 'A brand rail and the kind in words — the only one that says what a chip is unhovered.',
    root: () => 'gap-2 text-foreground hover:underline',
    icon: null,
    rail: (color) => color.fill,
    showKind: true
  },
  solid: {
    label: 'Solid brand',
    note: 'Full saturation. A Storybook chip is unmistakably Storybook, and it is loud.',
    root: (color) => `rounded-md px-2 py-0.5 text-background ${color.fill} hover:opacity-90`,
    icon: () => '',
    rail: null,
    showKind: false
  }
};

export const chipVariantStyle = (variant: ChipVariant): ChipVariantStyle =>
  CHIP_VARIANT_STYLE[variant];
