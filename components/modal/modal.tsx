import clsx from "clsx";
import { X } from "kui-icons";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { Button } from "../button";
import { ConfigContext } from "../config/config-context";
import { getMousePoint } from "../config/context";
import zhCN from "../locale/zh-CN";

export interface ModalProps {
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  title?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  width?: number | string;
  top?: number;
  mask?: boolean;
  maskClosable?: boolean;
  maximized?: boolean;
  centered?: boolean;
  draggable?: boolean;
  showClose?: boolean;
  loading?: boolean;
  footer?: boolean | React.ReactNode;
  escKey?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
  onOpenChange?: (opened: boolean) => void;
  content?: React.ReactNode;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  className,
  open,
  defaultOpen = false,
  title,
  okText,
  cancelText,
  width = 520,
  top = 100,
  mask = true,
  maskClosable = false,
  maximized = false,
  centered = false,
  draggable = false,
  showClose = true,
  loading = false,
  footer = true,
  escKey = true,
  onClose,
  onOk,
  onCancel,
  onOpenChange,
  content,
  children,
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const currentOpen = open ?? innerOpen;

  const [visible, setVisible] = useState(false);
  const [showInner, setShowInner] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [leftPos, setLeftPos] = useState(0);
  const [topPos, setTopPos] = useState(top);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [mousedownIn, setMousedownIn] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const refModal = useRef<HTMLDivElement>(null);
  const refWrap = useRef<HTMLDivElement>(null);
  const refHeader = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const getOffset = (el: HTMLElement) => ({
    left: el.offsetLeft,
    top: el.offsetTop,
  });

  const updateOrigin = useCallback(() => {
    if (refModal.current) {
      const { x, y } = getMousePoint();
      const p = getOffset(refModal.current);
      refModal.current.style.transformOrigin = `${x - p.left}px ${y - p.top}px`;
    }
  }, []);

  const toggle = useCallback((value: boolean) => {
    if (value && hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (value) {
      previousFocus.current = document.activeElement as HTMLElement | null;
      setRendered(true);
      setTimeout(() => {
        setVisible(true);
        setShowInner(true);
        refWrap.current?.focus();
        setTimeout(() => {
          if (draggable && refModal.current) {
            setLeftPos((document.body.offsetWidth - refModal.current.offsetWidth) / 2);
          }
          updateOrigin();
        }, 0);
      }, 0);
    } else {
      setVisible(false);
      previousFocus.current?.focus();
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowInner(false), 300);
    }
  }, [draggable, updateOrigin]);

  const requestOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open]
  );

  useEffect(() => {
    const timer = setTimeout(() => toggle(currentOpen), 0);
    return () => clearTimeout(timer);
  }, [currentOpen, toggle]);

  // Dragging
  const mousemove = useCallback((e: MouseEvent) => {
    if (isMousePressed && draggable) {
      const { x, y } = startPos.current;
      setLeftPos((prev) => prev + e.clientX - x);
      setTopPos((prev) => (prev ?? 100) + e.clientY - y);
      startPos.current = { x: e.clientX, y: e.clientY };
      updateOrigin();
      e.preventDefault();
    }
  }, [draggable, isMousePressed, updateOrigin]);

  const mouseup = useCallback(() => {
    setIsMousePressed(false);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (
      e.button === 0 &&
      draggable &&
      refHeader.current &&
      refHeader.current.contains(e.target as Node)
    ) {
      setIsMousePressed(true);
      startPos.current = { x: e.clientX, y: e.clientY };
    }
    setMousedownIn(visible && !!refModal.current?.contains(e.target as Node));
  }, [draggable, visible]);

  const close = useCallback(() => {
    requestOpen(false);
    onClose?.();
  }, [onClose, requestOpen]);

  const escToClose = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  }, [close]);

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
    if (escKey) document.addEventListener("keydown", escToClose);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
      if (escKey) document.removeEventListener("keydown", escToClose);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [escKey, escToClose, handleMouseDown, mousemove, mouseup]);

  const ok = () => onOk?.();
  const cancel = () => {
    requestOpen(false);
    onCancel?.();
  };

  const clickMaskToClose = (e: React.MouseEvent) => {
    if (!loading && maskClosable && !refModal.current?.contains(e.target as Node) && !mousedownIn) {
      close();
    }
  };

  const okLabel = okText || locale?.k?.common?.ok;
  const cancelLabel = cancelText || locale?.k?.common?.cancel;

  let contentNode = content;
  if (!contentNode) {
    const footerContent = footer === true ? (
      <>
        <Button onClick={cancel}>{cancelLabel}</Button>
        <Button onClick={ok} type="primary" loading={loading}>
          {okLabel}
        </Button>
      </>
    ) : footer;

    contentNode = (
      <div className="k-modal-content" tabIndex={0}>
        {showClose && (
          <Button icon={X} size="small" onClick={close} className="k-modal-close" type="text" />
        )}
        {title !== undefined && (
          <div className="k-modal-header" ref={refHeader}>
            <div className="k-modal-header-inner">{title}</div>
          </div>
        )}
        <div className="k-modal-body">{children}</div>
        {footer !== false && <div className="k-modal-footer">{footerContent}</div>}
      </div>
    );
  }

  const modalStyle: React.CSSProperties | null = maximized
    ? null
    : {
        width: typeof width === "number" ? `${width}px` : width,
        top: `${topPos}px`,
        left: draggable ? `${leftPos}px` : undefined,
      };

  const classes = clsx("k-modal", className, {
    "k-modal-draggable": draggable,
    "k-modal-maximized": maximized,
    "k-modal-centered": centered,
    "k-modal-has-footer": footer !== false && footer != null,
  });

  if (!rendered) return null;

  const modalEl = (
    <div className={classes}>
      {mask && (
        <Transition name="k-modal-fade" show={visible} timeout={400}>
          <div className="k-modal-mask" />
        </Transition>
      )}
      <div
        ref={refWrap}
        className="k-modal-wrap"
        tabIndex={-1}
        role="dialog"
        style={{ display: showInner ? undefined : "none" }}
        onClick={clickMaskToClose}
      >
        <div
          ref={refModal}
          className={clsx(
            "k-modal-inner",
            visible
              ? "k-modal-zoom-enter-from k-modal-zoom-enter-active"
              : "k-modal-zoom-leave-from k-modal-zoom-leave-active k-modal-zoom-leave-to"
          )}
          style={modalStyle || undefined}
        >
          {contentNode}
          <div tabIndex={0} />
        </div>
      </div>
    </div>
  );

  return <Teleport to="body">{modalEl}</Teleport>;
};

export default Modal;
