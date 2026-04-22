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

  it('renders an <img> for a step with an icon (default shim)', () => {
    render(
      <Steps
        stepsList={[{ title: 'Setup', description: 'with icon', icon: 'users' }]}
      />,
    );
    const img = screen.getByAltText('users');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/svg/icons/users.svg');
  });
});
