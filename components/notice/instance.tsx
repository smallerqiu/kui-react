import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import Container, { type NoticeContainerApi } from "./container";
import type { ContentProps } from "./content";

export interface NoticeInstance {
  show: (options: ContentProps) => () => void;
  clean: () => void;
  destroy: () => void;
}
export const createInstance = (type: "message" | "notice"): NoticeInstance => {
  const container = document.createElement("div");
  container.id = `k-${type}-box`;
  document.body.appendChild(container);
  const root = createRoot(container);
  let api: NoticeContainerApi | null = null;
  flushSync(() => root.render(<Container type={type} ref={(value) => { api = value; }} />));
  return {
    show: (options) => api?.show(options) ?? (() => undefined),
    clean: () => api?.clean(),
    destroy: () => { root.unmount(); container.remove(); },
  };
};
