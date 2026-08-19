import clsx from "clsx";
import { ChevronDown, CircleX, Loading } from "kui-icons";
import React, { useContext, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { ConfigContext } from "../config/config-context";
import Empty from "../empty";
import Icon, { type IconType } from "../icon";
import zhCN from "../locale/zh-CN";
import Space from "../space";
import Tag from "../tag";
import Tooltip from "../tooltip";
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
  /** Allow creating a new option from the search text in multiple mode. */
  allowCreate?: boolean;
  block?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  loading?: boolean;
  bordered?: boolean;
  extendWidth?: boolean;
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
  allowCreate = false,
  block = false,
  disabled = false,
  multiple = false,
  loading = false,
  bordered = true,
  extendWidth = true,
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
    multiple ? (Array.isArray(defaultValue) ? defaultValue : []) : normalizeValue(defaultValue)
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
  const [createdOptions, setCreatedOptions] = useState<SelectOption[]>([]);
  const [minWidth, setMinWidth] = useState(0);
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

  const refPopper = useRef<HTMLDivElement>(null);
  const refSelection = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);
  const queryInputMirrorRef = useRef<HTMLSpanElement>(null);
  const queryInputEventTimer = useRef<NodeJS.Timeout | null>(null);
  const clearQueryTimer = useRef<NodeJS.Timeout | null>(null);
  const positionRaf = useRef(0);
  const openRaf = useRef(0);

  const hasSearchEvent = !!onSearch;
  const searchable = filterable || hasSearchEvent || (multiple && allowCreate);

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
    let source: SelectOption[];
    if (options && options.length > 0) {
      source = options;
    } else {
      source = [];
      getChildren(children).forEach((child) => {
        if (React.isValidElement<React.ComponentProps<typeof Option>>(child)) {
          const childProps = child.props;
          const { label, value: val, disabled: d } = childProps;
          const candidateLabel = label ?? childProps.children ?? val;
          source.push({
            value: val,
            disabled: d,
            label:
              typeof candidateLabel === "string" || typeof candidateLabel === "number"
                ? candidateLabel
                : val,
          });
        }
      });
    }
    return [
      ...source,
      ...createdOptions.filter(
        (created) => !source.some((option) => option.value === created.value)
      ),
    ];
  }, [options, loading, children, createdOptions]);

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
    if (searchable) {
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
      if (searchable) {
        if (queryInputRef.current) {
          queryInputRef.current.value = "";
          queryInputRef.current.style.width = "";
        }
        setQueryKey("");
        setActiveIndex(optionsData.findIndex((option) => option.value === val));
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
      });
    }
  };

  const removeTag = (index: number) => {
    if (disabled) return;

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
    if (searchable) {
      setQueryInputVisible(true);
      setTimeout(() => {
        queryInputRef.current?.focus();
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

  const moveActive = (direction: 1 | -1) => {
    const filtered = filterOptions();
    if (!filtered.length) {
      setActiveIndex(-1);
      return;
    }
    let index = activeIndex;
    for (let count = 0; count < filtered.length; count += 1) {
      index = (index + direction + filtered.length) % filtered.length;
      if (!filtered[index]?.disabled) {
        setActiveIndex(index);
        setTimeout(() => scrollOptionIntoView(index), 0);
        return;
      }
    }
  };

  const resetQueryInput = () => {
    setQueryKey("");
    if (queryInputRef.current) {
      queryInputRef.current.value = "";
      queryInputRef.current.style.width = "";
    }
  };

  const createFromQuery = () => {
    if (!multiple || !allowCreate) return false;
    const newValue = queryKey.trim();
    if (!newValue) return false;
    const normalized = newValue.toLocaleLowerCase();
    const existing = optionsData.find(
      (option) =>
        String(option.value).trim().toLocaleLowerCase() === normalized ||
        String(option.label).trim().toLocaleLowerCase() === normalized
    );
    if (existing) {
      if (!existing.disabled && !isChecked(existing.value)) handleSelect(existing);
      else {
        resetQueryInput();
        setActiveIndex(optionsData.findIndex((option) => option.value === existing.value));
        showQuery();
      }
      return true;
    }
    const option = { label: newValue, value: newValue };
    setCreatedOptions((current) => [...current, option]);
    handleSelect(option);
    return true;
  };

  const closeDropdown = () => {
    if (!visible) return;
    setVisible(false);
    onOpenChange?.(false);
    clearQuery();
  };

  const onKeydown = (e: React.KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
    if (disabled) return;
    if (!visible) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        toggle(true);
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          setTimeout(() => moveActive(e.key === "ArrowDown" ? 1 : -1), 0);
        }
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      moveActive(e.key === "ArrowDown" ? 1 : -1);
      e.preventDefault();
    } else if (e.key === "Enter") {
      const item = filterOptions()[activeIndex];
      if (item && !item.disabled) {
        handleSelect(item);
        e.preventDefault();
      } else if (createFromQuery()) e.preventDefault();
    } else if (e.key === "Escape") {
      closeDropdown();
      refSelection.current?.focus();
      e.preventDefault();
    } else if (e.key === "Tab") closeDropdown();
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
        minWidth: extendWidth ? `${minWidth}px` : undefined,
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
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      queryKeydown(event);
      onKeydown(event);
      event.stopPropagation();
    },
    onBlur: () => {
      if (!visible) {
        setQueryInputVisible(false);
      }
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
    const hasDisplayLimit = typeof maxTagCount === "number" && Number.isFinite(maxTagCount);
    const displayCount = hasDisplayLimit ? Math.max(0, Math.floor(maxTagCount)) : labelText.length;
    const visibleLabels = labelText.slice(0, displayCount);
    const hiddenLabels = labelText.slice(displayCount);
    const tagSize = size || "medium";
    const tags: React.ReactNode[] = visibleLabels.map((label, index) => (
      <Tag
        key={`${label}-${index}`}
        size={tagSize}
        shape={shape}
        theme="default"
        compact
        closeable={!disabled}
        onClose={() => removeTag(index)}
      >
        {label}
      </Tag>
    ));
    if (hiddenLabels.length) {
      tags.push(
        <Tooltip
          key="tag-more"
          title={
            <Space wrap size={4}>
              {hiddenLabels.map((label, index) => (
                <Tag
                  key={`${label}-${index}`}
                  size="small"
                  shape={shape}
                  theme="fill"
                  compact
                  closeable={!disabled}
                  onClose={() => removeTag(displayCount + index)}
                >
                  {label}
                </Tag>
              ))}
            </Space>
          }
        >
          <Tag size={tagSize} shape={shape} theme="default" compact>
            +{hiddenLabels.length}...
          </Tag>
        </Tooltip>
      );
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

  if (searchable && !multiple) {
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
      "k-select-borderless": bordered === false || theme === "plain",
      "k-select-lg": size === "large",
      "k-select-sm": size === "small",
      "k-select-fill": theme === "fill",
      "k-select-has-icon": icon,
      "k-select-circle": shape === "circle" && !multiple,
      "k-select-square": shape === "square",
      "k-select-multiple": multiple,
      "k-select-show-search": queryInputVisible,
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
      onKeyDown={onKeydown}
      role="combobox"
      aria-expanded={visible}
      aria-haspopup="listbox"
      aria-disabled={disabled || undefined}
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
