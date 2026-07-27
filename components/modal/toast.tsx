import { CircleAlert, CircleCheck, CircleQuestionMark, CircleX, Info } from "kui-icons";
import { useContext, useState } from "react";
import { Button } from "../button";
import { ConfigContext } from "../config";
import Icon, { type IconType } from "../icon";
import zhCN from "../locale/zh-CN";
import Modal from "./modal";

export type ToastType = "info" | "success" | "error" | "warning" | "confirm";
export interface ToastProps {
  title?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  content?: React.ReactNode;
  color?: string;
  icon?: IconType[];
  onOk?: () => void | Promise<unknown>;
  onCancel?: () => void;
  onDestroy?: () => void;
  type?: ToastType;
}

const icons = { info: Info, error: CircleX, success: CircleCheck, warning: CircleAlert, confirm: CircleQuestionMark };

export default function Toast({
  title, okText, cancelText, content, color, icon, onOk, onCancel, onDestroy, type = "info",
}: ToastProps) {
  const { locale } = useContext(ConfigContext);
  const messages = (locale ?? zhCN)?.k?.common;
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const hide = () => { setOpen(false); setTimeout(() => onDestroy?.(), 300); };
  const ok = async () => {
    try {
      const result = onOk?.();
      if (result && typeof (result as Promise<unknown>).then === "function") {
        setLoading(true);
        await result;
      }
      hide();
    } catch { setLoading(false); }
  };
  const cancel = () => { onCancel?.(); hide(); };
  const body = <>
    <div className="k-toast-header">
      <Icon className="k-toast-icon" type={icon ?? icons[type]} color={color} />
      <div className="k-toast-title">{title}</div>
    </div>
    <div className="k-toast-content">{content}</div>
    <div className="k-toast-footer">
      {type === "confirm" && <Button onClick={cancel}>{cancelText ?? messages?.cancel}</Button>}
      <Button type="primary" loading={loading} onClick={ok}>{okText ?? messages?.ok}</Button>
    </div>
  </>;
  return <Modal open={open} className={["k-toast", `k-toast-${type}`].join(" ")} maskClosable={false} content={body} onClose={hide} />;
}
