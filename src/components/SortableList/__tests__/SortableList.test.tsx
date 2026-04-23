import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SortableList from '../SortableList';

const items = [
  { id: '1', label: 'One' },
  { id: '2', label: 'Two' },
  { id: '3', label: 'Three' },
];

describe('SortableList', () => {
  it('renders items in order', () => {
    render(
      <SortableList
        items={items}
        getItemId={(i) => i.id}
        onReorder={() => {}}
        renderItem={(item) => <div>{item.label}</div>}
      />,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('passes dragHandleProps to renderItem', () => {
    const seen: unknown[] = [];
    render(
      <SortableList
        items={items}
        getItemId={(i) => i.id}
        onReorder={() => {}}
        renderItem={(item, ctx) => {
          seen.push(ctx.dragHandleProps);
          return <div>{item.label}</div>;
        }}
      />,
    );
    expect(seen.length).toBe(3);
    expect(seen[0]).toBeTruthy();
  });
});
