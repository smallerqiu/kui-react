import { createRoot, type Root } from "react-dom/client";
import { ConfigContext, EMPTY_CONFIG } from "../config/config-context";
import { currentConfig, recordMousePoint, subscribeConfig } from "../config/context";
import type { IconType } from "../icon";
import Toast, { type ToastType } from "./toast";

export interface ModalApiProps {
  title?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  content?: React.ReactNode;
  color?: string;
  icon?: IconType[];
  onOk?: () => void | PromiseLike<unknown>;
  onCancel?: () => void;
  type?: ToastType;
}

export interface ModalInstance {
  /** 重新显示窗口。命令式创建时默认就是打开的，hide 之前用它做二次确认这类场景。 */
  show: () => void;
  /** 收起窗口，退场动画照常播；动画结束这棵树自己拆掉（和 Vue 那边 hide 的走向一致）。 */
  hide: () => void;
  /** 立刻收起并在退场动画跑完后拆掉 DOM、退订配置。重复调用只生效一次。 */
  destroy: () => void;
}

const instances = new Set<ModalInstance>();
recordMousePoint();

function showModal(props: ModalApiProps): ModalInstance {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  let open = true;
  let destroyed = false;
  let unmountTimer: ReturnType<typeof setTimeout> | undefined;
  let unsubscribe: () => void = () => {};

  const unmount = () => {
    if (destroyed) return;
    destroyed = true;
    if (unmountTimer !== undefined) clearTimeout(unmountTimer);
    unsubscribe();
    instances.delete(instance);
    root.unmount();
    container.remove();
  };

  const instance: ModalInstance = {
    show: () => {
      if (destroyed) return;
      open = true;
      render();
    },
    hide: () => {
      if (destroyed) return;
      open = false;
      render();
    },
    destroy: () => {
      if (destroyed) return;
      instance.hide();
      // 拆树要等退场动画：Vue 那边是 hide() 之后延后 300ms 才 render(null)，
      // 直接 unmount 等于把动画剪掉（destroy 常常是关窗回调里顺手调的）。
      if (unmountTimer === undefined) unmountTimer = setTimeout(unmount, 300);
    },
  };

  // 命令式弹窗是 createRoot 挂出去的独立树，useContext 够不着页面里的 ConfigProvider。
  // 所以把最外层 ConfigProvider 登记的配置显式包一层进来，语言/弹层容器/尺寸才跟着走；
  // 再订阅配置变化，ConfigProvider 更新时活着的弹窗也跟着重渲染（Vue 侧靠 reactive provide 同一件事）。
  const render = () => {
    // 销毁后的 root 不能再渲染：退了订也可能有已经排好的回调赶在前面跑，
    // 拿 unmounted 的 root 渲染是直接抛 "Cannot update an unmounted root"。
    if (destroyed) return;
    root.render(
      <ConfigContext.Provider value={currentConfig() ?? EMPTY_CONFIG}>
        <Toast
          {...props}
          open={open}
          onOpenChange={(next) => {
            open = next;
            render();
          }}
          onDestroy={instance.destroy}
        />
      </ConfigContext.Provider>,
    );
  };
  unsubscribe = subscribeConfig(render);
  render();
  instances.add(instance);
  return instance;
}

export interface ModalApi {
  show: (props: ModalApiProps) => ModalInstance;
  info: (props: ModalApiProps) => ModalInstance;
  success: (props: ModalApiProps) => ModalInstance;
  warning: (props: ModalApiProps) => ModalInstance;
  confirm: (props: ModalApiProps) => ModalInstance;
  error: (props: ModalApiProps) => ModalInstance;
  destroyAll: () => void;
}

export const modal: ModalApi = {
  show: showModal,
  info: (props) => showModal({ type: "info", ...props }),
  success: (props) => showModal({ type: "success", ...props }),
  warning: (props) => showModal({ type: "warning", ...props }),
  error: (props) => showModal({ type: "error", ...props }),
  confirm: (props) => showModal({ type: "confirm", ...props }),
  destroyAll: () => [...instances].forEach((instance) => instance.destroy()),
};
