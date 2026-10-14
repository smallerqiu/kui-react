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
import { PopupHostContext, usePopupHostScope } from "../config/popup-host";
import type { DrawerPlacementsType } from "../const/types";
import zhCN from "../locale/zh-CN";
import { toCssLength } from "../utils/css";
import { pushOverlay, type OverlayHandle } from "../utils/overlay-stack";
import { toggleContainerScroll } from "../utils/react-node";
import { useValue } from "../utils/use-value";

export type DrawerTarget =
  HTMLElement | RefObject<HTMLElement | null> | (() => HTMLElement | null | undefined);

export interface DrawerProps {
  open?: boolean;
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
  destroyOnClose?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onOpenChange?: (opened: boolean) => void;
  children?: React.ReactNode;
}

const getBody = () => document.body;

const ensurePositioningContext = (element: HTMLElement) => {
  if (element === document.body) return;
  const computedPosition = getComputedStyle(element).position;
  if (computedPosition && computedPosition !== "static") return;
  const position = element.style.position;
  element.style.position = "relative";
  return () => {
    if (element.style.position === "relative") element.style.position = position;
  };
};

const Drawer: React.FC<DrawerProps> = ({
  open,
  title,
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
  destroyOnClose = true,
  onOk,
  onCancel,
  onClose,
  onOpenChange,
  children,
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  // 抽屉里 teleported 出去的浮层登记在这里，关抽屉时一起收掉（和 Modal 同一个作用域机制）。
  const { register: registerHostedPopup, closeAll: closeHostedPopups } = usePopupHostScope();
  const [innerOpen, setInnerOpen] = useValue(open, (next) => next ?? false);
  const currentOpen = innerOpen;

  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<OverlayHandle | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const setWrapRef = useCallback(
    (node: HTMLDivElement | null) => {
      wrapRef.current = node;
      if (node && visible) node.focus();
    },
    [visible],
  );

  const resolveTarget = useCallback(() => {
    const candidate = typeof target === "function" ? target() : target;
    if (candidate && "current" in candidate) return candidate.current;
    return candidate ?? null;
  }, [target]);
  const isBody = targetEl === document.body;

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const nextTarget = resolveTarget();
      setTargetEl((current) => (current === nextTarget ? current : nextTarget));
    });
    return () => cancelAnimationFrame(frame);
  }, [currentOpen, resolveTarget]);

  // 退场倒计时：300ms 后摘掉 DOM，默认关一次就销毁面板内容，重开时重新挂载。
  // 期间重开必须把它取消掉，否则面板刚亮起来就被上一次关闭摘走。
  const cancelHide = useCallback(() => {
    if (hideTimerRef.current === null) return;
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
  }, []);

  const toggle = useCallback(
    (value: boolean) => {
      if (value) {
        cancelHide();
        previousFocus.current = document.activeElement as HTMLElement | null;
        setRendered(true);
        setTimeout(() => {
          setVisible(true);
          wrapRef.current?.focus();
        }, 0);
      } else {
        // 先把抽屉里的浮层收掉，再动焦点：下拉挂在 body 上，抽屉关了它还亮着。
        closeHostedPopups();
        setVisible(false);
        previousFocus.current?.focus();
        cancelHide();
        hideTimerRef.current = setTimeout(() => {
          hideTimerRef.current = null;
          if (destroyOnClose) setRendered(false);
        }, 300);
      }
    },
    [cancelHide, closeHostedPopups, destroyOnClose],
  );

  useEffect(() => cancelHide, [cancelHide]);

  const requestOpen = useCallback(
    (next: boolean) => {
      setInnerOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, setInnerOpen],
  );

  const close = useCallback(() => {
    requestOpen(false);
    onClose?.();
  }, [onClose, requestOpen]);

  // 进遮罩层队列：叠在 Drawer 上的 Modal 开着时，Escape 归 Modal。
  useEffect(() => {
    if (!rendered || !visible) return;
    const handle = pushOverlay();
    overlayRef.current = handle;
    return () => {
      handle.release();
      if (overlayRef.current === handle) overlayRef.current = null;
    };
  }, [rendered, visible]);

  const escToClose = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      if (!visible) return;
      if (!overlayRef.current?.isTop()) return;
      close();
    },
    [close, visible],
  );

  useEffect(() => {
    if (currentOpen && !targetEl) return;
    const timer = setTimeout(() => toggle(currentOpen), 0);
    return () => clearTimeout(timer);
  }, [currentOpen, targetEl, toggle]);

  useEffect(() => {
    if (escKey) document.addEventListener("keydown", escToClose);
    return () => {
      if (escKey) document.removeEventListener("keydown", escToClose);
    };
  }, [escKey, escToClose]);

  useEffect(() => {
    if (!targetEl) return;
    toggleContainerScroll(targetEl, currentOpen);
    return () => toggleContainerScroll(targetEl, false);
  }, [currentOpen, targetEl]);

  useLayoutEffect(() => {
    if (rendered && targetEl) return ensurePositioningContext(targetEl);
  }, [rendered, targetEl]);

  // 与 Modal 同一条口径：先把开合状态同步出去（onOpenChange），再通知这次动作
  // （onCancel/onClose），受控的父组件在语义回调里读到的已经是结算后的开合值。
  const cancel = () => {
    requestOpen(false);
    onCancel?.();
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
    drawerStyle.width = toCssLength(width);
  }
  if (placement === "top" || placement === "bottom") {
    drawerStyle.height = toCssLength(height);
  }

  const classes = clsx("k-drawer", `k-drawer-${placement}`, {
    "k-drawer-has-footer": hasFooter,
    "k-drawer-to-body": isBody,
    "k-drawer-no-mask": !mask,
  });

  if (!rendered || !targetEl) return null;

  const drawerEl = (
    <div className={classes}>
      {/* unmountOnExit 跟着 destroyOnClose：关掉后是留一份隐藏 DOM（Vue 侧的 v-show）还是直接摘掉，
          两个仓库得是同一个开关说了算，否则 destroyOnClose=false 保不住抽屉里填过的表单状态。 */}
      {mask && (
        <Transition
          name="k-drawer-fade"
          show={visible}
          timeout={400}
          appear
          unmountOnExit={destroyOnClose}
        >
          <div
            className={clsx("k-drawer-mask", { "k-drawer-mask-to-body": isBody })}
            onClick={maskClosable ? close : undefined}
          />
        </Transition>
      )}
      <div ref={setWrapRef} className="k-drawer-wrap" tabIndex={-1}>
        <Transition
          show={visible}
          name={`k-drawer-${placement}`}
          timeout={200}
          appear
          unmountOnExit={destroyOnClose}
        >
          <div className="k-drawer-box" style={drawerStyle}>
            <div className="k-drawer-content">
              {/* 与 Modal 同一条口径：没有标题内容就不该有 header，空标题也会撑出一条带边框的
                  横条。Drawer 的右上角关闭按钮住在 header 里，所以还要给 `closable` 留位置。 */}
              {(title != null || closable) && (
                <div className="k-drawer-header">
                  {closeNode}
                  <div className="k-drawer-header-inner">{title}</div>
                </div>
              )}
              <div className="k-drawer-body">{children}</div>
              {footerNode}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );

  // Provider 不落 DOM，只给这棵树圈出浮层作用域。
  return (
    <Teleport to={targetEl}>
      <PopupHostContext.Provider value={registerHostedPopup}>{drawerEl}</PopupHostContext.Provider>
    </Teleport>
  );
};

export default Drawer;
