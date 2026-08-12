import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import LoadingBar, { type LoadingHandle, type LoadingProps } from "./loading-bar";

export type { LoadingProps } from "./loading-bar";

let root: Root | null = null;
let instance: LoadingHandle | null = null;
let container: HTMLElement | null = null;

function ensureInstance(props?: LoadingProps) {
  if (instance) return instance;
  container = document.getElementById("k-loading-box") ?? document.createElement("div");
  container.id = "k-loading-box";
  if (!container.parentNode) document.body.appendChild(container);
  root = createRoot(container);
  flushSync(() =>
    root!.render(
      <LoadingBar
        {...props}
        ref={(value) => {
          instance = value;
        }}
      />
    )
  );
  return instance;
}

const invoke = (method: keyof LoadingHandle, value?: number) => {
  const current = ensureInstance();
  if (method === "update") current?.update(value ?? 0);
  else current?.[method]();
};

const loading = {
  start: () => invoke("start"),
  finish: () => invoke("finish"),
  error: () => invoke("error"),
  update: (percent: number) => invoke("update", percent),
  destroy() {
    root?.unmount();
    container?.remove();
    root = null;
    instance = null;
    container = null;
  },
};

export default loading;
