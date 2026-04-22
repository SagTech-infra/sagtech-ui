import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InfoTabs from '../InfoTabs';

describe('InfoTabs', () => {
  const list = [
    { title: 'Tab A', description: 'A content', role: 'a' },
    { title: 'Tab B', description: 'B content', role: 'b' },
  ];

  it('renders the section title and every tab button', () => {
    render(<InfoTabs title="Section" list={list} />);
    expect(screen.getByText('Section')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: 'set tab' });
    expect(buttons).toHaveLength(list.length);
    expect(buttons[0]).toHaveTextContent('Tab A');
    expect(buttons[1]).toHaveTextContent('Tab B');
  });

  it('renders arrow icons via the default <img> shim', () => {
    render(<InfoTabs title="Section" list={list} />);
    const arrows = screen.getAllByAltText('arrow');
    expect(arrows.length).toBeGreaterThan(0);
    expect(arrows[0].tagName).toBe('IMG');
  });

  it('switches active tab highlight when another tab button is clicked', async () => {
    render(<InfoTabs title="Section" list={list} />);
    const buttons = screen.getAllByRole('button', { name: 'set tab' });
    const [tabA, tabB] = buttons;
    const labelA = tabA.querySelector('h4');
    const labelB = tabB.querySelector('h4');
    expect(labelA?.className).toMatch(/text-pr_purple/);
    expect(labelB?.className).toMatch(/text-white_4/);

    fireEvent.click(tabB);

    await waitFor(() => {
      expect(labelA?.className).toMatch(/text-white_4/);
      expect(labelB?.className).toMatch(/text-pr_purple/);
    });
  });
});
