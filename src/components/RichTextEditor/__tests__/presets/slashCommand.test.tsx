import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SuggestionMenu } from '../../presets/SuggestionMenu';
import { defaultSlashCommands } from '../../presets/slashCommand';

// ---------------------------------------------------------------------------
// NOTE: Full TipTap slash-command suggestion integration (typing "/" into the
// ProseMirror editable and observing the ReactRenderer-mounted portal) requires
// DOMRect.fromRect / document.createRange which happy-dom does not implement.
// We unit-test the defaultSlashCommands array structure and the SuggestionMenu
// component with slash-command-shaped items (same shape, different type tag).
// The run() callbacks are tested via mock editor assertions.
// ---------------------------------------------------------------------------

describe('defaultSlashCommands — structure', () => {
  it('exports 6 default commands', () => {
    expect(defaultSlashCommands).toHaveLength(6);
  });

  it('each command has title, icon and run function', () => {
    for (const cmd of defaultSlashCommands) {
      expect(typeof cmd.title).toBe('string');
      expect(cmd.title.length).toBeGreaterThan(0);
      expect(typeof cmd.icon).toBe('string');
      expect(typeof cmd.run).toBe('function');
    }
  });

  it('includes Heading 2, Heading 3, Bullet List, Ordered List, Quote, Code', () => {
    const titles = defaultSlashCommands.map((c) => c.title);
    expect(titles).toContain('Heading 2');
    expect(titles).toContain('Heading 3');
    expect(titles).toContain('Bullet List');
    expect(titles).toContain('Ordered List');
    expect(titles).toContain('Quote');
    expect(titles).toContain('Code');
  });

  it('Heading 2 run calls editor.chain().focus().deleteRange().setHeading()', () => {
    const run = vi.fn();
    const chain = { focus: () => chain, deleteRange: () => chain, setHeading: () => chain, run };
    const mockEditor = { chain: () => chain } as unknown as Parameters<typeof defaultSlashCommands[0]['run']>[0];
    const mockRange = { from: 0, to: 1 } as unknown as Parameters<typeof defaultSlashCommands[0]['run']>[1];

    const h2 = defaultSlashCommands.find((c) => c.title === 'Heading 2')!;
    h2.run(mockEditor, mockRange);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('Bullet List run calls chain().toggleBulletList()', () => {
    const run = vi.fn();
    const chain = { focus: () => chain, deleteRange: () => chain, toggleBulletList: () => chain, run };
    const mockEditor = { chain: () => chain } as unknown as Parameters<typeof defaultSlashCommands[0]['run']>[0];
    const mockRange = { from: 0, to: 1 } as unknown as Parameters<typeof defaultSlashCommands[0]['run']>[1];

    const bulletList = defaultSlashCommands.find((c) => c.title === 'Bullet List')!;
    bulletList.run(mockEditor, mockRange);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('Code run calls chain().toggleCode()', () => {
    const run = vi.fn();
    const chain = { focus: () => chain, deleteRange: () => chain, toggleCode: () => chain, run };
    const mockEditor = { chain: () => chain } as unknown as Parameters<typeof defaultSlashCommands[0]['run']>[0];
    const mockRange = { from: 0, to: 1 } as unknown as Parameters<typeof defaultSlashCommands[0]['run']>[1];

    const code = defaultSlashCommands.find((c) => c.title === 'Code')!;
    code.run(mockEditor, mockRange);
    expect(run).toHaveBeenCalledTimes(1);
  });
});

describe('SuggestionMenu with slash commands — keyboard transitions', () => {
  it('renders all 6 default commands as options', () => {
    render(
      <SuggestionMenu
        items={defaultSlashCommands}
        selectedIndex={0}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(6);
  });

  it('highlights the correct option when selectedIndex changes', () => {
    const { rerender } = render(
      <SuggestionMenu
        items={defaultSlashCommands}
        selectedIndex={0}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );

    let options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');

    rerender(
      <SuggestionMenu
        items={defaultSlashCommands}
        selectedIndex={3}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );

    options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[3]).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onSelect with clicked index', () => {
    const onSelect = vi.fn();
    render(
      <SuggestionMenu
        items={defaultSlashCommands}
        selectedIndex={0}
        onSelect={onSelect}
        dir="ltr"
      />,
    );
    const options = screen.getAllByRole('option');
    fireEvent.mouseDown(options[4]); // Quote
    expect(onSelect).toHaveBeenCalledWith(4);
  });

  it('renders icons alongside titles', () => {
    render(
      <SuggestionMenu
        items={defaultSlashCommands}
        selectedIndex={0}
        onSelect={vi.fn()}
        dir="ltr"
      />,
    );
    // Each command has an icon — spot check H2 and bullet
    expect(screen.getByText('H2')).toBeInTheDocument();
    expect(screen.getByText('•')).toBeInTheDocument();
  });
});
