import { act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInstance, type NoticeInstance } from "../components/notice/instance";

describe.each(["message", "notice"] as const)("%s exit motion", (type) => {
  let instance: NoticeInstance | undefined;

  afterEach(() => {
    instance?.destroy();
    instance = undefined;
    act(() => vi.runAllTimers());
    vi.useRealTimers();
  });

  it("keeps the item mounted until its leave animation finishes", () => {
    vi.useFakeTimers();
    instance = createInstance(type);
    const onClose = vi.fn();
    let close = () => {};
    act(() => {
      close = instance!.show({ content: "Closing content", duration: 0, onClose });
    });
    const enteringItem = document.querySelector(`.k-${type}-slide-enter-active`);

    expect(enteringItem).not.toBeNull();
    act(() => vi.advanceTimersByTime(300));
    expect(document.querySelector(`.k-${type}-slide-enter-active`)).toBeNull();

    act(close);

    const leavingItem = document.querySelector(`.k-${type}-slide-leave-active`);
    expect(leavingItem).not.toBeNull();
    expect(leavingItem?.textContent).toContain("Closing content");
    expect(onClose).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(300));

    expect(document.querySelector(`.k-${type}-slide-leave-active`)).toBeNull();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
