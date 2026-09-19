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
  let active = true;
  const pending: Array<{
    options: ContentProps;
    closed: boolean;
    close?: () => void;
  }> = [];
  root.render(
    <Container
      type={type}
      ref={(value) => {
        if (!value || !active) return;
        api = value;
        pending.splice(0).forEach((item) => {
          if (!item.closed) item.close = value.show(item.options);
        });
      }}
    />,
  );
  let destroying = false;
  return {
    show: (options) => {
      if (api) return api.show(options);
      const item = { options, closed: false, close: undefined as (() => void) | undefined };
      pending.push(item);
      return () => {
        item.closed = true;
        item.close?.();
      };
    },
    clean: () => {
      pending.forEach((item) => (item.closed = true));
      api?.clean();
    },
    destroy: () => {
      if (destroying) return;
      destroying = true;
      active = false;
      pending.length = 0;
      const remove = () => {
        root.unmount();
        container.remove();
      };
      if (api) api.clean(() => setTimeout(remove, 0));
      else setTimeout(remove, 0);
    },
  };
};
