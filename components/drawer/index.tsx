import clsx from "clsx";
import { X } from "kui-icons";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { Button } from "../button";
import { ConfigContext } from "../config/config-context";
import type { DrawerPlacementsType } from "../const/types";
import zhCN from "../locale/zh-CN";
import { toggleContainerScroll } from "../utils/react-node";

export type DrawerTarget =
  HTMLElement | RefObject<HTMLElement | null> | (() => HTMLElement | null | undefined);

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  title?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  okText?: string;
  cancelText?: string;
  placement?: DrawerPlacementsType;
  closable?: boolean;
  footer?: boolean | React.ReactNode;
  maskClosable?: boolean;
  target?: DrawerTarget;
  mask?: boolean;
  loading?: boolean;
  escKey?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onOpenChange?: (opened: boolean) => void;
  children?: React.ReactNode;
}

const getBody = () => document.body;

const ensurePositioningContext = (element: HTMLElement) => {
  if (element === document.body || getComputedStyle(element).position !== "static") return;
  const position = element.style.position;
  element.style.position = "relative";
  return () => {
    if (element.style.position === "relative") element.style.position = position;
  };
};

const Drawer: React.FC<DrawerProps> = ({
  open,
  defaultOpen = false,
  title = "Title",
  width = 520,
  height = 520,
  okText,
  cancelText,
  placement = "right",
  closable = true,
  footer = true,
  maskClosable = true,
  target = getBody,
  mask = true,
  loading = false,
  escKey = true,
  onOk,
  onCancel,
  onClose,
  onOpenChange,
  children,
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const currentOpen = open ?? innerOpen;

  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const resolveTarget = () => {
    const candidate = typeof target === "function" ? target() : target;
    if (candidate && "current" in candidate) return candidate.current ?? document.body;
    return candidate ?? document.body;
  };
  const targetEl = resolveTarget();
  const isBody = targetEl === document.body;

  const toggle = useCallback((value: boolean) => {
    if (value) {
      previousFocus.current = document.activeElement as HTMLElement | null;
      setRendered(true);
      setTimeout(() => {
        setVisible(true);
        wrapRef.current?.focus();
      }, 0);
    } else {
      setVisible(false);
      previousFocus.current?.focus();
    }
  }, []);

  const requestOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );

  const close = useCallback(() => {
    requestOpen(false);
    onClose?.();
  }, [onClose, requestOpen]);

  const escToClose = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    },
    [close],
  );

  useEffect(() => {
    const timer = setTimeout(() => toggle(currentOpen), 0);
    return () => clearTimeout(timer);
  }, [currentOpen, toggle]);

  useEffect(() => {
    if (escKey) document.addEventListener("keydown", escToClose);
    return () => {
      if (escKey) document.removeEventListener("keydown", escToClose);
    };
  }, [escKey, escToClose]);

  useEffect(() => {
    toggleContainerScroll(targetEl, currentOpen);
    return () => toggleContainerScroll(targetEl, false);
  }, [currentOpen, targetEl]);

  useLayoutEffect(() => {
    if (rendered) return ensurePositioningContext(targetEl);
  }, [rendered, targetEl]);

  const cancel = () => {
    onCancel?.();
    requestOpen(false);
  };

  const ok = () => onOk?.();

  const okLabel = okText || locale?.k?.common?.ok;
  const cancelLabel = cancelText || locale?.k?.common?.cancel;

  const hasFooter = footer !== false && footer != null;

  const footerNode = hasFooter ? (
    <div className="k-drawer-footer">
      {footer === true ? (
        <>
          <Button onClick={cancel}>{cancelLabel}</Button>
          <Button type="primary" onClick={ok} loading={loading}>
            {okLabel}
          </Button>
        </>
      ) : (
        footer
      )}
    </div>
  ) : null;

  const closeNode = closable ? (
    <Button className="k-drawer-close" size="small" type="text" onClick={close} icon={X} />
  ) : null;

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
      <div ref={wrapRef} className="k-drawer-wrap" tabIndex={-1}>
        <Transition show={visible} name={`k-drawer-${placement}`} timeout={200} appear>
          <div className="k-drawer-box" style={drawerStyle}>
            <div className="k-drawer-content">
              <div className="k-drawer-header">
                {closeNode}
                <div className="k-drawer-header-inner">{title}</div>
              </div>
              <div className="k-drawer-body">{children}</div>
              {footerNode}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );

  return <Teleport to={targetEl}>{drawerEl}</Teleport>;
};

export default Drawer;
