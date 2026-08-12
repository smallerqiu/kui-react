import clsx from "clsx";
import React, { useState } from "react";
import type { DirectionType, SizeType, ThemeType } from "../const/types";
import Checkbox, { type ChangeEvent } from "./checkbox";
import { CheckboxGroupContext } from "./checkbox-group-context";

export interface CheckboxOption<T extends string | number = string | number> {
  label?: string;
  value: T;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface CheckboxGroupProps<T extends string | number = string | number> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: T[];
  defaultValue?: T[];
  theme?: ThemeType;
  disabled?: boolean;
  options?: CheckboxOption[];
  direction?: DirectionType;
  size?: SizeType;
  onChange?: (value: T[]) => void;
  children?: React.ReactNode;
}

const CheckboxGroup = <T extends string | number = string | number>({
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
}: CheckboxGroupProps<T>) => {
  const [innerValue, setInnerValue] = useState<T[]>(defaultValue);
  const currentValue = value ?? innerValue;

  const handleCheckboxChange = (event: ChangeEvent) => {
    const checked = event.checked;
    const val = event.value as T;
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
      setInnerValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const classes = clsx(
    "k-checkbox-group",
    { "k-checkbox-group-vertical": direction === "vertical" },
    className
  );

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
