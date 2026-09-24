import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRef, useState } from "react";
import type { CarouselRef } from "../components/carousel/carousel";
import Carousel from "../components/carousel/carousel";
import CarouselItem from "../components/carousel/carousel-item";

function pointer(target: EventTarget, type: string, x: number, y = 0, pointerType = "touch") {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    button: 0,
  });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: pointerType },
    isPrimary: { value: true },
  });
  act(() => {
    target.dispatchEvent(event);
  });
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(300);
});
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
const slides = [0, 1, 2].map((n) => (
  <CarouselItem key={n}>
    <a href="#slide">{n}</a>
  </CarouselItem>
));
describe("Carousel swipe integration", () => {
  it("supports slides wrapped in nested fragments", () => {
    const onChange = vi.fn();
    const view = render(
      <Carousel onChange={onChange}>
        <>{slides[0]}<>{slides.slice(1)}</></>
      </Carousel>,
    );
    expect(view.getAllByRole("tab")).toHaveLength(3);
    fireEvent.click(view.getByLabelText("Next slide"));
    expect(onChange).toHaveBeenLastCalledWith(1);
    const track = view.container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    expect(track.style.width).toBe("1500px");
    pointer(track, "pointerdown", 200);
    pointer(window, "pointermove", 100);
    pointer(window, "pointerup", 100);
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it("honors goTo after next in the same event", () => {
    const ref = createRef<CarouselRef>();
    const onChange = vi.fn();
    const view = render(<Carousel ref={ref} onChange={onChange}>{slides}</Carousel>);
    act(() => {
      ref.current!.next();
      ref.current!.goTo(0);
    });
    act(() => vi.advanceTimersByTime(600));
    expect(view.getByLabelText("Go to slide 1").getAttribute("aria-selected")).toBe("true");
    expect(view.container.querySelector<HTMLElement>(".k-carousel-wrapper")!.style.transform).toBe(
      "translate3d(-300px, 0, 0)",
    );
    expect(onChange.mock.calls).toEqual([[1], [0]]);
  });

  it("measures asynchronously loaded slides and measures again after clearing them", () => {
    const view = render(<Carousel>{[]}</Carousel>);
    view.rerender(<Carousel>{slides}</Carousel>);
    expect(view.container.querySelector<HTMLElement>(".k-carousel-wrapper")!.style.width).toBe(
      "1500px",
    );
    view.rerender(<Carousel>{[]}</Carousel>);
    view.rerender(<Carousel>{slides}</Carousel>);
    const track = view.container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    expect(track.style.width).toBe("1500px");
    expect(track.style.transitionDuration).not.toBe("0s");
    pointer(track, "pointerdown", 200);
    pointer(window, "pointermove", 100);
    expect(track.style.transform).toBe("translate3d(-400px, 0, 0)");
    pointer(window, "pointerup", 100);
  });

  it("does not let an old transition overwrite an external value", () => {
    const view = render(<Carousel value={0}>{slides}</Carousel>);
    fireEvent.click(view.container.querySelector(".k-carousel-arrow-right")!);
    view.rerender(<Carousel value={2}>{slides}</Carousel>);
    act(() => vi.advanceTimersByTime(600));
    expect(view.container.querySelector<HTMLElement>(".k-carousel-wrapper")!.style.transform).toBe(
      "translate3d(-900px, 0, 0)",
    );
    expect(view.getByLabelText("Go to slide 3").getAttribute("aria-selected")).toBe("true");
  });

  it.each([false, true])(
    "accepts repeated ref calls and reversals through loop boundaries (vertical=%s)",
    (vertical) => {
      const ref = createRef<CarouselRef>();
      const onChange = vi.fn();
      render(
        <Carousel ref={ref} vertical={vertical} onChange={onChange}>
          {slides}
        </Carousel>,
      );
      act(() => {
        for (let i = 0; i < 7; i++) ref.current!.next();
        for (let i = 0; i < 4; i++) ref.current!.prev();
      });
      expect(onChange.mock.calls.map(([index]) => index)).toEqual([
        1, 2, 0, 1, 2, 0, 1, 0, 2, 1, 0,
      ]);
      act(() => vi.advanceTimersByTime(600));
      expect(
        document.querySelector('[aria-label="Go to slide 1"]')?.getAttribute("aria-selected"),
      ).toBe("true");
    },
  );
  it.each([false, true])("commits initial value without animation (vertical=%s)", (vertical) => {
    const committed: string[][] = [];
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.classList.contains("k-carousel-wrapper"))
        committed.push([this.style.transform, this.style.transitionDuration]);
      return new DOMRect();
    });
    const onChange = vi.fn();
    render(
      <Carousel value={5} vertical={vertical} onChange={onChange}>
        {Array.from({ length: 10 }, (_, n) => (
          <CarouselItem key={n}>{n}</CarouselItem>
        ))}
      </Carousel>,
    );
    expect(committed).toContainEqual([
      vertical ? "translate3d(0, -1536px, 0)" : "translate3d(-1800px, 0, 0)",
      "0s",
    ]);
    expect(onChange).not.toHaveBeenCalled();
  });
  it("regrabs an unfinished transition without jumping or waiting for its timer", () => {
    const onChange = vi.fn();
    const { container } = render(<Carousel onChange={onChange}>{slides}</Carousel>);
    const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    pointer(track, "pointerdown", 200);
    pointer(window, "pointermove", 100);
    pointer(window, "pointerup", 100);
    track.style.transform = "matrix(1, 0, 0, 1, -450, 0)";
    pointer(track, "pointerdown", 200);
    expect(track.style.transform).toBe("translate3d(-450px, 0, 0)");
    pointer(window, "pointermove", 100);
    expect(track.style.transform).toBe("translate3d(-550px, 0, 0)");
    act(() => vi.advanceTimersByTime(600));
    expect(track.style.transform).toBe("translate3d(-550px, 0, 0)");
    // This is now a long drag: continue past the halfway snap point.
    pointer(window, "pointermove", -200);
    pointer(window, "pointerup", -200);
    expect(onChange.mock.calls).toEqual([[1], [2]]);
  });
  it.each(["mouse", "touch"])(
    "supports default vertical %s dragging and inertial settling",
    (kind) => {
      const onChange = vi.fn();
      const { container } = render(
        <Carousel vertical onChange={onChange}>
          {slides}
        </Carousel>,
      );
      const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
      expect(track.style.touchAction).toBe("pan-x");
      pointer(track, "pointerdown", 0, 200, kind);
      pointer(window, "pointermove", 0, 100, kind);
      expect(track.style.transform).toBe("translate3d(0, -356px, 0)");
      pointer(window, "pointerup", 0, 100, kind);
      expect(onChange).toHaveBeenCalledExactlyOnceWith(1);
      expect(track.style.transform).toBe("translate3d(0, -512px, 0)");
      expect(track.style.transitionTimingFunction).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
      expect(parseFloat(track.style.transitionDuration)).toBeGreaterThanOrEqual(140);
    },
  );
  it("allows disabling default mouse dragging", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Carousel draggable={false} onChange={onChange}>
        {slides}
      </Carousel>,
    );
    const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    pointer(track, "pointerdown", 200, 0, "mouse");
    pointer(window, "pointermove", 100, 0, "mouse");
    pointer(window, "pointerup", 100, 0, "mouse");
    expect(onChange).not.toHaveBeenCalled();
  });
  it("keeps the looping clone transition when the parent synchronizes value", () => {
    function Host() {
      const [value, setValue] = useState(2);
      return (
        <Carousel value={value} onChange={setValue}>
          {slides}
        </Carousel>
      );
    }
    const { container } = render(<Host />);
    const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    pointer(track, "pointerdown", 200);
    pointer(window, "pointermove", 100);
    pointer(window, "pointerup", 100);
    expect(track.style.transform).toBe("translate3d(-1200px, 0, 0)");
    expect(track.style.transitionDuration).not.toBe("0s");
    act(() => vi.advanceTimersByTime(520));
    expect(track.style.transform).toBe("translate3d(-300px, 0, 0)");
  });
  it("moves the track while touching and updates selection only on release", () => {
    const onChange = vi.fn();
    const { container } = render(<Carousel onChange={onChange}>{slides}</Carousel>);
    const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    pointer(track, "pointerdown", 200);
    pointer(window, "pointermove", 100);
    expect(track.style.transform).toBe("translate3d(-400px, 0, 0)");
    expect(track.style.transitionDuration).toBe("0s");
    expect(onChange).not.toHaveBeenCalled();
    pointer(window, "pointerup", 100);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(1);
    expect(track.style.transform).toBe("translate3d(-600px, 0, 0)");
    expect(fireEvent.click(track.querySelector("a")!, { detail: 1 })).toBe(false);
  });
  it("settles a looping clone even if transitionend is missing, then permits another swipe", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Carousel value={2} onChange={onChange}>
        {slides}
      </Carousel>,
    );
    const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    pointer(track, "pointerdown", 200);
    pointer(window, "pointermove", 100);
    pointer(window, "pointerup", 100);
    expect(onChange).toHaveBeenLastCalledWith(0);
    act(() => vi.advanceTimersByTime(520));
    expect(track.style.transform).toBe("translate3d(-300px, 0, 0)");
    pointer(track, "pointerdown", 200);
    pointer(window, "pointermove", 100);
    pointer(window, "pointerup", 100);
    expect(onChange).toHaveBeenLastCalledWith(1);
  });
  it("pauses autoplay while held and resumes after cancellation", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Carousel autoplay delay={1000} onChange={onChange}>
        {slides}
      </Carousel>,
    );
    const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    pointer(track, "pointerdown", 200);
    act(() => vi.advanceTimersByTime(3000));
    expect(onChange).not.toHaveBeenCalled();
    pointer(window, "pointercancel", 200);
    act(() => vi.advanceTimersByTime(1000));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(1);
  });
  it("rebounds at a non-loop boundary without emitting change", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Carousel loop={false} onChange={onChange}>
        {slides}
      </Carousel>,
    );
    const track = container.querySelector<HTMLElement>(".k-carousel-wrapper")!;
    pointer(track, "pointerdown", 100);
    pointer(window, "pointermove", 200);
    expect(track.style.transform).toBe("translate3d(30px, 0, 0)");
    pointer(window, "pointerup", 200);
    expect(track.style.transform).toBe("translate3d(0px, 0, 0)");
    expect(onChange).not.toHaveBeenCalled();
  });
});
