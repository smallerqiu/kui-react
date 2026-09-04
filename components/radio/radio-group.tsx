import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DirectionType, RadioType, ShapeType, SizeType, ThemeType } from "../const/types";
import type { IconType } from "../icon";
import Radio from "./radio";
import RadioButton from "./radio-button";
import type { ChangeEvent } from "./types";
import { RadioGroupContext } from "./radio-group-context";

type RadioValue = string | number | undefined;

export interface RadioOption {
  label?: string;
  value?: string | number;
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
  ...rest
}: RadioGroupProps<T>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<RadioValue, HTMLElement | null>());
  const animationFrame = useRef<number | null>(null);

  const [innerValue, setInnerValue] = useState<T>(() => defaultValue ?? value ?? ("" as T));
  const currentValue = value ?? innerValue;
  const [segStyle, setSegStyle] = useState<React.CSSProperties>({});
  const [changed, setChanged] = useState(false);

  const isVertical = direction === "vertical";
  const isButton = type === "button";
  const isCard = theme === "card";

  const setItemRef = (el: HTMLElement | null, val: RadioValue) => {
    if (el) {
      itemRefs.current.set(val, el);
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

  const updateSeg = useCallback(() => {
    if (!isCard || !isButton) return;
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(() => {
      setChanged(true);
      animationFrame.current = requestAnimationFrame(() => {
        updateSize();
        animationFrame.current = null;
      });
    });
  }, [isButton, isCard, updateSize]);

  useEffect(() => {
    updateSeg();
  }, [updateSeg]);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
  }, [updateSize]);

  const handleRadioChange = (event: ChangeEvent) => {
    if (readOnly) return;
    const nextValue = event.value as T;
    if (value === undefined) {
      setInnerValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === "left" || e.propertyName === "top") {
      setChanged(false);
    }
  };

  const classes = clsx(
    "k-radio-group",
    {
      "k-radio-button-group": isButton,
      "k-radio-button-changed": changed,
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
        return React.cloneElement(child, {
          ref: (el: HTMLButtonElement | HTMLLabelElement | null) => setItemRef(el, val),
        });
      }
      return child;
    });
  }, [options, children, disabled, readOnly, size, theme, shape, Component]);

  return (
    <RadioGroupContext.Provider
      value={{
        value: currentValue,
        disabled,
        readOnly,
        theme,
        size,
        shape,
        onChange: handleRadioChange,
      }}
    >
      <div className={classes} ref={rootRef} aria-readonly={readOnly || undefined} {...rest}>
        {content}
        {changed && isCard && isButton && (
          <div
            className="k-radio-group-card-seg"
            style={segStyle}
            onTransitionEnd={onTransitionEnd}
          />
        )}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
