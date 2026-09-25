import { act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import Demo from "../src/components/demo/demo";
import { DocsContext } from "../src/context";
import zh from "../src/lang/zh";

const editors = vi.hoisted(
  () =>
    [] as Array<{
      update: (code: string) => void;
      destroy: ReturnType<typeof vi.fn>;
    }>,
);
vi.mock("codejar", () => ({
  CodeJar: (element: HTMLElement) => {
    let onUpdate: (code: string) => void = () => {};
    const editor = {
      update: (code: string) => {
        element.textContent = code;
        onUpdate(code);
      },
      destroy: vi.fn(),
    };
    editors.push(editor);
    return {
      updateCode: (code: string) => {
        element.textContent = code;
      },
      toString: () => element.textContent || "",
      onUpdate: (callback: typeof onUpdate) => {
        onUpdate = callback;
      },
      destroy: editor.destroy,
    };
  },
}));

const source = "export default function App() { return <span>Original</span>; }";
const draft = "export default function App() { return <span>Edited</span>; }";
const mountDemo = (direction = "vertical") =>
  render(
    <MemoryRouter>
      <DocsContext.Provider
        value={{
          lang: "zh",
          locale: zh,
          changeLang() {},
          t: (key) => zh.text[key.replace("text.", "") as keyof typeof zh.text] || key,
        }}
      >
        <Demo source={source} javaScriptSource={source} direction={direction}>
          <span>Original</span>
        </Demo>
      </DocsContext.Provider>
    </MemoryRouter>,
  );

afterEach(() => {
  vi.useRealTimers();
  editors.length = 0;
});

describe("Demo editor", () => {
  it("preserves the editor and draft when switching responsive layouts", () => {
    vi.useFakeTimers();
    let width = 1000;
    const original = HTMLElement.prototype.getBoundingClientRect;
    const measure = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return this.classList.contains("k-demo-container") ? { width } as DOMRect : original.call(this);
    });
    const view = mountDemo("horizontal");
    const code = view.container.querySelector(".k-code");
    act(() => editors[0].update(draft));
    const resize = (next: number) => {
      width = next;
      fireEvent(window, new Event("resize"));
    };
    resize(700);
    expect(view.container.querySelector(".k-demo-vertical")).not.toBeNull();
    expect(view.container.querySelector(".k-code")).toBe(code);
    expect(code?.textContent).toBe(draft);
    fireEvent.click(view.getByRole("button", { name: "收起代码" }));
    resize(820);
    expect(view.container.querySelector(".k-demo-vertical")).not.toBeNull();
    resize(900);
    expect(view.container.querySelector(".k-demo-horizontal")).not.toBeNull();
    expect(view.container.querySelector<HTMLElement>(".k-code-box")!.style.height).toBe("");
    expect(editors).toHaveLength(1);
    view.unmount();
    measure.mockRestore();
  });

  it("keeps the collapsed preview, toolbar, and editor draft mounted", () => {
    vi.useFakeTimers();
    const view = mountDemo();
    const codeBox = view.container.querySelector<HTMLElement>(".k-code-box")!;
    const code = view.container.querySelector(".k-code")!;
    expect(codeBox.style.height).toBe("80px");
    expect(view.container.querySelector(".k-demo-vertical")).not.toBeNull();
    expect(view.getByText("可实时编辑")).not.toBeNull();
    expect(view.container.querySelector(".k-code-tools")).not.toBeNull();
    act(() => editors[0].update(draft));
    fireEvent.click(view.getByRole("button", { name: "展开代码" }));
    expect(codeBox.style.height).toBe("");
    fireEvent.click(view.getByRole("button", { name: "收起代码" }));
    expect(view.container.querySelector(".k-code")).toBe(code);
    expect(code.textContent).toBe(draft);
    expect(editors).toHaveLength(1);
    act(() => vi.advanceTimersByTime(500));
    expect(view.getByText("Edited")).not.toBeNull();
    view.unmount();
    expect(editors[0].destroy).toHaveBeenCalled();
  });

  it("preserves separate TS and JS drafts across language switches", () => {
    vi.useFakeTimers();
    const view = mountDemo();
    act(() => editors[0].update(draft));
    fireEvent.click(view.getByText("JS"));
    expect(view.container.querySelector(".k-code")?.textContent).toBe(source);
    fireEvent.click(view.getByText("TS"));
    expect(view.container.querySelector(".k-code")?.textContent).toBe(draft);
    expect(view.getByText("Edited")).not.toBeNull();
    view.unmount();
  });
});
