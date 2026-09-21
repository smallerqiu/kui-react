import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import type { PlacementsType } from "../const/types";
import { usePopoverPosition, usePopoverOutsideClick } from "../utils/use-popover";
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
  /** 只渲染浮层本身，不包含触发元素、定位与动画，与 kui-vue 一致 */
  panelOnly?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export type PoptipPanelProps = Omit<PoptipProps, "children" | "open" | "defaultOpen" | "show">;

export function PoptipPanel(props: PoptipPanelProps) {
  return <Poptip {...props} panelOnly />;
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
  panelOnly = false,
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
  const {
    left,
    top,
    currentPlacement,
    transOrigin,
    refPopper,
    refSelection,
    updatePosition,
    setSelectionRef,
  } = usePopoverPosition(placement, visible, panelOnly, title);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const showTimer = useRef<NodeJS.Timeout | null>(null);

  const updateShow = useCallback(
    (value: boolean) => {
      if (externalOpen === undefined) setVisible(value);
      onOpenChange?.(value);
      onShowChange?.(value);
      if (!value) onClose?.();
    },
    [externalOpen, onClose, onOpenChange, onShowChange],
  );

  usePopoverOutsideClick(visible, refSelection, refPopper, updateShow);

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
  if (
    firstChild &&
    React.isValidElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>(
      firstChild,
    )
  ) {
    const childProps = firstChild.props;
    const mergedTriggerProps: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> =
      {
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
    <Transition show={visible} name={`k-${preCls}`} nodeRef={refPopper} appear>
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

  // panelOnly：直接渲染浮层本身，无触发元素、无 Teleport、无动画与定位
  if (panelOnly) {
    return (
      <div
        {...({ "k-placement": placement } as React.HTMLAttributes<HTMLDivElement>)}
        className={clsx(`k-${preCls}`, `k-${preCls}-has-arrow`, `k-${preCls}-panel`, {
          [`k-${preCls}-dark`]: dark,
        })}
        style={{ width: width ? (typeof width === "number" ? `${width}px` : width) : undefined }}
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
    );
  }

  return (
    <>
      {triggerNode}
      <Teleport to="body">{overlayNode}</Teleport>
    </>
  );
};

export default Poptip;
