import { act, fireEvent, render } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Alert from "../components/alert";
import Tag from "../components/tag";

afterEach(() => vi.useRealTimers());

describe.each([
  ["Alert", Alert, { closable: true }, ".k-alert", 300],
  ["Tag", Tag, { closeable: true }, ".k-tag", 200],
] as const)("%s close lifecycle", (_name, Component, props, selector, duration) => {
  it("keeps the exit animation, removes content, and emits each event once", () => {
    vi.useFakeTimers();
    const cleanup = vi.fn();
    const onClose = vi.fn();
    const onAfterClose = vi.fn();
    function Child() {
      useEffect(() => cleanup, []);
      return <span>Content</span>;
    }
    const { container, rerender } = render(
      <Component {...props} onClose={onClose} onAfterClose={onAfterClose}>
        <Child />
      </Component>,
    );
    const close = container.querySelector(`${selector}-close`)!;
    fireEvent.click(close);
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onAfterClose).not.toHaveBeenCalled();
    expect(container.querySelector(selector)).not.toBeNull();
    expect(cleanup).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(duration));
    expect(container.querySelector(selector)).toBeNull();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(onAfterClose).toHaveBeenCalledTimes(1);
    rerender(
      <Component {...props} onClose={onClose} onAfterClose={onAfterClose}>
        <Child />
      </Component>,
    );
    expect(container.querySelector(selector)).toBeNull();
  });

  it("cancels completion when the parent unmounts during exit", () => {
    vi.useFakeTimers();
    const onAfterClose = vi.fn();
    const { container, unmount } = render(
      <Component {...props} onAfterClose={onAfterClose}>
        Content
      </Component>,
    );
    fireEvent.click(container.querySelector(`${selector}-close`)!);
    unmount();
    act(() => vi.advanceTimersByTime(duration + 100));
    expect(onAfterClose).not.toHaveBeenCalled();
    expect(container.childElementCount).toBe(0);
  });
});
