import clsx from "clsx";
import { ChevronDown, CircleX, Loading, X } from "kui-icons";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { ConfigContext } from "../config";
import Empty from "../empty";
import Icon, { type IconType } from "../icon";
import zhCN from "../locale/zh-CN";
import { isEmpty } from "../utils/number";
import { setPlacement } from "../utils/placement";
import { getChildren } from "../utils/react-node";
import Option, { type OptionSelectEvent } from "./option";

import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";

export interface SelectOption {
  label: string | number;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "onSelect"
> {
  placeholder?: string;
  size?: SizeType;
  placement?: DropPlacementsType;
  width?: number;
  maxTagCount?: number;
  value?: string | number | any[];
  modelValue?: string | number | any[]; // For backward compatibility
  clearable?: boolean;
  filterable?: boolean;
  block?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  loading?: boolean;
  bordered?: boolean;
  showArrow?: boolean;
  options?: SelectOption[];
  theme?: ThemeType;
  emptyText?: string;
  loadingText?: string;
  icon?: IconType[];
  shape?: ShapeType;
  arrowIcon?: IconType[];
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (value: string | number | string[] | number[]) => void;
  onSelect?: (option: SelectOption & { selected: boolean }) => void;
  onOpenChange?: (opened: boolean) => void;
  children?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  placeholder,
  size,
  placement = "bottom-left",
  width,
  maxTagCount,
  value,
  modelValue,
  clearable = true,
  filterable = false,
  block = false,
  disabled = false,
  multiple = false,
  loading = false,
  bordered = true,
  showArrow = true,
  options,
  theme = "fill",
  emptyText,
  loadingText,
  icon,
  shape,
  arrowIcon,
  onSearch,
  onChange,
  onSelect,
  onOpenChange,
  children,
  className = "",
  style,
  ...rest
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;

  const initialValue = modelValue !== undefined ? modelValue : value;

  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [currentValue, setCurrentValue] = useState<any[]>(
    multiple ? ((initialValue || []) as any[]) : isEmpty(initialValue) ? [] : [initialValue]
  );

  const [queryInputVisible, setQueryInputVisible] = useState(false);
  const [queryKey, setQueryKey] = useState("");
  const [minWidth, setMinWidth] = useState(0);
  const [queryInputFocused, setQueryInputFocused] = useState(false);
  const transOrigin = useRef("bottom");
  const left = useRef(0);
  const top = useRef(0);
  const currentPlacement = useRef(placement);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [ctxFocused, setCtxFocused] = useState(false);

  const refPopper = useRef<HTMLDivElement>(null);
  const refSelection = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);
  const queryInputMirrorRef = useRef<HTMLSpanElement>(null);
  const queryInputEventTimer = useRef<NodeJS.Timeout | null>(null);

  const hasSearchEvent = !!onSearch;

  // Sync value with prop
  useEffect(() => {
    const val = modelValue !== undefined ? modelValue : value;
    setCurrentValue(multiple ? ((val || []) as any[]) : isEmpty(val) ? [] : [val]);
  }, [value, modelValue, multiple]);

  // Update placement position
  const updatePosition = () => {
    if (!refSelection.current || !refPopper.current) return;

    setMinWidth(refSelection.current.offsetWidth);

    const placementObj = { value: currentPlacement };
    const originObj = { value: transOrigin };
    const topObj = { value: top };
    const leftObj = { value: left };

    setPlacement({
      refSelection,
      refPopper,
      currentPlacement,
      transOrigin,
      top: topObj,
      left: leftObj,
    });

    setCurrentPlacement(placementObj.value as DropPlacementsType);
    setTransOrigin(originObj.value);
    setTop(topObj.value);
    setLeft(leftObj.value);
  };

  useEffect(() => {
    if (visible) {
      updatePosition();
    }
  }, [visible, placement]);

  // Position ResizeObserver
  useEffect(() => {
    if (!visible || !refSelection.current) return;
    const observer = new ResizeObserver(() => {
      updatePosition();
    });
    observer.observe(refSelection.current);
    return () => {
      observer.disconnect();
    };
  }, [visible]);

  // Handle outside click
  const outsideClick = (e: MouseEvent) => {
    const ctx = refSelection.current;
    if (
      refPopper.current &&
      !refPopper.current.contains(e.target as Node) &&
      ctx &&
      !ctx.contains(e.target as Node)
    ) {
      setVisible(false);
      onOpenChange?.(false);
      clearQuery();
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("click", outsideClick);
    } else {
      document.removeEventListener("click", outsideClick);
    }
    return () => {
      document.removeEventListener("click", outsideClick);
    };
  }, [visible]);

  const optionsData = useMemo(() => {
    if (loading) return [];
    if (options && options.length > 0) {
      return options;
    }

    const data: SelectOption[] = [];
    const childList = getChildren(children);

    childList.forEach((child: any) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as any;
        const { label, value: val, disabled: d } = childProps;
        const resolvedLabel = label || childProps.children || val;
        data.push({
          value: val,
          disabled: d,
          label: resolvedLabel,
        });
      }
    });
    return data;
  }, [options, loading, children]);

  const reallySize = useMemo(() => {
    const key = queryKey;
    const filter = filterable && key.trim() !== "";
    return filter
      ? optionsData.filter((item) => String(item.label).toLowerCase().includes(key.toLowerCase()))
          .length
      : optionsData.length;
  }, [optionsData, queryKey, filterable]);

  const scrollOptionIntoView = (index: number) => {
    const containerEl = refPopper.current;
    if (!containerEl || !containerEl.children[0]) return;
    const listEl = containerEl.children[0];
    const optionEl = listEl.children[index] as HTMLElement;
    if (!optionEl) return;

    const optionTop = optionEl.offsetTop;
    const optionHeight = optionEl.offsetHeight;
    const containerHeight = containerEl.clientHeight;

    const targetScroll = optionTop - containerHeight / 2 + optionHeight / 2;
    containerEl.scrollTop = targetScroll;
  };

  // Keyboard navigation
  const onKeydown = (e: KeyboardEvent) => {
    if ((!visible || optionsData.length === 0) && ctxFocused) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        toggle();
      }
      return;
    }
    if (visible) {
      if (e.key === "ArrowDown") {
        let index = activeIndex;
        if (index < reallySize - 1) {
          index += 1;
        } else {
          index = 0;
        }
        setActiveIndex(index);
        scrollOptionIntoView(index);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        let index = activeIndex;
        if (index >= 1) {
          index -= 1;
        } else {
          index = reallySize - 1;
        }
        setActiveIndex(index);
        scrollOptionIntoView(index);
        e.preventDefault();
      } else if (e.key === "Enter" && activeIndex >= 0 && (ctxFocused || queryInputFocused)) {
        const filtered = filterOptions();
        const item = filtered[activeIndex];
        if (item) {
          handleSelect({ label: item.label, value: item.value });
        }
        e.preventDefault();
      } else if (e.key === "Escape" && (ctxFocused || queryInputFocused)) {
        setVisible(false);
        onOpenChange?.(false);
        clearQuery();
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      onKeydown(e);
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [visible, activeIndex, optionsData, reallySize, ctxFocused, queryInputFocused, queryKey]);

  const labelText = useMemo(() => {
    if (!optionsData || optionsData.length === 0) {
      return [];
    }
    const lookup = new Map<string | number, string | number>();
    optionsData.forEach((item) => {
      lookup.set(item.value, item.label);
    });
    return currentValue.map((val) => lookup.get(val) ?? val);
  }, [optionsData, currentValue]);

  const isChecked = (val: string | number) => {
    if (multiple) {
      return currentValue.indexOf(val) >= 0;
    } else {
      return !isEmpty(currentValue) && currentValue[0] === val;
    }
  };

  const clearQuery = () => {
    setActiveIndex(-1);
    if (filterable || hasSearchEvent) {
      setTimeout(() => {
        setQueryKey("");
        if (queryInputRef.current) {
          queryInputRef.current.value = "";
          queryInputRef.current.style.width = "";
        }
        setQueryInputVisible(false);
      }, 300);
    }
  };

  const onMouseenter = (index: number) => {
    setActiveIndex(index);
  };

  const handleSelect = (item: OptionSelectEvent) => {
    const { value: val, label: lbl } = item;
    let selected = true;
    let nextValue = [...currentValue];

    if (multiple) {
      const idx = nextValue.indexOf(val);
      if (idx >= 0) {
        selected = false;
        nextValue = nextValue.filter((v) => v !== val);
      } else {
        nextValue.push(val);
      }
      setTimeout(updatePosition, 0);
      if (hasSearchEvent || filterable) {
        if (queryInputRef.current) {
          queryInputRef.current.value = "";
          queryInputRef.current.style.width = "";
        }
        setQueryKey("");
        showQuery();
      }
    } else {
      nextValue = [val];
      setVisible(false);
      onOpenChange?.(false);
      clearQuery();
      setActiveIndex(-1);
    }

    if (value === undefined && modelValue === undefined) {
      setCurrentValue(nextValue);
    }

    const outputValue = multiple ? nextValue : nextValue[0];
    onChange?.(outputValue);
    onSelect?.({ value: val, label: lbl, selected });
  };

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const v = target.value;
    setQueryKey(v);
    setActiveIndex(-1);

    setTimeout(() => {
      if (queryInputMirrorRef.current && queryInputRef.current) {
        queryInputRef.current.style.width = `${queryInputMirrorRef.current.offsetWidth}px`;
      }
      updatePosition();
    }, 0);

    if (hasSearchEvent) {
      if (queryInputEventTimer.current) clearTimeout(queryInputEventTimer.current);
      queryInputEventTimer.current = setTimeout(() => {
        setRendered(true);
        setVisible(true);
        onOpenChange?.(true);
        setTimeout(updatePosition, 0);
        onSearch?.(e);
      }, 500);
    }
  };

  const emptyClick = () => {
    if (queryInputVisible) {
      setTimeout(() => {
        queryInputRef.current?.focus();
        setQueryInputFocused(true);
      });
    }
  };

  const removeTag = (e: React.MouseEvent, index: number) => {
    if (disabled) return;
    e.stopPropagation();

    const nextValue = [...currentValue];
    nextValue.splice(index, 1);

    if (value === undefined && modelValue === undefined) {
      setCurrentValue(nextValue);
    }
    onChange?.(multiple ? nextValue : nextValue[0]);
    setTimeout(updatePosition, 0);
  };

  const onClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextValue: any[] = [];
    if (value === undefined && modelValue === undefined) {
      setCurrentValue(nextValue);
    }
    onChange?.(multiple ? nextValue : (undefined as any));
    clearQuery();
  };

  const showQuery = () => {
    if (filterable || hasSearchEvent) {
      setQueryInputVisible(true);
      setTimeout(() => {
        queryInputRef.current?.focus();
        setQueryInputFocused(true);
      }, 0);
    }
  };

  const toggle = (show: boolean | null = null) => {
    if (disabled) return;

    if (hasSearchEvent) {
      showQuery();
      return;
    }

    if (!rendered) {
      setRendered(true);
      setVisible(true);
      onOpenChange?.(true);
      setTimeout(() => {
        updatePosition();
        showQuery();
      }, 0);
    } else {
      const nextVisible = show !== null ? show : !visible;
      setVisible(nextVisible);
      onOpenChange?.(nextVisible);
      if (nextVisible) {
        setTimeout(() => {
          updatePosition();
          showQuery();
        }, 0);
      } else {
        clearQuery();
      }
    }
  };

  const filterOptions = () => {
    const key = queryKey;
    const filter = filterable && key.trim() !== "";
    return filter
      ? optionsData.filter((item) => String(item.label).toLowerCase().includes(key.toLowerCase()))
      : optionsData;
  };

  const renderOptions = () => {
    const nodes = filterOptions();
    return nodes.map((item, index) => {
      const { label, value: val, disabled: d } = item;
      const checked = isChecked(val);
      return (
        <Option
          onSelect={handleSelect}
          onMouseEnter={() => onMouseenter(index)}
          key={`${val}-${label}`}
          active={activeIndex === index}
          value={val}
          label={label}
          disabled={d}
          checked={checked}
          multiple={multiple}
        />
      );
    });
  };

  const queryKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (queryKey === "" && multiple && currentValue.length > 0) {
        const nextValue = currentValue.slice(0, -1);
        if (value === undefined && modelValue === undefined) {
          setCurrentValue(nextValue);
        }
        onChange?.(nextValue);
        setTimeout(updatePosition, 0);
      }
    }
  };

  const showClear = clearable && !disabled && !isEmpty(currentValue) && !isEmpty(labelText);

  const renderOverlay = () => {
    if (!rendered) return null;

    const optionNodes = renderOptions();
    const popperProps = {
      ref: refPopper,
      style: {
        minWidth: `${minWidth}px`,
        left: `${left}px`,
        top: `${top}px`,
        transformOrigin: transOrigin,
      } as React.CSSProperties,
      className: clsx("k-select-dropdown", "k-scroll", {
        "k-select-dropdown-multiple": multiple,
        "k-select-dropdown-sm": size === "small",
      }),
    };

    const loadingNode = (
      <div className="k-select-loading">
        <Icon type={Loading} spin />
        <span>{locale?.k?.select?.loading}</span>
      </div>
    );

    const overlay = (
      <div {...popperProps}>
        {loading ? (
          loadingNode
        ) : optionNodes.length ? (
          <ul>{optionNodes}</ul>
        ) : (
          <Empty onClick={emptyClick} description={emptyText || locale?.k?.select?.emptyText} />
        )}
      </div>
    );

    return (
      <Teleport to="body">
        <Transition show={visible} name="k-select" ref={refPopper}>
          {overlay}
        </Transition>
      </Teleport>
    );
  };

  const finalArrowIcon = arrowIcon || ChevronDown;

  const queryInputProps = {
    ref: queryInputRef,
    className: "k-select-search",
    autoComplete: "off",
    onChange: (e: any) => e.stopPropagation(),
    onKeyDown: queryKeydown,
    onInput: searchInput as any,
    onBlur: () => {
      if (!visible) {
        setQueryInputVisible(false);
      }
      setQueryInputFocused(false);
    },
  };

  const queryNode = (
    <div
      style={{ display: queryInputVisible ? undefined : "none" }}
      key="search"
      className="k-select-search-wrap"
    >
      <input {...queryInputProps} />
      <span className="k-select-search-mirror" ref={queryInputMirrorRef}>
        {queryKey}
      </span>
    </div>
  );

  const placeholderText = placeholder || locale?.k?.select?.placeholder;
  const placeNode =
    placeholderText && isEmpty(labelText) && !queryKey ? (
      <div className="k-select-placeholder" key="placeholder">
        {placeholderText}
      </div>
    ) : null;

  const renderTags = () => {
    let tags = labelText.map((label, i) => {
      return (
        <span className="k-select-tag" key={`${label}-${i}`}>
          {label}
          <Icon type={X} onClick={(e) => removeTag(e, i)} />
        </span>
      );
    });
    if (maxTagCount && maxTagCount > 0 && tags.length > maxTagCount) {
      const sliced = tags.slice(0, maxTagCount);
      sliced.push(
        <span className="k-select-tag" key="tag-more">
          +{labelText.length - maxTagCount}...
        </span>
      );
      return sliced;
    }
    return tags;
  };

  const labelsNode = multiple ? (
    <div className="k-select-labels" key="labels">
      {renderTags()}
      {queryNode}
    </div>
  ) : (
    <div
      key="label"
      className="k-select-label"
      style={{ display: !isEmpty(labelText) && !queryKey.length ? undefined : "none" }}
    >
      {labelText[0]}
    </div>
  );

  const childNode: React.ReactNode[] = [labelsNode];
  if (placeNode) childNode.push(placeNode);

  if ((filterable || hasSearchEvent) && !multiple) {
    childNode.push(queryNode);
  }

  const rootStyles: React.CSSProperties = { ...style };
  if (width) {
    rootStyles.width = `${width}px`;
  }

  const arrowNode =
    !hasSearchEvent && showArrow ? <Icon className="k-select-arrow" type={finalArrowIcon} /> : null;

  const rootClasses = clsx(
    "k-select",
    {
      "k-select-disabled": disabled,
      "k-select-block": block,
      "k-select-opened": visible,
      "k-select-borderless": bordered === false,
      "k-select-lg": size === "large",
      "k-select-sm": size === "small",
      "k-select-fill": theme === "fill",
      "k-select-has-icon": icon,
      "k-select-circle": shape === "circle" && !multiple,
      "k-select-square": shape === "square",
      "k-select-multiple": multiple,
      "k-select-show-search": queryInputFocused,
      "k-select-show-tags": multiple && !isEmpty(labelText),
      "k-select-has-clear": showClear,
    },
    className
  );

  const clearNode = showClear ? (
    <Icon className="k-select-clearable" type={CircleX} onClick={onClear} />
  ) : null;

  return (
    <div
      tabIndex={disabled ? undefined : 0}
      className={rootClasses}
      style={rootStyles}
      onClick={() => toggle()}
      onFocus={() => setCtxFocused(true)}
      onBlur={() => setCtxFocused(false)}
      ref={refSelection}
      {...rest}
    >
      {icon ? <Icon type={icon} className="k-select-icon" /> : null}
      <div className="k-select-selection">{childNode}</div>
      <span className="k-select-suffix">
        {arrowNode}
        {clearNode}
      </span>
      {renderOverlay()}
    </div>
  );
};

export default Select;
