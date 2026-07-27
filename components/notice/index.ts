import type { ReactNode } from "react";
import type { NoticeType } from "../const/types";
import type { IconType } from "../icon";
import { createInstance, type NoticeInstance } from "./instance";

let noticeInstance: NoticeInstance | null = null;
export interface NoticeOptions {
  type?: NoticeType;
  title?: ReactNode;
  content?: ReactNode;
  duration?: number;
  icon?: IconType[];
  color?: string;
  onClose?: () => void;
}
export interface NoticeApi {
  name: "notice";
  info: (options: NoticeOptions) => () => void;
  success: (options: NoticeOptions) => () => void;
  warning: (options: NoticeOptions) => () => void;
  error: (options: NoticeOptions) => () => void;
  open: (options: NoticeOptions) => () => void;
  destroy: () => void;
}
const notice: NoticeApi = {
  name: "notice",
  open(options) {
    noticeInstance ??= createInstance("notice");
    return noticeInstance.show({ ...options, noticeType: "notice" });
  },
  destroy() { noticeInstance?.clean(); noticeInstance?.destroy(); noticeInstance = null; },
  info(options) { return this.open({ ...options, type: "info" }); },
  success(options) { return this.open({ ...options, type: "success" }); },
  warning(options) { return this.open({ ...options, type: "warning" }); },
  error(options) { return this.open({ ...options, type: "error" }); },
};
export default notice;
