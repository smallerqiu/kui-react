import clsx from "clsx";
import React, { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import Teleport from "react-kui/base/teleport";
import Transition, { getTransitionProp } from "react-kui/base/transition";
import { useDropdownContext } from "../dropdown/dropdown-context";
import type { IconType } from "../icon";
import Icon from "../icon";
import { setPlacement } from "../utils/placement";
import { SubMenuContext, useMenuContext, useSubMenuContext } from "./menu-context";

export interface SubMenuProps {
  itemKey: string;
  disabled?: boolean;
  title?: ReactNode;
  icon?: IconType[];
  children?: ReactNode;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  itemKey,
  disabled = false,
  title,
  icon,
  children,
}) => {
  const refSelection = useRef<HTMLDivElement | null>(null);
  const refPopper = useRef<HTMLDivElement | null>(null);

  const top = useRef(0);
  const left = useRef(0);
  const minWidth = useRef("");
  const currentPlacement = useRef("bottom-left");

  const transOrigin = useRef("bottom left");

  const dropdownContext = useDropdownContext();
  const menuContext = useMenuContext();
  const subMenuContext = useSubMenuContext();

  const popTimer = useRef<NodeJS.Timeout | null>(null);
  const preCls = menuContext?.dropdown ? "dropdown-menu-submenu" : "menu-submenu";

  const rendered = useRef<boolean>(
    menuContext?.mode === "inline" && !menuContext?.popupInlineCollapsed
  );

  // onMounted(() => {
  //   nextTick(() => {
  //     const width = refSelection.value?.offsetWidth;
  //     minWidth.value = `${width}px`;

  //     if (menuContext?.openKeys.includes(key)) {
  //       updatePosition();
  //     }
  //   });
  // });

  // onBeforeUnmount(() => {
  //   clearTimeout(popTimer.value);
  // });

  const clearCurrentPopTimer = () => {
    if (popTimer.current) clearTimeout(popTimer.current);
  };
  const hideCurrentPopTimer = () => {
    popTimer.current = setTimeout(() => {
      menuContext?.openKeysChange?.(itemKey as string, false, subMenuContext?.keyPath || []);
    }, 200);
  };

  const childSubMenuContext = {
    keyPath: [...(subMenuContext?.keyPath || []), itemKey],
    clearPopTimer: clearCurrentPopTimer,
    hidePopTimer: hideCurrentPopTimer,
  };

  const showPopper = () => {
    rendered.current = true;
  };

  const updatePosition = () => {
    // console.log(mode, keyPath);
    // the second level menu show right top
    // or the mode is vertical
    if (
      (menuContext?.mode == "horizontal" && subMenuContext?.keyPath.length) ||
      menuContext?.mode == "vertical" ||
      (menuContext?.mode == "inline" && menuContext?.inlineCollapsed)
    ) {
      currentPlacement.current = "right-top";
    }
    setTimeout(() => {
      setPlacement({
        refSelection,
        refPopper,
        currentPlacement,
        transOrigin,
        top,
        left,
        offset: 8,
      });
    });
  };
  useLayoutEffect(() => {
    menuContext?.openKeysChange?.(itemKey as string, true, subMenuContext?.keyPath || []);
    updatePosition();
  }, [rendered, itemKey, menuContext, subMenuContext]);
  const usePopup = () =>
    menuContext?.mode === "horizontal" ||
    menuContext?.mode === "vertical" ||
    menuContext?.popupInlineCollapsed;

  const renderChildren = () => {
    const popup = usePopup();
    if (popup && !rendered.current) return null;

    const opened = menuContext?.openKeys.includes(itemKey);
    let leftValue = left.current;
    if (
      (menuContext?.mode == "horizontal" && subMenuContext?.keyPath.length) ||
      menuContext?.mode == "vertical"
    ) {
      leftValue += 3;
    }
    const popperPros = {
      ref: refPopper,
      "k-placement": currentPlacement.current,
      style: {
        minWidth: menuContext?.mode == "horizontal" ? minWidth.current : null,
        top: top.current + "px",
        left: leftValue + "px",
        transformOrigin: transOrigin.current,
      } as CSSProperties,
      onMouseEnter: () => {
        clearCurrentPopTimer();
        menuContext?.openKeysChange?.(itemKey as string, true, subMenuContext?.keyPath || []);
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
      : getTransitionProp("k-collapse-slide");
    const containerProps = popup
      ? { className: `k-${preCls}-popup`, ...popperPros }
      : { className: `k-${preCls}-sub` };

    return (
      <Teleport to="body" disabled={!popup}>
        <Transition {...transitionProps} show={opened}>
          {opened ? (
            <div {...containerProps}>
              <div className={popup ? `k-${preCls}-sub` : undefined}>
                <ul className={`k-menu k-menu-${popup ? "vertical" : menuContext?.mode}`}>
                  <SubMenuContext.Provider value={childSubMenuContext}>
                    {children}
                  </SubMenuContext.Provider>
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Transition>
      </Teleport>
    );
  };

  const selected = menuContext?.selectedKeys.includes(itemKey) && !menuContext?.dropdown;
  const opened = menuContext?.openKeys.includes(itemKey);
  const titleProps: Record<string, any> = {
    class: `k-${preCls}-title`,
    style: {} as CSSProperties,
  };
  if (menuContext?.mode == "inline" && !menuContext?.inlineCollapsed) {
    titleProps.onClick = () => {
      if (disabled) return;
      menuContext?.openKeysChange?.(itemKey as string, !opened, subMenuContext?.keyPath || []);
    };
  } else if (
    menuContext?.mode == "horizontal" ||
    menuContext?.mode == "vertical" ||
    menuContext?.inlineCollapsed
  ) {
    // popper
    titleProps.ref = refSelection;
    titleProps.onMouseEnter = () => {
      if (disabled) return;
      clearCurrentPopTimer();
      showPopper();
    };
    titleProps.onMouseLeave = () => {
      if (disabled) return;
      popTimer.current = setTimeout(() => {
        menuContext?.openKeysChange?.(itemKey as string, false, subMenuContext?.keyPath || []);
      }, 200);
    };
  }
  if (
    subMenuContext?.keyPath.length &&
    menuContext?.mode === "inline" &&
    !menuContext?.inlineCollapsed
  ) {
    titleProps.style.paddingLeft = `${(subMenuContext?.keyPath || []).length * 16 + 16}px`;
  }

  const titleNode = (
    <div {...titleProps}>
      {icon ? <Icon type={icon} className="k-menu-item-icon" /> : null}
      {<span className={`k-${preCls}-title-content`}>{title}</span>}
      {menuContext?.mode == "horizontal" && !subMenuContext?.keyPath.length ? null : (
        <i className={`k-${preCls}-arrow`} />
      )}
    </div>
  );

  const classes = [
    `k-${preCls}`,
    {
      [`k-${preCls}-active`]: opened || selected,
      [`k-${preCls}-selected`]: selected,
      [`k-${preCls}-opened`]: opened,
      [`k-${preCls}-disabled`]: disabled,
    },
  ];
  const childrenNode = renderChildren();
  return (
    <li className={clsx(classes)}>
      {titleNode}
      {childrenNode}
    </li>
  );
};
export default SubMenu;
