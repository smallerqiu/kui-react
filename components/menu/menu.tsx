import clsx from "clsx";
import React, { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { DirectionType } from "../const/types";
import { useDropdownContext } from "../dropdown/dropdown-context";
import type { IconType } from "../icon";
import { MenuContext, type MenuContextProps } from "./menu-context";
import RecursiveMenu from "./recursive-menu";

export interface MenuSelectEvent {
  key: string;
  keyPath: string[];
}

export interface MenuOptionsProps {
  icon?: IconType[];
  title?: ReactNode;
  key: string;
  disabled?: boolean;
  children?: MenuOptionsProps[];
  [key: string]: unknown;
}

export interface MenuProps {
  theme?: string;
  mode?: DirectionType;
  selectedKeys?: string[];
  accordion?: boolean;
  items?: MenuOptionsProps[];
  inlineCollapsed?: boolean;
  openKeys?: string[];
  onSelect?: (data: MenuSelectEvent) => void;
  onOpenChange?: (openKeys: string[]) => void;
  onChange?: (selectedKeys: string[]) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Menu: React.FC<MenuProps> = ({
  theme,
  mode = "vertical",
  selectedKeys = [],
  accordion = false,
  items,
  inlineCollapsed = false,
  openKeys = [],
  onSelect,
  onOpenChange,
  onChange,
  children,
  className = "",
  style,
}) => {
  const dropdownContext = useDropdownContext();
  const currentInlineCollapsed = useRef(inlineCollapsed);
  const popupInlineCollapsed = useRef(inlineCollapsed);
  const tempOpenKeys = useRef(openKeys);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    if (inlineCollapsed) {
      currentInlineCollapsed.current = true;
      if (openKeys.length) {
        tempOpenKeys.current = [...openKeys];
      }
      onChange?.([]);
      collapseTimer.current = setTimeout(() => {
        popupInlineCollapsed.current = true;
      }, 200);
    } else {
      popupInlineCollapsed.current = false;
      currentInlineCollapsed.current = false;
      onChange?.([...tempOpenKeys.current]);
    }
  }, [inlineCollapsed, openKeys, onChange]);

  const selectedKeysChange = (key: string, selected: boolean, keyPath: string[]) => {
    let nextSelected: string[];
    if (selected) {
      nextSelected = [...keyPath, key];
    } else {
      nextSelected = selectedKeys.filter((x) => x !== key);
    }

    onChange?.(nextSelected);
    onSelect?.({ key, keyPath });

    if (mode === "horizontal" || mode === "vertical" || currentInlineCollapsed) {
      tempOpenKeys.current = [...nextSelected];
    }

    dropdownContext?.menuSelected?.({ key, keyPath });
  };

  const openKeysChange = (key: string, opened: boolean, keyPath: string[]) => {
    let nextOpenKeys: string[];
    if (accordion) {
      nextOpenKeys = opened ? [...keyPath, key] : keyPath;
    } else {
      if (!opened) {
        nextOpenKeys = openKeys.filter((x) => x !== key);
      } else {
        nextOpenKeys = openKeys.includes(key) ? openKeys : [...openKeys, key];
      }
    }

    onOpenChange?.(nextOpenKeys);
  };

  const dropdown = dropdownContext != null;

  const menuState: MenuContextProps = {
    openKeys,
    selectedKeys,
    mode,
    inlineCollapsed: currentInlineCollapsed,
    popupInlineCollapsed,
    dropdown,
    openKeysChange,
    selectedKeysChange,
  };

  const preCls = dropdown ? "dropdown-menu" : "menu";

  const cls = clsx(
    `k-${preCls}`,
    `k-${preCls}-${mode}`,
    { "k-scroll": dropdown },
    inlineCollapsed && `k-${preCls}-inline-collapsed`,
    className
  );

  return (
    <MenuContext.Provider value={menuState}>
      <ul className={cls} data-theme-mode={theme} style={style}>
        {items && items.length > 0
          ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
          : children}
      </ul>
    </MenuContext.Provider>
  );
};

export default Menu;
