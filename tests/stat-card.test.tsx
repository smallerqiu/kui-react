import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StatCard, StatNumber } from "react-kui";
import { statItemKey } from "../components/stat-card/utils/stat-item-key";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

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

  it("renders no wrapper for content that cannot be seen", () => {
    // An empty wrapper keeps its margin and flex gap in the layout, so a card that
    // switched its title off would still pay for a title row.
    for (const title of [undefined, null, false, ""] as const) {
      const { container, unmount } = render(<StatCard title={title as never} items={[]} />);
      expect(container.querySelector(".k-stat-card-title"), `title: ${String(title)}`).toBeNull();
      unmount();
    }

    const { container } = render(
      <StatCard
        prefix=""
        items={[
          { value: 1, desc: false, duration: 0, autoAnimate: false },
          { value: 2, desc: "", trend: false, duration: 0, autoAnimate: false },
        ]}
      />,
    );
    expect(container.querySelector(".k-stat-card-item-desc")).toBeNull();
    expect(container.querySelector(".k-stat-card-item-trend")).toBeNull();
    expect(container.querySelector(".k-stat-number-prefix")).toBeNull();
  });

  it("still treats zero as content", () => {
    const { container } = render(
      <StatCard title={0} items={[{ value: 1, desc: 0, duration: 0, autoAnimate: false }]} />,
    );
    expect(container.querySelector(".k-stat-card-title")?.textContent).toBe("0");
    expect(container.querySelector(".k-stat-card-item-desc")?.textContent).toBe("0");
  });

  it("keeps a caller-supplied key out of the positional fallback", () => {
    expect(statItemKey({ key: 1 }, 0)).not.toBe(statItemKey({}, 1));
    expect(statItemKey({}, 1)).toBe("kui-item-1");
    expect(statItemKey({ key: 1 }, 0)).toBe("1");
  });

  it("does not collide keys when a card reorders its items", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(
      <StatCard
        items={[
          { key: 1, value: 1, duration: 0, autoAnimate: false },
          { value: 2, duration: 0, autoAnimate: false },
        ]}
      />,
    );
    rerender(
      <StatCard
        items={[
          { value: 2, duration: 0, autoAnimate: false },
          { key: 1, value: 1, duration: 0, autoAnimate: false },
        ]}
      />,
    );
    expect(error).not.toHaveBeenCalledWith(
      expect.stringContaining("two children with the same key"),
      expect.anything(),
    );
  });

  it("jumps straight to the target when motion is reduced", () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: () => false,
      }),
    );
    const { container } = render(<StatNumber value={1234} duration={1.2} autoAnimate={false} />);
    expect(container.querySelector(".k-stat-countup-number")?.textContent).toBe("1,234");
  });
});
