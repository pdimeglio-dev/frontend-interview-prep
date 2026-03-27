import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { InfiniteFeed } from "./InfiniteFeed";

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    mockObserverInstance = this;
  }

  observe(el: Element) {
    this.elements.push(el);
  }

  unobserve() {}
  disconnect() {}

  // Helper to simulate intersection
  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

let mockObserverInstance: MockIntersectionObserver | null = null;

describe("InfiniteFeed", () => {
  beforeEach(() => {
    mockObserverInstance = null;
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  const makeFetchPage = (totalPages: number) => {
    return vi.fn(async (page: number) => {
      if (page > totalPages) return [];
      return Array.from({ length: 5 }, (_, i) => ({
        id: `${page}-${i}`,
        title: `Page ${page} Item ${i}`,
      }));
    });
  };

  it("should render the feed container and sentinel", () => {
    const fetchPage = makeFetchPage(3);
    render(<InfiniteFeed fetchPage={fetchPage} />);

    expect(screen.getByTestId("infinite-feed")).toBeInTheDocument();
    expect(screen.getByTestId("sentinel")).toBeInTheDocument();
  });

  it("should fetch page 1 on initial load", async () => {
    const fetchPage = makeFetchPage(3);
    render(<InfiniteFeed fetchPage={fetchPage} />);

    await waitFor(() => {
      expect(fetchPage).toHaveBeenCalledWith(1);
    });
  });

  it("should render items from the first page", async () => {
    const fetchPage = makeFetchPage(3);
    render(<InfiniteFeed fetchPage={fetchPage} />);

    await waitFor(() => {
      expect(screen.getByText("Page 1 Item 0")).toBeInTheDocument();
      expect(screen.getByText("Page 1 Item 4")).toBeInTheDocument();
    });
  });

  it("should fetch next page when sentinel becomes visible", async () => {
    const fetchPage = makeFetchPage(3);
    render(<InfiniteFeed fetchPage={fetchPage} />);

    await waitFor(() => {
      expect(fetchPage).toHaveBeenCalledWith(1);
    });

    // Simulate sentinel becoming visible
    mockObserverInstance?.trigger(true);

    await waitFor(() => {
      expect(fetchPage).toHaveBeenCalledWith(2);
    });
  });

  it("should append data from subsequent pages", async () => {
    const fetchPage = makeFetchPage(3);
    render(<InfiniteFeed fetchPage={fetchPage} />);

    await waitFor(() => {
      expect(screen.getByText("Page 1 Item 0")).toBeInTheDocument();
    });

    mockObserverInstance?.trigger(true);

    await waitFor(() => {
      // Page 1 items still there
      expect(screen.getByText("Page 1 Item 0")).toBeInTheDocument();
      // Page 2 items added
      expect(screen.getByText("Page 2 Item 0")).toBeInTheDocument();
    });
  });

  it("should stop fetching when empty array is returned", async () => {
    const fetchPage = makeFetchPage(1); // only 1 page of data
    render(<InfiniteFeed fetchPage={fetchPage} />);

    await waitFor(() => {
      expect(fetchPage).toHaveBeenCalledWith(1);
    });

    mockObserverInstance?.trigger(true);

    await waitFor(() => {
      expect(fetchPage).toHaveBeenCalledWith(2);
    });

    // Trigger again — should NOT fetch page 3
    mockObserverInstance?.trigger(true);

    // Wait a bit, then verify no page 3 call
    await new Promise((r) => setTimeout(r, 100));
    expect(fetchPage).not.toHaveBeenCalledWith(3);
  });
});
