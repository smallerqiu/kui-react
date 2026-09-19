import { createRoot, type Root } from "react-dom/client";
import LoadingBar, { type LoadingHandle, type LoadingProps } from "./loading-bar";

export type { LoadingProps } from "./loading-bar";

let root: Root | null = null;
let instance: LoadingHandle | null = null;
let container: HTMLElement | null = null;
let pending: Array<(current: LoadingHandle) => void> = [];

function ensureInstance(props?: LoadingProps) {
  if (instance) return instance;
  if (root) return null;
  container = document.getElementById("k-loading-box") ?? document.createElement("div");
  container.id = "k-loading-box";
  if (!container.parentNode) document.body.appendChild(container);
  root = createRoot(container);
  const currentRoot = root;
  root.render(
    <LoadingBar
      {...props}
      ref={(value) => {
        if (!value || root !== currentRoot) return;
        instance = value;
        const actions = pending;
        pending = [];
        actions.forEach((action) => action(value));
      }}
    />,
  );
  return null;
}

const invoke = (method: keyof LoadingHandle, value?: number) => {
  const current = ensureInstance();
  const action = (target: LoadingHandle) => {
    if (method === "update") target.update(value ?? 0);
    else target[method]();
  };
  if (current) action(current);
  else pending.push(action);
};

const loading = {
  start: (props?: LoadingProps) => {
    const current = ensureInstance(props);
    if (current) current.start();
    else pending.push((target) => target.start());
  },
  finish: () => invoke("finish"),
  error: () => invoke("error"),
  update: (percent: number) => invoke("update", percent),
  destroy() {
    const currentRoot = root;
    const currentContainer = container;
    root = null;
    instance = null;
    container = null;
    pending = [];
    currentContainer?.remove();
    queueMicrotask(() => {
      currentRoot?.unmount();
    });
  },
};

export default loading;
