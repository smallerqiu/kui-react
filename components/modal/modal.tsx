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
  panelOnly?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
  onOpenChange?: (opened: boolean) => void;
  onAfterClose?: () => void;
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
  panelOnly = false,
  onClose,
  onOk,
  onCancel,
  onOpenChange,
  onAfterClose,
  content,
  children,
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const currentOpen = open ?? innerOpen;

  // Vue's v-show equivalent: always rendered but controlled by visibility
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
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Core toggle logic - mirrors Vue's toggle function
  const toggle = useCallback(
    (value: boolean) => {
      if (!rendered && value) {
        setRendered(true);
        return;
      }

      if (value) {
        if (document.activeElement instanceof HTMLElement) {
          previousActiveRef.current = document.activeElement;
        }
        // Reset position when opening
        setLeftPos(0);
        setTopPos(top);
        setVisible(true);
        setShowInner(true);
        refWrap.current?.focus();
        setTimeout(() => {
          if (draggable && refModal.current) {
            setLeftPos((document.body.offsetWidth - refModal.current.offsetWidth) / 2);
          }
          updateOrigin();
        }, 100);
      } else {
        // Closing: immediate hide mask, delayed hide content
        setVisible(false);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
          setShowInner(false);
        }, 300);
      }
    },
    [draggable, updateOrigin, rendered, top],
  );

  const requestOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );

  // Watch currentOpen and trigger toggle
  useEffect(() => {
    if (panelOnly) return;
    const timer = setTimeout(() => {
      if (currentOpen && !rendered) {
        setRendered(true);
        toggle(true);
      } else if (currentOpen !== visible) {
        toggle(currentOpen);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [currentOpen, panelOnly, toggle, rendered, visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

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
    if (panelOnly || !escKey) return;
    document.addEventListener("keydown", escToClose);
    return () => {
      document.removeEventListener("keydown", escToClose);
    };
  }, [escKey, escToClose, panelOnly]);

  const ok = () => onOk?.();
  const cancel = () => {
    requestOpen(false);
    onCancel?.();
  };
  const afterClose = () => {
    previousActiveRef.current?.focus();
    previousActiveRef.current = null;
    onAfterClose?.();
  };

  const clickMaskToClose = (e: React.MouseEvent) => {
    if (!loading && maskClosable && !refModal.current?.contains(e.target as Node) && !mousedownIn) {
      close();
    }
  };

  const mousemove = useCallback(
    (e: MouseEvent) => {
      if (isMousePressed && draggable) {
        const { x, y } = startPos.current;
        setLeftPos((prev) => prev + e.clientX - x);
        setTopPos((prev) => (prev ?? 100) + e.clientY - y);
        startPos.current = { x: e.clientX, y: e.clientY };
        updateOrigin();
        e.preventDefault();
      }
    },
    [draggable, isMousePressed, updateOrigin],
  );

  const mouseup = useCallback(() => {
    setIsMousePressed(false);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
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
    },
    [draggable, visible],
  );

  useEffect(() => {
    if (panelOnly) return;
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };
  }, [handleMouseDown, mousemove, mouseup, panelOnly]);

  const okLabel = okText || locale?.k?.common?.ok;
  const cancelLabel = cancelText || locale?.k?.common?.cancel;

  let contentNode = content;
  if (!contentNode) {
    const footerContent =
      footer === true ? (
        <>
          <Button onClick={cancel}>{cancelLabel}</Button>
          <Button onClick={ok} type="primary" loading={loading}>
            {okLabel}
          </Button>
        </>
      ) : (
        footer
      );

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

  // panelOnly mode
  if (panelOnly) {
    return (
      <div
        className={clsx("k-modal", "k-modal-panel", className)}
        style={{ width: typeof width === "number" ? `${width}px` : width }}
      >
        <div className="k-modal-wrap">
          <div className="k-modal-inner">{contentNode}</div>
        </div>
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
        <Transition show={visible} name="k-modal-fade" timeout={400}>
          <div className="k-modal-mask" />
        </Transition>
      )}
      {/* Key difference: showInner controls display, not visibility of element */}
      <div
        ref={refWrap}
        className="k-modal-wrap"
        tabIndex={-1}
        role="dialog"
        style={{ display: showInner ? undefined : "none" }}
        onClick={clickMaskToClose}
      >
        <Transition show={visible} name="k-modal-zoom" timeout={250} onAfterLeave={afterClose}>
          <div ref={refModal} className="k-modal-inner" style={modalStyle || undefined}>
            {contentNode}
            <div tabIndex={0} />
          </div>
        </Transition>
      </div>
    </div>
  );

  return <Teleport to="body">{modalEl}</Teleport>;
};

export default Modal;

export type ModalPanelProps = Omit<
  ModalProps,
  "open" | "defaultOpen" | "mask" | "maskClosable" | "centered" | "draggable" | "maximized"
>;

export function ModalPanel(props: ModalPanelProps) {
  return <Modal {...props} panelOnly />;
}
