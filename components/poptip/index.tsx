import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import type { PlacementsType } from "../const/types";
import { setPlacement } from "../utils/placement";
import { getChildren } from "../utils/react-node";

export interface PoptipProps {
  dark?: boolean;
  show?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  width?: number | string;
  trigger?: "click" | "hover" | "focus";
  placement?: PlacementsType;
  onClose?: () => void;
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

const Poptip: React.FC<PoptipProps> = ({
  dark = false,
  show = false,
  title,
  content,
  width,
  trigger = "hover",
  placement = "top",
  onClose,
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
      document.removeEventListener("click", outsideClick);
    };
  }, []);

  const updateShow = (value: boolean) => {
    setVisible(value);
    onShowChange?.(value);
    if (!value) onClose?.();
  };

  const outsideClick = (e: MouseEvent) => {
    const ctx = refSelection.current;
    if (
      refPopper.current &&
      !refPopper.current.contains(e.target as Node) &&
      ctx &&
      !ctx.contains(e.target as Node)
    ) {
      updateShow(false);
    }
  };

  const showPoptip = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (!rendered) {
      setRendered(true);
      document.addEventListener("click", outsideClick);
      setTimeout(() => {
        updateShow(true);
        setTimeout(updatePosition, 0);
      }, 0);
    } else {
      updateShow(true);
      setTimeout(updatePosition, 0);
    }
  };

  const hidePoptip = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!show) updateShow(false);
    }, 300);
  };

  const childList = getChildren(children);
  const firstChild = childList.length === 1 ? childList[0] : null;

  const triggerProps: React.HTMLAttributes<HTMLElement> = {
    onMouseLeave: hidePoptip,
  };

  if (trigger === "click") {
    triggerProps.onClick = showPoptip;
  } else if (trigger === "hover") {
    triggerProps.onMouseEnter = showPoptip;
  } else if (trigger === "focus") {
    triggerProps.onFocus = showPoptip;
    triggerProps.onBlur = hidePoptip;
  }

  let triggerNode: React.ReactNode;
  if (firstChild && React.isValidElement(firstChild)) {
    triggerNode = React.cloneElement(firstChild as React.ReactElement<any>, {
      ref: refSelection,
      ...triggerProps,
    });
  } else {
    triggerNode = (
      <span ref={refSelection} {...triggerProps}>
        {children}
      </span>
    );
  }

  const preCls = "poptip";

  const overlayNode = rendered ? (
    <Transition show={visible} name={`k-${preCls}`} nodeRef={refPopper}>
      <div
        ref={refPopper}
        {...({ "k-placement": currentPlacement } as React.HTMLAttributes<HTMLDivElement>)}
        className={clsx(`k-${preCls}`, `k-${preCls}-has-arrow`, {
          [`k-${preCls}-dark`]: dark,
        })}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          transformOrigin: transOrigin,
          width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        }}
        onMouseEnter={() => {
          if (hideTimer.current) clearTimeout(hideTimer.current);
          updateShow(true);
        }}
        onMouseLeave={() => {
          showTimer.current = setTimeout(() => {
            if (!show) updateShow(false);
          }, 300);
        }}
      >
        <div className={`k-${preCls}-content`}>
          {title ? <div className={`k-${preCls}-title`}>{title}</div> : null}
          <div className={`k-${preCls}-body`}>{content}</div>
          <div className={`k-${preCls}-arrow`}>
            <svg style={{ fill: "currentcolor" }} viewBox="0 0 24 8">
              <path
                id="ot"
                d="m24,0.97087l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
              />
              <path
                stroke="currentcolor"
                id="in"
                d="m24,0l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
              />
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

export default Poptip;
