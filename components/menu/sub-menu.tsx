import clsx from "clsx";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition, { getTransitionProp } from "../base/transition";
import Icon, { type IconType } from "../icon";
import { setPlacement } from "../utils/placement";
import { MenuContext, type MenuContextValue } from "./context";

export interface SubMenuProps {
  disabled?: boolean;
  title?: React.ReactNode;
  icon?: IconType[];
  menuKey?: string;
  children?: React.ReactNode;
}

const SubMenu: React.FC<SubMenuProps> = ({
  disabled = false,
  title,
  icon,
  menuKey = "",
  children,
}) => {
  const context = useContext(MenuContext);
  const refSelection = useRef<HTMLDivElement>(null);
  const refPopper = useRef<HTMLDivElement>(null);
  const top = useRef(0);
  const left = useRef(0);
  const currentPlacement = useRef("bottom-left");
  const transOrigin = useRef("bottom left");
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [placement, setCurrentPlacement] = useState("bottom-left");
  const [origin, setOrigin] = useState("bottom left");
  const [minWidth, setMinWidth] = useState("");
  const [rendered, setRendered] = useState(
    context.mode === "inline" && !context.popupInlineCollapsed
  );
  const [positioned, setPositioned] = useState(false);

  const keyPath = context.keyPath;
  const childKeyPath = [...keyPath, menuKey];
  const opened = context.openKeys.includes(menuKey);
  const selected = context.selectedKeys.includes(menuKey) && !context.dropdown;
  const preCls = context.dropdown ? "dropdown-menu-submenu" : "menu-submenu";
  const popup =
    context.mode === "horizontal" || context.mode === "vertical" || context.popupInlineCollapsed;

  const updatePosition = () => {
    if (!refSelection.current || !refPopper.current) return;
    if (
      (context.mode === "horizontal" && keyPath.length > 0) ||
      context.mode === "vertical" ||
      (context.mode === "inline" && context.inlineCollapsed)
    ) {
      currentPlacement.current = "right-top";
    }
    const placementState = { value: currentPlacement.current };
    const originState = { value: transOrigin.current };
    const topState = { value: top.current };
    const leftState = { value: left.current };
    setPlacement({
      refSelection: refSelection.current,
      refPopper: refPopper.current,
      currentPlacement: placementState,
      transOrigin: originState,
      top: topState,
      left: leftState,
      offset: 8,
    });
    currentPlacement.current = placementState.value;
    transOrigin.current = originState.value;
    top.current = topState.value;
    left.current = leftState.value;
    setPosition({ top: top.current, left: left.current });
    setCurrentPlacement(currentPlacement.current);
    setOrigin(transOrigin.current);
    setPositioned(true);
  };

  useEffect(() => {
    setMinWidth(`${refSelection.current?.offsetWidth}px`);
  }, []);
  useLayoutEffect(() => {
    if (rendered && opened && popup) updatePosition();
  }, [rendered, opened, popup]);
  useEffect(
    () => () => {
      if (popTimer.current) clearTimeout(popTimer.current);
      if (showTimer.current) clearTimeout(showTimer.current);
    },
    []
  );

  const clearCurrentPopTimer = () => {
    if (popTimer.current) clearTimeout(popTimer.current);
  };
  const hideCurrentPopTimer = () => {
    clearCurrentPopTimer();
    popTimer.current = setTimeout(() => context.openKeysChange(menuKey, false, keyPath), 200);
  };
  const showPopper = () => {
    if (!opened) setPositioned(false);
    setRendered(true);
    if (showTimer.current) clearTimeout(showTimer.current);
    showTimer.current = setTimeout(() => {
      context.openKeysChange(menuKey, true, keyPath);
    }, 0);
  };

  const childContext: MenuContextValue = {
    ...context,
    keyPath: childKeyPath,
    clearPopTimer: clearCurrentPopTimer,
    hidePopTimer: hideCurrentPopTimer,
  };
  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<any>;
    return React.cloneElement(element, {
      menuKey: element.props.menuKey ?? (element.key == null ? undefined : String(element.key)),
    });
  });

  const titleProps: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.RefObject<HTMLDivElement | null>;
  } = {
    className: `k-${preCls}-title`,
    style: {},
  };
  if (context.mode === "inline" && !context.inlineCollapsed) {
    titleProps.onClick = () => {
      if (!disabled) context.openKeysChange(menuKey, !opened, keyPath);
    };
  } else if (
    context.mode === "horizontal" ||
    context.mode === "vertical" ||
    context.inlineCollapsed
  ) {
    titleProps.ref = refSelection;
    titleProps.onMouseEnter = () => {
      if (disabled) return;
      clearCurrentPopTimer();
      showPopper();
    };
    titleProps.onMouseLeave = () => {
      if (!disabled) hideCurrentPopTimer();
    };
  }
  if (keyPath.length && context.mode === "inline" && !context.inlineCollapsed) {
    titleProps.style = { paddingLeft: `${keyPath.length * 16 + 16}px` };
  }

  let leftValue = position.left;
  if ((context.mode === "horizontal" && keyPath.length) || context.mode === "vertical") {
    leftValue += 3;
  }
  const transitionProps = popup
    ? {
        name: `k-${preCls}-popup`,
        timeout: 300,
      }
    : { ...getTransitionProp("k-collapse-slide"), timeout: 200 };
  const submenuNode = rendered ? (
    <Transition show={opened} {...transitionProps}>
      <div
        ref={refPopper}
        className={popup ? `k-${preCls}-popup` : `k-${preCls}-sub`}
        {...(popup ? ({ "k-placement": placement } as React.HTMLAttributes<HTMLDivElement>) : {})}
        style={
          popup
            ? {
                minWidth: context.mode === "horizontal" ? minWidth : undefined,
                top: `${position.top}px`,
                left: `${leftValue}px`,
                transformOrigin: origin,
                visibility: positioned ? undefined : "hidden",
              }
            : undefined
        }
        onMouseEnter={
          popup
            ? () => {
                clearCurrentPopTimer();
                context.openKeysChange(menuKey, true, keyPath);
                context.clearPopTimer?.();
              }
            : undefined
        }
        onMouseLeave={
          popup
            ? () => {
                hideCurrentPopTimer();
                context.hidePopTimer?.();
              }
            : undefined
        }
      >
        <div className={popup ? `k-${preCls}-sub` : undefined}>
          <ul className={`k-menu k-menu-${popup ? "vertical" : context.mode}`}>
            <MenuContext.Provider value={childContext}>{renderedChildren}</MenuContext.Provider>
          </ul>
        </div>
      </div>
    </Transition>
  ) : null;

  return (
    <li
      className={clsx(`k-${preCls}`, {
        [`k-${preCls}-active`]: opened || selected,
        [`k-${preCls}-selected`]: selected,
        [`k-${preCls}-opened`]: opened,
        [`k-${preCls}-disabled`]: disabled,
      })}
    >
      <div {...titleProps}>
        {icon ? <Icon type={icon} className="k-menu-item-icon" /> : null}
        <span className={`k-${preCls}-title-content`}>{title}</span>
        {context.mode === "horizontal" && !keyPath.length ? null : (
          <i className={`k-${preCls}-arrow`} />
        )}
      </div>
      <Teleport to="body" disabled={!popup}>
        {submenuNode}
      </Teleport>
    </li>
  );
};

export default SubMenu;
