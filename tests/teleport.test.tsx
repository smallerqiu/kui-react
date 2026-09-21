import { act, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode, useState } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import Teleport from "../components/base/teleport";
import { ConfigContext } from "../components/config/config-context";

afterEach(() => vi.useRealTimers());

it("preserves child state on ordinary updates in the same container", () => {
  function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
  const view = (label: string) => (
    <Teleport>
      <Counter />
      <span>{label}</span>
    </Teleport>
  );
  const { rerender, container } = render(view("first"));
  const button = screen.getByRole("button");
  expect(button.parentElement).toBe(document.body);
  expect(container.childNodes).toHaveLength(0);
  fireEvent.click(button);
  rerender(view("second"));
  expect(screen.getByRole("button")).toBe(button);
  expect(button.textContent).toBe("1");
});

it("resolves a deferred target created after the initial commit", () => {
  vi.useFakeTimers();
  const { container, unmount } = render(
    <Teleport to="#late-target" defer>
      late content
    </Teleport>,
  );
  const target = document.createElement("div");
  target.id = "late-target";
  container.append(target);
  expect(target.textContent).toBe("");
  act(() => vi.runOnlyPendingTimers());
  expect(target.textContent).toBe("late content");
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("re-resolves a stable selector when its target appears or is replaced", () => {
  const view = (show: boolean, key: number) => (
    <>
      <Teleport to="#teleport-target">
        <span>content</span>
      </Teleport>
      {show && <div id="teleport-target" key={key} />}
    </>
  );
  const { rerender, container } = render(view(false, 0));
  expect(screen.queryByText("content")).toBeNull();
  rerender(view(true, 0));
  expect(container.querySelector("#teleport-target")?.textContent).toBe("content");
  const original = container.querySelector("#teleport-target");
  rerender(view(true, 1));
  expect(container.querySelector("#teleport-target")).not.toBe(original);
  expect(container.querySelector("#teleport-target")?.textContent).toBe("content");
  rerender(view(false, 1));
  expect(screen.queryByText("content")).toBeNull();
});

it("re-resolves a stable getPopupContainer callback when its result changes", () => {
  const first = document.createElement("div");
  const second = document.createElement("div");
  let target = first;
  const config = { locale: null, getPopupContainer: () => target };
  const view = (text: string) => (
    <ConfigContext.Provider value={config}>
      <Teleport>{text}</Teleport>
    </ConfigContext.Provider>
  );
  const { rerender, unmount } = render(view("first"));
  expect(first.textContent).toBe("first");
  target = second;
  rerender(view("second"));
  expect(first.textContent).toBe("");
  expect(second.textContent).toBe("second");
  unmount();
  expect(second.textContent).toBe("");
});

it("uses the configured default for body but respects an explicit element", () => {
  const configured = document.createElement("div");
  const explicit = document.createElement("div");
  const { rerender } = render(
    <ConfigContext.Provider value={{ locale: null, getPopupContainer: () => configured }}>
      <Teleport to="body">default</Teleport>
    </ConfigContext.Provider>,
  );
  expect(configured.textContent).toBe("default");
  rerender(
    <ConfigContext.Provider value={{ locale: null, getPopupContainer: () => configured }}>
      <Teleport to={explicit}>explicit</Teleport>
    </ConfigContext.Provider>,
  );
  expect(configured.textContent).toBe("");
  expect(explicit.textContent).toBe("explicit");
});

it("renders inline when disabled and cleans up only its own portal children", () => {
  const target = document.createElement("div");
  const existing = document.createElement("span");
  target.append(existing);
  const { container, rerender, unmount } = render(
    <StrictMode>
      <Teleport to={target}>content</Teleport>
    </StrictMode>,
  );
  expect(target.textContent).toBe("content");
  rerender(
    <StrictMode>
      <Teleport to={target} disabled>
        content
      </Teleport>
    </StrictMode>,
  );
  expect(container.textContent).toBe("content");
  expect(target.textContent).toBe("");
  rerender(
    <StrictMode>
      <Teleport to={target}>content</Teleport>
    </StrictMode>,
  );
  expect(container.textContent).toBe("");
  expect(target.textContent).toBe("content");
  unmount();
  expect(target.childNodes).toHaveLength(1);
  expect(target.firstChild).toBe(existing);
});

it("defers resolution and cancels stale timers when switching targets or unmounting", () => {
  vi.useFakeTimers();
  const first = document.createElement("div");
  const second = document.createElement("div");
  const { rerender, unmount } = render(
    <StrictMode>
      <Teleport to={first} defer>
        content
      </Teleport>
    </StrictMode>,
  );
  expect(first.textContent).toBe("");
  rerender(
    <StrictMode>
      <Teleport to={second} defer>
        content
      </Teleport>
    </StrictMode>,
  );
  act(() => vi.runOnlyPendingTimers());
  expect(first.textContent).toBe("");
  expect(second.textContent).toBe("content");
  unmount();
  act(() => vi.runOnlyPendingTimers());
  expect(second.textContent).toBe("");
});

it("does not resolve portal targets during server rendering", () => {
  const getPopupContainer = vi.fn(() => document.body);
  expect(
    renderToString(
      <ConfigContext.Provider value={{ locale: null, getPopupContainer }}>
        <Teleport>portal</Teleport>
      </ConfigContext.Provider>,
    ),
  ).toBe("");
  expect(getPopupContainer).not.toHaveBeenCalled();
  expect(renderToString(<Teleport disabled>inline</Teleport>)).toBe("inline");
});
