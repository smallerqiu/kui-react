import clsx from "clsx";
import React, {
  Children,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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

export interface MenuProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "defaultValue" | "onChange" | "onSelect"
> {
  theme?: "light" | "dark";
  mode?: DirectionType;
  value?: string[];
  defaultValue?: string[];
  selectedKeys?: string[];
  accordion?: boolean;
  items?: MenuOptionsProps[];
  inlineCollapsed?: boolean;
  collapsedTooltip?: boolean;
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onSelect?: (data: MenuSelectEvent) => void;
  onOpenChange?: (openKeys: string[]) => void;
  onChange?: (selectedKeys: string[]) => void;
  children?: ReactNode;
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
  collapsedTooltip = true,
  openKeys,
  defaultOpenKeys = [],
  onSelect,
  onOpenChange,
  onChange,
  children,
  className = "",
  style,
  ...rest
}) => {
  const dropdownContext = useDropdownContext();
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultValue);
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);
  const [popupOpenKeys, setPopupOpenKeys] = useState<string[]>([]);
  const [collapseState, setCollapseState] = useState({
    inlineCollapsed,
    popupReady: inlineCollapsed,
  });
  const [inlineOpenVisible, setInlineOpenVisible] = useState(!inlineCollapsed);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseFrame = useRef(0);
  const menuRef = useRef<HTMLUListElement>(null);
  const itemWidths = useRef<number[]>([]);
  const overflowWidth = useRef(0);
  const [visibleCount, setVisibleCount] = useState(Number.POSITIVE_INFINITY);

  // --- tempOpenKeys: save/restore openKeys during mode switch & collapse ---
  // Using useState so React tracks changes and the value is available during render.
  const [tempOpenKeys, setTempOpenKeys] = useState<string[]>(openKeys ?? defaultOpenKeys);

  // Render-time change detection (React "adjusting state when prop changes" pattern)
  const [prevMode, setPrevMode] = useState(mode);
  const [prevInlineCollapsed, setPrevInlineCollapsed] = useState(inlineCollapsed);

  // Effect-time change detection (refs, only read/written inside effects)
  const prevCollapsedEffectRef = useRef(inlineCollapsed);

  // Sync collapseState when inlineCollapsed prop changes
  if (collapseState.inlineCollapsed !== inlineCollapsed) {
    setCollapseState({ inlineCollapsed, popupReady: false });
  }

  // Mode switch: save/restore openKeys (adjusting state during render)
  if (prevMode !== mode) {
    setPrevMode(mode);
    if (mode === "vertical") {
      const current = openKeys ?? internalOpenKeys;
      if (current.length > 0) setTempOpenKeys([...current]);
      if (openKeys === undefined) setInternalOpenKeys([]);
    } else if (!inlineCollapsed && tempOpenKeys.length > 0) {
      if (openKeys === undefined) setInternalOpenKeys([...tempOpenKeys]);
    }
  }

  // inlineCollapsed: save/restore openKeys (adjusting state during render)
  if (prevInlineCollapsed !== inlineCollapsed) {
    setPrevInlineCollapsed(inlineCollapsed);
    if (inlineCollapsed) {
      const current = openKeys ?? internalOpenKeys;
      if (current.length > 0) setTempOpenKeys([...current]);
      if (openKeys === undefined) setInternalOpenKeys([]);
    } else if (tempOpenKeys.length > 0) {
      if (openKeys === undefined) setInternalOpenKeys([...tempOpenKeys]);
    }
  }

  const currentSelectedKeys = value ?? selectedKeys ?? internalSelectedKeys;
  const currentOpenKeys = openKeys ?? internalOpenKeys;
  const popupInlineCollapsed =
    inlineCollapsed &&
    collapseState.inlineCollapsed === inlineCollapsed &&
    collapseState.popupReady;
  const visibleOpenKeys = popupInlineCollapsed
    ? popupOpenKeys
    : inlineOpenVisible
      ? currentOpenKeys
      : [];

  // Switching the collapsed presentation must not mutate controlled openKeys.
  // Keep the expanded path intact so it can be restored when inline mode returns.
  useEffect(() => {
    const changed = prevCollapsedEffectRef.current !== inlineCollapsed;
    prevCollapsedEffectRef.current = inlineCollapsed;

    if (changed) {
      cancelAnimationFrame(collapseFrame.current);
      collapseFrame.current = requestAnimationFrame(() => {
        setInlineOpenVisible(!inlineCollapsed);
        if (inlineCollapsed) setPopupOpenKeys([]);
      });
      if (inlineCollapsed) {
        collapseTimer.current = setTimeout(() => {
          setCollapseState((current) =>
            current.inlineCollapsed ? { ...current, popupReady: true } : current,
          );
          collapseTimer.current = null;
        }, 220);
      } else if (openKeys !== undefined && tempOpenKeys.length > 0) {
        onOpenChange?.([...tempOpenKeys]);
      }
    }

    return () => {
      cancelAnimationFrame(collapseFrame.current);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    };
  }, [inlineCollapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedKeysChange = (key: string, selected: boolean, keyPath: string[]) => {
    keyPath = keyPath.filter((itemKey) => itemKey !== overflowMenuKey);
    const nextSelected = selected
      ? [...keyPath, key]
      : currentSelectedKeys.filter((itemKey) => itemKey !== key);

    if (value === undefined && selectedKeys === undefined) setInternalSelectedKeys(nextSelected);
    onChange?.(nextSelected);
    onSelect?.({ key, keyPath });

    if (mode === "horizontal" || mode === "vertical" || inlineCollapsed) {
      if (inlineCollapsed) {
        setPopupOpenKeys([]);
        onOpenChange?.([]);
        dropdownContext?.menuSelected?.({ key, keyPath });
        return;
      }
      const current = openKeys ?? internalOpenKeys;
      if (current.length > 0) {
        setTempOpenKeys([...current]);
      }
      if (openKeys === undefined) setInternalOpenKeys([]);
      onOpenChange?.([]);
    }
    dropdownContext?.menuSelected?.({ key, keyPath });
  };

  const openKeysChange = (key: string, opened: boolean, keyPath: string[]) => {
    keyPath = keyPath.filter((itemKey) => itemKey !== overflowMenuKey);
    const sourceOpenKeys = inlineCollapsed ? popupOpenKeys : currentOpenKeys;
    let nextOpenKeys: string[];
    if (accordion) {
      nextOpenKeys = opened ? [...keyPath, key] : keyPath;
    } else if (opened) {
      nextOpenKeys = sourceOpenKeys.includes(key) ? sourceOpenKeys : [...sourceOpenKeys, key];
    } else {
      nextOpenKeys = sourceOpenKeys.filter((itemKey) => itemKey !== key);
    }

    if (inlineCollapsed) setPopupOpenKeys(nextOpenKeys);
    else if (openKeys === undefined) setInternalOpenKeys(nextOpenKeys);
    onOpenChange?.(nextOpenKeys);
  };

  const dropdown = dropdownContext != null;
  const menuState: MenuContextProps = {
    theme,
    openKeys: visibleOpenKeys,
    selectedKeys: currentSelectedKeys,
    mode,
    inlineCollapsed,
    collapsedTooltip,
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
    className,
  );
  const allChildren = useMemo(
    () =>
      items && items.length > 0
        ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
        : Children.toArray(children),
    [children, items],
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
      <ul
        {...rest}
        ref={menuRef}
        className={cls}
        theme-mode={theme}
        style={style}
        role="menu"
        aria-orientation={horizontal ? "horizontal" : "vertical"}
      >
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
