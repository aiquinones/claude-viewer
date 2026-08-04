import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ViewSlider } from './ViewSlider';

// The slide only means anything in motion, so the stories drive it from a button rather than a
// static prop. Toggle the theme and reduced-motion to check both paths.
const meta: Meta<typeof ViewSlider> = {
  title: 'Landing/ViewSlider',
  component: ViewSlider
};

export default meta;

type Story = StoryObj<typeof ViewSlider>;

const Pane = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 bg-card">
    <span className="text-sm font-semibold">{label}</span>
    <button type="button" className="cursor-pointer text-xs underline" onClick={onClick}>
      slide
    </button>
  </div>
);

const Interactive = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const toggle = (): void => setShowDetail((previous) => !previous);

  return (
    <ViewSlider
      showDetail={showDetail}
      home={<Pane label="Home" onClick={toggle} />}
      detail={<Pane label="Detail" onClick={toggle} />}
    />
  );
};

export const Slides: Story = { render: () => <Interactive /> };

// Where it rests when a surface is open. Home is still mounted, just hidden.
export const DetailOpen: Story = {
  args: {
    showDetail: true,
    home: <div className="p-6 text-sm">Home</div>,
    detail: <div className="p-6 text-sm">Detail</div>
  }
};
