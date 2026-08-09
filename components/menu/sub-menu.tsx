import clsx from "clsx";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { getTransitionProp } from "../base/transition";
import Icon, { type IconType } from "../icon";
import { setPlacement } from "../utils/placement";
import { MenuContext, type MenuContextValue } from "./context";

export interface SubMenuProps {
  disabled?: boolean;
  title?: React.ReactNode;
  isPopup?: boolean;
  icon?: IconType[];
  menuKey?: string;
  keyPath?: string[];
  children?: React.ReactNode;
}

const SubMenu: React.FC<SubMenuProps> = ({
  disabled = false,
  title,
  isPopup = false,
  icon,
  menuKey,
  keyPath: ownKeyPath,
  children,
}) => {
  const ctx = useContext(MenuContext);
  const key = menuKey ?? "";
  const keyPath = ownKeyPath ?? ctx.keyPath;
  const childKeyPath = [...keyPath, key];
  const refSelection = useRef<HTMLDivElement>(null);
  const refPopper = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLDivElement>(null);
  const popTimer = useRef<NodeJS.Timeout | null>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [currentPlacement, setCurrentPlacement] = useState("bottom-left");
  const [transOrigin, setTransOrigin] = useState("bottom left");
  const [minWidth, setMinWidth] = useState("");
  const [rendered, setRendered] = useState(false);
  const [positioned, setPositioned] = useState(false);

  const preCls = ctx.isDropdown ? "dropdown-menu-submenu" : "menu-submenu";
  const isOpened = ctx.openKeys.includes(key);
  const isSelected = ctx.selectedKeys.includes(key) && !ctx.isDropdown;
  const isPopupMode = ctx.mode === "horizontal" || ctx.mode === "vertical" || ctx.inlineCollapsed;

  useEffect(() => {
    if (refSelection.current) setMinWidth(`${refSelection.current.offsetWidth}px`);
  }, []);

  const updatePosition = () => {
    const needRight =
      (ctx.mode === "horizontal" && keyPath.length > 0) ||
      ctx.mode === "vertical" ||
      (ctx.mode === "inline" && ctx.inlineCollapsed);
    const plObj = { value: needRight ? "right-top" : currentPlacement };
    const toObj = { value: transOrigin };
    const topObj = { value: top };
    const leftObj = { value: left };
    if (!refSelection.current || !refPopper.current) return;

    setPlacement({
      refSelection: refSelection.current,
      refPopper: refPopper.current,
      currentPlacement: plObj,
      transOrigin: toObj,
      top: topObj,
      left: leftObj,
      offset: 8,
    });
    setCurrentPlacement(plObj.value);
    setTransOrigin(toObj.value);
    setTop(topObj.value);
    setLeft(leftObj.value);
  };

  const showPopper = () => {
    if (!isOpened) setPositioned(false);
    setRendered(true);
    ctx.onOpenChange(key, true, keyPath);
  };

  useLayoutEffect(() => {
    if (!rendered || !isOpened || !isPopupMode || !refPopper.current) return;
    updatePosition();
    setPositioned(true);
  }, [rendered, isOpened, isPopupMode]);

  const clearPopTimer = () => {
    if (popTimer.current) clearTimeout(popTimer.current);
  };
  const hidePopper = () => {
    clearPopTimer();
    popTimer.current = setTimeout(() => ctx.onOpenChange(key, false, keyPath), 200);
  };
  useEffect(() => () => clearPopTimer(), []);

  const enrichedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<any>;
    return React.cloneElement(element, {
      menuKey: element.props.menuKey ?? (element.key == null ? undefined : String(element.key)),
      keyPath: childKeyPath,
      isPopup: ctx.mode !== "inline" || ctx.inlineCollapsed,
    });
  });
  const childContext: MenuContextValue = {
    ...ctx,
    keyPath: childKeyPath,
    clearPopupTimer: clearPopTimer,
    schedulePopupClose: hidePopper,
  };

  const titleProps: Record<string, any> = {
    className: `k-${preCls}-title`,
    style: {} as React.CSSProperties,
  };
  if (ctx.mode === "inline" && !ctx.inlineCollapsed) {
    titleProps.onClick = () => {
      if (!disabled) ctx.onOpenChange(key, !isOpened, keyPath);
    };
  } else if (isPopupMode) {
    titleProps.ref = refSelection;
    titleProps.onMouseEnter = () => {
      if (disabled) return;
      clearPopTimer();
      ctx.clearPopupTimer?.();
      showPopper();
    };
    titleProps.onMouseLeave = () => {
      if (!disabled) hidePopper();
    };
  }
  if (keyPath.length && ctx.mode === "inline" && !ctx.inlineCollapsed && !isPopup) {
    titleProps.style.paddingLeft = `${keyPath.length * 16 + 16}px`;
  }

  const leftWithOffset =
    (ctx.mode === "horizontal" && keyPath.length) || ctx.mode === "vertical" ? left + 3 : left;
  const popperNode = rendered ? (
    <CSSTransition
      appear
      in={isOpened}
      nodeRef={refPopper}
      timeout={300}
      classNames={{
        appearActive: `k-${preCls}-popup-enter-active`,
        enterActive: `k-${preCls}-popup-enter-active`,
        exitActive: `k-${preCls}-popup-leave-active`,
      }}
      unmountOnExit
    >
      <div
        ref={refPopper}
        className={`k-${preCls}-popup`}
        {...({ "k-placement": currentPlacement } as React.HTMLAttributes<HTMLDivElement>)}
        style={{
          minWidth: ctx.mode === "horizontal" ? minWidth : undefined,
          top: `${top}px`,
          left: `${leftWithOffset}px`,
          transformOrigin: transOrigin,
          visibility: positioned ? undefined : "hidden",
        }}
        onMouseEnter={() => {
          clearPopTimer();
          ctx.clearPopupTimer?.();
          ctx.onOpenChange(key, true, keyPath);
        }}
        onMouseLeave={() => {
          hidePopper();
          ctx.schedulePopupClose?.();
        }}
      >
        <div className={`k-${preCls}-sub`}>
          <ul className="k-menu k-menu-vertical">
            <MenuContext.Provider value={childContext}>{enrichedChildren}</MenuContext.Provider>
          </ul>
        </div>
      </div>
    </CSSTransition>
  ) : null;

  const showInline = isOpened && !ctx.inlineCollapsed && ctx.mode !== "vertical";
  const inlineTransition = getTransitionProp("k-collapse-slide", inlineRef);
  const inlineSubNode =
    ctx.mode !== "horizontal" ? (
      <CSSTransition
        in={showInline}
        nodeRef={inlineRef}
        timeout={200}
        {...inlineTransition}
        unmountOnExit
      >
        <div ref={inlineRef} className={`k-${preCls}-sub`}>
          <ul className={`k-menu k-menu-${ctx.mode}`}>
            <MenuContext.Provider value={childContext}>{enrichedChildren}</MenuContext.Provider>
          </ul>
        </div>
      </CSSTransition>
    ) : null;

  const classes = clsx(`k-${preCls}`, {
    [`k-${preCls}-active`]: isOpened || isSelected,
    [`k-${preCls}-selected`]: isSelected,
    [`k-${preCls}-opened`]: isOpened,
    [`k-${preCls}-disabled`]: disabled,
  });

  return (
    <li className={classes}>
      <div {...titleProps}>
        {icon ? <Icon type={icon} className="k-menu-item-icon" /> : null}
        <span className={`k-${preCls}-title-content`}>{title}</span>
        {ctx.mode === "horizontal" && !keyPath.length ? null : (
          <i className={`k-${preCls}-arrow`} />
        )}
      </div>
      {ctx.mode !== "horizontal" && (
        <>
          {inlineSubNode}
          {(ctx.inlineCollapsed || ctx.mode === "vertical") &&
            popperNode &&
            createPortal(popperNode, document.body)}
        </>
      )}
      {ctx.mode === "horizontal" && popperNode && createPortal(popperNode, document.body)}
    </li>
  );
};

export default SubMenu;
