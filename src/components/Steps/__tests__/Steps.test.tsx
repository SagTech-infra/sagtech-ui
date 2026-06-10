import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Steps from '../Steps';

describe('Steps', () => {
  it('renders every step title and description', () => {
    const list = [
      { title: 'Discovery', description: 'Analyze requirements' },
      { title: 'Design', description: 'Wireframes and mockups' },
    ];
    render(<Steps stepsList={list} />);
    expect(screen.getByText('Discovery')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Analyze requirements')).toBeInTheDocument();
  });

  it('renders a self-contained svg icon (not a hosted <img>) for a step with an icon', () => {
    const { container } = render(
      <Steps stepsList={[{ title: 'Setup', description: 'with icon', icon: 'users' }]} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });
});
