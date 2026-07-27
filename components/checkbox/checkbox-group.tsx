import React, { useEffect, useState } from "react";
import type { DirectionType, SizeType, ThemeType } from "../const/types";
import Checkbox, { type ChangeEvent } from "./checkbox";

export interface CheckboxOption {
  label?: string;
  value?: any;
  disabled?: boolean;
  [key: string]: any;
}

export interface CheckboxGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: any[];
  defaultValue?: any[];
  theme?: ThemeType;
  disabled?: boolean;
  options?: CheckboxOption[];
  direction?: DirectionType;
  size?: SizeType;
  onChange?: (value: any[]) => void;
  children?: React.ReactNode;
}

export interface CheckboxGroupContextValue {
  value?: any[];
  disabled?: boolean;
  theme?: ThemeType;
  size?: SizeType;
  onChange?: (e: ChangeEvent) => void;
}

export const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(null);

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  defaultValue = [],
  theme = "fill",
  disabled = false,
  options,
  direction = "horizontal",
  size,
  onChange,
  children,
  className = "",
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState<any[]>(
    value !== undefined ? value : defaultValue
  );

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleCheckboxChange = (event: ChangeEvent) => {
    const { checked, value: val } = event;
    const nextValue = [...currentValue];
    const index = nextValue.indexOf(val);

    if (checked) {
      if (index === -1) {
        nextValue.push(val);
      }
    } else {
      if (index > -1) {
        nextValue.splice(index, 1);
      }
    }

    if (value === undefined) {
      setCurrentValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const classes = [
    "k-checkbox-group",
    direction === "vertical" ? "k-checkbox-group-vertical" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content =
    options && options.length > 0
      ? options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            value={option.value}
            disabled={disabled || option.disabled}
          />
        ))
      : children;

  return (
    <CheckboxGroupContext.Provider
      value={{ value: currentValue, disabled, theme, size, onChange: handleCheckboxChange }}
    >
      <div className={classes} {...rest}>
        {content}
      </div>
    </CheckboxGroupContext.Provider>
  );
};

export default CheckboxGroup;
