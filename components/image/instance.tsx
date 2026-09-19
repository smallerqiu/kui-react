import { createRoot, type Root } from "react-dom/client";
import Preview, { type ImagePreviewApi, type ImagePreviewProps } from "./preview";

export interface ImagePreviewInstance extends ImagePreviewApi {
  destroy: () => void;
}

export default function createInstance(props: ImagePreviewProps = {}): ImagePreviewInstance {
  const container = document.createElement("div");
  container.id = "k-image-preview-box";
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  let api: ImagePreviewApi | null = null;
  let active = true;
  const pending: Array<(current: ImagePreviewApi) => void> = [];
  root.render(
    <Preview
      {...props}
      ref={(value) => {
        if (!value || !active) return;
        api = value;
        pending.splice(0).forEach((action) => action(value));
      }}
    />,
  );
  const invoke = (action: (current: ImagePreviewApi) => void) => {
    if (api) action(api);
    else if (active) pending.push(action);
  };
  return {
    show: (options) => invoke((current) => current.show(options)),
    close: () => invoke((current) => current.close()),
    togglePanel: () => invoke((current) => current.togglePanel()),
    destroy: () => {
      if (!active) return;
      active = false;
      pending.length = 0;
      container.remove();
      queueMicrotask(() => root.unmount());
    },
  };
}
