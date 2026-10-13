import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tour } from "react-kui";

describe("Tour Vue parity", () => {
  it("renders lazily, locks scrolling, and points to the target", async () => {
    const target = document.createElement("button");
    target.getBoundingClientRect = () =>
      ({ left: 100, top: 80, right: 180, bottom: 112, width: 80, height: 32 }) as DOMRect;
    document.body.appendChild(target);

    const steps = [{ target, title: "Target", description: "Description" }];
    const { rerender } = render(<Tour open={false} steps={steps} />);

    expect(document.querySelector(".k-tour-root")).toBeNull();

    rerender(<Tour open steps={steps} />);

    await waitFor(() => expect(document.querySelector(".k-tour-root")).not.toBeNull());
    expect(document.querySelector(".k-tour-arrow")).not.toBeNull();
    expect(document.querySelector(".k-tour-focus")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Close" }).querySelector(".k-icon")).not.toBeNull();
    // 滚动锁改用引用计数版实现：class + 内联 overflow-y，而不是往 head 注入 <style>。
    expect(document.body.classList.contains("k-scroll-locked")).toBe(true);
    expect(document.body.style.overflowY).toBe("hidden");

    rerender(<Tour open={false} steps={steps} />);
    await waitFor(() => expect(document.body.classList.contains("k-scroll-locked")).toBe(false));
    expect(document.body.style.overflowY).toBe("");
    target.remove();
  });
});
