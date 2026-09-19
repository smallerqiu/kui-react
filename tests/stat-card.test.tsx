import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatCard, StatNumber } from "react-kui";

describe("StatCard", () => {
  it("updates a number without recreating its element", () => {
    const { container, rerender } = render(
      <StatNumber value={1234} duration={0} autoAnimate={false} />,
    );
    const number = container.querySelector(".k-stat-countup-number")!;
    expect(number.textContent).toBe("1,234");

    rerender(<StatNumber value={5678} duration={0} autoAnimate={false} />);
    expect(container.querySelector(".k-stat-countup-number")).toBe(number);
    expect(number.textContent).toBe("5,678");
  });

  it("falls back when IntersectionObserver is unavailable", () => {
    const { container } = render(<StatNumber value={42} duration={0} />);
    expect(container.querySelector(".k-stat-number")?.textContent).toBe("42");
  });

  it("supports size and omits empty descriptions", () => {
    const { container } = render(
      <StatCard
        size="small"
        prefix="$"
        items={[{ key: "revenue", value: 12, duration: 0, autoAnimate: false }]}
      />,
    );
    expect(container.querySelector(".k-stat-card")?.classList).toContain("k-stat-card-small");
    expect(container.querySelector(".k-stat-card")?.textContent).toContain("$12");
    expect(container.querySelector(".k-stat-card-item-desc")).toBeNull();
  });
});
