import React, { useState, useEffect, useRef, useMemo } from "react";
import type {
  DirectionType,
  RadioType,
  ShapeType,
  SizeType,
  ThemeType,
} from "../const/types";
import type { IconType } from "../icon";
import Radio from "./radio";
import RadioButton from "./radio-button";
import type { ChangeEvent } from "./types";

export interface RadioOption {
  label?: string;
  value?: any;
  disabled?: boolean;
  icon?: IconType[];
  [key: string]: any;
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

export interface RadioGroupContextValue {
  value?: any;
  disabled?: boolean;
  theme?: ThemeType;
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (e: ChangeEvent) => void;
}

export const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

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

  const [currentValue, setCurrentValue] = useState(value !== undefined ? value : defaultValue);
  const [segStyle, setSegStyle] = useState<React.CSSProperties>({});
  const [changed, setChanged] = useState(false);

  const isVertical = direction === "vertical";
  const isButton = type === "button";
  const isCard = theme === "card";

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const setItemRef = (el: HTMLElement | null, val: any) => {
    if (el) {
      itemRefs.current.set(val, el);
    }
  };

  const updateSize = () => {
    const activeEl = itemRefs.current.get(currentValue);
    if (activeEl) {
      setSegStyle(
        isVertical
          ? { height: `${activeEl.offsetHeight - 4}px`, top: `${activeEl.offsetTop + 2}px` }
          : { width: `${activeEl.offsetWidth - 4}px`, left: `${activeEl.offsetLeft + 2}px` }
      );
    }
  };

  const updateSeg = () => {
    if (!isCard || !isButton) return;
    setChanged(true);
    setTimeout(updateSize, 0);
  };

  useEffect(() => {
    updateSeg();
  }, [currentValue, direction, theme, type]);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
    };
  }, [currentValue]);

  const handleRadioChange = (event: ChangeEvent) => {
    if (value === undefined) {
      setCurrentValue(event.value);
    }
    onChange?.(event.value);
  };

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === "left" || e.propertyName === "top") {
      setChanged(false);
    }
  };

  const classes = [
    "k-radio-group",
    isButton ? "k-radio-button-group" : "",
    changed ? "k-radio-button-changed" : "",
    shape === "circle" ? "k-radio-group-circle" : "",
    theme === "fill" && isButton ? "k-radio-group-fill" : "",
    isCard && isButton ? "k-radio-group-card" : "",
    isVertical ? "k-radio-group-vertical" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
      if (React.isValidElement(child)) {
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
