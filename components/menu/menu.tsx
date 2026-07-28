import clsx from "clsx";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { DirectionType } from "../const/types";
import Icon, { type IconType } from "../icon";
import { setPlacement } from "../utils/placement";

// ─────────────────────────────────────────
// Shared Context
// ─────────────────────────────────────────

export interface MenuSelectEvent {
  key: string;
  keyPath: string[];
}

export interface MenuContextValue {
  selectedKeys: string[];
  openKeys: string[];
  mode: DirectionType;
  inlineCollapsed: boolean;
  isDropdown: boolean;
  accordion: boolean;
  keyPath: string[];
  onSelectedChange: (key: string, selected: boolean, keyPath: string[]) => void;
  onOpenChange: (key: string, opened: boolean, keyPath: string[]) => void;
}

export const MenuContext = createContext<MenuContextValue>({
  selectedKeys: [],
  openKeys: [],
  mode: "vertical",
  inlineCollapsed: false,
  isDropdown: false,
  accordion: false,
  keyPath: [],
  onSelectedChange: () => {},
  onOpenChange: () => {},
});

// ─────────────────────────────────────────
// MenuOptionsProps
// ─────────────────────────────────────────

export interface MenuOptionsProps {
  icon?: IconType[];
  title?: React.ReactNode;
  key: string;
  disabled?: boolean;
  children?: MenuOptionsProps[];
  [key: string]: any;
}

// ─────────────────────────────────────────
// MenuItem
// ─────────────────────────────────────────

export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  icon?: IconType[];
  title?: React.ReactNode;
  disabled?: boolean;
  isPopup?: boolean;
  /** injected by SubMenu or RecursiveMenu */
  menuKey?: string;
  /** injected contextual key path */
  keyPath?: string[];
  children?: React.ReactNode;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  disabled = false,
  isPopup = false,
  menuKey,
  keyPath: ownKeyPath,
  children,
  className = "",
  ...rest
}) => {
  const ctx = useContext(MenuContext);
  const [active, setActive] = useState(false);
  const preCls = ctx.isDropdown ? "dropdown-menu" : "menu";
  const key = menuKey ?? "";
  const keyPath = ownKeyPath ?? ctx.keyPath;
  const isSelected = ctx.selectedKeys.includes(key) && !ctx.isDropdown;

  useEffect(() => {
    if (isSelected) {
      ctx.onSelectedChange(key, true, keyPath);
    }
  }, []);

  const paddingLeft =
    (ctx.mode === "inline" || ctx.mode === "vertical") && keyPath.length && !isPopup
      ? `${keyPath.length * 16 + 16}px`
      : undefined;

  return (
    <li
      className={clsx(
        `k-${preCls}-item`,
        {
          [`k-${preCls}-item-active`]: active,
          [`k-${preCls}-item-selected`]: isSelected,
          [`k-${preCls}-item-disabled`]: disabled,
        },
        className
      )}
      style={{ paddingLeft }}
      onMouseEnter={() => !disabled && setActive(true)}
      onMouseLeave={() => !disabled && setActive(false)}
      onClick={() => {
        if (!disabled) ctx.onSelectedChange(key, true, keyPath);
      }}
      {...rest}
    >
      {icon ? <Icon type={icon} className={`k-${preCls}-item-icon`} /> : null}
      <span className={`k-${preCls}-title-content`}>{title || children}</span>
    </li>
  );
};

// ─────────────────────────────────────────
// SubMenu
// ─────────────────────────────────────────

export interface SubMenuProps {
  disabled?: boolean;
  title?: React.ReactNode;
  isPopup?: boolean;
  icon?: IconType[];
  /** injected by RecursiveMenu or Menu */
  menuKey?: string;
  /** key path from ancestors */
  keyPath?: string[];
  children?: React.ReactNode;
}

export const SubMenu: React.FC<SubMenuProps> = ({
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
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [currentPlacement, setCurrentPlacement] = useState("bottom-left");
  const [transOrigin, setTransOrigin] = useState("bottom left");
  const [minWidth, setMinWidth] = useState("");
  const [rendered, setRendered] = useState(false);
  const popTimer = useRef<NodeJS.Timeout | null>(null);

  const preCls = ctx.isDropdown ? "dropdown-menu-submenu" : "menu-submenu";
  const isOpened = ctx.openKeys.includes(key);
  const isSelected = ctx.selectedKeys.includes(key) && !ctx.isDropdown;

  useEffect(() => {
    if (refSelection.current) {
      setMinWidth(`${refSelection.current.offsetWidth}px`);
    }
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
    setRendered(true);
    setTimeout(() => {
      ctx.onOpenChange(key, true, keyPath);
      updatePosition();
    }, 0);
  };

  const clearPopTimer = () => {
    if (popTimer.current) clearTimeout(popTimer.current);
  };

  const hidePopper = () => {
    clearPopTimer();
    popTimer.current = setTimeout(() => {
      ctx.onOpenChange(key, false, keyPath);
    }, 200);
  };

  // Inject deeper keyPath into children
  const enrichedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as React.ReactElement<any>, {
      keyPath: childKeyPath,
      isPopup: ctx.mode !== "inline" || ctx.inlineCollapsed,
    });
  });

  // Title click / hover handlers
  let titleProps: Record<string, any> = {
    className: `k-${preCls}-title`,
    style: {} as React.CSSProperties,
  };

  const isPopupMode = ctx.mode === "horizontal" || ctx.mode === "vertical" || ctx.inlineCollapsed;

  if (ctx.mode === "inline" && !ctx.inlineCollapsed) {
    titleProps.onClick = () => {
      if (!disabled) ctx.onOpenChange(key, !isOpened, keyPath);
    };
  } else if (isPopupMode) {
    titleProps.ref = refSelection;
    titleProps.onMouseEnter = () => {
      if (!disabled) {
        clearPopTimer();
        showPopper();
      }
    };
    titleProps.onMouseLeave = () => {
      if (!disabled) hidePopper();
    };
  }

  if (keyPath.length && ctx.mode !== "horizontal" && !isPopup) {
    titleProps.style.paddingLeft = `${keyPath.length * 16 + 16}px`;
  }

  // Popup overlay (for horizontal/vertical/collapsed modes)
  const leftWithOffset =
    (ctx.mode === "horizontal" && keyPath.length) || ctx.mode === "vertical" ? left + 3 : left;

  const popperNode = rendered ? (
    <div
      ref={refPopper}
      className={`k-${preCls}-popup`}
      style={{
        minWidth: ctx.mode === "horizontal" ? minWidth : undefined,
        top: `${top}px`,
        left: `${leftWithOffset}px`,
        transformOrigin: transOrigin,
        display: isOpened ? undefined : "none",
      }}
      onMouseEnter={() => {
        clearPopTimer();
        ctx.onOpenChange(key, true, keyPath);
      }}
      onMouseLeave={hidePopper}
    >
      <div className={`k-${preCls}-sub`}>
        <ul className="k-menu k-menu-vertical">{enrichedChildren}</ul>
      </div>
    </div>
  ) : null;

  // Inline sub list (shown inline when not collapsed)
  const inlineSubNode =
    ctx.mode !== "horizontal" ? (
      <div
        className={`k-${preCls}-sub`}
        style={{
          display: isOpened && !ctx.inlineCollapsed && ctx.mode !== "vertical" ? undefined : "none",
        }}
      >
        <ul className={`k-menu k-menu-${ctx.mode}`}>{children}</ul>
      </div>
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

// ─────────────────────────────────────────
// RecursiveMenu
// ─────────────────────────────────────────

interface RecursiveMenuProps {
  item: MenuOptionsProps;
  isPopup?: boolean;
  keyPath?: string[];
}

export const RecursiveMenu: React.FC<RecursiveMenuProps> = ({
  item,
  isPopup = false,
  keyPath = [],
}) => {
  if (item.children && item.children.length > 0) {
    return (
      <SubMenu
        key={item.key}
        menuKey={item.key}
        isPopup={isPopup}
        title={item.title}
        icon={item.icon}
        disabled={item.disabled}
        keyPath={keyPath}
      >
        {item.children.map((child) => (
          <RecursiveMenu item={child} key={child.key} keyPath={[...keyPath, item.key]} />
        ))}
      </SubMenu>
    );
  }
  return (
    <MenuItem
      key={item.key}
      menuKey={item.key}
      isPopup={isPopup}
      icon={item.icon}
      disabled={item.disabled}
      keyPath={keyPath}
    >
      {item.title}
    </MenuItem>
  );
};

// ─────────────────────────────────────────
// Menu
// ─────────────────────────────────────────

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect"> {
  theme?: string;
  mode?: DirectionType;
  value?: string[];
  accordion?: boolean;
  items?: MenuOptionsProps[];
  inlineCollapsed?: boolean;
  openKeys?: string[];
  onSelect?: (data: MenuSelectEvent) => void;
  onOpenChange?: (openKeys: string[]) => void;
  isDropdown?: boolean;
  children?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({
  theme,
  mode = "vertical",
  value = [],
  accordion = false,
  items,
  inlineCollapsed = false,
  openKeys = [],
  onSelect,
  onOpenChange,
  isDropdown = false,
  children,
  className = "",
  ...rest
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(value);
  const [currentOpenKeys, setCurrentOpenKeys] = useState<string[]>(openKeys);
  const [currentMode, setCurrentMode] = useState<DirectionType>(mode);
  const [collapsed, setCollapsed] = useState(inlineCollapsed);
  const tempOpenKeys = useRef<string[]>(openKeys);

  useEffect(() => {
    setSelectedKeys(value);
  }, [value]);

  useEffect(() => {
    setCurrentMode(mode);
    if (mode === "vertical") {
      applyCollapsed(true);
    }
  }, [mode]);

  useEffect(() => {
    setCurrentOpenKeys(openKeys);
  }, [openKeys]);

  useEffect(() => {
    setCollapsed(inlineCollapsed);
    applyCollapsed(inlineCollapsed);
  }, [inlineCollapsed]);

  const applyCollapsed = (coll: boolean) => {
    if (coll) {
      if (currentOpenKeys.length > 0) {
        tempOpenKeys.current = currentOpenKeys;
      }
      setCurrentOpenKeys([]);
    } else {
      setCurrentOpenKeys(tempOpenKeys.current);
    }
  };

  const handleSelectedChange = (key: string, selected: boolean, keyPath: string[]) => {
    let nextSelected: string[];
    if (selected) {
      nextSelected = [...keyPath, key];
    } else {
      nextSelected = selectedKeys.filter((x) => x !== key);
    }
    setSelectedKeys(nextSelected);
    onSelect?.({ key, keyPath });

    // Close open menus after selection in certain modes
    if (currentMode === "horizontal" || currentMode === "vertical" || collapsed) {
      if (currentOpenKeys.length > 0) {
        tempOpenKeys.current = currentOpenKeys;
      }
      setCurrentOpenKeys([]);
    }
  };

  const handleOpenChange = (key: string, opened: boolean, keyPath: string[]) => {
    let nextOpen: string[];
    if (accordion) {
      nextOpen = opened ? [...keyPath, key] : keyPath;
    } else {
      if (!opened) {
        nextOpen = currentOpenKeys.filter((x) => x !== key);
      } else {
        nextOpen = [...currentOpenKeys, key];
      }
    }
    setCurrentOpenKeys(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const preCls = isDropdown ? "dropdown-menu k-scroll" : "menu";
  const cls = clsx(
    `k-${preCls} k-${preCls}-${currentMode}`,
    { [`k-${preCls}-inline-collapsed`]: collapsed },
    className
  );

  const contextValue: MenuContextValue = {
    selectedKeys,
    openKeys: currentOpenKeys,
    mode: currentMode,
    inlineCollapsed: collapsed,
    isDropdown,
    accordion,
    keyPath: [],
    onSelectedChange: handleSelectedChange,
    onOpenChange: handleOpenChange,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <ul className={cls} {...({ "theme-mode": theme } as any)} {...rest}>
        {items && items.length > 0
          ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
          : children}
      </ul>
    </MenuContext.Provider>
  );
};

export default Menu;
