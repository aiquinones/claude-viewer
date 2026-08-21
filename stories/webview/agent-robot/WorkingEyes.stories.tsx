import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties } from 'react';
import { Robot } from '@src/webview/loading/Robot';
import { RobotHead } from '@src/webview/agent-robot/RobotHead';

// Working is the mood with the least to say with its face. The other three carry something beside
// the head — Zs, a ?, three dots — and this one has a page, so its eyes only have to not contradict
// that. These are the pairs tried, kept because the argument comes back around.
//
// `lowered` is what ships. `inward` was the first pass and fuses into a single V at row size.
const meta: Meta = {
  title: 'Agents/Working eyes',
  parameters: { layout: 'centered' }
};

export default meta;

interface EyeOption {
  id: string;
  label: string;
  note: string;
  left: string;
  right: string;
  // Where the pair's middle sits, which is the point a blink scales about. It is not the same for
  // every candidate — `lowered` sits a unit below the rest — and getting it wrong is not subtle:
  // under `transform-box: view-box` an unset origin falls back to the centre of the whole picture,
  // so the eye shrinks towards (16,16) and visibly climbs the face as it shuts.
  centreY: number;
}

// Each pair keeps the icon's eye columns — x 13 and 19 — and changes only the mark drawn there.
const OPTIONS: EyeOption[] = [
  {
    id: 'icon',
    label: 'the icon, unchanged',
    note: 'the same eyes every other mood wears',
    left: 'M13 17v2',
    right: 'M19 17v2',
    centreY: 18
  },
  {
    id: 'lowered',
    label: 'lowered ticks',
    note: 'shorter and dropped a unit — heads down, looking at the page. This is the one that ships',
    left: 'M13 18.2v1.6',
    right: 'M19 18.2v1.6',
    centreY: 19
  },
  {
    id: 'inward',
    label: 'inward slant',
    note: 'the first pass — the two strokes read as one V at small sizes',
    left: 'M12.6 16.6 13.8 19',
    right: 'M19.4 16.6 18.2 19',
    centreY: 17.8
  },
  {
    id: 'parallel',
    label: 'parallel slant',
    note: 'both eyes lean the same way, so they cannot fuse into a shape',
    left: 'M12.4 16.6 13.6 19',
    right: 'M18.4 16.6 19.6 19',
    centreY: 17.8
  },
  {
    id: 'squint',
    label: 'squint',
    note: 'horizontal dashes — the most legible small, the furthest from the icon',
    left: 'M11.9 18h2.2',
    right: 'M17.9 18h2.2',
    centreY: 18
  }
];

const SIZES: string[] = ['size-24', 'size-12', 'size-8'];

interface CandidateProps {
  option: EyeOption;
  size: string;
}

// A working robot with one candidate pair. `agent-robot--working` is what colours it green and runs
// the bob, the scan and the blink, so each candidate animates exactly as it would ship — minus the
// page, which is the same in every case and only competes for attention here.
//
// The origins are inline rather than from `.bot-eye-left`/`.bot-eye-right`, since those name one
// height and this file compares five.
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
    <RobotHead
      face={
        <>
          <path
            className="bot-eye"
            style={{ transformOrigin: `13px ${option.centreY}px` } as CSSProperties}
            d={option.left}
          />
          <path
            className="bot-eye"
            style={{ transformOrigin: `19px ${option.centreY}px` } as CSSProperties}
            d={option.right}
          />
        </>
      }
    />
  </svg>
);

// Every candidate at every size, with the icon at the top for reference. The smallest column is the
// one that decides it — that is roughly what a row of these looks like from across the room.
export const Candidates: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center gap-6 border-b border-border pb-5">
        <span className="w-40 shrink-0 text-xs text-muted-foreground">the icon</span>
        {SIZES.map((size) => (
          <Robot key={size} className={size} />
        ))}
      </div>

      {OPTIONS.map((option) => (
        <div key={option.id} className="flex items-center gap-6">
          <span className="w-40 shrink-0">
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
