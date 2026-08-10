import clsx from "clsx";
import { ChevronDown, ChevronRight, CircleX } from "kui-icons";
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
import type { CascaderOption, CascaderProps, CascaderValue } from "./types";

const EMPTY_OPTIONS: CascaderOption[] = [];

const pathFromValue = (options: CascaderOption[], value: CascaderValue) => {
  const path: CascaderOption[] = [];
  let current = options;
  for (const item of value) {
    const option = current.find((node) => node.value === item);
    if (!option) break;
    path.push(option);
    current = option.children ?? [];
  }
  return path;
};

export default function Cascader({
  value,
  modelValue,
  defaultValue = [],
  options: optionsProp,
  theme = "fill",
  bordered = true,
  shape,
  showArrow = true,
  placeholder = "请选择",
  icon,
  arrowIcon = ChevronDown,
  emptyText,
  disabled,
  clearable = true,
  size,
  expandTrigger = "click",
  showAllLevels = true,
  separator = " / ",
  placement = "bottom-left",
  onChange,
  onOpenChange,
  className,
  style,
  onClick,
  onKeyDown,
  ...rest
}: CascaderProps) {
  const options = optionsProp ?? EMPTY_OPTIONS;
  const controlledValue = modelValue ?? value;
  const [innerValue, setInnerValue] = useState<CascaderValue>(defaultValue);
  const currentValue = controlledValue ?? innerValue;
  const selectedPath = useMemo(() => pathFromValue(options, currentValue), [options, currentValue]);
  const [activePath, setActivePath] = useState<CascaderOption[]>(selectedPath);
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, minWidth: 0, origin: "top" });
  const selectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => setActivePath(selectedPath), [selectedPath]);

  const menus = useMemo(() => {
    const result: CascaderOption[][] = [options];
    for (const option of activePath) {
      if (!option.children?.length) break;
      result.push(option.children);
    }
    return result;
  }, [activePath, options]);

  const displayLabel =
    selectedPath
      .map((item) => item.label)
      .filter(Boolean)
      .join(showAllLevels ? separator : "") || "";
  const shownLabel = showAllLevels ? displayLabel : (selectedPath.at(-1)?.label ?? "");

  const updatePosition = useCallback(() => {
    const selection = selectionRef.current;
    if (!selection) return;
    const rect = selection.getBoundingClientRect();
    const above = placement.startsWith("top");
    const overlayWidth = overlayRef.current?.offsetWidth ?? rect.width;
    const overlayHeight = overlayRef.current?.offsetHeight ?? 0;
    let left = rect.left;
    if (placement.endsWith("right")) left = rect.right - overlayWidth;
    else if (placement === "top" || placement === "bottom")
      left = rect.left + (rect.width - overlayWidth) / 2;
    setPosition({
      left: left + window.scrollX,
      top: (above ? rect.top - overlayHeight : rect.bottom) + window.scrollY,
      minWidth: rect.width,
      origin: above ? "bottom" : "top",
    });
  }, [placement]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled || next === visible) return;
      if (next) {
        setRendered(true);
        setActivePath(selectedPath);
      }
      setVisible(next);
      onOpenChange?.(next);
    },
    [disabled, onOpenChange, selectedPath, visible]
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

  const choose = (option: CascaderOption, column: number, hover = false) => {
    if (option.disabled) return;
    const nextPath = [...activePath.slice(0, column), option];
    setActivePath(nextPath);
    if (!option.children?.length && !hover) {
      commit(nextPath.map((item) => item.value));
      setVisible(false);
      onOpenChange?.(false);
    }
  };

  const clear = (event: MouseEvent) => {
    event.stopPropagation();
    setActivePath([]);
    commit([]);
  };

  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (event.key === "Escape") setOpen(false);
    else if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(!visible);
    }
  };

  const hasValue = currentValue.length > 0;
  const showClear = clearable && !disabled && hasValue;
  const classes = clsx(
    "k-cascader",
    {
      "k-cascader-disabled": disabled,
      "k-cascader-opened": visible,
      "k-cascader-borderless": !bordered,
      "k-cascader-circle": shape === "circle",
      "k-cascader-square": shape === "square",
      "k-cascader-fill": theme === "fill",
      "k-cascader-lg": size === "large",
      "k-cascader-sm": size === "small",
      "k-cascader-has-clear": showClear,
    },
    className
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
          if (!event.defaultPrevented) setOpen(!visible);
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
      {rendered && (
        <Teleport to="body">
          <Transition show={visible} name="k-cascader" timeout={250} nodeRef={overlayRef}>
            <div
              ref={overlayRef}
              className={clsx("k-cascader-dropdown", {
                "k-cascader-dropdown-sm": size === "small",
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
                    <ul className="k-cascader-dropdown-menu k-scroll" key={column}>
                      {menu.map((item) => {
                        const hasChildren = !!item.children?.length;
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
                            onClick={() => choose(item, column)}
                            onMouseEnter={() => {
                              if (expandTrigger === "hover" && hasChildren)
                                choose(item, column, true);
                            }}
                          >
                            <span>{item.label}</span>
                            {hasChildren && (
                              <Icon className="k-cascader-item-arrow" type={ChevronRight} />
                            )}
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

export type { CascaderOption, CascaderProps, CascaderValue } from "./types";
