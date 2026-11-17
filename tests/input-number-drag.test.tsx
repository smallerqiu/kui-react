import { fireEvent, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import InputNumber from "../components/input-number";

const pointer = (target: EventTarget, type: string, x: number) => {
  const event = new MouseEvent(type, { clientX: x, button: 0, bubbles: true, cancelable: true });
  Object.defineProperty(event, "pointerId", { value: 1 });
  fireEvent(target as Element, event);
};
it("accelerates dragging and respects decimal steps, bounds and normal typing", () => {
  const onChange = vi.fn();
  const { container } = render(
    <InputNumber
      value={1}
      step={0.1}
      precision={2}
      min={0}
      max={5}
      addonAfter="kg"
      onChange={onChange}
    />,
  );
  pointer(container.querySelector(".k-input-number-drag")!, "pointerdown", 0);
  pointer(document, "pointermove", 40);
  expect(onChange).toHaveBeenLastCalledWith(2.5);
  pointer(document, "pointermove", 160);
  expect(onChange).toHaveBeenLastCalledWith(5);
  pointer(document, "pointermove", -40);
  expect(onChange).toHaveBeenLastCalledWith(0);
  pointer(document, "pointerup", -40);
  fireEvent.change(container.querySelector("input")!, { target: { value: "3.25" } });
  expect(onChange).toHaveBeenLastCalledWith(3.25);
});
it("uses numeric drag results without parser and cleans up when disabled", () => {
  const onChange = vi.fn();
  const { container, rerender, unmount } = render(
    <InputNumber value={10} parser={(v) => Number(v) / 100} onChange={onChange} />,
  );
  pointer(container.querySelector(".k-input-number-drag")!, "pointerdown", 0);
  pointer(document, "pointermove", 40);
  expect(onChange).toHaveBeenLastCalledWith(25);
  rerender(<InputNumber value={10} disabled onChange={onChange} />);
  const count = onChange.mock.calls.length;
  pointer(document, "pointermove", 80);
  expect(onChange).toHaveBeenCalledTimes(count);
  expect(container.querySelector(".k-input-number-drag")).toBeNull();
  rerender(<InputNumber draggable={false} />);
  expect(container.querySelector(".k-input-number-drag")).toBeNull();
  unmount();
});
it("focuses on click and stops updates on pointer cancellation", () => {
  const onChange = vi.fn();
  const { container } = render(<InputNumber value={1} onChange={onChange} />);
  const handle = container.querySelector(".k-input-number-drag")!;
  pointer(handle, "pointerdown", 0);
  pointer(document, "pointerup", 0);
  expect(document.activeElement).toBe(container.querySelector("input"));
  pointer(handle, "pointerdown", 0);
  pointer(document, "pointercancel", 0);
  pointer(document, "pointermove", 80);
  expect(onChange).not.toHaveBeenCalled();
});
