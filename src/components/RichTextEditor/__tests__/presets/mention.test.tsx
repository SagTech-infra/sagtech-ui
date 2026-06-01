import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SuggestionMenu } from '../../presets/SuggestionMenu';
import type { MentionItem } from '../../presets/types';

// ---------------------------------------------------------------------------
// NOTE: Full TipTap mention suggestion integration (typing "@" + observing the
// menu rendered via ReactRenderer into a portal) requires document.createRange
// and DOMRect.fromRect which happy-dom does not implement reliably.  The
// SuggestionMenu component and the keyboard navigation logic are therefore
// tested in isolation here.  The integration path (typing trigger, dispatching
// events to ProseMirror) is covered by Storybook stories and manual QA.
// ---------------------------------------------------------------------------

const ITEMS: MentionItem[] = [
  { id: '1', label: 'Alice' },
  { id: '2', label: 'Bob' },
  { id: '3', label: 'Charlie' },
];

describe('SuggestionMenu — rendering', () => {
  it('renders all items as options', () => {
    render(
      <SuggestionMenu
        items={ITEMS}
        selectedIndex={0}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('marks the selectedIndex item as aria-selected', () => {
    render(
      <SuggestionMenu
        items={ITEMS}
        selectedIndex={1}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSelect with the correct index on mousedown', () => {
    const onSelect = vi.fn();
    render(
      <SuggestionMenu
        items={ITEMS}
        selectedIndex={0}
        onSelect={onSelect}
        dir="ltr"
      />,
    );
    const options = screen.getAllByRole('option');
    fireEvent.mouseDown(options[2]);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('renders nothing when items list is empty', () => {
    const { container } = render(
      <SuggestionMenu
        items={[]}
        selectedIndex={0}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('sets dir attribute from prop', () => {
    render(
      <SuggestionMenu
        items={ITEMS}
        selectedIndex={0}
        onSelect={vi.fn()}
        dir="rtl"
      />,
    );
    expect(screen.getByRole('listbox')).toHaveAttribute('dir', 'rtl');
  });
});

describe('SuggestionMenu — SlashCommand items with icon', () => {
  it('renders icon when item has icon property', () => {
    const slashItems = [
      { title: 'Heading 2', icon: 'H2', run: vi.fn() },
      { title: 'Bullet List', icon: '•', run: vi.fn() },
    ];
    render(
      <SuggestionMenu
        items={slashItems}
        selectedIndex={0}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );
    expect(screen.getByText('H2')).toBeInTheDocument();
    expect(screen.getByText('•')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
    expect(screen.getByText('Bullet List')).toBeInTheDocument();
  });

  it('calls onSelect with correct index for slash commands', () => {
    const onSelect = vi.fn();
    const slashItems = [
      { title: 'Heading 2', icon: 'H2', run: vi.fn() },
      { title: 'Code', icon: '<>', run: vi.fn() },
    ];
    render(
      <SuggestionMenu
        items={slashItems}
        selectedIndex={0}
        onSelect={onSelect}
        dir="ltr"
      />,
    );
    const options = screen.getAllByRole('option');
    fireEvent.mouseDown(options[1]);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
