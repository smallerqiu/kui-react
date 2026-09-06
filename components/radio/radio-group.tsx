import clsx from "clsx";
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { DirectionType, RadioType, ShapeType, SizeType, ThemeType } from "../const/types";
import type { IconType } from "../icon";
import Radio from "./radio";
import RadioButton from "./radio-button";
import type { ChangeEvent } from "./types";
import { RadioGroupContext } from "./radio-group-context";

type RadioValue = string | number | undefined;

export interface RadioOption {
  label?: string;
  value: string | number;
  disabled?: boolean;
  icon?: IconType[];
  [key: string]: unknown;
}

export interface RadioGroupProps<T extends RadioValue = string | number> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  value?: T;
  defaultValue?: T;
  disabled?: boolean;
  readOnly?: boolean;
  direction?: DirectionType;
  size?: SizeType;
  theme?: ThemeType;
  shape?: ShapeType;
  options?: RadioOption[];
  type?: RadioType;
  onChange?: (value: T) => void;
  children?: React.ReactNode;
}

const RadioGroup = <T extends RadioValue = string | number>({
  value,
  defaultValue,
  disabled = false,
  readOnly = false,
  direction = "horizontal",
  size,
  theme,
  shape,
  options,
  type,
  onChange,
  children,
  className = "",
  onKeyDown,
  ...rest
}: RadioGroupProps<T>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const name = `k-radio-group-${useId().replace(/:/g, "")}`;
  const itemRefs = useRef(new Map<RadioValue, HTMLElement | null>());

  const [innerValue, setInnerValue] = useState<T>(() => defaultValue ?? value ?? ("" as T));
  const currentValue = value ?? innerValue;
  const [segStyle, setSegStyle] = useState<React.CSSProperties>({});
  const [segmentReady, setSegmentReady] = useState(false);

  const isVertical = direction === "vertical";
  const isButton = type === "button";
  const isCard = theme === "card";

  const setItemRef = (el: HTMLElement | null, val: RadioValue) => {
    if (el) {
      itemRefs.current.set(val, el);
    } else {
      itemRefs.current.delete(val);
    }
  };

  const updateSize = useCallback(() => {
    const activeEl = itemRefs.current.get(currentValue);
    if (activeEl) {
      setSegStyle(
        isVertical
          ? { height: `${activeEl.offsetHeight - 4}px`, top: `${activeEl.offsetTop + 2}px` }
          : { width: `${activeEl.offsetWidth - 4}px`, left: `${activeEl.offsetLeft + 2}px` },
      );
    }
  }, [currentValue, isVertical]);

  useEffect(() => {
    if (!isCard || !isButton) {
      return;
    }
    updateSize();
    const frame = requestAnimationFrame(() => setSegmentReady(true));
    return () => cancelAnimationFrame(frame);
  }, [isButton, isCard, updateSize]);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
    };
  }, [updateSize]);

  const handleRadioChange = (event: ChangeEvent) => {
    if (readOnly || event.value === undefined) return;
    const nextValue = event.value as T;
    if (value === undefined) {
      setInnerValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const classes = clsx(
    "k-radio-group",
    {
      "k-radio-button-group": isButton,
      "k-radio-button-changed": segmentReady && isCard && isButton,
      "k-radio-group-circle": shape === "circle",
      "k-radio-group-fill": theme === "fill" && isButton,
      "k-radio-group-card": isCard && isButton,
      "k-radio-group-vertical": isVertical,
    },
    className,
  );

  const Component = isButton ? RadioButton : Radio;

  const content = useMemo(() => {
    if (options && options.length > 0) {
      return options.map((option) => (
        <Component
          ref={(el: HTMLButtonElement | HTMLLabelElement | null) => setItemRef(el, option.value)}
          key={option.label ?? option.value}
          label={option.label}
          value={option.value}
          disabled={disabled || option.disabled}
          readOnly={readOnly}
          icon={option.icon}
          size={size}
          theme={theme}
          shape={shape}
        />
      ));
    }
    return React.Children.map(children, (child) => {
      if (
        React.isValidElement<{
          value?: RadioValue;
          ref?: React.Ref<HTMLButtonElement | HTMLLabelElement>;
        }>(child)
      ) {
        const val = child.props.value;
        const childRef = child.props.ref;
        return React.cloneElement(child, {
          ref: (el: HTMLButtonElement | HTMLLabelElement | null) => {
            setItemRef(el, val);
            if (typeof childRef === "function") childRef(el);
            else if (childRef) childRef.current = el;
          },
        });
      }
      return child;
    });
  }, [options, children, disabled, readOnly, size, theme, shape, Component]);

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        value: currentValue,
        disabled,
        readOnly,
        theme,
        size,
        shape,
        onChange: handleRadioChange,
      }}
    >
      <div
        {...rest}
        className={classes}
        ref={rootRef}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (!isButton || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key))
            return;
          const buttons = [
            ...(rootRef.current?.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])') ??
              []),
          ];
          if (!buttons.length) return;
          event.preventDefault();
          const index = buttons.indexOf(event.target as HTMLElement);
          const offset = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
          const next = buttons[(Math.max(index, 0) + offset + buttons.length) % buttons.length];
          next?.focus();
          next?.click();
        }}
      >
        {content}
        {isCard && isButton && (
          <div
            className={clsx("k-radio-group-card-seg", segmentReady && "is-ready")}
            style={segStyle}
          />
        )}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
