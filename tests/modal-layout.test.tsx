import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Modal from "../components/modal/modal";

/**
 * Modal 的取值契约：width 走 toCssLength（"480" 这种纯数字字符串也要补 px，以前直接被浏览器丢掉），
 * 居中时不能写内联 top（内联样式压得住 `.k-modal-centered .k-modal-inner{top:0}`），
 * 不拖动时不写内联 left。
 * 两个仓库断言同一件事，见 kui-vue/tests/modal-layout.test.ts。
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

const inner = () => document.querySelector<HTMLElement>(".k-modal-inner");

describe("Modal inline geometry", () => {
  it("uses the top and width defaults", async () => {
    await open();
    await settle();

    expect(inner()?.style.width).toBe("520px");
    expect(inner()?.style.top).toBe("100px");
    expect(inner()?.style.left).toBe("");
  });

  it("turns numeric-string widths into px", async () => {
    open({ width: "480" });
    await settle();
    expect(inner()?.style.width).toBe("480px");

    view?.rerender(
      <Modal open title="标题" width="30rem">
        <span>内容</span>
      </Modal>,
    );
    await settle();
    expect(inner()?.style.width).toBe("30rem");
  });

  it("honours a custom top", async () => {
    open({ top: 40 });
    await settle();
    expect(inner()?.style.top).toBe("40px");
  });

  it("leaves top to the stylesheet when centered", async () => {
    open({ centered: true });
    await settle();

    expect(document.querySelector(".k-modal")?.classList.contains("k-modal-centered")).toBe(true);
    expect(inner()?.style.top).toBe("");
    expect(inner()?.style.left).toBe("");
  });

  it("writes left only while draggable", async () => {
    open({ draggable: true });
    await settle();
    // 拖动时 left 才有意义，具体值取决于居中计算，别把时序写进断言
    expect(inner()?.style.left).not.toBe("");

    view?.rerender(
      <Modal open title="标题" draggable centered>
        <span>内容</span>
      </Modal>,
    );
    await settle();
    expect(inner()?.style.left).toBe("");
    expect(inner()?.style.top).toBe("");
  });

  it("drops the geometry style when maximized", async () => {
    open({ maximized: true });
    await settle();
    // 最大化由样式表铺满整屏，内联几何一律不写
    expect(inner()?.style.width).toBe("");
    expect(inner()?.style.top).toBe("");
  });
});
