import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Modal from "../components/modal/modal";

/**
 * Modal 的面板谓词契约：没给 title 就不该有 header（空标题也会撑出一条带边框的横条），
 * footer 关掉时既没有 .k-modal-footer，也不该带 k-modal-has-footer（它决定 body 的可用高度）。
 * 两个仓库断言同一件事，见 kui-vue/tests/modal-header-footer.test.ts。
 */

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 80));
};

let view: ReturnType<typeof render> | null = null;

const open = (props: Record<string, unknown> = {}) => {
  view = render(
    <Modal open title="标题" {...props}>
      <span>内容</span>
    </Modal>,
  );
  return view;
};

afterEach(() => {
  view?.unmount();
  view = null;
  document.body.innerHTML = "";
  document.body.className = "";
  document.body.removeAttribute("style");
});

const root = () => document.querySelector(".k-modal");

describe("Modal header and footer predicates", () => {
  it("renders the header and the default footer", async () => {
    open();
    await settle();

    expect(document.querySelector(".k-modal-header-inner")?.textContent).toBe("标题");
    expect(document.querySelectorAll(".k-modal-footer button")).toHaveLength(2);
    expect(root()?.classList.contains("k-modal-has-footer")).toBe(true);
  });

  it("drops the header when no title is given", async () => {
    open({ title: undefined });
    await settle();

    expect(document.querySelector(".k-modal-header")).toBeNull();
    expect(document.querySelector(".k-modal-body")?.textContent).toBe("内容");
  });

  it("drops the header for an explicit null title", async () => {
    open({ title: null });
    await settle();

    expect(document.querySelector(".k-modal-header")).toBeNull();
  });

  // react 侧的富标题靠 `title: ReactNode`，vue 侧同一能力是 `title` 插槽
  // （见 kui-vue/tests/modal-header-footer.test.ts）。
  it("renders rich title content", async () => {
    open({ title: <em>富标题</em> });
    await settle();

    expect(document.querySelector(".k-modal-header-inner em")?.textContent).toBe("富标题");
    expect(document.querySelector(".k-modal-header-inner")?.textContent).toBe("富标题");
  });

  it("drops the footer node and its class when footer is off", async () => {
    open({ footer: false });
    await settle();

    expect(document.querySelector(".k-modal-footer")).toBeNull();
    expect(root()?.classList.contains("k-modal-has-footer")).toBe(false);
  });

  it("treats a null footer the same as false", async () => {
    open({ footer: null });
    await settle();

    expect(document.querySelector(".k-modal-footer")).toBeNull();
    expect(root()?.classList.contains("k-modal-has-footer")).toBe(false);
  });

  it("keeps custom footer content", async () => {
    open({ footer: <span data-testid="custom">自定义</span> });
    await settle();

    expect(document.querySelector(".k-modal-footer")?.textContent).toBe("自定义");
    expect(root()?.classList.contains("k-modal-has-footer")).toBe(true);
  });
});
