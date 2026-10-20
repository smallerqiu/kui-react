import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../components";

const dot = (container: HTMLElement) => container.querySelector(".k-badge-status-dot");

describe("Badge status dot", () => {
  it("paints nothing when the caller asked for nothing", () => {
    const { container } = render(<Badge />);

    // 无子节点不等于要状态点：一颗谁也没要的灰点在这里什么都没说
    expect(dot(container)).toBeNull();
    expect(container.querySelector("sup")).toBeNull();
    expect(container.querySelector(".k-badge")?.childElementCount).toBe(0);
  });

  it("treats a cleared count as no badge rather than a status dot", () => {
    for (const count of [0, "", -1]) {
      const { container, unmount } = render(<Badge count={count as number | string} />);
      expect(dot(container)).toBeNull();
      expect(container.querySelector("sup")).toBeNull();
      unmount();
    }
  });

  it("still paints the grey dot when status is asked for by name", () => {
    const { container } = render(<Badge status="default" />);

    // 收成显式模式不能顺手把 default 这一档也吃掉
    expect(dot(container)?.className).toContain("k-badge-status-default");
  });

  it("opens the status mode through color alone", () => {
    const { container } = render(<Badge color="#f0f0f0" text="Offline" />);

    // 判据是 (status || color)，少认 color 这一臂这里就空了
    expect(dot(container)?.getAttribute("style")).toContain("rgb(240, 240, 240)");
    expect(container.querySelector(".k-badge-status-text")?.textContent).toBe("Offline");
  });

  it("keeps the count bubble alone when a count and a status are both given", () => {
    const { container } = render(<Badge count={5} status="success" />);

    // 有数字时状态点让位，否则一颗点会挤在气泡旁边
    expect(dot(container)).toBeNull();
    expect(container.querySelector(".k-badge-count")?.textContent).toBe("5");
  });
});
