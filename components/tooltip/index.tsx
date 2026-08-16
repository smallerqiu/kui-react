import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import type { PlacementsType } from "../const/types";
import { colors } from "../const/var";
import { isColor } from "../utils/color";
import { setPlacement } from "../utils/placement";
import { getChildren, setRef } from "../utils/react-node";

export interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  title?: React.ReactNode;
  color?: string;
  disabled?: boolean;
  width?: number | string;
  placement?: PlacementsType;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export type TooltipPanelProps = Omit<TooltipProps, "children" | "open" | "defaultOpen" | "show">;

export function TooltipPanel({ title, color, width, placement = "top" }: TooltipPanelProps) {
  const bgColor = isColor(color)
    ? colors.some((preset) => preset === color)
      ? `var(--kui-color-${color})`
      : color
    : undefined;
  return (
    <div
      {...({ "k-placement": placement } as React.HTMLAttributes<HTMLDivElement>)}
      className={clsx("k-tooltip", "k-tooltip-has-arrow", "k-tooltip-panel")}
      style={{ width: typeof width === "number" ? `${width}px` : width }}
    >
      <div className="k-tooltip-content" style={{ backgroundColor: bgColor }}>
        <div className="k-tooltip-title">{title}</div>
        <div className="k-tooltip-arrow">
          <svg style={{ fill: "currentcolor" }} viewBox="0 0 24 7">
            <path d="M24 0V1C20 1 18.5 2 16.5 4C14.5 6 14 7 12 7C10 7 9.5 6 7.5 4C5.5 2 4 1 0 1V0H24Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const Tooltip: React.FC<TooltipProps> = ({
  open,
  defaultOpen = false,
  show,
  title,
  color,
  disabled = false,
  width,
  placement = "top",
  onOpenChange,
  onShowChange,
  children,
}) => {
  const externalOpen = open ?? show;
  const initialOpen = externalOpen ?? defaultOpen;
  const [visible, setVisible] = useState(initialOpen);
  const [rendered, setRendered] = useState(initialOpen);
  const [previousOpen, setPreviousOpen] = useState(externalOpen);
  if (previousOpen !== externalOpen) {
    setPreviousOpen(externalOpen);
    if (externalOpen !== undefined) {
      setVisible(externalOpen);
      if (externalOpen) setRendered(true);
    }
  }
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const [transOrigin, setTransOrigin] = useState("bottom");

  const refPopper = useRef<HTMLDivElement>(null);
  const refSelection = useRef<HTMLElement>(null);
  const placementRef = useRef<string>(placement);
  const transOriginRef = useRef("bottom");
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const showTimer = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = useCallback(() => {
    if (!refSelection.current || !refPopper.current) return;
    placementRef.current = placement;

    setPlacement({
      refSelection,
      refPopper,
      currentPlacement: placementRef,
      transOrigin: transOriginRef,
      top: topRef,
      left: leftRef,
    });

    setCurrentPlacement(placementRef.current as PlacementsType);
    setTransOrigin(transOriginRef.current);
    setTop(topRef.current);
    setLeft(leftRef.current);
  }, [placement]);

  useEffect(() => {
    if (visible) updatePosition();
  }, [title, updatePosition, visible]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, [updatePosition]);

  const updateShow = (value: boolean) => {
    if (externalOpen === undefined) setVisible(value);
    onOpenChange?.(value);
    onShowChange?.(value);
  };

  const mouseEnter = () => {
    if (disabled) return;
    if (showTimer.current) clearTimeout(showTimer.current);
    if (!rendered) {
      setRendered(true);
      setTimeout(() => {
        updateShow(true);
        setTimeout(updatePosition, 0);
      }, 0);
    } else {
      updateShow(true);
      setTimeout(updatePosition, 0);
    }
  };

  const hide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      updateShow(false);
    }, 300);
  };

  // Clone the trigger child to add event handlers
  const childList = getChildren(children);
  const firstChild = childList.length === 1 ? childList[0] : null;

  const triggerProps: React.HTMLAttributes<HTMLElement> = {
    onMouseEnter: mouseEnter,
    onMouseLeave: hide,
    onTouchStart: mouseEnter,
    onTouchEnd: hide,
  };
  const setSelectionRef = (node: HTMLElement | null) => {
    refSelection.current = node;
  };

  let triggerNode: React.ReactNode;
  if (
    firstChild &&
    React.isValidElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>(
      firstChild
    )
  ) {
    const childProps = firstChild.props;
    triggerNode = React.cloneElement(firstChild, {
      ref: (node) => {
        setRef(childProps.ref, node);
        setSelectionRef(node);
      },
      onMouseEnter: (event) => {
        childProps.onMouseEnter?.(event);
        mouseEnter();
      },
      onMouseLeave: (event) => {
        childProps.onMouseLeave?.(event);
        hide();
      },
      onTouchStart: (event) => {
        childProps.onTouchStart?.(event);
        mouseEnter();
      },
      onTouchEnd: (event) => {
        childProps.onTouchEnd?.(event);
        hide();
      },
    });
  } else {
    triggerNode = (
      <span ref={setSelectionRef} {...triggerProps}>
        {children}
      </span>
    );
  }

  const preCls = "tooltip";

  const arrowFill = isColor(color)
    ? colors.some((preset) => preset === color)
      ? `var(--kui-color-${color})`
      : color
    : "currentcolor";

  const bgColor = isColor(color)
    ? colors.some((preset) => preset === color)
      ? `var(--kui-color-${color})`
      : color
    : undefined;

  const overlayNode = rendered ? (
    <Transition show={visible} name={`k-${preCls}`} nodeRef={refPopper}>
      <div
        ref={refPopper}
        {...({ "k-placement": currentPlacement } as React.HTMLAttributes<HTMLDivElement>)}
        className={clsx(
          `k-${preCls}`,
          {
            [`k-${preCls}-${color}`]: color && !isColor(color),
            [`k-${preCls}-has-color`]: isColor(color),
          },
          `k-${preCls}-has-arrow`
        )}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          transformOrigin: transOrigin,
          width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        }}
        onMouseEnter={() => {
          if (hideTimer.current) clearTimeout(hideTimer.current);
          if (!disabled) updateShow(true);
        }}
        onMouseLeave={() => {
          showTimer.current = setTimeout(() => {
            updateShow(false);
          }, 300);
        }}
      >
        <div className={`k-${preCls}-content`} style={{ backgroundColor: bgColor }}>
          <div className={`k-${preCls}-title`}>{title}</div>
          <div className={`k-${preCls}-arrow`}>
            <svg style={{ fill: arrowFill }} viewBox="0 0 24 7">
              <path d="M24 0V1C20 1 18.5 2 16.5 4C14.5 6 14 7 12 7C10 7 9.5 6 7.5 4C5.5 2 4 1 0 1V0H24Z" />
            </svg>
          </div>
        </div>
      </div>
    </Transition>
  ) : null;

  return (
    <>
      {triggerNode}
      <Teleport to="body">{overlayNode}</Teleport>
    </>
  );
};

export default Tooltip;
