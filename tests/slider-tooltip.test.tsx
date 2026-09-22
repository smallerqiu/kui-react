import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Thumb from "../components/slider/thumb";
import Slider from "../components/slider";
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
it.each([false, true])(
  "keeps the tooltip open during a real document drag (vertical=%s)",
  async (vertical) => {
    vi.useFakeTimers();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 200, 200),
    );
    render(<Slider value={30} vertical={vertical} />);
    const thumb = screen.getByRole("slider");
    fireEvent.mouseEnter(thumb);
    fireEvent.mouseDown(thumb, { button: 0 });
    fireEvent.mouseLeave(thumb);
    fireEvent.mouseMove(document, { clientX: 150, clientY: 150, buttons: 1 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(thumb.getAttribute("aria-expanded")).toBe("true");
    expect(document.querySelector(".k-tooltip-title")?.textContent).toBe(
      thumb.getAttribute("aria-valuenow"),
    );
    fireEvent.mouseUp(document);
    expect(thumb.getAttribute("aria-expanded")).toBe("false");
  },
);
it.each([null, true, false])(
  "keeps tooltip visibility correct during dragging with tooltipVisible=%s",
  async (tooltipVisible) => {
    vi.useFakeTimers();
    const { rerender } = render(<Thumb value={30} dragging tooltipVisible={tooltipVisible} />);
    const thumb = screen.getByRole("slider");
    fireEvent.mouseEnter(thumb);
    fireEvent.mouseLeave(thumb);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(thumb.getAttribute("aria-expanded")).toBe(String(tooltipVisible !== false));
    rerender(<Thumb value={60} dragging tooltipVisible={tooltipVisible} />);
    expect(thumb.getAttribute("aria-expanded")).toBe(String(tooltipVisible !== false));
    if (tooltipVisible !== false)
      expect(document.querySelector(".k-tooltip-title")?.textContent).toBe("60");
    rerender(<Thumb value={60} tooltipVisible={tooltipVisible} />);
    expect(thumb.getAttribute("aria-expanded")).toBe(String(tooltipVisible === true));
  },
);
it("still opens on hover and closes after leaving without dragging", async () => {
  vi.useFakeTimers();
  render(<Thumb value={30} />);
  const thumb = screen.getByRole("slider");
  fireEvent.mouseEnter(thumb);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000);
  });
  expect(thumb.getAttribute("aria-expanded")).toBe("true");
  fireEvent.mouseLeave(thumb);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000);
  });
  expect(thumb.getAttribute("aria-expanded")).toBe("false");
});
