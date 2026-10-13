import { act, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { modal, type ModalInstance } from "../components/modal/api";

/**
 * modal.info() 返回的实例形状（Vue 那边是 { show, hide, destroy }，见 kui-vue/tests/modal-imperative-instance.test.ts）。
 * 关键契约：destroy 只负责关窗，DOM 要等退场动画跑完才拆，拆的时候容器 div 和传送到 body 的那份都得一起走。
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const flush = () =>
  act(async () => {
    await sleep(0);
  });

const titleText = () => document.querySelector(".k-toast-title")?.textContent;

let instances: ModalInstance[] = [];

function open(title: string) {
  const instance = modal.info({ title, content: "content" });
  instances.push(instance);
  return instance;
}

describe("Imperative modal instance", () => {
  afterEach(async () => {
    await act(async () => {
      instances.forEach((instance) => instance.destroy());
      await sleep(500);
    });
    instances = [];
    document.body.innerHTML = "";
    document.body.className = "";
    document.body.removeAttribute("style");
  });

  it("exposes the show / hide / destroy surface", () => {
    const instance = open("Surface");
    expect(typeof instance.show).toBe("function");
    expect(typeof instance.hide).toBe("function");
    expect(typeof instance.destroy).toBe("function");
  });

  it("plays the exit animation before removing the dialog", async () => {
    const baseline = document.body.childElementCount;
    const instance = open("Animated");
    await waitFor(() => expect(titleText()).toBe("Animated"));
    // 打开后 body 里多了两坨：命令式容器 + 传送到 body 的窗口
    expect(document.body.childElementCount).toBeGreaterThan(baseline);

    act(() => {
      instance.destroy();
    });
    await act(async () => {
      await sleep(10);
    });
    // destroy 只关窗，不掀桌子：动画期间标题还在，但窗口已经进入关闭态（滚动锁先放开）
    expect(titleText()).toBe("Animated");
    expect(document.body.classList.contains("k-scroll-locked")).toBe(false);
    // 动画还没播完就把 DOM 掀掉，等于没有退场
    await sleep(120);
    expect(titleText()).toBe("Animated");

    await waitFor(() => expect(document.querySelector(".k-toast")).toBeNull());
    // 容器和传送节点要一起拆干净，否则 body 里全是空 div
    await waitFor(() => expect(document.body.childElementCount).toBe(baseline));
  });

  it("hide() closes the dialog and the container goes away with it", async () => {
    const baseline = document.body.childElementCount;
    const instance = open("Hide me");
    await waitFor(() => expect(titleText()).toBe("Hide me"));

    act(() => {
      instance.hide();
    });
    await waitFor(() => expect(document.querySelector(".k-toast")).toBeNull());
    await waitFor(() => expect(document.body.childElementCount).toBe(baseline));
  });

  it("is idempotent when destroy is called repeatedly", async () => {
    const instance = open("Destroy twice");
    await flush();

    act(() => {
      instance.destroy();
      instance.destroy();
      instance.destroy();
    });
    await waitFor(() => expect(document.querySelector(".k-toast")).toBeNull());
  });

  it("takes a node tree for title and content, not just a string", async () => {
    await act(async () => {
      instances.push(modal.info({ title: <strong>富标题</strong>, content: <p>富正文</p> }));
      await sleep(0);
    });

    // 命令式 API 的 title/content 是 ReactNode：节点要原样渲染出来，不是被 toString 掉
    await waitFor(() =>
      expect(document.querySelector(".k-toast-title strong")?.textContent).toBe("富标题"),
    );
    expect(document.querySelector(".k-toast-content p")?.textContent).toBe("富正文");
  });
});
