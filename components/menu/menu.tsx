import clsx from "clsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { DirectionType } from "../const/types";
import { DropdownContext } from "../dropdown/dropdown";
import type { IconType } from "../icon";
import { MenuContext, type MenuContextValue } from "./context";
import RecursiveMenu from "./recursive-menu";

const EMPTY_KEYS: string[] = [];

export interface MenuSelectEvent {
  key: string;
  keyPath: string[];
}

export interface MenuOptionsProps {
  icon?: IconType[];
  title?: React.ReactNode;
  key: string;
  disabled?: boolean;
  children?: MenuOptionsProps[];
  [key: string]: any;
}

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
  value = EMPTY_KEYS,
  accordion = false,
  items,
  inlineCollapsed = false,
  openKeys = EMPTY_KEYS,
  onSelect,
  onOpenChange,
  isDropdown = false,
  children,
  className = "",
  ...rest
}) => {
  const dropdown = useContext(DropdownContext);
  const resolvedIsDropdown = isDropdown || dropdown !== null;
  const [selectedKeys, setSelectedKeys] = useState<string[]>(value);
  const [currentOpenKeys, setCurrentOpenKeys] = useState<string[]>(openKeys);
  const [currentMode, setCurrentMode] = useState<DirectionType>(mode);
  const [collapsed, setCollapsed] = useState(inlineCollapsed);
  const tempOpenKeys = useRef<string[]>(openKeys);

  const applyCollapsed = (nextCollapsed: boolean) => {
    if (nextCollapsed) {
      if (currentOpenKeys.length > 0) tempOpenKeys.current = currentOpenKeys;
      setCurrentOpenKeys([]);
    } else {
      setCurrentOpenKeys(tempOpenKeys.current);
    }
  };

  useEffect(() => setSelectedKeys(value), [value]);
  useEffect(() => {
    setCurrentMode(mode);
    if (mode === "vertical") applyCollapsed(true);
  }, [mode]);
  useEffect(() => setCurrentOpenKeys(openKeys), [openKeys]);
  useEffect(() => {
    setCollapsed(inlineCollapsed);
    applyCollapsed(inlineCollapsed);
  }, [inlineCollapsed]);

  const handleSelectedChange = (key: string, selected: boolean, keyPath: string[]) => {
    const nextSelected = selected
      ? [...keyPath, key]
      : selectedKeys.filter((itemKey) => itemKey !== key);
    setSelectedKeys(nextSelected);
    onSelect?.({ key, keyPath });

    if (currentMode === "horizontal" || currentMode === "vertical" || collapsed) {
      if (currentOpenKeys.length > 0) tempOpenKeys.current = currentOpenKeys;
      setCurrentOpenKeys([]);
    }
  };

  const handleOpenChange = (key: string, opened: boolean, keyPath: string[]) => {
    let nextOpen: string[];
    if (accordion) {
      nextOpen = opened ? [...keyPath, key] : keyPath;
    } else if (!opened) {
      nextOpen = currentOpenKeys.filter((itemKey) => itemKey !== key);
    } else {
      nextOpen = currentOpenKeys.includes(key) ? currentOpenKeys : [...currentOpenKeys, key];
    }
    setCurrentOpenKeys(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const preCls = resolvedIsDropdown ? "dropdown-menu" : "menu";
  const classes = clsx(
    `k-${preCls}`,
    `k-${preCls}-${currentMode}`,
    { "k-scroll": resolvedIsDropdown, [`k-${preCls}-inline-collapsed`]: collapsed },
    className
  );
  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<any>;
    return React.cloneElement(element, {
      menuKey: element.props.menuKey ?? (element.key == null ? undefined : String(element.key)),
      keyPath: [],
    });
  });
  const contextValue: MenuContextValue = {
    selectedKeys,
    openKeys: currentOpenKeys,
    mode: currentMode,
    inlineCollapsed: collapsed,
    isDropdown: resolvedIsDropdown,
    accordion,
    keyPath: [],
    onSelectedChange: handleSelectedChange,
    onOpenChange: handleOpenChange,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <ul className={classes} {...({ "theme-mode": theme } as any)} {...rest}>
        {items?.length
          ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
          : renderedChildren}
      </ul>
    </MenuContext.Provider>
  );
};

export default Menu;
