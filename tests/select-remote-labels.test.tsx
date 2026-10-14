import { fireEvent, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Select } from "../components";

it("resizes remote search input on every keystroke before the debounce opens the popup", () => {
  const onSearch = vi.fn();
  const { container, unmount } = render(<Select onSearch={onSearch} options={[]} />);
  const select = container.querySelector<HTMLElement>(".k-select")!;
  const input = container.querySelector<HTMLInputElement>(".k-select-search")!;
  const mirror = container.querySelector<HTMLElement>(".k-select-search-mirror")!;
  Object.defineProperty(select, "clientWidth", { configurable: true, value: 300 });
  Object.defineProperty(mirror, "offsetWidth", {
    configurable: true,
    get: () => (mirror.textContent?.length ?? 0) * 10,
  });
  fireEvent.click(select);
  fireEvent.change(input, { target: { value: "a" } });
  expect(input.style.width).toBe("12px");
  fireEvent.change(input, { target: { value: "abcdef" } });
  expect(input.style.width).toBe("62px");
  fireEvent.change(input, { target: { value: "a".repeat(40) } });
  expect(input.style.width).toBe("260px");
  fireEvent.change(input, { target: { value: "ab" } });
  expect(input.style.width).toBe("22px");
  expect(onSearch).not.toHaveBeenCalled();
  expect(select.classList.contains("k-select-opened")).toBe(false);
  unmount();
});

it.each([false, true])(
  "preserves selected labels across remote results (multiple=%s)",
  (multiple) => {
    const onChange = vi.fn();
    const value = multiple ? [0] : 0;
    const props = { multiple, value, onChange, onSearch: vi.fn() };
    const { container, rerender } = render(
      <Select {...props} options={[{ value: 0, label: "Zero" }]} />,
    );
    const label = () =>
      container.querySelector(multiple ? ".k-select-labels" : ".k-select-label")?.textContent;
    expect(label()).toContain("Zero");
    rerender(<Select {...props} loading options={[]} />);
    expect(label()).toContain("Zero");
    rerender(<Select {...props} options={[{ value: 1, label: "One" }]} />);
    expect(label()).toContain("Zero");
    rerender(<Select {...props} options={[]} />);
    expect(label()).toContain("Zero");
    rerender(<Select {...props} options={[{ value: 0, label: "Updated" }]} />);
    expect(label()).toContain("Updated");
    expect(onChange).not.toHaveBeenCalled();
    rerender(<Select {...props} value={multiple ? [] : ""} options={[]} />);
    expect(label()).not.toContain("Updated");
    rerender(<Select {...props} options={[]} />);
    expect(label()).toContain("0");
    expect(label()).not.toContain("Updated");
  },
);

// 保留标签的缓存在 render 期间写回 state，React 会重试本组件直到比较不再成立。
// 用 `!==` 比较时 NaN 永远"和上次不同"，重试到上限直接抛 Too many re-renders，
// 整棵子树交给错误边界；`Number(rawId)` 解析失败就能把 NaN 送进 value 或 label。
it.each([false, true])("renders a NaN selection instead of looping (multiple=%s)", (multiple) => {
  const value = multiple ? [Number.NaN, 0] : Number.NaN;
  const { container } = render(
    <Select multiple={multiple} value={value} options={[{ value: 0, label: "Zero" }]} />,
  );
  const label = container.querySelector(multiple ? ".k-select-labels" : ".k-select-label")!;
  expect(label.textContent).toContain("NaN");
  if (multiple) expect(label.textContent).toContain("Zero");
});

it("renders a NaN option label instead of looping", () => {
  const { container } = render(<Select value={1} options={[{ value: 1, label: Number.NaN }]} />);
  expect(container.querySelector(".k-select-label")?.textContent).toContain("NaN");
});
