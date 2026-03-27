/**
 * Implement VirtualList here.
 * See README.md for the full problem description.
 */

interface VirtualListProps {
  items: React.ReactNode[];
  itemHeight: number;
  windowHeight: number;
}

export function VirtualList({ items, itemHeight, windowHeight }: VirtualListProps) {
  // TODO: Implement this
  return (
    <div
      data-testid="virtual-list-container"
      style={{ height: windowHeight, overflowY: "auto", position: "relative" }}
    >
      <div style={{ height: items.length * itemHeight }}>
        {/* Render visible items here with position: absolute */}
      </div>
    </div>
  );
}
