import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Modal from "../components/modal/modal";

/**
 * Modal 的遮罩语义契约：打开时锁页面滚动、给 dialog 标 aria-modal、把 Tab 关在面板内，
 * 关闭/卸载时把锁和焦点还给触发元素；嵌套时锁按引用计数，先关的那层不能把别的层的锁解掉。
 * 两个仓库断言同一件事，见 kui-vue/tests/modal-a11y.test.ts。
 */

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 80));
};

let view: ReturnType<typeof render> | null = null;

const open = (props: Record<string, unknown> = {}) => {
  view = render(
    <Modal open title="标题" {...props}>
      <input aria-label="输入框" />
    </Modal>,
  );
  return view;
};

afterEach(() => {
  view?.unmount();
  view = null;
  document.body.className = "";
  document.body.removeAttribute("style");
});

const locked = () => document.body.classList.contains("k-scroll-locked");

describe("Modal scroll lock and focus trap", () => {
  it("locks page scroll and marks the dialog modal", async () => {
    open();
    await settle();

    expect(locked()).toBe(true);
    expect(document.body.style.overflowY).toBe("hidden");
    expect(document.querySelector(".k-modal-wrap")?.getAttribute("aria-modal")).toBe("true");
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it("never locks or traps for panelOnly", async () => {
    open({ panelOnly: true, open: undefined });
    await settle();

    expect(locked()).toBe(false);
    expect(document.body.style.overflowY).toBe("");
    expect(document.querySelector(".k-modal-wrap")?.getAttribute("aria-modal")).toBeNull();
  });

  it("keeps Tab inside the panel", async () => {
    open();
    await settle();

    const inner = document.querySelector<HTMLElement>(".k-modal-inner");
    const focusables = inner?.querySelectorAll<HTMLElement>(
      "button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
    );
    const last = focusables?.[focusables.length - 1];
    const first = focusables?.[0];
    expect(focusables?.length).toBeGreaterThan(2);

    last?.focus();
    fireEvent.keyDown(inner as HTMLElement, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    first?.focus();
    fireEvent.keyDown(inner as HTMLElement, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("returns focus to the trigger once the modal closes", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "打开";
    document.body.appendChild(trigger);
    trigger.focus();

    const wrapper = open();
    await settle();
    expect(document.activeElement?.closest(".k-modal-inner")).not.toBeNull();

    wrapper.rerender(
      <Modal open={false} title="标题">
        <input aria-label="输入框" />
      </Modal>,
    );
    await settle();

    expect(document.activeElement).toBe(trigger);
    expect(locked()).toBe(false);
    trigger.remove();
  });

  it("unlocks only after the last stacked modal is gone", async () => {
    const outer = open();
    await settle();
    const inner = render(
      <Modal open title="内层">
        <span>内容</span>
      </Modal>,
    );
    await settle();
    expect(locked()).toBe(true);

    inner.unmount();
    await settle();
    expect(locked()).toBe(true);

    outer.unmount();
    await settle();
    expect(locked()).toBe(false);
    view = null;
  });
});
