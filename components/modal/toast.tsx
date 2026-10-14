import { CircleAlert, CircleCheck, CircleQuestionMark, CircleX, Info } from "kui-icons";
import clsx from "clsx";
import { useContext, useRef, useState } from "react";
import { Button } from "../button";
import { ConfigContext, DEFAULT_LOCALE } from "../config/config-context";
import Icon, { type IconType } from "../icon";
import { isPromiseLike } from "../utils/promise";
import Modal from "./modal";

export type ToastType = "info" | "success" | "error" | "warning" | "confirm";
export interface ToastProps {
  title?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  content?: React.ReactNode;
  color?: string;
  icon?: IconType[];
  onOk?: () => void | PromiseLike<unknown>;
  onCancel?: () => void;
  onDestroy?: () => void;
  type?: ToastType;
  /**
   * 受控开关。命令式 API（modal.show 返回的实例）要靠它把 show/hide 的时机拿回来，
   * 所以 Toast 不再自己决定开合；默认打开，跟 vue 那边 instance.show() 的行为一致。
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const icons = {
  info: Info,
  error: CircleX,
  success: CircleCheck,
  warning: CircleAlert,
  confirm: CircleQuestionMark,
};

export default function Toast({
  title,
  okText,
  cancelText,
  content,
  color,
  icon,
  onOk,
  onCancel,
  onDestroy,
  type = "info",
  open = true,
  onOpenChange,
}: ToastProps) {
  const { locale } = useContext(ConfigContext);
  const messages = (locale ?? DEFAULT_LOCALE)?.k?.common;
  const [loading, setLoading] = useState(false);
  const destroyRequestedRef = useRef(false);

  const requestDestroy = () => {
    if (destroyRequestedRef.current) return;
    destroyRequestedRef.current = true;
    onDestroy?.();
  };

  const handleClose = () => {
    onOpenChange?.(false);
  };

  const ok = () => {
    const result = onOk?.();
    if (!isPromiseLike(result)) {
      handleClose();
      return;
    }
    // onOk 返 Promise 时由这层接管：成功才关窗，失败只停 loading、窗口留着让用户改完再试。
    // （以前这里是 catch 完照样关窗，请求失败了窗口却消失，等于把错误吞了。）
    setLoading(true);
    Promise.resolve(result).then(
      () => {
        setLoading(false);
        handleClose();
      },
      () => setLoading(false),
    );
  };

  const cancel = () => {
    onCancel?.();
    handleClose();
  };

  const body = (
    <>
      <div className="k-toast-header">
        <Icon className="k-toast-icon" type={icon ?? icons[type]} color={color} />
        <div className="k-toast-title">{title}</div>
      </div>
      <div className="k-toast-content">{content}</div>
      <div className="k-toast-footer">
        {type === "confirm" && <Button onClick={cancel}>{cancelText ?? messages?.cancel}</Button>}
        <Button type="primary" loading={loading} onClick={ok}>
          {okText ?? messages?.ok}
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      open={open}
      className={clsx("k-toast", `k-toast-${type}`)}
      maskClosable={false}
      content={body}
      onClose={handleClose}
      onAfterClose={requestDestroy}
      onOpenChange={(opened) => {
        if (!opened) onOpenChange?.(false);
      }}
    />
  );
}
