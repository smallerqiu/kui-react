import { fireEvent, render, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GradientPicker,
  createCornerGradient,
  createLinearGradient,
  formatGradient,
} from "../components";
import {
  normalizeGradient,
  mixGradientColor,
  type CornerGradientValue,
  type GradientStop,
  type GradientValue,
} from "../components/gradient-picker/types";

const canvasContext = {
  clearRect: vi.fn(),
  createLinearGradient: () => ({ addColorStop: vi.fn() }),
  fillRect: vi.fn(),
  fillStyle: "",
};

const linear = (): GradientValue => [
  { color: "#ff0000", offset: 0 },
  { color: "#00ff00", offset: 50 },
  { color: "#0000ff", offset: 100 },
];

const stopsOf = (value: GradientValue) => value as GradientStop[];
const colorsOf = (value: GradientValue) => value as CornerGradientValue;

// The lane and the hue slider are both 190px wide from x = 0, so clientX / 1.9 is the offset.
const press = (target: Element, x: number, y = 0) =>
  fireEvent.mouseDown(target, { clientX: x, clientY: y, bubbles: true });
const panel = () => document.querySelector(".k-color-picker-panel");

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    canvasContext as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const width = this.classList?.contains("k-color-picker-paint") ? 234 : 190;
    const height = this.classList?.contains("k-color-picker-paint") ? 136 : 8;
    return { width, height, left: 0, top: 0, right: width, bottom: height } as DOMRect;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GradientPicker", () => {
  it("keeps coincident stops inside their bounds", () => {
    const onChange = vi.fn();
    const { container } = render(
      <GradientPicker
        value={[
          { color: "#f00", offset: 0 },
          { color: "#0f0", offset: 0 },
          { color: "#00f", offset: 100 },
        ]}
        onChange={onChange}
      />,
    );
    fireEvent.keyDown(container.querySelector('[role="slider"]')!, { key: "ArrowRight" });
    expect(onChange.mock.calls.at(-1)![0][0].offset).toBe(0);
  });

  it("interpolates transparent colors without adding an invisible hue", () => {
    expect(mixGradientColor("#ff000000", "#0000ff", 0.5)).toBe("#0000ff80");
  });

  it("supports touch dragging and cancellation", () => {
    const onChange = vi.fn();
    const { container } = render(<GradientPicker value={linear()} onChange={onChange} />);
    const marker = container.querySelectorAll('[role="slider"]')[1];
    fireEvent.touchStart(marker, { touches: [{ clientX: 95, clientY: 0 }] });
    fireEvent.touchMove(document, { touches: [{ clientX: 38, clientY: 60 }] });
    expect(onChange.mock.calls.at(-1)![0][1].offset).toBe(20);
    fireEvent.touchCancel(document);
    expect(marker.classList.contains("k-gradient-picker-stop-removing")).toBe(false);
    const count = onChange.mock.calls.length;
    fireEvent.touchMove(document, { touches: [{ clientX: 100, clientY: 60 }] });
    expect(onChange).toHaveBeenCalledTimes(count);
  });
  it("normalizes values and converts between the two types", () => {
    expect(normalizeGradient(undefined)).toEqual(createLinearGradient());
    expect(
      normalizeGradient([
        { color: "#00ff00", offset: 120 },
        { color: "#ff0000", offset: -5 },
      ]),
    ).toEqual([
      { color: "#ff0000", offset: 0 },
      { color: "#00ff00", offset: 100 },
    ]);
    expect(normalizeGradient(undefined, "corner")).toEqual(createCornerGradient());
    expect(normalizeGradient(linear(), "corner")).toEqual([
      "#ff0000",
      "#0000ff",
      "#ff0000",
      "#0000ff",
    ]);
    expect(normalizeGradient(["#ff0000", "#00ff00", "#0000ff", "#ffffff"])).toEqual([
      { color: "#ff0000", offset: 0 },
      { color: "#ffffff", offset: 100 },
    ]);
  });

  it("formats the value as preview CSS without owning the gradient function", () => {
    expect(
      formatGradient([
        { color: "#0000ff", offset: 100 },
        { color: "#ff0000", offset: 0 },
      ]),
    ).toBe("linear-gradient(90deg, #ff0000 0%, #0000ff 100%)");
    const corner = formatGradient(createCornerGradient());
    expect(corner.startsWith("radial-gradient(at 0% 0%, #ff0000")).toBe(true);
    expect(corner.endsWith("linear-gradient(135deg, #ff0000 0%, #0000ff 100%)")).toBe(true);
  });

  it("renders the painted bar itself, without a trigger box", () => {
    const { container, unmount } = render(<GradientPicker value={linear()} />);

    expect(container.querySelector(".k-gradient-picker-bar-fill")?.getAttribute("style")).toContain(
      "linear-gradient(90deg,",
    );
    expect(container.querySelectorAll(".k-gradient-picker-stop")).toHaveLength(3);
    expect(container.querySelector(".k-gradient-picker")?.getAttribute("role")).toBeNull();
    expect(panel()).toBeNull();
    unmount();

    const corner = render(<GradientPicker type="corner" value={createCornerGradient()} />);
    expect(
      corner.container.querySelector(".k-gradient-picker-corners-color")?.getAttribute("style"),
    ).toContain("radial-gradient(at 0% 0%,");
    expect(corner.container.querySelectorAll(".k-gradient-picker-corner")).toHaveLength(4);
  });

  it("mirrors the three control sizes on the root", () => {
    const small = render(<GradientPicker value={linear()} size="small" />);
    expect(small.container.querySelector(".k-gradient-picker")!.className).toContain(
      "k-gradient-picker-sm",
    );
    small.unmount();

    const medium = render(<GradientPicker value={linear()} />);
    const mediumClass = medium.container.querySelector(".k-gradient-picker")!.className;
    expect(mediumClass).not.toContain("k-gradient-picker-sm");
    expect(mediumClass).not.toContain("k-gradient-picker-lg");
    medium.unmount();

    const large = render(<GradientPicker value={linear()} size="large" />);
    expect(large.container.querySelector(".k-gradient-picker")!.className).toContain(
      "k-gradient-picker-lg",
    );
    large.unmount();

    const corner = render(
      <GradientPicker type="corner" value={createCornerGradient()} size="small" />,
    );
    expect(corner.container.querySelector(".k-gradient-picker")!.className).toContain(
      "k-gradient-picker-sm",
    );
    corner.unmount();
  });

  it("adds a stop on click with the interpolated color, without opening the panel", () => {
    const onChange = vi.fn();
    const { container } = render(
      <GradientPicker
        value={[
          { color: "#ff0000", offset: 0 },
          { color: "#00ff00", offset: 100 },
        ]}
        onChange={onChange}
      />,
    );

    // Red to green: halfway is #808000.
    press(container.querySelector(".k-gradient-picker-stops")!, 95);
    fireEvent.mouseUp(document);

    const value = onChange.mock.lastCall?.[0] as GradientValue;
    expect(stopsOf(value)).toEqual([
      { color: "#ff0000", offset: 0 },
      { color: "#808000", offset: 50 },
      { color: "#00ff00", offset: 100 },
    ]);
    const markers = container.querySelectorAll(".k-gradient-picker-stop");
    expect(markers).toHaveLength(3);
    expect(markers[1].className).toContain("k-gradient-picker-stop-active");
    // Adding a stop is not a request to open its color panel.
    expect(panel()).toBeNull();
  });

  it("drags a stop and keeps it between its neighbours", () => {
    const onChange = vi.fn();
    const { container } = render(<GradientPicker value={linear()} onChange={onChange} />);

    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseMove(document, { clientX: 19 });
    fireEvent.mouseUp(document);

    const moved = stopsOf(onChange.mock.lastCall?.[0] as GradientValue);
    expect(moved[1].offset).toBe(10);

    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 19);
    fireEvent.mouseMove(document, { clientX: 190 });
    fireEvent.mouseUp(document);

    const latest = stopsOf(onChange.mock.lastCall?.[0] as GradientValue);
    expect(latest[1].offset).toBe(99.9);
    expect(panel()).toBeNull();
  });

  it("removes a stop only after dragging it down, never below two", () => {
    const onChange = vi.fn();
    const { container } = render(<GradientPicker value={linear()} onChange={onChange} />);

    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseMove(document, { clientX: 95, clientY: 60 });
    expect(container.querySelectorAll(".k-gradient-picker-stop")[1].className).toContain(
      "k-gradient-picker-stop-removing",
    );
    fireEvent.mouseUp(document);

    const removed = stopsOf(onChange.mock.lastCall?.[0] as GradientValue);
    expect(removed.map((stop) => stop.color)).toEqual(["#ff0000", "#0000ff"]);
    expect(container.querySelectorAll(".k-gradient-picker-stop")).toHaveLength(2);

    const before = onChange.mock.calls.length;
    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseMove(document, { clientX: 95, clientY: 60 });
    fireEvent.mouseUp(document);
    const after = onChange.mock.calls.slice(before).map(([next]) => next as GradientValue);
    expect(after.every((next) => Array.isArray(next) && stopsOf(next).length === 2)).toBe(true);
  });

  it("moves and deletes stops from the keyboard", () => {
    const onChange = vi.fn();
    const { container } = render(<GradientPicker value={linear()} onChange={onChange} />);
    const marker = () => container.querySelectorAll(".k-gradient-picker-stop")[1];

    fireEvent.keyDown(marker(), { key: "ArrowRight" });
    expect(stopsOf(onChange.mock.lastCall?.[0] as GradientValue)[1].offset).toBe(51);

    fireEvent.keyDown(marker(), { key: "ArrowLeft", shiftKey: true });
    expect(stopsOf(onChange.mock.lastCall?.[0] as GradientValue)[1].offset).toBe(41);

    fireEvent.keyDown(marker(), { key: "Delete" });
    expect(stopsOf(onChange.mock.lastCall?.[0] as GradientValue)).toHaveLength(2);
  });

  it("opens the color panel when a stop is clicked, not dragged", async () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<GradientPicker value={linear()} onChange={onChange} />);

    // A press that travels is a drag and must not pop the panel.
    press(container.querySelectorAll(".k-gradient-picker-stop")[0], 0);
    fireEvent.mouseMove(document, { clientX: 20 });
    fireEvent.mouseUp(document);
    expect(panel()).toBeNull();

    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseUp(document);
    await waitFor(() => expect(panel()).not.toBeNull());

    expect(document.querySelector(".k-color-picker-paint")).not.toBeNull();
    expect(
      document.querySelector(".k-gradient-picker-color-popup .k-color-picker-arrow svg"),
    ).not.toBeNull();
    expect(
      document.querySelector(".k-gradient-picker-color-popup")?.getAttribute("k-placement"),
    ).toContain("bottom");
    // The panel has no alpha row.
    expect(document.querySelector(".k-color-picker-alpha")).toBeNull();

    const hue = document.querySelector("canvas.k-color-picker-hue")!;
    press(hue, 30);
    fireEvent.mouseUp(document);

    const stops = stopsOf(onChange.mock.lastCall?.[0] as GradientValue);
    expect(stops[1].color).not.toBe("#00ff00");
    expect(stops[1].color).toHaveLength(7);
    expect(stops[0].color).toBe("#ff0000");
    expect(stops[2].color).toBe("#0000ff");
    unmount();
  });

  it("opens the color panel from an activated stop's keyboard", async () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<GradientPicker value={linear()} onChange={onChange} />);

    fireEvent.keyDown(container.querySelectorAll(".k-gradient-picker-stop")[2], { key: "Enter" });
    await waitFor(() => expect(panel()).not.toBeNull());

    press(document.querySelector("canvas.k-color-picker-hue")!, 30);
    fireEvent.mouseUp(document);

    const stops = stopsOf(onChange.mock.lastCall?.[0] as GradientValue);
    expect(stops[2].color).not.toBe("#0000ff");
    expect(stops[2].color).toHaveLength(7);
    expect(stops[0].color).toBe("#ff0000");
    unmount();
  });

  it("shows the opacity row with alpha and keeps the alpha in the color", async () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <GradientPicker value={linear()} alpha onChange={onChange} />,
    );

    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseUp(document);
    await waitFor(() => expect(panel()).not.toBeNull());

    const alpha = document.querySelector("canvas.k-color-picker-alpha")!;
    press(alpha, 0);
    fireEvent.mouseUp(document);

    const stops = stopsOf(onChange.mock.lastCall?.[0] as GradientValue);
    expect(stops[1].color).toBe("#00ff0000");
    expect(stops[0].color).toBe("#ff0000");
    unmount();
  });

  it("edits only the clicked corner", async () => {
    const onChange = vi.fn();
    const { container, unmount } = render(<GradientPicker type="corner" onChange={onChange} />);

    expect(container.querySelectorAll(".k-gradient-picker-corner")).toHaveLength(4);
    fireEvent.click(container.querySelector(".k-gradient-picker-corner-tr")!);
    await waitFor(() => expect(panel()).not.toBeNull());
    expect(
      container.querySelector(".k-gradient-picker-corner-tr")!.getAttribute("aria-pressed"),
    ).toBe("true");
    expect(document.querySelector(".k-color-picker-alpha")).toBeNull();

    press(document.querySelector("canvas.k-color-picker-hue")!, 30);
    fireEvent.mouseUp(document);

    const colors = colorsOf(onChange.mock.lastCall?.[0] as GradientValue);
    expect(colors[1]).not.toBe("#ffff00");
    expect(colors[1]).toHaveLength(7);
    expect(colors[0]).toBe("#ff0000");
    expect(colors[2]).toBe("#00ff00");
    expect(colors[3]).toBe("#0000ff");
    unmount();
  });

  it("hands the new value, and only the value, to change", () => {
    const onChange = vi.fn();
    const { container } = render(<GradientPicker value={linear()} onChange={onChange} />);

    press(container.querySelector(".k-gradient-picker-stops")!, 38);
    fireEvent.mouseUp(document);

    const call = onChange.mock.lastCall!;
    expect(call).toHaveLength(1);
    const stops = stopsOf(call[0] as GradientValue);
    expect(stops).toHaveLength(4);
    expect(container.querySelectorAll(".k-gradient-picker-stop")).toHaveLength(4);
  });

  it("blocks every edit while disabled or read-only", () => {
    const onChange = vi.fn();
    const disabled = render(<GradientPicker value={linear()} disabled onChange={onChange} />);

    press(disabled.container.querySelector(".k-gradient-picker-stops")!, 95);
    fireEvent.mouseUp(document);
    press(disabled.container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseUp(document);
    fireEvent.keyDown(disabled.container.querySelector(".k-gradient-picker-stop")!, {
      key: "ArrowRight",
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(
      disabled.container.querySelector(".k-gradient-picker")!.getAttribute("aria-disabled"),
    ).toBe("true");
    expect(
      disabled.container.querySelector(".k-gradient-picker-stop")!.getAttribute("tabindex"),
    ).toBe("-1");
    expect(panel()).toBeNull();
    disabled.unmount();

    const corner = render(<GradientPicker type="corner" disabled onChange={onChange} />);
    expect(
      (corner.container.querySelector(".k-gradient-picker-corner") as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(corner.container.querySelector(".k-gradient-picker-corner-tr")!);
    expect(onChange).not.toHaveBeenCalled();
    corner.unmount();

    const readonly = render(<GradientPicker value={linear()} readOnly onChange={onChange} />);
    expect(readonly.container.querySelector(".k-gradient-picker")!.className).toContain(
      "k-gradient-picker-readonly",
    );
    press(readonly.container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseUp(document);
    expect(onChange).not.toHaveBeenCalled();
    expect(panel()).toBeNull();
    readonly.unmount();
  });

  it("keeps the color panel open when a controlled value echoes the edit back", async () => {
    function Host() {
      const [value, setValue] = useState<GradientValue>(linear());
      return <GradientPicker value={value} onChange={(next) => setValue(next)} />;
    }
    const { container, unmount } = render(<Host />);

    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseUp(document);
    await waitFor(() => expect(panel()).not.toBeNull());

    press(document.querySelector("canvas.k-color-picker-hue")!, 30);
    fireEvent.mouseUp(document);

    const markers = container.querySelectorAll(".k-gradient-picker-stop");
    expect(
      (markers[1].querySelector(".k-gradient-picker-stop-color") as HTMLElement).style
        .backgroundColor,
    ).not.toBe("rgb(0, 255, 0)");
    expect(panel()).not.toBeNull();
    unmount();
  });

  it("closes the color panel when the controlled value changes from outside", async () => {
    const { container, rerender, unmount } = render(<GradientPicker value={linear()} />);

    press(container.querySelectorAll(".k-gradient-picker-stop")[1], 95);
    fireEvent.mouseUp(document);
    await waitFor(() => expect(panel()).not.toBeNull());

    rerender(<GradientPicker type="corner" value={createCornerGradient()} />);
    await waitFor(() => expect(panel()).toBeNull());
    expect(container.querySelector(".k-gradient-picker-corners-fill")).not.toBeNull();
    unmount();
  });
});
