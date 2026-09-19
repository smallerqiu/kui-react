import { act, createRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VirtualList, type VirtualListRef } from "react-kui";
import { getVirtualRange } from "../components/virtual-list/range";

describe("VirtualList", () => {
  it("normalizes invalid range inputs", () => {
    expect(
      getVirtualRange({
        count: Number.POSITIVE_INFINITY,
        scrollTop: Number.NaN,
        viewportHeight: Number.NaN,
        itemHeight: 0,
        overscan: Number.NaN,
      }),
    ).toEqual({ start: 0, end: 0, offset: 0, total: 0 });
  });

  it("keeps imperative scrolling inside the available range", () => {
    const data = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Item ${id}` }));
    const ref = createRef<VirtualListRef>();
    const { container, rerender } = render(
      <VirtualList ref={ref} data={data} height={100} itemHeight={20} itemKey="id">
        {(item) => item.label}
      </VirtualList>,
    );
    const list = container.querySelector<HTMLElement>(".k-virtual-list")!;
    Object.defineProperty(list, "clientHeight", { configurable: true, value: 100 });

    act(() => ref.current?.scrollToIndex(0, "center"));
    expect(list.scrollTop).toBe(0);
    act(() => ref.current?.scrollToIndex(Number.NaN, "start"));
    expect(list.scrollTop).toBe(0);
    act(() => ref.current?.scrollToIndex(999, "end"));
    expect(list.scrollTop).toBe(19900);

    rerender(
      <VirtualList ref={ref} data={data.slice(0, 2)} height={100} itemHeight={20} itemKey="id">
        {(item) => item.label}
      </VirtualList>,
    );
    expect(list.scrollTop).toBe(0);
  });

  it("uses the normalized height for layout and item rendering", () => {
    const { container } = render(
      <VirtualList data={[{ id: 1 }]} itemHeight={0} overscan={1}>
        {(item) => item.id}
      </VirtualList>,
    );

    expect(container.querySelector<HTMLElement>(".k-virtual-list-spacer")?.style.height).toBe(
      "1px",
    );
    expect(container.querySelector<HTMLElement>(".k-virtual-list-item")?.style.height).toBe("1px");
  });
});
