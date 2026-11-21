import { Fragment, StrictMode, useState } from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { Splitter, SplitterPanel } from "../components/splitter";
beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 1004,
    height: 604,
    left: 0,
    top: 0,
  } as DOMRect);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
const pointer = (target: Element | Window, type: string, x: number) => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x });
  Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true } });
  fireEvent(target, event);
};
const settle = () => act(() => vi.advanceTimersByTimeAsync(20));
const sizes = () =>
  [...document.querySelectorAll<HTMLElement>(".k-splitter-item")].map((el) =>
    parseFloat(el.style.flexBasis),
  );
const panels = () => [
  <SplitterPanel key="a" size={300} min={100} collapsible>
    <input defaultValue="keep me" />
  </SplitterPanel>,
  <SplitterPanel key="b" min={100}>
    Right
  </SplitterPanel>,
];
it("keeps dragging across parent rerenders and value echoes in StrictMode", async () => {
  function Demo() {
    const [value, setValue] = useState<number[]>(),
      [count, setCount] = useState(0);
    return (
      <>
        <button onClick={() => setValue([250, 750])}>Set layout</button>
        <Splitter
          value={value}
          onChange={setValue}
          onResize={() => setCount((n) => n + 1)}
          data-count={count}
        >
          {panels()}
        </Splitter>
      </>
    );
  }
  const w = render(
    <StrictMode>
      <Demo />
    </StrictMode>,
  );
  const handle = w.getByRole("separator");
  pointer(handle, "pointerdown", 307);
  pointer(window, "pointermove", 407);
  await settle();
  expect(sizes()).toEqual([400, 600]);
  pointer(window, "pointermove", 457);
  await settle();
  pointer(window, "pointerup", 457);
  expect(sizes()).toEqual([450, 550]);
  fireEvent.click(w.getByText("Set layout"));
  expect(sizes()).toEqual([250, 750]);
});
it("updates collapsed binding and restores the same content", () => {
  const onCollapsedChange = vi.fn();
  const w = render(
    <Splitter>
      <SplitterPanel size={300} collapsible onCollapsedChange={onCollapsedChange}>
        <input defaultValue="original" />
      </SplitterPanel>
      <SplitterPanel />
    </Splitter>,
  );
  const input = w.getByRole("textbox") as HTMLInputElement;
  input.value = "edited";
  fireEvent.click(w.getByRole("button", { name: "Collapse panel 1" }));
  expect(sizes()).toEqual([0, 1000]);
  expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
  expect(w.container.querySelector(".k-splitter-item")?.hasAttribute("inert")).toBe(true);
  fireEvent.click(w.getByRole("button", { name: "Expand panel 1" }));
  expect(sizes()).toEqual([300, 700]);
  expect(w.getByRole("textbox")).toBe(input);
  expect(input.value).toBe("edited");
});
it("disables pointer, keyboard and collapse interaction", async () => {
  const onChange = vi.fn();
  const w = render(
    <Splitter disabled onChange={onChange}>
      {panels()}
    </Splitter>,
  );
  const handle = w.getByRole("separator");
  expect(handle.getAttribute("aria-disabled")).toBe("true");
  expect(w.getByRole("button").hasAttribute("disabled")).toBe(true);
  pointer(handle, "pointerdown", 300);
  pointer(window, "pointerup", 500);
  fireEvent.keyDown(handle, { key: "ArrowRight" });
  await settle();
  expect(sizes()).toEqual([300, 700]);
  expect(onChange).not.toHaveBeenCalled();
});
it("flattens fragments and keeps panel configuration off the DOM", () => {
  const w = render(
    <Splitter>
      {false}
      <Fragment>
        <SplitterPanel size={300} min={100} max={800} resizable collapsible collapsed={false} />
        <SplitterPanel />
      </Fragment>
    </Splitter>,
  );
  expect(w.getAllByRole("separator")).toHaveLength(1);
  expect(sizes()).toEqual([300, 700]);
  const panel = w.container.querySelector(".k-splitter-panel")!;
  for (const name of ["size", "min", "max", "resizable", "collapsible", "collapsed"])
    expect(panel.hasAttribute(name)).toBe(false);
});
it("moves the lazy preview and commits the final widths on pointer release", async () => {
  const w = render(<Splitter lazy>{panels()}</Splitter>);
  pointer(w.getByRole("separator"), "pointerdown", 300);
  pointer(window, "pointermove", 400);
  await settle();
  expect(sizes()).toEqual([300, 700]);
  expect((w.container.querySelector(".k-splitter-preview") as HTMLElement).style.transform).toBe(
    "translateX(100px)",
  );
  pointer(window, "pointerup", 400);
  expect(sizes()).toEqual([400, 600]);
  expect(w.container.querySelector(".k-splitter-preview")).toBeNull();
});
