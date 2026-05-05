import type { Meta, StoryObj } from '@storybook/react';
import Globe3D from './Globe3D';
import type { Globe3DMarker } from './types';

const meta = {
  title: 'Data Display/Globe3D',
  component: Globe3D,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 500, height: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Globe3D>;

export default meta;
type Story = StoryObj<typeof meta>;

const markers: Globe3DMarker[] = [
  { lat: 40.7128, lng: -74.006, label: 'New York' },
  { lat: 51.5074, lng: -0.1278, label: 'London' },
  { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  { lat: -33.8688, lng: 151.2093, label: 'Sydney' },
  { lat: 55.7558, lng: 37.6173, label: 'Moscow' },
];

export const Basic: Story = {
  args: {
    markers,
    width: 500,
    height: 500,
    autoRotate: true,
    onMarkerClick: (m) => console.log('clicked marker', m),
  },
};
