import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { useDropdownContext } from "../dropdown/dropdown-context";
import type { IconType } from "../icon";
import Icon from "../icon";
import { getTransitionProp } from "../utils/transition";
import { setPlacement } from "../utils/placement";
import { SubMenuContext, useMenuContext, useSubMenuContext } from "./menu-context";

export interface SubMenuProps {
  itemKey?: string;
  menuKey?: string;
  disabled?: boolean;
  title?: ReactNode;
  icon?: IconType[];
  children?: ReactNode;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  itemKey,
  menuKey,
  disabled = false,
  title,
  icon,
  children,
}) => {
  const dropdownContext = useDropdownContext();
  const menuContext = useMenuContext();
  const subMenuContext = useSubMenuContext();

  const generatedKey = useId();
  const currentKey = itemKey ?? menuKey ?? generatedKey;
  const refSelection = useRef<HTMLDivElement | null>(null);
  const refPopper = useRef<HTMLDivElement | null>(null);
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const placementRef = useRef("bottom-left");
  const originRef = useRef("bottom left");
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    placement: "bottom-left",
    origin: "bottom left",
  });
  const [minWidth, setMinWidth] = useState("");
  // Prevents popup flash at (0,0) before first positioning calculation
  const [popupPositioned, setPopupPositioned] = useState(false);
  const [prevPopupInlineCollapsed, setPrevPopupInlineCollapsed] = useState(
    Boolean(menuContext?.popupInlineCollapsed)
  );

  // Reset positioning when transitioning to inline-collapsed popup mode
  // (adjusting state during render — avoids synchronous setState in effect)
  if (prevPopupInlineCollapsed !== Boolean(menuContext?.popupInlineCollapsed)) {
    setPrevPopupInlineCollapsed(Boolean(menuContext?.popupInlineCollapsed));
    if (menuContext?.popupInlineCollapsed) {
      setPopupPositioned(false);
    }
  }
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const positionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRaf = useRef(0);
  const preCls = menuContext?.dropdown ? "dropdown-menu-submenu" : "menu-submenu";
  const popup =
    menuContext?.mode === "horizontal" ||
    menuContext?.mode === "vertical" ||
    Boolean(menuContext?.popupInlineCollapsed);
  const [rendered, setRendered] = useState(
    menuContext?.mode === "inline" && !menuContext?.popupInlineCollapsed
  );
  const opened = Boolean(menuContext?.openKeys.includes(currentKey));

  const clearCurrentPopTimer = useCallback(() => {
    if (popTimer.current) clearTimeout(popTimer.current);
    popTimer.current = null;
  }, []);

  const hideCurrentPopTimer = useCallback(() => {
    clearCurrentPopTimer();
    popTimer.current = setTimeout(() => {
      menuContext?.openKeysChange?.(currentKey, false, subMenuContext?.keyPath || []);
    }, 200);
  }, [clearCurrentPopTimer, currentKey, menuContext, subMenuContext]);

  const childSubMenuContext = useMemo(
    () => ({
      keyPath: [...(subMenuContext?.keyPath || []), currentKey],
      clearPopTimer: clearCurrentPopTimer,
      hidePopTimer: hideCurrentPopTimer,
    }),
    [clearCurrentPopTimer, currentKey, hideCurrentPopTimer, subMenuContext?.keyPath]
  );

  const updatePosition = useCallback(() => {
    if (!refSelection.current || !refPopper.current) return;
    setMinWidth(`${refSelection.current.offsetWidth}px`);
    if (
      (menuContext?.mode === "horizontal" && subMenuContext?.keyPath.length) ||
      menuContext?.mode === "vertical" ||
      (menuContext?.mode === "inline" && menuContext.inlineCollapsed)
    ) {
      placementRef.current = "right-top";
    } else {
      placementRef.current = "bottom-left";
    }

    setPlacement({
      refSelection,
      refPopper,
      currentPlacement: placementRef,
      transOrigin: originRef,
      top: topRef,
      left: leftRef,
      offset: 8,
    });
    setPosition({
      top: topRef.current,
      left: leftRef.current,
      placement: placementRef.current,
      origin: originRef.current,
    });
    setPopupPositioned(true);
  }, [menuContext, subMenuContext]);

  const schedulePosition = useCallback(() => {
    if (positionTimer.current) clearTimeout(positionTimer.current);
    positionTimer.current = setTimeout(updatePosition, 0);
  }, [updatePosition]);

  const showPopper = () => {
    clearCurrentPopTimer();
    if (!rendered) {
      setRendered(true);
      cancelAnimationFrame(openRaf.current);
      openRaf.current = requestAnimationFrame(() => {
        menuContext?.openKeysChange?.(currentKey, true, subMenuContext?.keyPath || []);
        schedulePosition();
      });
    } else {
      menuContext?.openKeysChange?.(currentKey, true, subMenuContext?.keyPath || []);
      schedulePosition();
    }
  };

  useEffect(() => {
    if (opened && popup) schedulePosition();
  }, [opened, popup, schedulePosition]);

  useEffect(
    () => () => {
      clearCurrentPopTimer();
      if (positionTimer.current) clearTimeout(positionTimer.current);
      cancelAnimationFrame(openRaf.current);
    },
    [clearCurrentPopTimer]
  );

  let left = position.left;
  if (
    (menuContext?.mode === "horizontal" && subMenuContext?.keyPath.length) ||
    menuContext?.mode === "vertical"
  ) {
    left += 3;
  }

  const popperProps = {
    ref: refPopper,
    "k-placement": position.placement,
    style: {
      minWidth: menuContext?.mode === "horizontal" ? minWidth : undefined,
      top: `${position.top}px`,
      left: `${left}px`,
      transformOrigin: position.origin,
      visibility: popup && !popupPositioned ? "hidden" : undefined,
    } as CSSProperties,
    onMouseEnter: () => {
      clearCurrentPopTimer();
      menuContext?.openKeysChange?.(currentKey, true, subMenuContext?.keyPath || []);
      subMenuContext?.clearPopTimer?.();
      dropdownContext?.clearPopTimer?.();
    },
    onMouseLeave: () => {
      hideCurrentPopTimer();
      subMenuContext?.hidePopTimer?.();
      dropdownContext?.clearPopTimer?.();
    },
  };

  const transitionProps = popup
    ? { name: `k-${preCls}-popup` }
    : {
        ...getTransitionProp("k-collapse-slide"),
        timeout: { appear: 300, enter: 300, exit: 200 },
      };
  const containerProps = popup
    ? { className: `k-${preCls}-popup`, ...popperProps }
    : { className: `k-${preCls}-sub` };

  const childrenNode =
    popup && !rendered ? null : (
      <Teleport to="body" disabled={!popup}>
        <Transition {...transitionProps} show={opened} appear={popup}>
          <div {...containerProps}>
            <div className={popup ? `k-${preCls}-sub` : undefined}>
              <ul className={`k-menu k-menu-${popup ? "vertical" : menuContext?.mode}`}>
                <SubMenuContext.Provider value={childSubMenuContext}>
                  {children}
                </SubMenuContext.Provider>
              </ul>
            </div>
          </div>
        </Transition>
      </Teleport>
    );

  const selected = Boolean(
    menuContext?.selectedKeys.includes(currentKey) && !menuContext?.dropdown
  );
  const titleStyle: CSSProperties = {};
  if (
    subMenuContext?.keyPath.length &&
    menuContext?.mode === "inline" &&
    !menuContext.inlineCollapsed
  ) {
    titleStyle.paddingLeft = `${subMenuContext.keyPath.length * 16 + 16}px`;
  }

  const popupTitleProps =
    menuContext?.mode === "inline" && !menuContext.inlineCollapsed
      ? {
          onClick: () => {
            if (!disabled) {
              menuContext?.openKeysChange?.(currentKey, !opened, subMenuContext?.keyPath || []);
            }
          },
        }
      : {
          ref: refSelection as React.Ref<HTMLDivElement>,
          onMouseEnter: () => {
            if (!disabled) showPopper();
          },
          onMouseLeave: () => {
            if (!disabled) hideCurrentPopTimer();
          },
        };

  return (
    <li
      className={clsx(`k-${preCls}`, {
        [`k-${preCls}-active`]: opened || selected,
        [`k-${preCls}-selected`]: selected,
        [`k-${preCls}-opened`]: opened,
        [`k-${preCls}-disabled`]: disabled,
      })}
    >
      <div className={`k-${preCls}-title`} style={titleStyle} {...popupTitleProps}>
        {icon ? <Icon type={icon} className="k-menu-item-icon" /> : null}
        <span className={`k-${preCls}-title-content`}>{title}</span>
        {menuContext?.mode === "horizontal" && !subMenuContext?.keyPath.length ? null : (
          <i className={`k-${preCls}-arrow`} />
        )}
      </div>
      {childrenNode}
    </li>
  );
};

export default SubMenu;
