import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DirectionType, RadioType, ShapeType, SizeType, ThemeType } from "../const/types";
import type { IconType } from "../icon";
import Radio from "./radio";
import RadioButton from "./radio-button";
import type { ChangeEvent } from "./types";
import { RadioGroupContext } from "./radio-group-context";

export interface RadioOption {
  label?: string;
  value?: any;
  disabled?: boolean;
  icon?: IconType[];
  [key: string]: unknown;
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  direction?: DirectionType;
  size?: SizeType;
  theme?: ThemeType;
  shape?: ShapeType;
  options?: RadioOption[];
  type?: RadioType;
  onChange?: (value: any) => void;
  children?: React.ReactNode;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue = "",
  disabled = false,
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
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<any, HTMLElement | null>());

  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = value ?? innerValue;
  const [segStyle, setSegStyle] = useState<React.CSSProperties>({});
  const [changed, setChanged] = useState(false);

  const isVertical = direction === "vertical";
  const isButton = type === "button";
  const isCard = theme === "card";

  const setItemRef = (el: HTMLElement | null, val: any) => {
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
          : { width: `${activeEl.offsetWidth - 4}px`, left: `${activeEl.offsetLeft + 2}px` }
      );
    }
  }, [currentValue, isVertical]);

  const updateSeg = useCallback(() => {
    if (!isCard || !isButton) return;
    setTimeout(() => {
      setChanged(true);
      updateSize();
    }, 0);
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
    };
  }, [updateSize]);

  const handleRadioChange = (event: ChangeEvent) => {
    if (value === undefined) {
      setInnerValue(event.value);
    }
    onChange?.(event.value);
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
    className
  );

  const Component = isButton ? RadioButton : Radio;

  const content = useMemo(() => {
    if (options && options.length > 0) {
      return options.map((option) => (
        <Component
          ref={(el: any) => setItemRef(el, option.value)}
          key={option.value}
          label={option.label}
          value={option.value}
          disabled={disabled || option.disabled}
          icon={option.icon}
          size={size}
          theme={theme}
          shape={shape}
        />
      ));
    }
    return React.Children.map(children, (child) => {
      if (React.isValidElement<{ value?: any }>(child)) {
        const val = child.props.value;
        return React.cloneElement(child, {
          ref: (el: any) => setItemRef(el, val),
        } as any);
      }
      return child;
    });
  }, [options, children, disabled, size, theme, shape, Component]);

  return (
    <RadioGroupContext.Provider
      value={{ value: currentValue, disabled, theme, size, shape, onChange: handleRadioChange }}
    >
      <div className={classes} ref={rootRef} {...rest}>
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
