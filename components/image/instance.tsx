import { flushSync } from "react-dom";
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
  flushSync(() =>
    root.render(
      <Preview
        {...props}
        ref={(value) => {
          api = value;
        }}
      />
    )
  );
  return {
    show: (options) => api?.show(options),
    close: () => api?.close(),
    togglePanel: () => api?.togglePanel(),
    destroy: () => {
      root.unmount();
      container.remove();
    },
  };
}
