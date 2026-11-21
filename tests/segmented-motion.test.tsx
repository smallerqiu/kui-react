import { act, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Segmented from "../components/segmented";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it.each([false, true])(
  "only animates selection changes, not visibility or layout (vertical=%s)",
  (vertical) => {
    let hidden = false;
    let size = 50;
    let notify = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          notify = callback;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    for (const key of ["offsetWidth", "offsetHeight", "offsetLeft", "offsetTop"] as const) {
      vi.spyOn(HTMLElement.prototype, key, "get").mockImplementation(function (this: HTMLElement) {
        if (hidden) return 0;
        if (key === "offsetWidth" || key === "offsetHeight") return size;
        return this.textContent === "B" ? size : 0;
      });
    }
    const direction = vertical ? "vertical" : "horizontal";
    const options = ["A", "B"];
    const { container, rerender, unmount } = render(
      <Segmented options={options} value="A" direction={direction} />,
    );
    const indicator = () => container.querySelector(".k-segmented-indicator")!;
    expect(indicator().classList.contains("is-ready")).toBe(true);
    expect(indicator().classList.contains("is-animating")).toBe(false);
    rerender(<Segmented options={options} value="B" direction={direction} />);
    expect(indicator().classList.contains("is-animating")).toBe(true);
    act(() => notify());
    expect(indicator().classList.contains("is-animating")).toBe(true);
    act(() => {
      hidden = true;
      notify();
    });
    expect(indicator().classList.contains("is-ready")).toBe(false);
    rerender(<Segmented options={options} value="A" direction={direction} />);
    act(() => {
      hidden = false;
      notify();
    });
    expect(indicator().classList.contains("is-ready")).toBe(true);
    expect(indicator().classList.contains("is-animating")).toBe(false);
    rerender(<Segmented options={options} value="B" direction={direction} />);
    expect(indicator().classList.contains("is-animating")).toBe(true);
    act(() => {
      size = 80;
      notify();
    });
    expect(indicator().classList.contains("is-animating")).toBe(false);
    expect(indicator().getAttribute("style")).toContain(vertical ? "top: 80px" : "left: 80px");
    unmount();
    expect(disconnect).toHaveBeenCalled();
  },
);

it("positions directly when mounted hidden, including after an unmatched value", () => {
  let size = 0;
  let notify = () => {};
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        notify = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(() => size);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(() => size);
  const options = ["A", "B"];
  const { container, rerender } = render(<Segmented options={options} value="B" />);
  const indicator = () => container.querySelector(".k-segmented-indicator")!;
  expect(indicator().classList.contains("is-ready")).toBe(false);
  act(() => {
    size = 50;
    notify();
  });
  expect(indicator().classList.contains("is-ready")).toBe(true);
  expect(indicator().classList.contains("is-animating")).toBe(false);
  rerender(<Segmented options={options} value="missing" />);
  rerender(<Segmented options={options} value="A" />);
  expect(indicator().classList.contains("is-animating")).toBe(false);
});
