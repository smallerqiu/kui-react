import React, {
  forwardRef,
  useCallback,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import type { PlacementsType } from "../const/types";
import { setPlacement } from "../utils/placement";
import { createFrameScheduler, isEventOutside } from "../utils/popup";
import { getChildren, setRef } from "../utils/react-node";
import {
  registerPopupLayer,
  isTopPopupLayer,
  popupLayerElements,
  closePopupChildren,
} from "./layers";
import type { PopupOpenChangeDetail, PopupRef, PopupTrigger } from "./types";
export type { PopupOpenChangeDetail, PopupOpenReason, PopupRef, PopupTrigger } from "./types";

export interface PopupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "defaultChecked"
> {
  open?: boolean;
  disabled?: boolean;
  placement?: PlacementsType;
  trigger?: PopupTrigger;
  arrow?: boolean;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  matchTriggerWidth?: boolean;
  getPopupContainer?: () => HTMLElement | null | undefined;
  destroyOnClose?: boolean;
  target?: React.RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean, detail: PopupOpenChangeDetail) => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
  children?: React.ReactNode;
  overlay?: React.ReactNode | ((popup: PopupRef) => React.ReactNode);
  /** Reuse the overlay element itself, preserving selector markup and DOM refs. */
  raw?: boolean;
  outsideEvent?: "click" | "mousedown";
  transitionDuration?: number;
  getAnchorPosition?: () => { x: number; y: number } | null;
  /** Internal presentation hooks used by the existing components. */
  prefixCls?: string;
  transitionName?: string;
  panelOnly?: boolean;
  triggerProps?: React.HTMLAttributes<HTMLElement>;
  respectDefaultPrevented?: boolean;
  contentStyle?: React.CSSProperties;
  arrowContent?: React.ReactNode;
  hideWhenDetached?: boolean;
  onTriggerKeyDown?: (event: React.KeyboardEvent<HTMLElement>, popup: PopupRef) => void;
}

export const PopupArrow = ({ prefixCls }: { prefixCls: string }) => (
  <div className={`${prefixCls}-arrow`} aria-hidden="true">
    <svg
      style={{ fill: "currentcolor" }}
      viewBox={prefixCls === "k-popup" ? "0 0 24 9" : "0 0 24 8"}
    >
      {prefixCls === "k-popup" ? (
        <>
          {/* Cover the panel border; only the curved outer edge is stroked. */}
          <path d="M0 0V1.5C6 1.5 7 8.5 12 8.5S18 1.5 24 1.5V0Z" />
          <path id="ot" fill="none" d="M0 1.5C6 1.5 7 8.5 12 8.5S18 1.5 24 1.5" />
        </>
      ) : (
        <>
          <path
            id="ot"
            d="m24,0.97087l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
          />
          <path
            id="in"
            stroke="currentcolor"
            d="m24,0l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
          />
        </>
      )}
    </svg>
  </div>
);

const Popup = forwardRef<PopupRef, PopupProps>(function Popup(
  {
    open,
    disabled = false,
    placement = "bottom-left",
    trigger = "click",
    arrow = false,
    offset = 3,
    openDelay = 0,
    closeDelay = 300,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    matchTriggerWidth = false,
    getPopupContainer,
    destroyOnClose = false,
    target,
    onOpenChange,
    onAfterOpen,
    onAfterClose,
    children,
    overlay,
    raw = false,
    outsideEvent = "click",
    transitionDuration = 300,
    getAnchorPosition,
    prefixCls = "k-popup",
    transitionName = prefixCls,
    panelOnly = false,
    triggerProps,
    onTriggerKeyDown,
    respectDefaultPrevented = true,
    contentStyle,
    arrowContent,
    hideWhenDetached = false,
    className,
    style,
    ...attrs
  },
  forwardedRef,
) {
  const [innerOpen, setInnerOpen] = useState(open ?? false);
  const [previousOpen, setPreviousOpen] = useState(open);
  if (open !== previousOpen) {
    setPreviousOpen(open);
    setInnerOpen(open ?? false);
  }
  const visible = innerOpen;
  const [rendered, setRendered] = useState(visible);
  const [positioned, setPositioned] = useState(false);
  const [previousVisible, setPreviousVisible] = useState(visible);
  if (visible !== previousVisible) {
    setPreviousVisible(visible);
    if (visible) setPositioned(false);
  }
  const [anchorVisible, setAnchorVisible] = useState(true);
  if (visible && !rendered) setRendered(true);
  const selectionRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const bindPopper = useCallback((node: HTMLDivElement | null) => {
    popperRef.current = node;
    setElement(node);
  }, []);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const contextPoint = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    origin: "bottom",
    placement,
    width: 0,
    ready: false,
  });
  // The callback reads the latest DOM ref when invoked, not during rendering.
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const getTriggerElement = useCallback(() => target?.current ?? selectionRef.current, [target]);
  const clearTimer = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
  }, []);
  const request = (next: boolean, detail: PopupOpenChangeDetail) => {
    clearTimer();
    if (next === visible) return;
    if (next && disabled) return;
    setInnerOpen(next);
    onOpenChange?.(next, detail);
  };
  const updatePosition = useCallback(() => {
    const selection = getTriggerElement(),
      popper = popperRef.current;
    if (!selection || !popper || panelOnly) return;
    const rect = selection.getBoundingClientRect();
    const point = contextPoint.current;
    const refs = {
      refSelection: { current: selection },
      refPopper: { current: popper },
      currentPlacement: { current: placement as string },
      transOrigin: { current: "bottom" },
      left: { current: 0 },
      top: { current: 0 },
    };
    if (matchTriggerWidth) popper.style.minWidth = `${rect.width || selection.offsetWidth}px`;
    setPlacement({
      ...refs,
      offset,
      position:
        getAnchorPosition?.() ?? (point ? { x: rect.left + point.x, y: rect.top + point.y } : null),
    });
    const next = {
      left: refs.left.current,
      top: refs.top.current,
      origin: refs.transOrigin.current,
      placement: refs.currentPlacement.current as PlacementsType,
      width: rect.width || selection.offsetWidth,
      ready: true,
    };
    setPosition((prev) =>
      Object.keys(next).every(
        (key) => prev[key as keyof typeof prev] === next[key as keyof typeof next],
      )
        ? prev
        : next,
    );
  }, [getTriggerElement, matchTriggerWidth, offset, panelOnly, placement, getAnchorPosition]);
  const requestFromEvent = useEffectEvent(request);
  const closeLater = () => {
    clearTimer();
    timer.current = setTimeout(
      () => request(false, { reason: trigger === "focus" ? "focus" : "hover" }),
      Math.max(0, closeDelay),
    );
  };
  const api: PopupRef = {
    open: () => request(true, { reason: "programmatic" }),
    close: () => request(false, { reason: "programmatic" }),
    updatePosition,
    cancelClose: clearTimer,
    scheduleClose: closeLater,
    getTriggerElement,
    getPopupElement: () => popperRef.current,
  };
  useImperativeHandle(forwardedRef, () => api);
  useLayoutEffect(() => {
    if (!visible || panelOnly || !element) {
      return;
    }
    updatePosition();
    const frame = requestAnimationFrame(() => setPositioned(true));
    return () => cancelAnimationFrame(frame);
  }, [visible, panelOnly, element, overlay, arrow, updatePosition]);
  useLayoutEffect(() => {
    if (!visible && element) closePopupChildren(element);
  }, [visible, element]);
  useEffect(() => {
    if (!visible || panelOnly || !element) return;
    const scheduler = createFrameScheduler();
    const update = () => scheduler.schedule(updatePosition);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    const selection = getTriggerElement();
    const intersection =
      hideWhenDetached && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            setAnchorVisible(entry.isIntersecting);
            if (entry.isIntersecting) update();
          })
        : null;
    if (selection) intersection?.observe(selection);
    if (selection) observer?.observe(selection);
    observer?.observe(element);
    const layer = {
      trigger: getTriggerElement,
      popup: element,
      close: () => requestFromEvent(false, { reason: "host" }),
    };
    const unregister = registerPopupLayer(layer);
    const outside = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        isEventOutside(
          event,
          [
            element,
            ...popupLayerElements(layer),
            trigger === "contextmenu" ? null : getTriggerElement(),
          ],
          false,
        )
      )
        requestFromEvent(false, { reason: "outside", event });
    };
    const keydown = (event: KeyboardEvent) => {
      if (
        !closeOnEscape ||
        event.key !== "Escape" ||
        event.defaultPrevented ||
        !isTopPopupLayer(layer)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      requestFromEvent(false, { reason: "escape", event });
      getTriggerElement()?.focus({ preventScroll: true });
    };
    document.addEventListener(outsideEvent, outside);
    document.addEventListener("keydown", keydown);
    document.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      unregister();
      scheduler.cancel();
      observer?.disconnect();
      intersection?.disconnect();
      document.removeEventListener(outsideEvent, outside);
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [
    visible,
    panelOnly,
    element,
    closeOnOutsideClick,
    closeOnEscape,
    trigger,
    getTriggerElement,
    updatePosition,
    hideWhenDetached,
    outsideEvent,
  ]);
  useEffect(() => {
    clearTimer();
  }, [visible, disabled, clearTimer]);
  useEffect(() => clearTimer, [clearTimer]);

  const enter = (event: React.MouseEvent<HTMLElement>) => {
    if (trigger !== "hover" || disabled) return;
    clearTimer();
    if (openDelay > 0)
      timer.current = setTimeout(
        () => request(true, { reason: "hover", event: event.nativeEvent }),
        openDelay,
      );
    else request(true, { reason: "hover", event: event.nativeEvent });
  };
  const nodes = getChildren(children);
  type TriggerProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  const candidate =
    nodes.length === 1 &&
    React.isValidElement<TriggerProps>(nodes[0]) &&
    nodes[0].type !== React.Fragment ? (
      nodes[0]
    ) : (
      <span>{nodes}</span>
    );
  const original = candidate.props;
  const triggerNode = target
    ? candidate
    : React.cloneElement(candidate, {
        ...triggerProps,
        ref: (node: HTMLElement | null) => {
          selectionRef.current = node;
          setRef(original.ref, node);
        },
        "aria-expanded": visible,
        onTouchStart: (event: React.TouchEvent<HTMLElement>) => {
          original.onTouchStart?.(event);
          if (trigger === "hover") request(true, { reason: "hover", event: event.nativeEvent });
        },
        onTouchEnd: (event: React.TouchEvent<HTMLElement>) => {
          original.onTouchEnd?.(event);
          if (trigger === "hover") closeLater();
        },
        onTouchMove: (event: React.TouchEvent<HTMLElement>) => {
          original.onTouchMove?.(event);
          if (trigger === "hover") updatePosition();
        },
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          original.onClick?.(event);
          if (
            (!respectDefaultPrevented || !event.defaultPrevented) &&
            trigger === "click" &&
            !disabled
          )
            request(!visible, { reason: "trigger", event: event.nativeEvent });
        },
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
          original.onMouseEnter?.(event);
          if (!event.defaultPrevented) enter(event);
        },
        onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
          original.onMouseLeave?.(event);
          if (trigger === "hover" && !event.defaultPrevented) closeLater();
        },
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          original.onFocus?.(event);
          if (!event.defaultPrevented && trigger === "focus")
            request(true, { reason: "focus", event: event.nativeEvent });
        },
        onBlur: (event: React.FocusEvent<HTMLElement>) => {
          original.onBlur?.(event);
          if (
            trigger === "focus" &&
            !event.defaultPrevented &&
            !popperRef.current?.contains(event.relatedTarget)
          )
            closeLater();
        },
        onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
          original.onContextMenu?.(event);
          if (trigger !== "contextmenu" || disabled || event.defaultPrevented) return;
          event.preventDefault();
          const rect = getTriggerElement()?.getBoundingClientRect();
          if (rect)
            contextPoint.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
          request(true, { reason: "contextmenu", event: event.nativeEvent });
          updatePosition();
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          original.onKeyDown?.(event);
          if (event.defaultPrevented || disabled) return;
          onTriggerKeyDown?.(event, api);
          if (
            !event.defaultPrevented &&
            trigger === "click" &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            request(!visible, { reason: "trigger", event: event.nativeEvent });
          }
        },
      });
  // The render prop receives methods only; DOM refs are read when those methods are called.
  // eslint-disable-next-line react-hooks/refs
  const content = typeof overlay === "function" ? overlay(api) : overlay;
  const shell = (
    <div
      {...attrs}
      ref={bindPopper}
      className={[
        `${prefixCls}`,
        arrow && `${prefixCls}-has-arrow`,
        panelOnly && `${prefixCls}-panel`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      k-placement={panelOnly ? placement : position.placement}
      style={{
        ...style,
        ...(panelOnly
          ? {}
          : {
              position: "absolute",
              left: position.left,
              top: position.top,
              transformOrigin:
                prefixCls === "k-popup" && arrow ? "var(--k-popup-arrow-origin)" : position.origin,
              minWidth: matchTriggerWidth ? position.width : style?.minWidth,
              visibility:
                positioned && (!hideWhenDetached || anchorVisible) ? style?.visibility : "hidden",
            }),
      }}
      onMouseEnter={(event) => {
        attrs.onMouseEnter?.(event);
        clearTimer();
      }}
      onMouseLeave={(event) => {
        attrs.onMouseLeave?.(event);
        if (trigger === "hover") closeLater();
      }}
      onFocusCapture={(event) => {
        attrs.onFocusCapture?.(event);
        clearTimer();
      }}
      onBlurCapture={(event) => {
        attrs.onBlurCapture?.(event);
        if (
          trigger === "focus" &&
          !event.currentTarget.contains(event.relatedTarget) &&
          !getTriggerElement()?.contains(event.relatedTarget)
        )
          closeLater();
      }}
    >
      <div className={`${prefixCls}-content`} style={contentStyle}>
        {content}
        {arrow && (arrowContent ?? <PopupArrow prefixCls={prefixCls} />)}
      </div>
    </div>
  );
  const rawElement =
    raw &&
    React.isValidElement<
      React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
    >(content)
      ? content
      : null;
  const rawRef = rawElement?.props.ref;
  const bindRaw = useCallback(
    (node: HTMLDivElement | null) => {
      bindPopper(node);
      setRef(rawRef, node);
    },
    [bindPopper, rawRef],
  );
  const panel = rawElement
    ? React.cloneElement(rawElement, {
        ...attrs,
        ref: bindRaw,
        ...({ "k-placement": position.placement } as React.HTMLAttributes<HTMLDivElement>),
        style: { ...rawElement.props.style, ...shell.props.style },
      })
    : shell;
  if (panelOnly) return panel;
  return (
    <>
      {target && !nodes.length ? null : triggerNode}
      {rendered && (
        <Teleport to={getPopupContainer?.()}>
          <Transition
            show={visible}
            name={transitionName}
            nodeRef={popperRef}
            appear
            timeout={transitionDuration}
            unmountOnExit={destroyOnClose}
            onAfterEnter={onAfterOpen}
            onAfterLeave={() => {
              if (destroyOnClose && !visible) setRendered(false);
              onAfterClose?.();
            }}
          >
            {panel}
          </Transition>
        </Teleport>
      )}
    </>
  );
});
export default Popup;
