import type { Preview } from '@storybook/react';
import '../src/tokens/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#070715' },
        { name: 'light', value: '#F8F8F8' },
      ],
    },
    controls: { expanded: true },
    layout: 'centered',
  },
  initialGlobals: {
    backgrounds: { value: '#070715' },
  },
};

export default preview;
