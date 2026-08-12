import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import type { DropPlacementsType, TriggerType } from "../const/types";
import { setPlacement } from "../utils/placement";
import { getChildren } from "../utils/react-node";
import { DropdownContext } from "./dropdown-context";

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "show"> {
  trigger?: TriggerType;
  disabled?: boolean;
  arrow?: boolean;
  show?: boolean;
  placement?: DropPlacementsType;
  target?: React.RefObject<any>;
  onOpenChange?: (opened: boolean) => void;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger = "hover",
  disabled = false,
  arrow = false,
  show = false,
  placement = "bottom-left",
  target,
  onOpenChange,
  overlay,
  children,
  className = "",
  style,
  ...rest
}) => {
  const [visible, setVisible] = useState(show);
  const [rendered, setRendered] = useState(show);
  const [previousShow, setPreviousShow] = useState(show);
  if (previousShow !== show) {
    setPreviousShow(show);
    setVisible(show);
    if (show) setRendered(true);
  }

  const localRefSelection = useRef<HTMLElement>(null);
  const refPopper = useRef<HTMLDivElement>(null);

  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const [transOrigin, setTransOrigin] = useState("bottom");
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const placementRef = useRef<string>(placement);
  const transOriginRef = useRef("bottom");
  const leftRef = useRef(0);
  const topRef = useRef(0);

  const showTimer = useRef<NodeJS.Timeout | null>(null);
  const positionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const contextmenuPosition = useRef<{ x: number; y: number } | null>(null);

  const refSelection = target || localRefSelection;

  const updatePosition = useCallback(
    (e?: MouseEvent, requestedPlacement = placement) => {
      if (!refPopper.current) return;
      const targetElement = refSelection.current;
      if (!targetElement) return;

      const position =
        e != null
          ? { x: e.clientX, y: e.clientY }
          : trigger === "contextmenu"
            ? contextmenuPosition.current
            : null;

      placementRef.current = requestedPlacement;

      setPlacement({
        refSelection,
        position,
        refPopper,
        currentPlacement: placementRef,
        transOrigin: transOriginRef,
        top: topRef,
        left: leftRef,
      });

      setCurrentPlacement((current) =>
        current === placementRef.current ? current : (placementRef.current as DropPlacementsType)
      );
      setTransOrigin((current) =>
        current === transOriginRef.current ? current : transOriginRef.current
      );
      setTop((current) => (current === topRef.current ? current : topRef.current));
      setLeft((current) => (current === leftRef.current ? current : leftRef.current));
    },
    [placement, refSelection, trigger]
  );

  const schedulePositionUpdate = useCallback(() => {
    if (frameRef.current !== null || typeof window === "undefined") return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updatePosition();
    });
  }, [updatePosition]);

  useEffect(() => {
    if (visible) {
      positionTimer.current = setTimeout(() => updatePosition(undefined, placement), 0);
    }
    return () => {
      if (positionTimer.current) clearTimeout(positionTimer.current);
      positionTimer.current = null;
    };
  }, [placement, updatePosition, visible]);

  useEffect(() => {
    if (!visible) return;
    const targetElement = refSelection.current;
    if (!targetElement) return;
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedulePositionUpdate);
    observer?.observe(targetElement);
    if (refPopper.current) observer?.observe(refPopper.current);
    window.addEventListener("resize", schedulePositionUpdate);
    window.addEventListener("scroll", schedulePositionUpdate, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", schedulePositionUpdate);
      window.removeEventListener("scroll", schedulePositionUpdate, true);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [refSelection, schedulePositionUpdate, visible]);

  const outsideClick = useCallback((e: MouseEvent) => {
    const targetElement = refSelection.current;
    if (!refPopper.current) return;
    const clickedEl = e.target as HTMLElement;

    if (
      (!refPopper.current.contains(clickedEl) &&
        targetElement &&
        !targetElement.contains(clickedEl)) ||
      (trigger === "contextmenu" && !refPopper.current.contains(clickedEl))
    ) {
      setVisible(false);
      onOpenChange?.(false);
    }
  }, [onOpenChange, refSelection, trigger]);

  useEffect(() => {
    if (visible) {
      document.addEventListener("click", outsideClick);
    } else {
      document.removeEventListener("click", outsideClick);
    }
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, [outsideClick, visible]);

  const clearPopTimer = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  };

  useEffect(
    () => () => {
      clearPopTimer();
      if (positionTimer.current) clearTimeout(positionTimer.current);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  const openChange = (opened: boolean, e?: MouseEvent) => {
    if (!rendered && opened) {
      setRendered(true);
    }
    setVisible(opened);
    onOpenChange?.(opened);
    if (opened) {
      if (trigger === "contextmenu" && e) {
        contextmenuPosition.current = { x: e.clientX, y: e.clientY };
      }
      if (positionTimer.current) clearTimeout(positionTimer.current);
      positionTimer.current = setTimeout(() => updatePosition(e, placement), 0);
    } else if (trigger === "contextmenu") {
      contextmenuPosition.current = null;
    }
  };

  const mouseEnterEvent = () => {
    if (disabled) return;
    if (trigger === "hover") {
      clearPopTimer();
      openChange(true);
    }
  };

  const mouseLeaveEvent = () => {
    if (disabled) return;
    if (trigger === "hover") {
      clearPopTimer();
      showTimer.current = setTimeout(() => {
        openChange(false);
      }, 300);
    }
  };

  const clickEvent = () => {
    if (disabled) return;
    if (trigger === "click") {
      openChange(true);
    }
  };

  const contextmenuEvent = (e: React.MouseEvent) => {
    if (disabled) return;
    if (trigger === "contextmenu") {
      e.preventDefault();
      openChange(true, e.nativeEvent);
    }
  };

  const childList = getChildren(children);
  const firstChild = (
    childList.length === 1 ? childList[0] : <span>{childList}</span>
  ) as React.ReactElement<Record<string, any>>;

  const triggerProps: Record<string, any> = {};
  if (!target) {
    triggerProps.onClick = (e: React.MouseEvent) => {
      clickEvent();
      if (React.isValidElement(firstChild) && firstChild.props.onClick) {
        firstChild.props.onClick(e);
      }
    };
    triggerProps.onMouseEnter = (e: React.MouseEvent) => {
      mouseEnterEvent();
      if (React.isValidElement(firstChild) && firstChild.props.onMouseEnter) {
        firstChild.props.onMouseEnter(e);
      }
    };
    triggerProps.onMouseLeave = (e: React.MouseEvent) => {
      mouseLeaveEvent();
      if (React.isValidElement(firstChild) && firstChild.props.onMouseLeave) {
        firstChild.props.onMouseLeave(e);
      }
    };
    triggerProps.onContextMenu = (e: React.MouseEvent) => {
      contextmenuEvent(e);
      if (React.isValidElement(firstChild) && firstChild.props.onContextMenu) {
        firstChild.props.onContextMenu(e);
      }
    };
  }

  const triggerNode = React.isValidElement(firstChild) ? (
    React.cloneElement(firstChild, {
      ref: refSelection,
      ...triggerProps,
    })
  ) : (
    <span ref={refSelection} {...triggerProps}>
      {firstChild}
    </span>
  );

  const popperClasses = clsx("k-dropdown", { "k-dropdown-has-arrow": arrow }, className);

  const overlayNode =
    rendered && overlay ? (
      <Transition show={visible} name="k-dropdown" nodeRef={refPopper}>
        <div
          ref={refPopper}
          style={
            {
              left: `${left}px`,
              top: `${top}px`,
              transformOrigin: transOrigin,
              ...style,
            } as React.CSSProperties
          }
          className={popperClasses}
          {...({ "k-placement": currentPlacement } as Record<string, string>)}
          onClick={() => openChange(false)}
          onMouseEnter={clearPopTimer}
          onMouseLeave={mouseLeaveEvent}
          {...rest}
        >
          <div className="k-dropdown-content">
            <div className="k-dropdown-body">{overlay}</div>
            {arrow && (
              <div className="k-dropdown-arrow">
                <svg style={{ fill: "currentcolor" }} viewBox="0 0 24 8">
                  <path
                    d="M24,0.97087 L24,1.97087 C20,1.97087 18.5,2.97087 16.5,4.97087 C14.5,6.97087 14,7.97087 12,7.97087 C10,7.97087 9.5,6.97087 7.5,4.97087 C5.5,2.97087 4,1.97087 0,1.97087 L0,0.97087 L24,0.97087 Z"
                    id="ot"
                  />
                  <path
                    d="M24,0 L24,1 C20.032328,1 18.1576594,1.985435 16.1576594,3.985435 C14.1576594,5.985435 13.3847825,7 12,7 C10.6152175,7 9.81306952,5.985435 7.81306952,3.985435 C5.81306952,1.985435 4.0114261,1 0,1 L0,0 L24,0 Z"
                    id="in"
                    stroke="currentcolor"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </Transition>
    ) : null;

  return (
    <DropdownContext.Provider
      value={{
        onMouseEnter: mouseEnterEvent,
        onMouseLeave: mouseLeaveEvent,
        clearPopTimer,
        menuSelected: () => openChange(false),
      }}
    >
      {triggerNode}
      <Teleport to="body">{overlayNode}</Teleport>
    </DropdownContext.Provider>
  );
};

export default Dropdown;
