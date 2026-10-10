import { useValue } from "../utils/use-value";
import clsx from "clsx";
import React, {
  useCallback,
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
import { getChildren } from "../utils/react-node";

const overflowMenuKey = "__kui_menu_overflow__";

// Shared empty array so "no visible open keys" keeps a stable identity.
const EMPTY_KEYS: string[] = [];

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
  "defaultValue" | "onChange" | "onSelect" | "defaultChecked"
> {
  theme?: "light" | "dark";
  mode?: DirectionType;
  value?: string[];
  selectedKeys?: string[];
  accordion?: boolean;
  items?: MenuOptionsProps[];
  inlineCollapsed?: boolean;
  collapsedTooltip?: boolean;
  openKeys?: string[];
  onSelect?: (data: MenuSelectEvent) => void;
  onOpenChange?: (openKeys: string[]) => void;
  onChange?: (selectedKeys: string[]) => void;
  children?: ReactNode;
}

export const Menu: React.FC<MenuProps> = ({
  theme,
  mode = "vertical",
  value,
  selectedKeys,
  accordion = false,
  items,
  inlineCollapsed = false,
  collapsedTooltip = true,
  openKeys,
  onSelect,
  onOpenChange,
  onChange,
  children,
  className = "",
  style,
  ...rest
}) => {
  // `inlineCollapsed` only collapses an inline menu; horizontal and vertical
  // menus are popup based, so the flag must not change their presentation.
  const collapsedInline = mode === "inline" && inlineCollapsed;
  const dropdownContext = useDropdownContext();
  const [internalSelectedKeys, setInternalSelectedKeys] = useValue(
    value,
    (next): string[] => next ?? [],
  );
  const [internalOpenKeys, setInternalOpenKeys] = useValue(
    openKeys,
    (next): string[] => next ?? [],
  );
  const [popupOpenKeys, setPopupOpenKeys] = useState<string[]>([]);
  const [collapseState, setCollapseState] = useState({
    inlineCollapsed: collapsedInline,
    popupReady: collapsedInline,
  });
  const [inlineOpenVisible, setInlineOpenVisible] = useState(!collapsedInline);
  const [inlineTransition, setInlineTransition] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseFrame = useRef(0);
  const menuRef = useRef<HTMLUListElement>(null);
  const itemWidths = useRef<number[]>([]);
  const overflowWidth = useRef(0);
  const [visibleCount, setVisibleCount] = useState(Number.POSITIVE_INFINITY);

  // --- tempOpenKeys: save/restore openKeys while the inline menu is collapsed ---
  // Using useState so React tracks changes and the value is available during render.
  const [tempOpenKeys, setTempOpenKeys] = useState<string[]>(openKeys ?? []);

  // Render-time change detection (React "adjusting state when prop changes" pattern)
  const [prevInlineCollapsed, setPrevInlineCollapsed] = useState(inlineCollapsed);

  // Effect-time change detection (refs, only read/written inside effects)
  const prevCollapsedEffectRef = useRef(collapsedInline);

  // Sync collapseState when the collapsed presentation changes
  if (collapseState.inlineCollapsed !== collapsedInline) {
    setCollapseState({ inlineCollapsed: collapsedInline, popupReady: false });
  }

  // Collapsing hides the inline expansion, expanding restores it. This memory is
  // driven only by the `inlineCollapsed` prop while the menu is inline: switching
  // `mode` never rewrites it, and a menu the user closed by hand stays closed.
  if (prevInlineCollapsed !== inlineCollapsed) {
    setPrevInlineCollapsed(inlineCollapsed);
    if (mode === "inline") {
      setInlineTransition(true);
      if (collapsedInline) {
        if (!inlineTransition) setTempOpenKeys([...internalOpenKeys]);
        setInternalOpenKeys([]);
      } else if (tempOpenKeys.length > 0) {
        setInternalOpenKeys([...tempOpenKeys]);
      }
    }
  }

  // While the inline menu is collapsed the visible expansion is the transient popup
  // path, so an external `openKeys` update cannot be applied to the hidden inline path —
  // it restates the intended expansion, and that lives in the collapse memory until the
  // menu widens again. Outside inline mode the prop drives popups directly (useValue).
  const [prevOpenKeysProp, setPrevOpenKeysProp] = useState(openKeys);
  if (openKeys !== prevOpenKeysProp) {
    setPrevOpenKeysProp(openKeys);
    // A collapsed popup's own `onOpenChange` comes back down as a prop update. That value
    // is the transient hover path rather than a new expansion intent, so it must not
    // overwrite the memory the menu restores when it widens again.
    const popupEcho =
      openKeys !== undefined &&
      openKeys.length === popupOpenKeys.length &&
      openKeys.every((key, index) => key === popupOpenKeys[index]);
    if (collapsedInline && !popupEcho) setTempOpenKeys(openKeys ? [...openKeys] : []);
  }

  const currentSelectedKeys =
    value === undefined && selectedKeys !== undefined ? selectedKeys : internalSelectedKeys;
  const currentOpenKeys = internalOpenKeys;
  const popupInlineCollapsed =
    collapsedInline &&
    collapseState.inlineCollapsed === collapsedInline &&
    collapseState.popupReady;
  const visibleOpenKeys = popupInlineCollapsed
    ? popupOpenKeys
    : inlineOpenVisible
      ? currentOpenKeys
      : EMPTY_KEYS;

  // Preserve the expanded path across collapsed presentation changes.
  // Keep the expanded path intact so it can be restored when inline mode returns.
  useEffect(() => {
    const changed = prevCollapsedEffectRef.current !== collapsedInline;
    prevCollapsedEffectRef.current = collapsedInline;

    if (changed) {
      cancelAnimationFrame(collapseFrame.current);
      collapseFrame.current = requestAnimationFrame(() => {
        setInlineOpenVisible(!collapsedInline);
        if (collapsedInline) setPopupOpenKeys([]);
      });
      if (collapsedInline) {
        collapseTimer.current = setTimeout(() => {
          setCollapseState((current) =>
            current.inlineCollapsed ? { ...current, popupReady: true } : current,
          );
          setInlineTransition(false);
          collapseTimer.current = null;
        }, 220);
      } else {
        collapseTimer.current = setTimeout(() => {
          setInlineTransition(false);
          collapseTimer.current = null;
        }, 350);
        // Mirror the render-time restore above: report the remembered path back
        // only when the menu really returns to an expanded inline presentation.
        if (openKeys !== undefined && mode === "inline" && tempOpenKeys.length > 0) {
          onOpenChange?.([...tempOpenKeys]);
        }
      }
    }

    return () => {
      cancelAnimationFrame(collapseFrame.current);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    };
  }, [collapsedInline]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers keep a stable identity so consumers' memos and hover timers are not
  // rebuilt on every render; the values they act on are read from this ref.
  const latest = useRef({
    mode,
    collapsedInline,
    value,
    selectedKeys,
    accordion,
    currentSelectedKeys,
    currentOpenKeys,
    popupOpenKeys,
    tempOpenKeys,
    onSelect,
    onOpenChange,
    onChange,
    // The setters keep their own identity across renders, so they are captured once
    // here and merged back in below instead of being rewritten every commit.
    setInternalSelectedKeys,
    setInternalOpenKeys,
    setPopupOpenKeys,
    menuSelected: dropdownContext?.menuSelected,
  });
  useLayoutEffect(() => {
    latest.current = {
      ...latest.current,
      mode,
      collapsedInline,
      value,
      selectedKeys,
      accordion,
      currentSelectedKeys,
      currentOpenKeys,
      popupOpenKeys,
      tempOpenKeys,
      onSelect,
      onOpenChange,
      onChange,
      menuSelected: dropdownContext?.menuSelected,
    };
    // No dependency list: mirroring the newest render into the ref after every
    // commit is the whole point of this pattern.
  });

  const selectedKeysChange = useCallback((key: string, selected: boolean, rawKeyPath: string[]) => {
    const state = latest.current;
    const keyPath = rawKeyPath.filter((itemKey) => itemKey !== overflowMenuKey);
    const nextSelected = selected
      ? [...keyPath, key]
      : state.currentSelectedKeys.filter((itemKey) => itemKey !== key);

    if (state.value !== undefined || state.selectedKeys === undefined) {
      state.setInternalSelectedKeys(nextSelected);
    }
    state.onChange?.(nextSelected);
    state.onSelect?.({ key, keyPath });

    // Selecting closes the popups that drove the click, and only an actually open
    // popup is reported closed so `onOpenChange` listeners never see a spurious [].
    if (state.collapsedInline) {
      if (state.popupOpenKeys.length > 0) {
        state.setPopupOpenKeys([]);
        state.onOpenChange?.([]);
      }
    } else if (state.mode !== "inline" && state.currentOpenKeys.length > 0) {
      state.setInternalOpenKeys([]);
      state.onOpenChange?.([]);
    }
    state.menuSelected?.({ key, keyPath });
  }, []);

  const openKeysChange = useCallback((key: string, opened: boolean, rawKeyPath: string[]) => {
    const state = latest.current;
    const keyPath = rawKeyPath.filter((itemKey) => itemKey !== overflowMenuKey);
    const sourceOpenKeys = state.collapsedInline ? state.popupOpenKeys : state.currentOpenKeys;
    let nextOpenKeys: string[];
    if (state.accordion) {
      nextOpenKeys = opened ? [...keyPath, key] : keyPath;
    } else if (opened) {
      nextOpenKeys = sourceOpenKeys.includes(key) ? sourceOpenKeys : [...sourceOpenKeys, key];
    } else {
      nextOpenKeys = sourceOpenKeys.filter((itemKey) => itemKey !== key);
    }

    if (state.collapsedInline) state.setPopupOpenKeys(nextOpenKeys);
    else state.setInternalOpenKeys(nextOpenKeys);
    state.onOpenChange?.(nextOpenKeys);
  }, []);

  const dropdown = dropdownContext != null;
  const menuState: MenuContextProps = useMemo(
    () => ({
      theme,
      openKeys: visibleOpenKeys,
      selectedKeys: currentSelectedKeys,
      mode,
      inlineCollapsed,
      collapsedTooltip,
      popupInlineCollapsed,
      inlineTransition,
      inlineOpenKeys: tempOpenKeys,
      dropdown,
      openKeysChange,
      selectedKeysChange,
    }),
    [
      theme,
      visibleOpenKeys,
      currentSelectedKeys,
      mode,
      inlineCollapsed,
      collapsedTooltip,
      popupInlineCollapsed,
      inlineTransition,
      tempOpenKeys,
      dropdown,
      openKeysChange,
      selectedKeysChange,
    ],
  );
  const preCls = dropdown ? "dropdown-menu" : "menu";
  const cls = clsx(
    `k-${preCls}`,
    `k-${preCls}-${mode}`,
    { "k-scroll": dropdown },
    collapsedInline && `k-${preCls}-inline-collapsed`,
    className,
  );
  const allChildren = useMemo(
    () =>
      items && items.length > 0
        ? items.map((item) => <RecursiveMenu item={item} key={item.key} />)
        : getChildren(children),
    [children, items],
  );
  const totalItems = allChildren.length;

  useLayoutEffect(() => {
    // Outside horizontal mode `visibleCount` is ignored during render, and an empty
    // menu has nothing to measure. Re-entering horizontal mode re-runs this effect
    // and starts from a fresh full-width measurement, so no reset is needed here.
    if (mode !== "horizontal" || totalItems === 0) return;
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
  // An empty menu has nothing to overflow, so it must not render the measure trigger.
  const showOverflowMeasure = horizontal && totalItems > 0 && !Number.isFinite(visibleCount);

  return (
    <MenuContext.Provider value={menuState}>
      <ul
        {...rest}
        ref={menuRef}
        className={cls}
        theme-mode={theme}
        style={style}
        // A horizontal bar moves focus left/right between siblings (see menu-keyboard),
        // which is the `menubar` contract; vertical and inline menus keep `menu`.
        role={horizontal ? "menubar" : "menu"}
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
