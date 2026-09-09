import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ShapeType, SizeType } from "../const/types";
import Icon, { type IconType } from "../icon";

export type SegmentedValue = string | number;
export interface SegmentedOption {
  label?: React.ReactNode;
  value: SegmentedValue;
  icon?: IconType[];
  disabled?: boolean;
  [key: string]: unknown;
}
export interface SegmentedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: SegmentedValue;
  defaultValue?: SegmentedValue;
  options?: SegmentedOption[];
  disabled?: boolean;
  readOnly?: boolean;
  block?: boolean;
  direction?: "horizontal" | "vertical";
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (value: SegmentedValue) => void;
  renderLabel?: (option: SegmentedOption, selected: boolean) => React.ReactNode;
}

const Segmented = ({
  value,
  defaultValue,
  options = [],
  disabled = false,
  readOnly = false,
  block = false,
  direction = "horizontal",
  size = "medium",
  shape = "round",
  onChange,
  renderLabel,
  className,
  onKeyDown,
  ...rest
}: SegmentedProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<SegmentedValue, HTMLButtonElement>());
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = value ?? innerValue;
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [ready, setReady] = useState(false);
  const vertical = direction === "vertical";

  const updateIndicator = useCallback(() => {
    const item = currentValue === undefined ? undefined : itemRefs.current.get(currentValue);
    if (!item) {
      setReady(false);
      setIndicatorStyle({});
      return;
    }
    setIndicatorStyle(vertical
      ? { height: item.offsetHeight, top: item.offsetTop }
      : { width: item.offsetWidth, left: item.offsetLeft });
    requestAnimationFrame(() => setReady(true));
  }, [currentValue, vertical]);

  useEffect(() => {
    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [options, updateIndicator]);

  const select = (option: SegmentedOption) => {
    if (disabled || readOnly || option.disabled || option.value === currentValue) return;
    if (value === undefined) setInnerValue(option.value);
    onChange?.(option.value);
  };
  const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const available = options.filter((option) => !option.disabled);
    if (!available.length || disabled || readOnly) return;
    event.preventDefault();
    const current = available.findIndex((option) => option.value === currentValue);
    const next = event.key === "Home"
      ? available[0]
      : event.key === "End"
        ? available.at(-1)
        : available[(Math.max(current, 0) + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + available.length) % available.length];
    if (next) {
      select(next);
      requestAnimationFrame(() => itemRefs.current.get(next.value)?.focus());
    }
  };

  return (
    <div
      {...rest}
      ref={rootRef}
      className={clsx("k-segmented", `k-segmented-${size}`, `k-segmented-${shape}`, {
        "k-segmented-block": block,
        "k-segmented-vertical": vertical,
        "k-segmented-disabled": disabled,
      }, className)}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onKeyDown={move}
    >
      {options.map((option) => (
        <button
          key={option.value}
          ref={(node) => node ? itemRefs.current.set(option.value, node) : itemRefs.current.delete(option.value)}
          type="button"
          className={clsx("k-segmented-item", { "k-segmented-item-active": option.value === currentValue })}
          role="radio"
          aria-checked={option.value === currentValue}
          disabled={disabled || option.disabled}
          tabIndex={option.value === currentValue ? 0 : -1}
          onClick={() => select(option)}
        >
          {option.icon && <Icon type={option.icon} />}
          <span>{renderLabel?.(option, option.value === currentValue) ?? option.label ?? option.value}</span>
        </button>
      ))}
      <span className={clsx("k-segmented-indicator", { "is-ready": ready })} style={indicatorStyle} />
    </div>
  );
};

export default Segmented;
