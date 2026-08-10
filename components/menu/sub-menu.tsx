import clsx from "clsx";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition, { getTransitionProp } from "../base/transition";
import { DropdownContext } from "../dropdown/dropdown";
import Icon, { type IconType } from "../icon";
import { setPlacement } from "../utils/placement";
import { MenuContext, SubMenuContext } from "./menu-context";

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
  const dropdownContext = useContext(DropdownContext);
  const menuContext = useContext(MenuContext);
  const parentSubMenuContext = useContext(SubMenuContext);
  const refSelection = useRef<HTMLDivElement>(null);
  const refPopper = useRef<HTMLDivElement>(null);
  const currentPlacement = useRef("bottom-left");
  const transOrigin = useRef("bottom left");
  const top = useRef(0);
  const left = useRef(0);
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [placement, setPlacementState] = useState("bottom-left");
  const [origin, setOrigin] = useState("bottom left");
  const [minWidth, setMinWidth] = useState("");
  const [rendered, setRendered] = useState(
    menuContext?.mode === "inline" && !menuContext.popupInlineCollapsed
  );
  const [positioned, setPositioned] = useState(false);

  const keyPath = parentSubMenuContext?.keyPath || [];
  const opened = Boolean(menuContext?.openKeys.includes(menuKey));
  const selected = Boolean(menuContext?.selectedKeys.includes(menuKey) && !menuContext.dropdown);
  const preCls = menuContext?.dropdown ? "dropdown-menu-submenu" : "menu-submenu";
  const popup = Boolean(
    menuContext?.mode === "horizontal" ||
    menuContext?.mode === "vertical" ||
    menuContext?.popupInlineCollapsed
  );

  const updatePosition = () => {
    if (!refSelection.current || !refPopper.current || !menuContext) return;
    if (
      (menuContext.mode === "horizontal" && keyPath.length) ||
      menuContext.mode === "vertical" ||
      (menuContext.mode === "inline" && menuContext.inlineCollapsed)
    ) {
      currentPlacement.current = "right-top";
    }
    const placementRef = { value: currentPlacement.current };
    const originRef = { value: transOrigin.current };
    const topRef = { value: top.current };
    const leftRef = { value: left.current };
    setPlacement({
      refSelection: refSelection.current,
      refPopper: refPopper.current,
      currentPlacement: placementRef,
      transOrigin: originRef,
      top: topRef,
      left: leftRef,
      offset: 8,
    });
    currentPlacement.current = placementRef.value;
    transOrigin.current = originRef.value;
    top.current = topRef.value;
    left.current = leftRef.value;
    setPosition({ top: top.current, left: left.current });
    setPlacementState(currentPlacement.current);
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
    popTimer.current = setTimeout(() => menuContext?.openKeysChange(menuKey, false, keyPath), 200);
  };
  const showPopper = () => {
    if (!opened) setPositioned(false);
    setRendered(true);
    if (showTimer.current) clearTimeout(showTimer.current);
    showTimer.current = setTimeout(() => {
      menuContext?.openKeysChange(menuKey, true, keyPath);
    }, 0);
  };
  const childSubMenuContext = {
    keyPath: [...keyPath, menuKey],
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
  } = { className: `k-${preCls}-title`, style: {} };
  if (menuContext?.mode === "inline" && !menuContext.inlineCollapsed) {
    titleProps.onClick = () => {
      if (!disabled) menuContext.openKeysChange(menuKey, !opened, keyPath);
    };
  } else if (
    menuContext?.mode === "horizontal" ||
    menuContext?.mode === "vertical" ||
    menuContext?.inlineCollapsed
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
  if (keyPath.length && menuContext?.mode === "inline" && !menuContext.inlineCollapsed) {
    titleProps.style = { paddingLeft: `${keyPath.length * 16 + 16}px` };
  }

  let leftValue = position.left;
  if ((menuContext?.mode === "horizontal" && keyPath.length) || menuContext?.mode === "vertical") {
    leftValue += 3;
  }
  const transitionProps = popup
    ? { name: `k-${preCls}-popup`, timeout: 300 }
    : { ...getTransitionProp("k-collapse-slide"), timeout: 200 };
  const childrenNode = rendered ? (
    <Teleport to="body" disabled={!popup}>
      <Transition show={opened} nodeRef={refPopper} {...transitionProps}>
        <div
          ref={refPopper}
          className={popup ? `k-${preCls}-popup` : `k-${preCls}-sub`}
          {...(popup ? ({ "k-placement": placement } as React.HTMLAttributes<HTMLDivElement>) : {})}
          style={
            popup
              ? {
                  minWidth: menuContext?.mode === "horizontal" ? minWidth : undefined,
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
                  menuContext?.openKeysChange(menuKey, true, keyPath);
                  parentSubMenuContext?.clearPopTimer?.();
                  dropdownContext?.clearPopTimer?.();
                }
              : undefined
          }
          onMouseLeave={
            popup
              ? () => {
                  hideCurrentPopTimer();
                  parentSubMenuContext?.hidePopTimer?.();
                  dropdownContext?.clearPopTimer?.();
                }
              : undefined
          }
        >
          <div className={popup ? `k-${preCls}-sub` : undefined}>
            <ul className={`k-menu k-menu-${popup ? "vertical" : menuContext?.mode}`}>
              <SubMenuContext.Provider value={childSubMenuContext}>
                {renderedChildren}
              </SubMenuContext.Provider>
            </ul>
          </div>
        </div>
      </Transition>
    </Teleport>
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
        {menuContext?.mode === "horizontal" && !keyPath.length ? null : (
          <i className={`k-${preCls}-arrow`} />
        )}
      </div>
      {childrenNode}
    </li>
  );
};

export default SubMenu;
