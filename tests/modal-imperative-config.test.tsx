import { act, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ConfigProvider from "../components/config";
import enUS from "../components/locale/en";
import zhCN from "../components/locale/zh-CN";
import { modal } from "../components/modal/api";

/**
 * 命令式弹窗（modal.info 这类）走 createRoot，挂在组件树外面，天生读不到 ConfigProvider。
 * ConfigProvider 会把配置登记到 config/context 的栈里，showModal 再显式包一层 Provider 取回来。
 * Vue 侧做的是同一件事（appContext 栈 + vm.appContext），这里断言的是这套登记在 React 里成立。
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Toast 底部按钮文案，从左到右。confirm 类型才有第二个。 */
const footerLabels = () =>
  [...document.querySelectorAll(".k-toast-footer .k-btn")].map((button) => button.textContent);

const okLabel = () => footerLabels().at(-1);

async function openInfo(title: string) {
  act(() => {
    modal.info({ title, content: "content" });
  });
  await act(async () => {
    await sleep(0);
  });
  await waitFor(() => expect(document.querySelector(".k-toast-title")).not.toBeNull());
  expect(document.querySelector(".k-toast-title")?.textContent).toBe(title);
}

async function destroyAll() {
  await act(async () => {
    modal.destroyAll();
    await sleep(500);
  });
}

describe("Imperative modal config inheritance", () => {
  afterEach(async () => {
    await destroyAll();
    document.body.innerHTML = "";
    document.body.className = "";
    document.body.removeAttribute("style");
  });

  it("gives the dialog the locale registered by ConfigProvider", async () => {
    render(
      <ConfigProvider locale={zhCN}>
        <span />
      </ConfigProvider>,
    );
    await openInfo("Localized");
    expect(okLabel()).toBe("确定");
  });

  it("falls back to the English defaults when no ConfigProvider is mounted", async () => {
    // 库级默认是 en，出处只有 `DEFAULT_LOCALE`；组件里再写死 `|| zhCN` 会让这里变成"确定"。
    await openInfo("No provider");
    expect(okLabel()).toBe("Ok");
  });

  it("re-renders an open dialog when the provider config changes", async () => {
    const { rerender } = render(
      <ConfigProvider locale={zhCN}>
        <span />
      </ConfigProvider>,
    );
    await openInfo("Live");
    expect(okLabel()).toBe("确定");

    rerender(
      <ConfigProvider locale={enUS}>
        <span />
      </ConfigProvider>,
    );
    await waitFor(() => expect(okLabel()).toBe("Ok"));
    // 语言换了，窗口内容不能跟着换成新的（那等于重开了一遍）。
    expect(document.querySelector(".k-toast-title")?.textContent).toBe("Live");
  });

  it("inherits appearance as well as text", async () => {
    render(
      <ConfigProvider size="small" theme="plain">
        <span />
      </ConfigProvider>,
    );
    await openInfo("Appearance");
    const okButton = document.querySelector(".k-toast-footer .k-btn")!;
    expect(okButton.classList.contains("k-btn-sm")).toBe(true);
    expect(okButton.classList.contains("k-btn-plain")).toBe(true);
  });

  it("routes the dialog through the configured popup container", async () => {
    const host = document.createElement("div");
    host.className = "imperative-host";
    document.body.appendChild(host);
    render(
      <ConfigProvider getPopupContainer={() => host}>
        <span />
      </ConfigProvider>,
    );
    await openInfo("Container");
    expect(host.querySelector(".k-modal-wrap")).not.toBeNull();
  });

  it("stops inheriting once the provider unmounts", async () => {
    const view = render(
      <ConfigProvider locale={zhCN}>
        <span />
      </ConfigProvider>,
    );
    view.unmount();
    await openInfo("After unmount");
    // 登记的中文配置随 Provider 一起失效，回到库级默认（英文），而不是停在"确定"。
    expect(okLabel()).toBe("Ok");
  });

  it("only registers the outermost provider", async () => {
    // Vue 侧同样是 !parentConfig 才登记：嵌套 Provider 改的是自己子树的口径，
    // 命令式 API 服务的是根上那份配置。
    const tree = (innerTheme: "plain" | "outline") => (
      <ConfigProvider locale={enUS}>
        <ConfigProvider locale={zhCN} theme={innerTheme}>
          <span />
        </ConfigProvider>
      </ConfigProvider>
    );
    const { rerender } = render(tree("plain"));
    await openInfo("Nested");
    expect(okLabel()).toBe("Ok");

    // 内层 Provider 重渲染（配置对象换了、登记副作用重跑）也不许把命令式 API 的口径抢走。
    rerender(tree("outline"));
    await act(async () => {
      await sleep(0);
    });
    expect(okLabel()).toBe("Ok");
  });

  it("serves the most recently mounted root when several providers coexist", async () => {
    const first = render(
      <ConfigProvider locale={zhCN}>
        <span />
      </ConfigProvider>,
    );
    const second = render(
      <ConfigProvider locale={enUS}>
        <span />
      </ConfigProvider>,
    );
    await openInfo("Two roots");
    expect(okLabel()).toBe("Ok");

    await destroyAll();
    second.unmount();
    await openInfo("Back to one root");
    expect(okLabel()).toBe("确定");
    first.unmount();
  });

  it("leaves destroyed dialogs alone when the config changes afterwards", async () => {
    const { rerender } = render(
      <ConfigProvider locale={zhCN}>
        <span />
      </ConfigProvider>,
    );
    modal.info({ title: "Gone", content: "content" });
    await act(async () => {
      await sleep(0);
    });
    await destroyAll();

    rerender(
      <ConfigProvider locale={enUS}>
        <span />
      </ConfigProvider>,
    );
    await act(async () => {
      await sleep(0);
    });
    expect(document.querySelectorAll(".k-toast").length).toBe(0);
  });
});
