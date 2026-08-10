import clsx from "clsx";
import { X } from "kui-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { Button } from "../button";
import { ConfigContext } from "../config";
import type { DrawerPlacementsType } from "../const/types";
import zhCN from "../locale/zh-CN";

export interface DrawerProps {
  open?: boolean;
  title?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  okText?: string;
  cancelText?: string;
  placement?: DrawerPlacementsType;
  closable?: boolean;
  footer?: boolean;
  maskClosable?: boolean;
  target?: () => HTMLElement;
  mask?: boolean;
  loading?: boolean;
  escKey?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onOpenChange?: (opened: boolean) => void;
  footerSlot?: React.ReactNode;
  children?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  open = false,
  title = "Title",
  width = 520,
  height = 520,
  okText,
  cancelText,
  placement = "right",
  closable = true,
  footer = true,
  maskClosable = true,
  target = () => document.body,
  mask = true,
  loading = false,
  escKey = true,
  onOk,
  onCancel,
  onClose,
  onOpenChange,
  footerSlot,
  children,
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;

  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [rendered, setRendered] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const toggle = (value: boolean) => {
    if (value && hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (!rendered && value) {
      setRendered(true);
      setTimeout(() => {
        setVisible(true);
        setOpened(true);
        onOpenChange?.(true);
      }, 0);
    } else {
      if (value) {
        setVisible(true);
        setOpened(true);
        onOpenChange?.(true);
      } else {
        setVisible(false);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setOpened(false), 300);
        onOpenChange?.(false);
      }
    }
  };

  const escToClose = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  useEffect(() => {
    toggle(open);
  }, [open]);

  useEffect(() => {
    if (escKey) document.addEventListener("keydown", escToClose);
    return () => {
      if (escKey) document.removeEventListener("keydown", escToClose);
      const t = target?.();
      if (t) t.style.overflow = "";
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [escKey]);

  const close = () => {
    toggle(false);
    onClose?.();
  };

  const cancel = () => {
    onCancel?.();
    toggle(false);
  };

  const ok = () => onOk?.();

  const okLabel = okText || locale?.k?.common?.ok;
  const cancelLabel = cancelText || locale?.k?.common?.cancel;

  const hasFooter = footer || !!footerSlot;

  const footerNode = hasFooter ? (
    <div className="k-drawer-footer">
      {footerSlot || (
        <>
          <Button onClick={cancel}>{cancelLabel}</Button>
          <Button type="primary" onClick={ok} loading={loading}>
            {okLabel}
          </Button>
        </>
      )}
    </div>
  ) : null;

  const closeNode = closable ? (
    <Button className="k-drawer-close" size="small" type="text" onClick={close} icon={X} />
  ) : null;

  const targetEl = target?.() || document.body;
  const isBody = targetEl === document.body;

  const drawerStyle: React.CSSProperties = {};
  if (placement === "left" || placement === "right") {
    drawerStyle.width = typeof width === "number" ? `${width}px` : width;
  }
  if (placement === "top" || placement === "bottom") {
    drawerStyle.height = typeof height === "number" ? `${height}px` : height;
  }

  const classes = clsx("k-drawer", `k-drawer-${placement}`, {
    "k-drawer-has-footer": hasFooter,
    "k-drawer-to-body": isBody,
    "k-drawer-no-mask": !mask,
  });

  if (!rendered) return null;

  const drawerEl = (
    <div className={classes}>
      {mask && (
        <Transition name="k-drawer-fade" show={visible} timeout={400}>
          <div
            className={clsx("k-drawer-mask", { "k-drawer-mask-to-body": isBody })}
            onClick={maskClosable ? close : undefined}
          />
        </Transition>
      )}
      <div className="k-drawer-wrap" tabIndex={-1} style={{ display: opened ? undefined : "none" }}>
        <div
          className={clsx(
            "k-drawer-box",
            visible
              ? `k-drawer-${placement}-enter-from k-drawer-${placement}-enter-active`
              : `k-drawer-${placement}-leave-from k-drawer-${placement}-leave-active k-drawer-${placement}-leave-to`
          )}
          style={drawerStyle}
        >
          <div className="k-drawer-content">
            <div className="k-drawer-header">
              {closeNode}
              <div className="k-drawer-header-inner">{title}</div>
            </div>
            <div className="k-drawer-body">{children}</div>
            {footerNode}
          </div>
        </div>
      </div>
    </div>
  );

  return <Teleport to={targetEl}>{drawerEl}</Teleport>;
};

export default Drawer;
