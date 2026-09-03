import clsx from "clsx";
import { ChevronDown, ChevronRight, CircleAlert, CircleX, Loading } from "kui-icons";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import Empty from "../empty";
import Icon from "../icon";
import { setPlacement } from "../utils/placement";
import type { CascaderOption, CascaderProps, CascaderValue } from "./types";

const EMPTY_OPTIONS: CascaderOption[] = [];

const pathFromValue = (
  options: CascaderOption[],
  value: CascaderValue,
  getChildren: (option: CascaderOption) => CascaderOption[],
) => {
  const path: CascaderOption[] = [];
  let current = options;
  for (const item of value) {
    const option = current.find((node) => node.value === item);
    if (!option) break;
    path.push(option);
    current = getChildren(option);
  }
  return path;
};

export default function Cascader({
  value,
  defaultValue = [],
  open: openProp,
  defaultOpen = false,
  options: optionsProp,
  theme = "fill",
  bordered = true,
  shape,
  showArrow = true,
  placeholder = "请选择",
  icon,
  arrowIcon = ChevronDown,
  emptyText,
  loadData,
  disabled,
  clearable = true,
  size,
  expandTrigger = "click",
  showAllLevels = true,
  separator = " / ",
  placement = "bottom-left",
  onChange,
  onExpandChange,
  onOpenChange,
  className,
  style,
  onClick,
  onKeyDown,
  ...rest
}: CascaderProps) {
  const options = optionsProp ?? EMPTY_OPTIONS;
  const controlledValue = value;
  const [innerValue, setInnerValue] = useState<CascaderValue>(defaultValue);
  const currentValue = controlledValue ?? innerValue;
  const [loadedChildren, setLoadedChildren] = useState(
    () => new Map<CascaderOption, CascaderOption[]>(),
  );
  const [loadingOptions, setLoadingOptions] = useState(() => new Set<CascaderOption>());
  const [failedOptions, setFailedOptions] = useState(() => new Set<CascaderOption>());
  const loadingRef = useRef(new Set<CascaderOption>());
  const mountedRef = useRef(true);
  const getOptionChildren = useCallback(
    (option: CascaderOption) => loadedChildren.get(option) ?? option.children ?? [],
    [loadedChildren],
  );
  const isExpandable = useCallback(
    (option: CascaderOption) =>
      getOptionChildren(option).length > 0 ||
      Boolean(loadData && option.isLeaf !== true && !loadedChildren.has(option)),
    [getOptionChildren, loadData, loadedChildren],
  );
  const selectedPath = useMemo(
    () => pathFromValue(options, currentValue, getOptionChildren),
    [currentValue, getOptionChildren, options],
  );
  const selectionKey = currentValue.map((item) => `${typeof item}:${item}`).join("\u0000");
  const [activeState, setActiveState] = useState({
    options,
    path: selectedPath,
    selectionKey,
  });
  const activePath =
    activeState.options === options && activeState.selectionKey === selectionKey
      ? activeState.path
      : selectedPath;
  const setActivePath = (path: CascaderOption[]) => {
    setActiveState({ options, path, selectionKey });
  };
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [activeColumn, setActiveColumn] = useState(0);
  const visible = openProp ?? innerOpen;
  const [rendered, setRendered] = useState(visible);
  const [position, setPosition] = useState({ left: 0, top: 0, minWidth: 0, origin: "top" });
  const selectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const currentPlacementRef = useRef(placement);
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const originRef = useRef("top");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const menus = useMemo(() => {
    const result: CascaderOption[][] = [options];
    for (const option of activePath) {
      const children = getOptionChildren(option);
      if (!children.length) break;
      result.push(children);
    }
    return result;
  }, [activePath, getOptionChildren, options]);

  const displayLabel =
    selectedPath
      .map((item) => item.label)
      .filter(Boolean)
      .join(showAllLevels ? separator : "") || "";
  const shownLabel = showAllLevels ? displayLabel : (selectedPath.at(-1)?.label ?? "");

  const updatePosition = useCallback(() => {
    const selection = selectionRef.current;
    if (!selection) return;
    currentPlacementRef.current = placement;
    setPlacement({
      refSelection: selectionRef,
      refPopper: overlayRef,
      currentPlacement: currentPlacementRef,
      transOrigin: originRef,
      top: topRef,
      left: leftRef,
    });
    setPosition({
      left: leftRef.current,
      top: topRef.current,
      minWidth: selection.offsetWidth,
      origin: originRef.current,
    });
  }, [placement]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled || next === visible) return;
      if (next) {
        setRendered(true);
        setActiveColumn(0);
      }
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [disabled, onOpenChange, openProp, visible],
  );

  useEffect(() => {
    if (!visible) return;
    requestAnimationFrame(updatePosition);
    const outside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (!selectionRef.current?.contains(target) && !overlayRef.current?.contains(target))
        setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [setOpen, updatePosition, visible]);

  useEffect(() => {
    if (visible) requestAnimationFrame(updatePosition);
  }, [activePath, updatePosition, visible]);

  const commit = (next: CascaderValue) => {
    if (controlledValue === undefined) setInnerValue(next);
    onChange?.(next);
  };

  const loadOption = async (option: CascaderOption, path: CascaderOption[]) => {
    if (!loadData || loadingRef.current.has(option)) return getOptionChildren(option);
    loadingRef.current.add(option);
    setLoadingOptions(new Set(loadingRef.current));
    setFailedOptions((current) => {
      const next = new Set(current);
      next.delete(option);
      return next;
    });
    try {
      const result = await loadData(option, path);
      const children = Array.isArray(result) ? result : (option.children ?? []);
      if (mountedRef.current) {
        setLoadedChildren((current) => new Map(current).set(option, children));
        requestAnimationFrame(updatePosition);
      }
      return children;
    } catch {
      if (mountedRef.current) setFailedOptions((current) => new Set(current).add(option));
      return [];
    } finally {
      loadingRef.current.delete(option);
      if (mountedRef.current) setLoadingOptions(new Set(loadingRef.current));
    }
  };

  const choose = (option: CascaderOption, column: number, hover = false) => {
    if (option.disabled) return;
    const nextPath = [...activePath.slice(0, column), option];
    setActivePath(nextPath);
    const children = getOptionChildren(option);
    const expandable = isExpandable(option);
    setActiveColumn(expandable ? column + 1 : column);
    if (expandable) onExpandChange?.(nextPath.map((item) => item.value));
    if (!expandable && !hover) {
      commit(nextPath.map((item) => item.value));
      setOpen(false);
    } else if (!children.length) {
      void loadOption(option, nextPath);
    }
  };

  const clear = (event: MouseEvent) => {
    event.stopPropagation();
    setActivePath([]);
    setActiveColumn(0);
    commit([]);
  };

  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (event.key === "Escape") {
      if (visible) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
    if (!visible && ["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const first = selectedPath.length
        ? selectedPath
        : options.filter((item) => !item.disabled).slice(0, 1);
      setActivePath(first);
      setOpen(true);
      return;
    }
    if (!visible) return;

    const column = Math.max(0, Math.min(activeColumn, menus.length - 1));
    const enabled = (menus[column] || []).filter((item) => !item.disabled);
    if (!enabled.length) return;
    const currentIndex = enabled.findIndex((item) => item.value === activePath[column]?.value);

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      let nextIndex: number;
      if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = enabled.length - 1;
      else if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % enabled.length;
      else nextIndex = currentIndex <= 0 ? enabled.length - 1 : currentIndex - 1;
      setActivePath([...activePath.slice(0, column), enabled[nextIndex]]);
      if (enabled[nextIndex].children?.length) {
        onExpandChange?.(
          [...activePath.slice(0, column), enabled[nextIndex]].map((item) => item.value),
        );
      }
    } else if (event.key === "ArrowLeft" && activePath.length > 1) {
      event.preventDefault();
      const nextPath = activePath.slice(0, column);
      setActiveColumn(Math.max(0, column - 1));
      setActivePath(nextPath);
      onExpandChange?.(nextPath.map((item) => item.value));
    } else if (event.key === "ArrowRight") {
      const option = activePath[column];
      const children = option ? getOptionChildren(option) : [];
      if (option && !children.length && isExpandable(option)) {
        event.preventDefault();
        void loadOption(option, activePath.slice(0, column + 1)).then((items) => {
          const first = items.find((item) => !item.disabled);
          if (first) {
            setActivePath([...activePath.slice(0, column + 1), first]);
            setActiveColumn(column + 1);
          }
        });
        return;
      }
      const first = children.find((item) => !item.disabled);
      if (first) {
        event.preventDefault();
        setActivePath([...activePath.slice(0, column + 1), first]);
        setActiveColumn(column + 1);
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = activePath[column] ?? enabled[0];
      const children = getOptionChildren(option);
      if (!children.length && isExpandable(option)) {
        void loadOption(option, activePath.slice(0, column + 1)).then((items) => {
          const first = items.find((item) => !item.disabled);
          if (first) {
            setActivePath([...activePath.slice(0, column + 1), first]);
            setActiveColumn(column + 1);
          }
        });
        return;
      }
      const first = children.find((item) => !item.disabled);
      if (first) {
        setActivePath([...activePath.slice(0, column + 1), first]);
        setActiveColumn(column + 1);
      } else choose(option, column);
    }
  };

  const hasValue = currentValue.length > 0;
  const showClear = clearable && !disabled && hasValue;
  const classes = clsx(
    "k-cascader",
    {
      "k-cascader-disabled": disabled,
      "k-cascader-opened": visible,
      "k-cascader-borderless": !bordered || theme === "plain",
      "k-cascader-circle": shape === "circle",
      "k-cascader-square": shape === "square",
      "k-cascader-fill": theme === "fill",
      "k-cascader-lg": size === "large",
      "k-cascader-sm": size === "small",
      "k-cascader-has-clear": showClear,
    },
    className,
  );

  return (
    <>
      <div
        {...rest}
        ref={selectionRef}
        className={classes}
        style={style}
        role="combobox"
        aria-expanded={visible}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={keyboard}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            if (!visible) setActivePath(selectedPath);
            setOpen(!visible);
          }
        }}
      >
        {icon && <Icon type={icon} className="k-cascader-icon" />}
        <div className="k-cascader-selection">
          {hasValue ? (
            <div className="k-cascader-label">{shownLabel}</div>
          ) : (
            <div className="k-cascader-placeholder">{placeholder}</div>
          )}
        </div>
        {showArrow && (
          <Icon
            className="k-cascader-arrow"
            type={arrowIcon}
            style={{ transform: visible ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        )}
        {showClear && <Icon className="k-cascader-clearable" onClick={clear} type={CircleX} />}
      </div>
      {(rendered || visible) && (
        <Teleport to="body">
          <Transition show={visible} name="k-cascader" timeout={250} nodeRef={overlayRef}>
            <div
              ref={overlayRef}
              className={clsx("k-cascader-dropdown", {
                "k-cascader-dropdown-sm": size === "small",
                "k-cascader-dropdown-lg": size === "large",
              })}
              style={{
                left: position.left,
                top: position.top,
                minWidth: position.minWidth,
                transformOrigin: position.origin,
              }}
            >
              {options.length ? (
                <div className="k-cascader-dropdown-menus">
                  {menus.map((menu, column) => (
                    <ul className="k-cascader-dropdown-menu k-scroll" role="listbox" key={column}>
                      {menu.map((item) => {
                        const hasChildren = isExpandable(item);
                        const isLoading = loadingOptions.has(item);
                        const isFailed = failedOptions.has(item);
                        return (
                          <li
                            className={clsx("k-cascader-dropdown-item", {
                              "k-cascader-dropdown-item-active":
                                activePath[column]?.value === item.value,
                              "k-cascader-dropdown-item-selected":
                                currentValue[column] === item.value,
                              "k-cascader-dropdown-item-disabled": item.disabled,
                            })}
                            key={item.value}
                            role="option"
                            aria-disabled={item.disabled}
                            aria-selected={currentValue[column] === item.value}
                            onClick={() => choose(item, column)}
                            onMouseEnter={() => {
                              if (expandTrigger === "hover" && hasChildren)
                                choose(item, column, true);
                            }}
                          >
                            <span>{item.label}</span>
                            {isLoading ? (
                              <Icon className="k-cascader-item-arrow" type={Loading} spin />
                            ) : isFailed ? (
                              <Icon className="k-cascader-item-arrow" type={CircleAlert} />
                            ) : hasChildren ? (
                              <Icon className="k-cascader-item-arrow" type={ChevronRight} />
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  ))}
                </div>
              ) : (
                <Empty description={emptyText} />
              )}
            </div>
          </Transition>
        </Teleport>
      )}
    </>
  );
}

export type { CascaderLoadData, CascaderOption, CascaderProps, CascaderValue } from "./types";
