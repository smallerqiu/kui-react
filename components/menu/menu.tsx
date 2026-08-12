import clsx from "clsx";
import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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
  value?: string[];
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
  value,
  selectedKeys,
  accordion = false,
  items,
  inlineCollapsed = false,
  openKeys,
  onSelect,
  onOpenChange,
  onChange,
  children,
  className = "",
  style,
}) => {
  const dropdownContext = useDropdownContext();
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>([]);
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>([]);
  const [collapseState, setCollapseState] = useState({
    inlineCollapsed,
    popupReady: inlineCollapsed,
  });
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (collapseState.inlineCollapsed !== inlineCollapsed) {
    setCollapseState({ inlineCollapsed, popupReady: false });
  }

  const currentSelectedKeys = value ?? selectedKeys ?? internalSelectedKeys;
  const currentOpenKeys = openKeys ?? internalOpenKeys;
  const visibleOpenKeys = inlineCollapsed ? [] : currentOpenKeys;
  const popupInlineCollapsed =
    inlineCollapsed &&
    collapseState.inlineCollapsed === inlineCollapsed &&
    collapseState.popupReady;

  useEffect(() => {
    if (inlineCollapsed) {
      collapseTimer.current = setTimeout(() => {
        setCollapseState((current) =>
          current.inlineCollapsed ? { ...current, popupReady: true } : current
        );
        collapseTimer.current = null;
      }, 200);
    }

    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    };
  }, [inlineCollapsed]);

  const selectedKeysChange = (key: string, selected: boolean, keyPath: string[]) => {
    const nextSelected = selected
      ? [...keyPath, key]
      : currentSelectedKeys.filter((itemKey) => itemKey !== key);

    setInternalSelectedKeys(nextSelected);
    onChange?.(nextSelected);
    onSelect?.({ key, keyPath });

    if (mode === "horizontal" || mode === "vertical" || inlineCollapsed) {
      setInternalOpenKeys([]);
      onOpenChange?.([]);
    }
    dropdownContext?.menuSelected?.({ key, keyPath });
  };

  const openKeysChange = (key: string, opened: boolean, keyPath: string[]) => {
    let nextOpenKeys: string[];
    if (accordion) {
      nextOpenKeys = opened ? [...keyPath, key] : keyPath;
    } else if (opened) {
      nextOpenKeys = currentOpenKeys.includes(key) ? currentOpenKeys : [...currentOpenKeys, key];
    } else {
      nextOpenKeys = currentOpenKeys.filter((itemKey) => itemKey !== key);
    }

    setInternalOpenKeys(nextOpenKeys);
    onOpenChange?.(nextOpenKeys);
  };

  const dropdown = dropdownContext != null;
  const menuState: MenuContextProps = {
    openKeys: visibleOpenKeys,
    selectedKeys: currentSelectedKeys,
    mode,
    inlineCollapsed,
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
      <ul className={cls} theme-mode={theme} style={style}>
        {items && items.length > 0
          ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
          : children}
      </ul>
    </MenuContext.Provider>
  );
};

export default Menu;
