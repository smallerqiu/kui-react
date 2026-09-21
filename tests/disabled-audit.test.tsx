import { fireEvent, render, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Checkbox,
  Radio,
  ColorPicker,
  Select,
  TreeSelect,
  DatePicker,
  Rate,
  Upload,
  Tooltip,
  InputOTP,
} from "react-kui";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("disabled audit regressions", () => {
  it.each([Checkbox, Radio])("blocks disabled label clicks", (Component) => {
    const onClick = vi.fn();
    const { container } = render(
      <Component disabled onClick={onClick}>
        Label
      </Component>,
    );
    fireEvent.click(container.querySelector("label")!);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables embedded search and date inputs", () => {
    const { container } = render(
      <>
        <Select disabled filterable options={[]} />
        <TreeSelect disabled filterable options={[]} />
        <DatePicker disabled />
      </>,
    );
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBeGreaterThanOrEqual(3);
    inputs.forEach((input) => expect(input.disabled).toBe(true));
  });

  it("blocks disabled ColorPicker presets and stops in-flight drags", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON() {},
    });
    const onChange = vi.fn();
    const view = (disabled: boolean) => (
      <ColorPicker panelOnly disabled={disabled} value="#ff0000" onChange={onChange} />
    );
    const { container, rerender } = render(view(true));
    fireEvent.click(container.querySelector(".k-color-picker-presets span")!);
    fireEvent.mouseDown(container.querySelector(".k-color-picker-hue")!, { clientX: 50 });
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector(".k-color-picker-body")!.hasAttribute("inert")).toBe(true);
    rerender(view(false));
    fireEvent.mouseDown(container.querySelector(".k-color-picker-hue")!, { clientX: 50 });
    expect(onChange).toHaveBeenCalled();
    onChange.mockClear();
    rerender(view(true));
    fireEvent.mouseMove(document, { clientX: 150 });
    expect(onChange).not.toHaveBeenCalled();
    rerender(view(false));
    fireEvent.mouseMove(document, { clientX: 100 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("discards hover-only Rate preview while disabled", () => {
    const { container, rerender } = render(<Rate value={1} />);
    fireEvent.mouseMove(container.querySelectorAll(".k-star")[3]);
    expect(container.querySelectorAll(".k-star-full")).toHaveLength(4);
    rerender(<Rate value={1} disabled />);
    expect(container.querySelectorAll(".k-star-full")).toHaveLength(1);
  });

  it("removes Upload drag-over styling on disable", () => {
    const { container, rerender } = render(<Upload draggable />);
    fireEvent.dragEnter(container.querySelector(".k-upload-add")!);
    expect(container.querySelector(".k-upload-drag-over")).not.toBeNull();
    rerender(<Upload draggable disabled />);
    expect(container.querySelector(".k-upload-drag-over")).toBeNull();
    fireEvent.dragLeave(container.querySelector(".k-upload-add")!);
    rerender(<Upload draggable />);
    expect(container.querySelector(".k-upload-drag-over")).toBeNull();
  });

  it("cancels pending Tooltip opening when disabled", () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { getByText, rerender } = render(
      <Tooltip title="Tip" onOpenChange={onOpenChange}>
        <span>Trigger</span>
      </Tooltip>,
    );
    fireEvent.mouseEnter(getByText("Trigger"));
    rerender(
      <Tooltip disabled title="Tip" onOpenChange={onOpenChange}>
        <span>Trigger</span>
      </Tooltip>,
    );
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(onOpenChange).not.toHaveBeenCalledWith(true);
  });

  it("does not delete disabled OTP characters", () => {
    const onChange = vi.fn();
    const { container } = render(<InputOTP disabled value="1234" onChange={onChange} />);
    fireEvent.keyDown(container.querySelector("input")!, { key: "Delete" });
    expect(onChange).not.toHaveBeenCalled();
  });
});
