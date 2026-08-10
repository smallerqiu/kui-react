import clsx from "clsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { DirectionType } from "../const/types";
import { DropdownContext } from "../dropdown/dropdown";
import type { IconType } from "../icon";
import { MenuContext } from "./menu-context";
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
  children,
  className,
  ...rest
}) => {
  const dropdownContext = useContext(DropdownContext);
  const [selectedKeys, setSelectedKeys] = useState([...value]);
  const [currentOpenKeys, setCurrentOpenKeys] = useState(inlineCollapsed ? [] : [...openKeys]);
  const [currentMode, setCurrentMode] = useState(mode);
  const [currentInlineCollapsed, setCurrentInlineCollapsed] = useState(inlineCollapsed);
  const [popupInlineCollapsed, setPopupInlineCollapsed] = useState(inlineCollapsed);
  const tempOpenKeys = useRef([...openKeys]);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef({ value: false, mode: false, open: false, collapsed: false });

  const collapseOpenKeys = () => {
    if (currentOpenKeys.length > 0) tempOpenKeys.current = [...currentOpenKeys];
    setCurrentOpenKeys([]);
  };
  const restoreOpenKeys = () => setCurrentOpenKeys([...tempOpenKeys.current]);

  useEffect(() => {
    if (!mounted.current.value) {
      mounted.current.value = true;
      return;
    }
    setSelectedKeys([...value]);
  }, [value]);
  useEffect(() => {
    if (!mounted.current.mode) {
      mounted.current.mode = true;
      return;
    }
    setCurrentMode(mode);
    if (mode === "vertical") collapseOpenKeys();
    else if (!inlineCollapsed) restoreOpenKeys();
  }, [mode]);
  useEffect(() => {
    if (!mounted.current.open) {
      mounted.current.open = true;
      return;
    }
    if (inlineCollapsed || currentMode === "vertical") tempOpenKeys.current = [...openKeys];
    else setCurrentOpenKeys([...openKeys]);
  }, [openKeys]);
  useEffect(() => {
    if (!mounted.current.collapsed) {
      mounted.current.collapsed = true;
      return;
    }
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    if (inlineCollapsed) {
      setCurrentInlineCollapsed(true);
      collapseOpenKeys();
      collapseTimer.current = setTimeout(() => setPopupInlineCollapsed(true), 200);
    } else {
      setPopupInlineCollapsed(false);
      setCurrentInlineCollapsed(false);
      restoreOpenKeys();
    }
  }, [inlineCollapsed]);
  useEffect(
    () => () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    },
    []
  );

  const selectedKeysChange = (key: string, selected: boolean, keyPath: string[]) => {
    setSelectedKeys((keys) =>
      selected ? [...keyPath, key] : keys.filter((itemKey) => itemKey !== key)
    );
    onSelect?.({ key, keyPath });
    if (currentMode === "horizontal" || currentMode === "vertical" || currentInlineCollapsed) {
      collapseOpenKeys();
    }
    dropdownContext?.menuSelected?.({ key, keyPath });
  };
  const openKeysChange = (key: string, opened: boolean, keyPath: string[]) => {
    let nextKeys: string[];
    if (accordion) nextKeys = opened ? [...keyPath, key] : keyPath;
    else if (!opened) nextKeys = currentOpenKeys.filter((itemKey) => itemKey !== key);
    else {
      nextKeys = currentOpenKeys.includes(key) ? currentOpenKeys : [...currentOpenKeys, key];
    }
    setCurrentOpenKeys(nextKeys);
    onOpenChange?.(nextKeys);
  };
  const dropdown = dropdownContext !== null;
  const preCls = dropdown ? "dropdown-menu" : "menu";
  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<any>;
    return React.cloneElement(element, {
      menuKey: element.props.menuKey ?? (element.key == null ? undefined : String(element.key)),
    });
  });

  return (
    <MenuContext.Provider
      value={{
        openKeys: currentOpenKeys,
        selectedKeys,
        mode: currentMode,
        inlineCollapsed: currentInlineCollapsed,
        popupInlineCollapsed,
        dropdown,
        openKeysChange,
        selectedKeysChange,
      }}
    >
      <ul
        className={clsx(
          `k-${preCls}`,
          `k-${preCls}-${currentMode}`,
          {
            "k-scroll": dropdown,
            [`k-${preCls}-inline-collapsed`]: currentInlineCollapsed,
          },
          className
        )}
        {...({ "theme-mode": theme } as React.HTMLAttributes<HTMLUListElement>)}
        {...rest}
      >
        {items?.length
          ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
          : renderedChildren}
      </ul>
    </MenuContext.Provider>
  );
};

export default Menu;
