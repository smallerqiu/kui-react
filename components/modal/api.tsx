import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { recordMousePoint } from "../config/context";
import type { IconType } from "../icon";
import Toast, { type ToastType } from "./toast";

export interface ModalApiProps {
  title?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  content?: React.ReactNode;
  color?: string;
  icon?: IconType[];
  onOk?: () => void | Promise<unknown>;
  onCancel?: () => void;
  type?: ToastType;
}

export interface ModalInstance {
  destroy: () => void;
}

const instances = new Set<ModalInstance>();
recordMousePoint();

function showModal(props: ModalApiProps): ModalInstance {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  let destroyed = false;
  const instance: ModalInstance = {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      instances.delete(instance);
      setTimeout(() => {
        root.unmount();
        container.remove();
      }, 0);
    },
  };
  flushSync(() => root.render(<Toast {...props} onDestroy={instance.destroy} />));
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
