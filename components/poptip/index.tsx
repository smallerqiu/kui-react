import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import type { PlacementsType } from "../const/types";
import { setPlacement } from "../utils/placement";
import { getChildren, setRef } from "../utils/react-node";

export interface PoptipProps {
  dark?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  width?: number | string;
  trigger?: "click" | "hover" | "focus";
  placement?: PlacementsType;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

const Poptip: React.FC<PoptipProps> = ({
  dark = false,
  open,
  defaultOpen = false,
  show,
  title,
  content,
  width,
  trigger = "hover",
  placement = "top",
  onClose,
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

  const updateShow = useCallback((value: boolean) => {
    if (externalOpen === undefined) setVisible(value);
    onOpenChange?.(value);
    onShowChange?.(value);
    if (!value) onClose?.();
  }, [externalOpen, onClose, onOpenChange, onShowChange]);

  const outsideClick = useCallback((e: MouseEvent) => {
    const ctx = refSelection.current;
    if (
      refPopper.current &&
      !refPopper.current.contains(e.target as Node) &&
      ctx &&
      !ctx.contains(e.target as Node)
    ) {
      updateShow(false);
    }
  }, [updateShow]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [updatePosition]);

  useEffect(() => {
    if (!visible) return;
    document.addEventListener("click", outsideClick);
    return () => document.removeEventListener("click", outsideClick);
  }, [outsideClick, visible]);

  const showPoptip = () => {
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

  const hidePoptip = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      updateShow(false);
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
  const setSelectionRef = (node: HTMLElement | null) => {
    refSelection.current = node;
  };
  if (
    firstChild &&
    React.isValidElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>(
      firstChild
    )
  ) {
    const childProps = firstChild.props;
    const mergedTriggerProps: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> = {
      ref: (node) => {
        setRef(childProps.ref, node);
        setSelectionRef(node);
      },
      onMouseLeave: (event) => {
        childProps.onMouseLeave?.(event);
        hidePoptip();
      },
    };
    if (trigger === "click") {
      mergedTriggerProps.onClick = (event) => {
        childProps.onClick?.(event);
        showPoptip();
      };
    } else if (trigger === "hover") {
      mergedTriggerProps.onMouseEnter = (event) => {
        childProps.onMouseEnter?.(event);
        showPoptip();
      };
    } else {
      mergedTriggerProps.onFocus = (event) => {
        childProps.onFocus?.(event);
        showPoptip();
      };
      mergedTriggerProps.onBlur = (event) => {
        childProps.onBlur?.(event);
        hidePoptip();
      };
    }
    triggerNode = React.cloneElement(firstChild, {
      ...mergedTriggerProps,
    });
  } else {
    triggerNode = (
      <span ref={setSelectionRef} {...triggerProps}>
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
            updateShow(false);
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
