import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AutoComplete } from "./AutoComplete";

describe("AutoComplete", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllTimers();
  });

  const mockFetch = vi.fn();

  it("should render an input", () => {
    render(<AutoComplete fetchResults={mockFetch} />);
    expect(screen.getByTestId("autocomplete-input")).toBeInTheDocument();
  });

  it("should debounce — not fetch immediately on typing", () => {
    render(<AutoComplete fetchResults={mockFetch} />);
    const input = screen.getByTestId("autocomplete-input");

    fireEvent.change(input, { target: { value: "react" } });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should fetch after debounce delay", async () => {
    mockFetch.mockResolvedValue([{ id: "1", name: "React" }]);
    render(<AutoComplete fetchResults={mockFetch} />);
    const input = screen.getByTestId("autocomplete-input");

    fireEvent.change(input, { target: { value: "react" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("react");
    });
  });

  it("should display results after fetch resolves", async () => {
    mockFetch.mockResolvedValue([
      { id: "1", name: "React" },
      { id: "2", name: "React Native" },
    ]);
    render(<AutoComplete fetchResults={mockFetch} />);
    const input = screen.getByTestId("autocomplete-input");

    fireEvent.change(input, { target: { value: "react" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("React Native")).toBeInTheDocument();
    });
  });

  it("should clear results when input is emptied", async () => {
    mockFetch.mockResolvedValue([{ id: "1", name: "React" }]);
    render(<AutoComplete fetchResults={mockFetch} />);
    const input = screen.getByTestId("autocomplete-input");

    fireEvent.change(input, { target: { value: "react" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "" } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.queryByText("React")).not.toBeInTheDocument();
    });
  });

  it("should reset debounce timer on rapid typing", () => {
    render(<AutoComplete fetchResults={mockFetch} />);
    const input = screen.getByTestId("autocomplete-input");

    fireEvent.change(input, { target: { value: "r" } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: "re" } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: "rea" } });
    vi.advanceTimersByTime(100);

    // 300ms haven't passed since last keystroke
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
