import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VirtualList } from "./VirtualList";

describe("VirtualList", () => {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);
  const itemHeight = 40;
  const windowHeight = 200; // shows 5 items + buffer

  it("should render a scrollable container", () => {
    render(<VirtualList items={items} itemHeight={itemHeight} windowHeight={windowHeight} />);
    const container = screen.getByTestId("virtual-list-container");
    expect(container).toBeInTheDocument();
    expect(container.style.height).toBe(`${windowHeight}px`);
    expect(container.style.overflowY).toBe("auto");
  });

  it("should NOT render all 1000 items", () => {
    render(<VirtualList items={items} itemHeight={itemHeight} windowHeight={windowHeight} />);
    const renderedItems = screen.getAllByText(/^Item \d+$/);
    expect(renderedItems.length).toBeLessThan(20); // way less than 1000
  });

  it("should render items near the top initially", () => {
    render(<VirtualList items={items} itemHeight={itemHeight} windowHeight={windowHeight} />);
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
  });

  it("should use absolute positioning for items", () => {
    render(<VirtualList items={items} itemHeight={itemHeight} windowHeight={windowHeight} />);
    const item = screen.getByText("Item 0");
    expect(item.parentElement?.style.position || item.style.position).toBe("absolute");
  });

  it("should have a tall inner container for scrollbar", () => {
    render(<VirtualList items={items} itemHeight={itemHeight} windowHeight={windowHeight} />);
    const container = screen.getByTestId("virtual-list-container");
    const inner = container.firstElementChild as HTMLElement;
    expect(parseInt(inner.style.height)).toBe(items.length * itemHeight);
  });

  it("should update visible items on scroll", () => {
    render(<VirtualList items={items} itemHeight={itemHeight} windowHeight={windowHeight} />);
    const container = screen.getByTestId("virtual-list-container");

    // Scroll down to show items around index 25
    fireEvent.scroll(container, { target: { scrollTop: 1000 } });

    expect(screen.getByText("Item 25")).toBeInTheDocument();
    expect(screen.queryByText("Item 0")).not.toBeInTheDocument();
  });
});
