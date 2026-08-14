import clsx from "clsx";
import React, {
  Children,
  useEffect,
  useLayoutEffect,
  useMemo,
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
import SubMenu from "./sub-menu";

const overflowMenuKey = "__kui_menu_overflow__";

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
  defaultValue?: string[];
  selectedKeys?: string[];
  accordion?: boolean;
  items?: MenuOptionsProps[];
  inlineCollapsed?: boolean;
  openKeys?: string[];
  defaultOpenKeys?: string[];
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
  defaultValue = [],
  selectedKeys,
  accordion = false,
  items,
  inlineCollapsed = false,
  openKeys,
  defaultOpenKeys = [],
  onSelect,
  onOpenChange,
  onChange,
  children,
  className = "",
  style,
}) => {
  const dropdownContext = useDropdownContext();
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultValue);
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);
  const [collapseState, setCollapseState] = useState({
    inlineCollapsed,
    popupReady: inlineCollapsed,
  });
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const itemWidths = useRef<number[]>([]);
  const overflowWidth = useRef(0);
  const [visibleCount, setVisibleCount] = useState(Number.POSITIVE_INFINITY);

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
    keyPath = keyPath.filter((itemKey) => itemKey !== overflowMenuKey);
    const nextSelected = selected
      ? [...keyPath, key]
      : currentSelectedKeys.filter((itemKey) => itemKey !== key);

    if (value === undefined && selectedKeys === undefined) setInternalSelectedKeys(nextSelected);
    onChange?.(nextSelected);
    onSelect?.({ key, keyPath });

    if (mode === "horizontal" || mode === "vertical" || inlineCollapsed) {
      if (openKeys === undefined) setInternalOpenKeys([]);
      onOpenChange?.([]);
    }
    dropdownContext?.menuSelected?.({ key, keyPath });
  };

  const openKeysChange = (key: string, opened: boolean, keyPath: string[]) => {
    keyPath = keyPath.filter((itemKey) => itemKey !== overflowMenuKey);
    let nextOpenKeys: string[];
    if (accordion) {
      nextOpenKeys = opened ? [...keyPath, key] : keyPath;
    } else if (opened) {
      nextOpenKeys = currentOpenKeys.includes(key) ? currentOpenKeys : [...currentOpenKeys, key];
    } else {
      nextOpenKeys = currentOpenKeys.filter((itemKey) => itemKey !== key);
    }

    if (openKeys === undefined) setInternalOpenKeys(nextOpenKeys);
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
  const allChildren = useMemo(
    () =>
      items && items.length > 0
        ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
        : Children.toArray(children),
    [children, items]
  );
  const totalItems = allChildren.length;

  useLayoutEffect(() => {
    if (mode !== "horizontal" || totalItems === 0) {
      return;
    }
    itemWidths.current = [];

    let observer: ResizeObserver | undefined;
    let measureFrame = 0;
    const resetFrame = requestAnimationFrame(() => {
      setVisibleCount(Number.POSITIVE_INFINITY);
      measureFrame = requestAnimationFrame(() => {
        const updateOverflow = () => {
          const menu = menuRef.current;
          if (!menu) return;
          const elements = Array.from(menu.children) as HTMLElement[];
          if (itemWidths.current.length !== totalItems && elements.length >= totalItems) {
            itemWidths.current = elements
              .slice(0, totalItems)
              .map((element) => element.getBoundingClientRect().width);
          }
          if (elements.length > totalItems) {
            overflowWidth.current = elements.at(-1)?.getBoundingClientRect().width || 0;
          }
          if (itemWidths.current.length !== totalItems || overflowWidth.current === 0) return;

          const style = getComputedStyle(menu);
          const available =
            menu.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
          const gap = parseFloat(style.columnGap) || 0;
          const totalWidth =
            itemWidths.current.reduce((sum, width) => sum + width, 0) + gap * (totalItems - 1);
          if (totalWidth <= available) {
            setVisibleCount(totalItems);
            return;
          }
          let used = overflowWidth.current;
          let count = 0;
          for (const width of itemWidths.current) {
            const next = used + gap + width;
            if (next > available) break;
            used = next;
            count += 1;
          }
          setVisibleCount(count);
        };

        updateOverflow();
        observer = new ResizeObserver(updateOverflow);
        if (menuRef.current) observer.observe(menuRef.current);
      });
    });

    return () => {
      cancelAnimationFrame(resetFrame);
      cancelAnimationFrame(measureFrame);
      observer?.disconnect();
    };
  }, [mode, totalItems]);

  const horizontal = mode === "horizontal";
  const count = horizontal ? visibleCount : totalItems;
  const visibleChildren = allChildren.slice(0, count);
  const overflowChildren = allChildren.slice(count);
  const showOverflowMeasure = horizontal && !Number.isFinite(visibleCount);

  return (
    <MenuContext.Provider value={menuState}>
      <ul ref={menuRef} className={cls} theme-mode={theme} style={style}>
        {visibleChildren}
        {(showOverflowMeasure || overflowChildren.length > 0) && (
          <SubMenu itemKey={overflowMenuKey} title="...">
            {overflowChildren}
          </SubMenu>
        )}
      </ul>
    </MenuContext.Provider>
  );
};

export default Menu;
