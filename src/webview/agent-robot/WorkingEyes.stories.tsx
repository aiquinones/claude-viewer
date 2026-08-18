import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';
import { Robot } from '../loading/Robot';
import { RobotHead } from './RobotHead';

// Working is the mood with nowhere to hide. The other three carry something beside the head — Zs, a
// ?, three dots — and read from across the room on that alone. Working has only its eyes, so this
// is the one shape that has to earn its difference from the icon without a prop.
//
// A first pass slanted them inward and they fused into a single V at row size. These are the ways
// out; nothing here changes the head.
const meta: Meta = {
  title: 'Agents/Working eyes',
  parameters: { layout: 'centered' }
};

export default meta;

interface EyeOption {
  id: string;
  label: string;
  note: string;
  eyes: ReactNode;
}

// Each pair keeps the icon's eye positions — x 13 and 19, centred on y 18 — and changes only the
// mark drawn there.
const OPTIONS: EyeOption[] = [
  {
    id: 'icon',
    label: 'the icon, unchanged',
    note: 'working is the default state, so it may be right that it looks like the plain icon',
    eyes: (
      <>
        <path className="bot-eye" d="M13 17v2" />
        <path className="bot-eye" d="M19 17v2" />
      </>
    )
  },
  {
    id: 'inward',
    label: 'inward slant',
    note: 'the first pass — the two strokes read as one V at small sizes',
    eyes: (
      <>
        <path className="bot-eye" d="M12.6 16.6 13.8 19" />
        <path className="bot-eye" d="M19.4 16.6 18.2 19" />
      </>
    )
  },
  {
    id: 'parallel',
    label: 'parallel slant',
    note: 'both eyes lean the same way, so they cannot fuse into a shape',
    eyes: (
      <>
        <path className="bot-eye" d="M12.4 16.6 13.6 19" />
        <path className="bot-eye" d="M18.4 16.6 19.6 19" />
      </>
    )
  },
  {
    id: 'lowered',
    label: 'lowered ticks',
    note: 'the icon’s eyes, shorter and dropped — heads down, looking at the keyboard',
    eyes: (
      <>
        <path className="bot-eye" d="M13 18.2v1.6" />
        <path className="bot-eye" d="M19 18.2v1.6" />
      </>
    )
  },
  {
    id: 'squint',
    label: 'squint',
    note: 'horizontal dashes — the most legible small, the furthest from the icon',
    eyes: (
      <>
        <path className="bot-eye" d="M11.9 18h2.2" />
        <path className="bot-eye" d="M17.9 18h2.2" />
      </>
    )
  }
];

const SIZES: string[] = ['size-24', 'size-12', 'size-8'];

interface CandidateProps {
  option: EyeOption;
  size: string;
}

// A working robot with one candidate pair of eyes. `agent-robot--working` is what colours it green
// and runs the bob and the scan, so each candidate is animated exactly as it would ship.
const Candidate = ({ option, size }: CandidateProps) => (
  <svg
    viewBox="-2 0 36 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={`agent-robot agent-robot--working ${size}`}
  >
    <RobotHead face={option.eyes} />
  </svg>
);

// Every candidate at every size, with the icon at the top for reference. The smallest column is the
// one that decides it — that is roughly what a row of these looks like from across the room.
export const Candidates: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center gap-6 border-b border-border pb-5">
        <span className="w-36 shrink-0 text-xs text-muted-foreground">the icon</span>
        {SIZES.map((size) => (
          <Robot key={size} className={size} />
        ))}
      </div>

      {OPTIONS.map((option) => (
        <div key={option.id} className="flex items-center gap-6">
          <span className="w-36 shrink-0">
            <span className="block text-sm font-medium">{option.label}</span>
            <span className="block text-xs text-muted-foreground">{option.note}</span>
          </span>
          {SIZES.map((size) => (
            <Candidate key={size} option={option} size={size} />
          ))}
        </div>
      ))}
    </div>
  )
};
