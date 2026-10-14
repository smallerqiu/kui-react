import { useValue } from "../utils/use-value";
import clsx from "clsx";
import { X } from "kui-icons";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { Button } from "../button";
import { ConfigContext, DEFAULT_LOCALE } from "../config/config-context";
import { PopupHostContext, usePopupHostScope } from "../config/popup-host";
import { getMousePoint } from "../config/context";
import { toCssLength } from "../utils/css";
import { createFocusTrap } from "../utils/focus";
import { pushOverlay, type OverlayHandle } from "../utils/overlay-stack";
import { toggleContainerScroll } from "../utils/react-node";

export interface ModalProps {
  className?: string;
  open?: boolean;
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
  destroyOnClose?: boolean;
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
  destroyOnClose = true,
  onClose,
  onOk,
  onCancel,
  onOpenChange,
  onAfterClose,
  content,
  children,
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || DEFAULT_LOCALE;
  // 窗口内 teleported 出去的浮层（下拉、气泡、子菜单）登记在这里，关窗时一起收掉。
  const { register: registerHostedPopup, closeAll: closeHostedPopups } = usePopupHostScope();
  const [innerOpen, setInnerOpen] = useValue(open, (next) => next ?? false);
  const currentOpen = innerOpen;

  // Vue's v-show equivalent: always rendered but controlled by visibility
  const [visible, setVisible] = useState(panelOnly);
  const [showInner, setShowInner] = useState(panelOnly);
  const [rendered, setRendered] = useState(panelOnly);
  const [leftPos, setLeftPos] = useState(0);
  const [topPos, setTopPos] = useState(top);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [mousedownIn, setMousedownIn] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const refModal = useRef<HTMLDivElement>(null);
  const refWrap = useRef<HTMLDivElement>(null);
  const refHeader = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 焦点陷阱是命令式的 DOM 对象，不能在建的时候读 ref（react-hooks/refs 禁止渲染期取 ref 值），
  // 所以放进 ref、在 effect/事件里创建与使用；handleKeyDown 是个稳定的转发壳。
  const focusTrapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null);
  const handleModalKeydown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    focusTrapRef.current?.handleKeydown(event.nativeEvent);
  }, []);
  const scrollLockedRef = useRef(false);
  const overlayRef = useRef<OverlayHandle | null>(null);
  const updateScrollLock = useCallback(
    (lock: boolean) => {
      if (panelOnly || scrollLockedRef.current === lock) return;
      toggleContainerScroll(typeof document === "undefined" ? null : document.body, lock);
      scrollLockedRef.current = lock;
    },
    [panelOnly],
  );

  const getOffset = (el: HTMLElement) => ({
    left: el.offsetLeft,
    top: el.offsetTop,
  });

  // 退场倒计时（toggle 里）：期间重开必须把它取消掉，否则窗口刚亮起来就被上一次关闭摘走。
  const cancelHide = useCallback(() => {
    if (hideTimerRef.current === null) return;
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  }, []);

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
      // 打开请求一律先取消上一次关闭留下的退场倒计时，否则窗口刚亮起来就被摘掉。
      if (value) cancelHide();

      if (!rendered && value) {
        setRendered(true);
        return;
      }

      if (value) {
        updateScrollLock(true);
        // Reset position when opening
        setLeftPos(0);
        setTopPos(top);
        setVisible(true);
        setShowInner(true);
        setTimeout(() => {
          if (draggable && refModal.current) {
            setLeftPos((document.body.offsetWidth - refModal.current.offsetWidth) / 2);
          }
          updateOrigin();
        }, 100);
      } else {
        // Closing: immediate hide mask, delayed hide content
        // 先把窗口里的浮层收掉：下拉是 teleported 到 body 的，窗口走了它们不会自己消失。
        closeHostedPopups();
        focusTrapRef.current?.deactivate();
        updateScrollLock(false);
        setVisible(false);
        cancelHide();
        hideTimerRef.current = setTimeout(() => {
          hideTimerRef.current = null;
          setShowInner(false);
          // 退场动画跑完再摘 DOM：默认关一次就销毁面板内容，重开时重新挂载。
          // panelOnly 是宿主浮层里的面板，摘掉等于把别人的内容一起清了，所以不销毁。
          if (destroyOnClose && !panelOnly) setRendered(false);
        }, 300);
      }
    },
    [
      cancelHide,
      closeHostedPopups,
      draggable,
      updateOrigin,
      rendered,
      top,
      updateScrollLock,
      destroyOnClose,
      panelOnly,
    ],
  );

  const requestOpen = useCallback(
    (next: boolean) => {
      setInnerOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, setInnerOpen],
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
      cancelHide();
      // 还锁着就被卸载的话要把锁解掉，否则页面再也滚不动了。
      if (scrollLockedRef.current) {
        toggleContainerScroll(document.body, false);
        scrollLockedRef.current = false;
      }
      focusTrapRef.current?.deactivate();
    };
  }, [cancelHide]);

  // 面板挂上之后再抓焦点：陷阱要等 refModal 有节点才建，activate 内部只排一个微任务。
  useEffect(() => {
    if (panelOnly || !rendered || !visible) return;
    if (!focusTrapRef.current) focusTrapRef.current = createFocusTrap(() => refModal.current);
    focusTrapRef.current.activate();
  }, [panelOnly, rendered, visible]);

  // 进遮罩层队列：叠着开时 Escape 只该关掉最上面那一层。
  useEffect(() => {
    if (panelOnly || !rendered || !visible) return;
    const handle = pushOverlay();
    overlayRef.current = handle;
    return () => {
      handle.release();
      if (overlayRef.current === handle) overlayRef.current = null;
    };
  }, [panelOnly, rendered, visible]);

  const close = useCallback(() => {
    requestOpen(false);
    onClose?.();
  }, [onClose, requestOpen]);

  const escToClose = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      // 已经关着的窗口不该响应 Escape，也不该在被别的层压在下面时抢走这次按键。
      if (!visible) return;
      if (!overlayRef.current?.isTop()) return;
      close();
    },
    [close, visible],
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
        {/* title 不给就不该有 header：空标题也会撑出一条带边框的横条 */}
        {title != null && (
          <div className="k-modal-header" ref={refHeader}>
            <div className="k-modal-header-inner">{title}</div>
          </div>
        )}
        <div className="k-modal-body">{children}</div>
        {footer && <div className="k-modal-footer">{footerContent}</div>}
      </div>
    );
  }

  const modalStyle: React.CSSProperties | null = maximized
    ? null
    : {
        width: toCssLength(width),
        // 居中靠 `.k-modal-centered .k-modal-inner { top: 0 }`，这里再写内联 top 就把它压掉了
        // （内联样式优先级高于任何类选择器）；left 只有拖动时才有意义。
        top: centered ? undefined : `${topPos}px`,
        left: draggable && !centered ? `${leftPos}px` : undefined,
      };

  const classes = clsx("k-modal", className, {
    "k-modal-draggable": draggable,
    "k-modal-maximized": maximized,
    "k-modal-centered": centered,
    "k-modal-has-footer": Boolean(footer),
    "k-modal-panel": panelOnly,
  });

  if (!rendered) return null;

  const modalEl = (
    <div className={classes}>
      {/* unmountOnExit 跟着 destroyOnClose：关掉后是留一份隐藏 DOM（Vue 侧的 v-show）还是直接摘掉，
          两个仓库得是同一个开关说了算，否则 destroyOnClose=false 保不住面板里填过的表单状态。 */}
      {mask && (
        <Transition show={visible} name="k-modal-fade" timeout={400} unmountOnExit={destroyOnClose}>
          <div className="k-modal-mask" />
        </Transition>
      )}
      {/* Key difference: showInner controls display, not visibility of element */}
      <div
        ref={refWrap}
        className="k-modal-wrap"
        tabIndex={-1}
        role="dialog"
        aria-modal={!panelOnly && mask ? true : undefined}
        style={{ display: showInner ? undefined : "none" }}
        onClick={clickMaskToClose}
      >
        <Transition
          show={visible}
          name="k-modal-zoom"
          timeout={250}
          unmountOnExit={destroyOnClose}
          onAfterLeave={afterClose}
        >
          <div
            ref={refModal}
            className="k-modal-inner"
            tabIndex={-1}
            style={modalStyle || undefined}
            onKeyDown={handleModalKeydown}
          >
            {contentNode}
            <div tabIndex={0} />
          </div>
        </Transition>
      </div>
    </div>
  );

  // panelOnly 是宿主浮层里的面板，不该被搬去 body（Vue 里同样是这条分支）
  // Provider 不落 DOM，只给这棵树圈出浮层作用域。
  const hosted = (
    <PopupHostContext.Provider value={registerHostedPopup}>{modalEl}</PopupHostContext.Provider>
  );
  return panelOnly ? hosted : <Teleport to="body">{hosted}</Teleport>;
};

export default Modal;

export type ModalPanelProps = Omit<
  ModalProps,
  "open" | "mask" | "maskClosable" | "centered" | "draggable" | "maximized"
>;

export function ModalPanel(props: ModalPanelProps) {
  // 与 Vue 的 ModalPanel 同参：面板态常开、不带遮罩
  return <Modal {...props} open mask={false} panelOnly />;
}
