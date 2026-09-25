import { StrictMode, type ReactNode } from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Playground from "../src/views/playground";
import { DocsContext } from "../src/context";
import zh from "../src/lang/zh";

const editors = vi.hoisted(() => [] as Array<(code: string) => void>);
vi.mock("../src/components/app-header", () => ({ default: ({ leading }: { leading?: ReactNode }) => leading }));
vi.mock("codejar", () => ({
  CodeJar: (element: HTMLElement) => {
    let update: ((code: string) => void) | undefined;
    editors.push((code) => {
      element.textContent = code;
      update?.(code);
    });
    return {
      updateCode: (code: string) => {
        element.textContent = code;
      },
      toString: () => element.textContent || "",
      onUpdate: (callback: (code: string) => void) => {
        update = callback;
      },
      destroy() {},
    };
  },
}));
const key = "kui-playground-code";
const source = (label: string) => `export default function App() { return <div>${label}</div>; }`;
function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname + location.search + location.hash}</output>;
}
function mount(from?: string) {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[{ pathname: "/playground", state: { playgroundFrom: from } }]}>
        <DocsContext.Provider
          value={{
            lang: "zh",
            locale: zh,
            changeLang() {},
            t: (key) => key,
          }}
        >
          <Playground /><Location />
        </DocsContext.Provider>
      </MemoryRouter>
    </StrictMode>,
  );
}
beforeEach(() => {
  sessionStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  sessionStorage.clear();
  editors.length = 0;
});
it("retains transferred code through StrictMode cleanup and reload", () => {
  const saved = { ts: source("Saved TS"), js: source("Saved JS"), language: "js" };
  sessionStorage.setItem(key, JSON.stringify(saved));
  const first = mount();
  expect(first.container.querySelector(".k-content")?.textContent).toBe("Saved JS");
  expect(JSON.parse(sessionStorage.getItem(key)!)).toEqual(saved);
  first.unmount();
  const second = mount();
  expect(second.container.querySelector(".k-code")?.textContent).toBe(saved.js);
  expect(second.container.querySelector(".k-content")?.textContent).toBe("Saved JS");
});
it.each(["ts", "js"] as const)(
  "saves %s edits immediately and restores the selected language",
  (language) => {
    sessionStorage.setItem(key, JSON.stringify({ ts: source("TS"), js: source("JS"), language }));
    const first = mount();
    act(() => editors.at(-1)!(source("Edited")));
    const saved = JSON.parse(sessionStorage.getItem(key)!);
    expect(saved[language]).toBe(source("Edited"));
    expect(saved[language === "ts" ? "js" : "ts"]).toBe(source(language === "ts" ? "JS" : "TS"));
    expect(saved.language).toBe(language);
    // Reload before the debounced compilation fires.
    first.unmount();
    const second = mount();
    expect(second.container.querySelector(".k-code")?.textContent).toBe(source("Edited"));
    expect(second.container.querySelector(".k-content")?.textContent).toBe("Edited");
  },
);
it.each(["null", "not json"])("handles invalid stored data: %s", (value) => {
  sessionStorage.setItem(key, value);
  expect(() => mount()).not.toThrow();
});
it("keeps an empty draft instead of replacing it with the default Spin example", () => {
  sessionStorage.setItem(key, JSON.stringify({ ts: "", js: "", language: "ts" }));
  const view = mount();
  expect(view.container.querySelector(".k-code")?.textContent).toBe("");
  expect(view.container.querySelector(".k-demo-error")).not.toBeNull();
});

it("returns to the originating documentation including its anchor", () => {
  const view = mount("/components/button?demo=basic#api");
  fireEvent.click(view.getByRole("button", { name: "返回文档" }));
  expect(view.getByTestId("location").textContent).toBe("/components/button?demo=basic#api");
});
it("returns to component docs when opened directly", () => {
  const view = mount();
  fireEvent.click(view.getByRole("button", { name: "返回文档" }));
  expect(view.getByTestId("location").textContent).toBe("/guide/components");
});
