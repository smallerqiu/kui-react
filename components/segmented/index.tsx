import { useValue } from "../utils/use-value";
import { useFormAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { createFormFieldComponent } from "../form/field-context";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
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
export type SegmentedOptionInput = SegmentedValue | SegmentedOption;

const isOptionObject = (option: SegmentedOptionInput): option is SegmentedOption =>
  typeof option === "object" && option !== null;

// A bare string or number is both the value and the visible content. Normalising
// up front keeps the rest of the component on one shape.
const normalizeOptions = (options: SegmentedOptionInput[]): SegmentedOption[] =>
  options.map((option) => (isOptionObject(option) ? option : { label: option, value: option }));

export interface SegmentedProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange" | "defaultChecked"
> {
  value?: SegmentedValue;
  options?: SegmentedOptionInput[];
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
  options = [],
  disabled = false,
  readOnly = false,
  block = false,
  direction = "horizontal",
  size: sizeProp,
  shape: shapeProp,
  onChange,
  renderLabel,
  className,
  onKeyDown,
  ...rest
}: SegmentedProps) => {
  const inheritedAppearance = useFormAppearance();
  const size = sizeProp ?? inheritedAppearance.size ?? "medium";
  const shape = shapeProp ?? inheritedAppearance.shape ?? "round";
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<SegmentedValue, HTMLButtonElement>());
  const [innerValue, setInnerValue] = useValue(value, (next) => next);
  const currentValue = innerValue;
  const items = normalizeOptions(options);
  // Roving tabindex: the checked item is the tab stop. Without a checked item
  // -- or when the checked one is disabled -- the first enabled item has to
  // take the 0, otherwise every item is -1 and the group is unreachable.
  const selectedItem = items.find((item) => item.value === currentValue);
  const focusValue =
    selectedItem && !selectedItem.disabled
      ? selectedItem.value
      : items.find((item) => !item.disabled)?.value;
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [ready, setReady] = useState(false);
  const [animating, setAnimating] = useState(false);
  const measured = useRef<
    | {
        value: SegmentedValue | undefined;
        vertical: boolean;
        width: number;
        height: number;
        left: number;
        top: number;
      }
    | undefined
  >(undefined);
  const vertical = direction === "vertical";

  const updateIndicator = useCallback(() => {
    const item = currentValue === undefined ? undefined : itemRefs.current.get(currentValue);
    if (!item || item.offsetWidth === 0 || item.offsetHeight === 0) {
      setReady(false);
      setAnimating(false);
      measured.current = undefined;
      setIndicatorStyle({});
      return;
    }
    const next = {
      value: currentValue,
      vertical,
      width: item.offsetWidth,
      height: item.offsetHeight,
      left: item.offsetLeft,
      top: item.offsetTop,
    };
    const previous = measured.current;
    if (
      previous &&
      Object.keys(next).every(
        (key) => next[key as keyof typeof next] === previous[key as keyof typeof next],
      )
    )
      return;
    setAnimating(
      !!previous && previous.vertical === next.vertical && !Object.is(previous.value, next.value),
    );
    measured.current = next;
    setIndicatorStyle(
      vertical
        ? { height: item.offsetHeight, top: item.offsetTop }
        : { width: item.offsetWidth, left: item.offsetLeft },
    );
    setReady(true);
  }, [currentValue, vertical]);

  useLayoutEffect(() => {
    updateIndicator();
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateIndicator) : undefined;
    if (rootRef.current) observer?.observe(rootRef.current);
    return () => observer?.disconnect();
  }, [options, updateIndicator]);

  const select = (option: SegmentedOption) => {
    if (disabled || readOnly || option.disabled || option.value === currentValue) return;
    setInnerValue(option.value);
    onChange?.(option.value);
  };
  const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)
    )
      return;
    const available = items.filter((option) => !option.disabled);
    if (!available.length || disabled || readOnly) return;
    event.preventDefault();
    const current = available.findIndex((option) => option.value === currentValue);
    const next =
      event.key === "Home"
        ? available[0]
        : event.key === "End"
          ? available.at(-1)
          : available[
              (Math.max(current, 0) +
                (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) +
                available.length) %
                available.length
            ];
    if (next) {
      select(next);
      requestAnimationFrame(() => itemRefs.current.get(next.value)?.focus());
    }
  };

  return (
    <div
      {...rest}
      ref={rootRef}
      className={clsx(
        "k-segmented",
        `k-segmented-${size}`,
        `k-segmented-${shape}`,
        {
          "k-segmented-block": block,
          "k-segmented-vertical": vertical,
          "k-segmented-disabled": disabled,
        },
        className,
      )}
      role="radiogroup"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onKeyDown={move}
    >
      {items.map((option) => {
        const label =
          renderLabel?.(option, option.value === currentValue) ??
          option.label ??
          (option.icon ? undefined : option.value);
        const hasLabel = label !== undefined && label !== null && label !== false && label !== "";
        return (
          <button
            key={option.value}
            ref={(node) => {
              if (node) itemRefs.current.set(option.value, node);
              else itemRefs.current.delete(option.value);
            }}
            type="button"
            className={clsx("k-segmented-item", {
              "k-segmented-item-active": option.value === currentValue,
            })}
            role="radio"
            aria-checked={option.value === currentValue}
            aria-label={!hasLabel ? String(option.value) : undefined}
            disabled={disabled || option.disabled}
            tabIndex={option.value === focusValue ? 0 : -1}
            onClick={() => select(option)}
          >
            {option.icon && <Icon type={option.icon} />}
            {hasLabel && <span>{label}</span>}
          </button>
        );
      })}
      <span
        className={clsx("k-segmented-indicator", { "is-ready": ready, "is-animating": animating })}
        style={indicatorStyle}
      />
    </div>
  );
};

export default createFormFieldComponent(Segmented);
