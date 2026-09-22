import { act, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Badge, StatNumber } from "../components";

afterEach(() => vi.useRealTimers());

it("Badge rolls numeric changes, preserves capped/text/dot counts, and cleans up", async () => {
  vi.useFakeTimers();
  const { container, rerender, unmount } = render(<Badge count={9} />);
  expect(container.textContent).toBe("9");
  rerender(<Badge count={10} />);
  expect(container.querySelector('[data-direction="up"]')).not.toBeNull();
  rerender(<Badge count={8} />);
  expect(container.querySelector('[data-direction="down"]')).not.toBeNull();
  await act(() => vi.advanceTimersByTimeAsync(400));
  expect(container.textContent).toBe("8");
  rerender(<Badge count={100} />);
  expect(container.textContent).toBe("99+");
  expect(container.querySelector(".odometer-numbers")).toBeNull();
  rerender(<Badge count="New" />);
  expect(container.textContent).toBe("New");
  rerender(<Badge count={8} dot />);
  expect(container.querySelector(".k-badge-count")).toBeNull();
  rerender(<Badge count={0} />);
  expect(container.querySelector("sup")).toBeNull();
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("StatNumber rollup uses the same increasing/decreasing direction", async () => {
  vi.useFakeTimers();
  const view = (value: number) => (
    <StatNumber value={value} type="rollup" duration={0.3} autoAnimate={false} />
  );
  const { container, rerender, unmount } = render(view(9));
  await act(() => vi.advanceTimersByTimeAsync(400));
  rerender(view(10));
  expect(container.querySelector('[data-direction="up"]')).not.toBeNull();
  await act(() => vi.advanceTimersByTimeAsync(400));
  rerender(view(9));
  expect(container.querySelector('[data-direction="down"]')).not.toBeNull();
  await act(() => vi.advanceTimersByTimeAsync(400));
  expect(container.textContent).toBe("9");
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("uses continuous tracks for large StatNumber updates but short tracks for Badge", async () => {
  vi.useFakeTimers();
  const view = (value: number) => (
    <>
      <StatNumber value={value} type="rollup" duration={0.3} autoAnimate={false} />
      <Badge count={value} maxCount={99999} />
    </>
  );
  const { container, rerender, unmount } = render(view(12345));
  await act(() => vi.advanceTimersByTimeAsync(400));
  rerender(view(54321));
  const numberTracks = container.querySelectorAll(".k-stat-number .odometer-track");
  expect(numberTracks).toHaveLength(4);
  expect(numberTracks[0].textContent).toBe("12345");
  for (const track of container.querySelectorAll(".k-badge .odometer-track"))
    expect(track.children).toHaveLength(2);
  await act(() => vi.advanceTimersByTimeAsync(400));
  expect(container.querySelector(".k-stat-number")?.textContent).toBe("54,321");
  expect(container.querySelector(".k-badge")?.textContent).toBe("54321");
  unmount();
});
