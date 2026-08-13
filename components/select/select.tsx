import clsx from "clsx";
import { ChevronDown, CircleX, Loading, X } from "kui-icons";
import React, { useContext, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { ConfigContext } from "../config/config-context";
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
export type SelectValue = string | number | (string | number)[] | undefined;
type SelectPrimitive = string | number;

const normalizeValue = (value: SelectValue): SelectPrimitive[] => {
  if (Array.isArray(value)) return value;
  return typeof value === "string" || typeof value === "number" ? [value] : [];
};

export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "onSelect" | "defaultValue"
> {
  placeholder?: string;
  size?: SizeType;
  placement?: DropPlacementsType;
  width?: number;
  maxTagCount?: number;
  value?: SelectValue;
  defaultValue?: SelectValue;
  open?: boolean;
  defaultOpen?: boolean;
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
  onChange?: (value: SelectValue) => void;
  onSelect?: (option: SelectOption & { selected: boolean }) => void;
  onClear?: () => void;
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
  defaultValue,
  open: openProp,
  defaultOpen = false,
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
  onClear: onClearCallback,
  onOpenChange,
  children,
  className = "",
  style,
  ...rest
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;

  const [innerVisible, setInnerVisible] = useState(defaultOpen);
  const visible = openProp ?? innerVisible;
  const setVisible = (next: boolean) => {
    if (openProp === undefined) setInnerVisible(next);
  };
  const [rendered, setRendered] = useState(visible);
  if (visible && !rendered) setRendered(true);
  const [internalValue, setInternalValue] = useState<(string | number)[]>(
    multiple
      ? (Array.isArray(defaultValue) ? defaultValue : [])
      : normalizeValue(defaultValue)
  );
  const controlled = value !== undefined;
  const controlledValue = value;
  const currentValue = useMemo(
    () =>
      controlled
        ? multiple
          ? Array.isArray(controlledValue)
            ? controlledValue
            : []
          : normalizeValue(controlledValue)
        : internalValue,
    [controlled, controlledValue, internalValue, multiple]
  );

  const [queryInputVisible, setQueryInputVisible] = useState(false);
  const [queryKey, setQueryKey] = useState("");
  const [minWidth, setMinWidth] = useState(0);
  const [queryInputFocused, setQueryInputFocused] = useState(false);
  const transOrigin = useRef("bottom");
  const left = useRef(0);
  const top = useRef(0);
  const currentPlacement = useRef(placement);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    origin: "bottom",
    placement,
  });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [ctxFocused, setCtxFocused] = useState(false);

  const refPopper = useRef<HTMLDivElement>(null);
  const refSelection = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);
  const queryInputMirrorRef = useRef<HTMLSpanElement>(null);
  const queryInputEventTimer = useRef<NodeJS.Timeout | null>(null);
  const clearQueryTimer = useRef<NodeJS.Timeout | null>(null);
  const positionRaf = useRef(0);
  const openRaf = useRef(0);

  const hasSearchEvent = !!onSearch;

  // Update placement position
  const updatePosition = () => {
    cancelAnimationFrame(positionRaf.current);
    positionRaf.current = requestAnimationFrame(() => {
      if (!refSelection.current || !refPopper.current) return;
      setMinWidth(refSelection.current.offsetWidth);
      setPlacement({
        refSelection,
        refPopper,
        currentPlacement,
        transOrigin,
        top,
        left,
      });
      setPosition({
        left: left.current,
        top: top.current,
        origin: transOrigin.current,
        placement: currentPlacement.current,
      });
    });
  };

  useEffect(() => {
    currentPlacement.current = placement;
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

  useEffect(() => {
    document.addEventListener("scroll", updatePosition, true);
    return () => {
      cancelAnimationFrame(positionRaf.current);
      cancelAnimationFrame(openRaf.current);
      if (queryInputEventTimer.current) clearTimeout(queryInputEventTimer.current);
      if (clearQueryTimer.current) clearTimeout(clearQueryTimer.current);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, []);

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
  const handleOutsideClick = useEffectEvent(outsideClick);

  useEffect(() => {
    if (visible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [visible]);

  const optionsData = useMemo(() => {
    if (loading) return [];
    if (options && options.length > 0) {
      return options;
    }

    const data: SelectOption[] = [];
    const childList = getChildren(children);

    childList.forEach((child) => {
      if (React.isValidElement<React.ComponentProps<typeof Option>>(child)) {
        const childProps = child.props;
        const { label, value: val, disabled: d } = childProps;
        const candidateLabel = label ?? childProps.children ?? val;
        const resolvedLabel =
          typeof candidateLabel === "string" || typeof candidateLabel === "number"
            ? candidateLabel
            : val;
        data.push({
          value: val,
          disabled: d,
          label: resolvedLabel,
        });
      }
    });
    return data;
  }, [options, loading, children]);

  const scrollOptionIntoView = (index: number) => {
    const containerEl = refPopper.current;
    if (!containerEl || !containerEl.children[0]) return;
    const optionEl = containerEl.querySelectorAll<HTMLElement>(".k-select-item")[index];
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
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const filtered = filterOptions();
        const direction = e.key === "ArrowDown" ? 1 : -1;
        let index = activeIndex;
        for (let count = 0; count < filtered.length; count += 1) {
          index = (index + direction + filtered.length) % filtered.length;
          if (!filtered[index]?.disabled) {
            setActiveIndex(index);
            setTimeout(() => scrollOptionIntoView(index), 0);
            break;
          }
        }
        e.preventDefault();
      } else if (e.key === "Enter" && activeIndex >= 0 && (ctxFocused || queryInputFocused)) {
        const filtered = filterOptions();
        const item = filtered[activeIndex];
        if (item && !item.disabled) {
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
  const handleDocumentKeydown = useEffectEvent(onKeydown);

  useEffect(() => {
    document.addEventListener("keydown", handleDocumentKeydown);
    return () => {
      document.removeEventListener("keydown", handleDocumentKeydown);
    };
  }, []);

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

  function clearQuery() {
    setActiveIndex(-1);
    if (filterable || hasSearchEvent) {
      if (clearQueryTimer.current) clearTimeout(clearQueryTimer.current);
      clearQueryTimer.current = setTimeout(() => {
        setQueryKey("");
        if (queryInputRef.current) {
          queryInputRef.current.value = "";
          queryInputRef.current.style.width = "";
        }
        setQueryInputVisible(false);
      }, 300);
    }
  }

  const onMouseenter = (index: number) => {
    setActiveIndex(index);
  };

  function handleSelect(item: OptionSelectEvent) {
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

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    const outputValue = multiple ? nextValue : nextValue[0];
    onChange?.(outputValue);
    onSelect?.({ value: val, label: lbl, selected });
  }

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
        if (!rendered) {
          setRendered(true);
          openRaf.current = requestAnimationFrame(() => {
            setVisible(true);
            onOpenChange?.(true);
          });
        } else {
          setVisible(true);
          onOpenChange?.(true);
        }
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

    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(multiple ? nextValue : nextValue[0]);
    setTimeout(updatePosition, 0);
  };

  const onClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextValue: (string | number)[] = [];
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onClearCallback?.();
    onChange?.(multiple ? nextValue : undefined);
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

  function toggle(show: boolean | null = null) {
    if (disabled) return;

    if (hasSearchEvent) {
      showQuery();
      return;
    }

    if (!rendered) {
      setRendered(true);
      openRaf.current = requestAnimationFrame(() => {
        setVisible(true);
        onOpenChange?.(true);
        showQuery();
      });
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
  }

  function filterOptions() {
    const key = queryKey;
    const filter = filterable && key.trim() !== "";
    return filter
      ? optionsData.filter((item) => String(item.label).toLowerCase().includes(key.toLowerCase()))
      : optionsData;
  }

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
        if (value === undefined) {
          setInternalValue(nextValue);
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
        left: `${position.left}px`,
        top: `${position.top}px`,
        transformOrigin: position.origin,
      } as React.CSSProperties,
      className: clsx("k-select-dropdown", "k-scroll", {
        "k-select-dropdown-multiple": multiple,
        "k-select-dropdown-sm": size === "small",
      }),
      onClick: (event: React.MouseEvent) => event.stopPropagation(),
    };

    const loadingNode = (
      <div className="k-select-loading">
        <Icon type={Loading} spin />
        <span>{loadingText || locale?.k?.select?.loading}</span>
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
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      searchInput(e);
    },
    onKeyDown: queryKeydown,
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
    const tags = labelText.map((label, i) => {
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
