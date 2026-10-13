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
import { usePopupHost } from "../config/popup-host";
import { useDropdownContext } from "../dropdown/dropdown-context";
import type { IconType } from "../icon";
import Icon from "../icon";
import { getTransitionProp } from "../utils/transition";
import { setPlacement } from "../utils/placement";
import { SubMenuContext, useMenuContext, useSubMenuContext } from "./menu-context";
import {
  firstMenuItemOf,
  handleMenuItemKeydown,
  handleSubMenuListKeydown,
  handleSubMenuTitleKeydown,
} from "./menu-keyboard";

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
  // The popup is teleported outside the menu, so trigger and list are linked by id.
  // `useId` output may hold punctuation, so it is stripped before becoming an id.
  const idSeed = generatedKey.replace(/[^a-zA-Z0-9_-]/g, "");
  const triggerId = `k-menu-submenu-title-${idSeed}`;
  const popupId = `k-menu-submenu-popup-${idSeed}`;
  const currentKey = itemKey ?? menuKey ?? generatedKey;
  const refSelection = useRef<HTMLDivElement | null>(null);
  const refPopper = useRef<HTMLDivElement | null>(null);
  const refTitle = useRef<HTMLDivElement | null>(null);
  const refList = useRef<HTMLUListElement | null>(null);
  // Set when a keyboard action asks for the first item of this submenu's list. The list may
  // not be mounted or positioned yet, so the effect below retries once it becomes ready.
  const pendingFocusFirst = useRef(false);
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
    Boolean(menuContext?.popupInlineCollapsed),
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
    menuContext?.mode === "inline" && !menuContext?.popupInlineCollapsed,
  );
  const restoreNested = !popup && menuContext?.inlineTransition && !!subMenuContext;
  const opened = Boolean(
    (restoreNested ? menuContext?.inlineOpenKeys : menuContext?.openKeys)?.includes(currentKey),
  );
  // Controlled opening must also instantiate a popup that has never been hovered.
  if (opened && popup && !rendered) setRendered(true);

  // 宿主窗口（Modal / Drawer）关掉时子菜单要跟着收：面板是 teleported 到 body 的，
  // 窗口摘了它还飘在页面上。只在真开着时才回调，免得给折叠态菜单白写一次 openKeys
  // （Vue 侧 usePopupHost 同一处也是这个守卫）。
  usePopupHost(() => {
    if (!opened) return;
    menuContext?.openKeysChange?.(currentKey, false, subMenuContext?.keyPath || []);
  });

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
    [clearCurrentPopTimer, currentKey, hideCurrentPopTimer, subMenuContext?.keyPath],
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
    [clearCurrentPopTimer],
  );

  const popperProps = {
    ref: refPopper,
    "theme-mode": menuContext?.theme,
    "k-placement": position.placement,
    style: {
      minWidth: menuContext?.mode === "horizontal" ? minWidth : undefined,
      top: `${position.top}px`,
      left: `${position.left}px`,
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

  // 展开/收起走 Menu 自己的 `k-menu-slide`，不能借 Collapse 的 `k-collapse-slide`：那个类带着
  // `animation: k-motion-scale-y-in`（scaleY 0→1，见 `components/collapse/styles/index.less`），
  // 会叠在同一个元素的高度过渡上——盒子按 height 先撑开，内容还被压成 0，看上去就是
  // "外层先展开、里面的再伸缩下来"。
  // `timeout` 必须等于 `styles/index.less` 里的 `@menu-submenu-duration`（200ms）：它是
  // react-transition-group 摘掉 `-enter-active` 的时机，比 CSS 长会多留一段固定高度 +
  // `overflow: hidden`，比 CSS 短会把过渡掐断。
  const transitionProps = popup
    ? { name: `k-${preCls}-popup` }
    : restoreNested
      ? { name: "k-menu-restore", timeout: 0 }
      : { ...getTransitionProp("k-menu-slide"), timeout: 200 };
  const containerProps = popup
    ? { className: `k-${preCls}-popup`, ...popperProps }
    : { className: `k-${preCls}-sub` };

  const activateTitle = () => {
    if (disabled) return;
    if (menuContext?.mode === "inline" && !menuContext.inlineCollapsed) {
      menuContext.openKeysChange?.(currentKey, !opened, subMenuContext?.keyPath || []);
      return;
    }
    if (opened) {
      menuContext?.openKeysChange?.(currentKey, false, subMenuContext?.keyPath || []);
    } else {
      showPopper();
    }
  };

  // A horizontal menu bar is a `menubar`, so ArrowDown opens its submenu; inside a vertical
  // or inline list the submenu branch key is ArrowRight (ArrowDown walks siblings there).
  const isMenubarItem =
    menuContext?.mode === "horizontal" && !(subMenuContext?.keyPath.length ?? 0);

  const focusFirstItem = useCallback(() => {
    const first = firstMenuItemOf(refList.current);
    if (!first) return false;
    first.focus({ preventScroll: true });
    return true;
  }, []);

  const expandAndFocusFirst = () => {
    if (!opened) {
      pendingFocusFirst.current = true;
      activateTitle();
      return;
    }
    // Already open: the list is normally ready, otherwise wait for the effect below.
    if ((popup && !popupPositioned) || !focusFirstItem()) pendingFocusFirst.current = true;
  };

  const closeAndRefocusTrigger = () => {
    menuContext?.openKeysChange?.(currentKey, false, subMenuContext?.keyPath || []);
    (refTitle.current ?? refSelection.current)?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!pendingFocusFirst.current) return;
    if (!opened) {
      pendingFocusFirst.current = false;
      return;
    }
    if (popup && !popupPositioned) return;
    pendingFocusFirst.current = false;
    focusFirstItem();
  }, [focusFirstItem, opened, popup, popupPositioned]);

  const childrenNode =
    popup && !rendered ? null : (
      <Teleport to="body" disabled={!popup}>
        <Transition {...transitionProps} show={opened} appear={popup}>
          <div {...containerProps}>
            <div className={popup ? `k-${preCls}-sub` : undefined}>
              <ul
                id={popupId}
                ref={refList}
                className={`k-menu k-menu-${popup ? "vertical" : menuContext?.mode}`}
                role="menu"
                aria-labelledby={triggerId}
                // A submenu list always stacks vertically — in horizontal mode it is
                // necessarily a popup, so the old mode-derived "horizontal" branch was dead.
                aria-orientation="vertical"
                onKeyDown={(event) => {
                  // Escape unwinds exactly one level: the innermost list handles it and
                  // stops propagation, focus goes back to that level's trigger.
                  handleSubMenuListKeydown(event, closeAndRefocusTrigger);
                }}
              >
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
    menuContext?.selectedKeys.includes(currentKey) && !menuContext?.dropdown,
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
      // The wrapper <li> carries no semantics of its own, so the title div is the menu item.
      role="none"
    >
      <div
        id={triggerId}
        className={`k-${preCls}-title`}
        style={titleStyle}
        {...popupTitleProps}
        ref={(node) => {
          refTitle.current = node;
          refSelection.current = node;
        }}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-haspopup="menu"
        aria-expanded={opened}
        aria-controls={opened ? popupId : undefined}
        onKeyDown={(event) => {
          if (event.key === "Escape" && opened) {
            event.preventDefault();
            // Do not let the enclosing submenu list close as well.
            event.stopPropagation();
            menuContext?.openKeysChange?.(currentKey, false, subMenuContext?.keyPath || []);
            return;
          }
          if (handleSubMenuTitleKeydown(event, { isMenubarItem, opened }, { expandAndFocusFirst }))
            return;
          handleMenuItemKeydown(event, activateTitle);
        }}
      >
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
