import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PlacementsType } from "../const/types";
import { colors } from "../const/var";
import { isColor } from "../utils/color";
import { setPlacement } from "../utils/placement";
import { getChildren } from "../utils/react-node";

export interface TooltipProps {
  show?: boolean;
  title?: React.ReactNode;
  color?: string;
  disabled?: boolean;
  width?: number | string;
  placement?: PlacementsType;
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  show = false,
  title,
  color,
  disabled = false,
  width,
  placement = "top",
  onShowChange,
  children,
}) => {
  const [visible, setVisible] = useState(show);
  const [rendered, setRendered] = useState(show);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const [transOrigin, setTransOrigin] = useState("bottom");

  const refPopper = useRef<HTMLDivElement>(null);
  const refSelection = useRef<HTMLElement>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const showTimer = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (!refSelection.current || !refPopper.current) return;
    const placementObj = { value: currentPlacement };
    const originObj = { value: transOrigin };
    const topObj = { value: top };
    const leftObj = { value: left };

    setPlacement({
      refSelection: refSelection.current,
      refPopper: refPopper.current,
      currentPlacement: placementObj,
      transOrigin: originObj,
      top: topObj,
      left: leftObj,
    });

    setCurrentPlacement(placementObj.value as PlacementsType);
    setTransOrigin(originObj.value);
    setTop(topObj.value);
    setLeft(leftObj.value);
  };

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (visible) updatePosition();
  }, [title, visible]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, []);

  const updateShow = (value: boolean) => {
    setVisible(value);
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
      if (!show) updateShow(false);
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

  let triggerNode: React.ReactNode;
  if (firstChild && React.isValidElement(firstChild)) {
    triggerNode = React.cloneElement(firstChild as React.ReactElement<any>, {
      ref: refSelection,
      ...triggerProps,
    });
  } else {
    triggerNode = (
      <span ref={refSelection as any} {...triggerProps}>
        {children}
      </span>
    );
  }

  const preCls = "tooltip";

  const arrowFill = isColor(color)
    ? colors.includes(color as any)
      ? `var(--kui-color-${color})`
      : color
    : "currentcolor";

  const bgColor = isColor(color)
    ? colors.includes(color as any)
      ? `var(--kui-color-${color})`
      : color
    : undefined;

  const overlayNode = rendered ? (
    <div
      ref={refPopper}
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
        display: visible ? undefined : "none",
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
      }}
      onMouseEnter={() => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        if (!disabled) updateShow(true);
      }}
      onMouseLeave={() => {
        showTimer.current = setTimeout(() => {
          if (!show) updateShow(false);
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
  ) : null;

  return (
    <>
      {triggerNode}
      {overlayNode && createPortal(overlayNode, document.body)}
    </>
  );
};

export default Tooltip;
