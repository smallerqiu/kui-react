import clsx from "clsx";
import { Check } from "kui-icons";
import React, { useContext, useEffect, useState } from "react";
import type { SizeType, ThemeType, ValueType } from "../const/types";
import Icon from "../icon";
import { CheckboxGroupContext } from "./checkbox-group";

export interface ChangeEvent {
  value?: any;
  label?: React.ReactNode;
  checked: boolean;
}

export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, "onChange"> {
  checked?: boolean;
  valueType?: ValueType;
  value?: any;
  label?: React.ReactNode;
  theme?: ThemeType;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: SizeType;
  onChange?: (e: ChangeEvent) => void;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  valueType = "boolean",
  value,
  label,
  theme = "fill",
  disabled = false,
  indeterminate = false,
  size,
  onChange,
  children,
  className = "",
  ...rest
}) => {
  const group = useContext(CheckboxGroupContext);

  const isGroup = !!group;
  const groupChecked = isGroup && group.value ? group.value.indexOf(value) > -1 : false;

  const [localChecked, setLocalChecked] = useState(checked);

  useEffect(() => {
    setLocalChecked(checked);
  }, [checked]);

  const isChecked = isGroup ? groupChecked : localChecked;
  const currentDisabled = disabled || (isGroup && group.disabled);
  const currentTheme = isGroup && group.theme ? group.theme : theme;
  const currentSize = isGroup && group.size ? group.size : size;

  const emitValue = (newChecked: boolean) => {
    if (!isGroup) {
      setLocalChecked(newChecked);
    }
    const labelVal = label || children || value;
    const eventObj: ChangeEvent = {
      checked: newChecked,
      value: value,
      label: labelVal,
    };
    onChange?.(eventObj);
    group?.onChange?.(eventObj);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentDisabled) return;
    emitValue(e.target.checked);
  };

  const triggerCheck = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (currentDisabled) return;
      emitValue(!isChecked);
    }
  };

  const rootClasses = clsx(
    "k-checkbox",
    {
      "k-checkbox-fill": currentTheme === "fill",
      "k-checkbox-disabled": currentDisabled,
      "k-checkbox-checked": isChecked && !indeterminate,
      "k-checkbox-indeterminate": indeterminate && !isChecked,
      "k-checkbox-sm": currentSize === "small",
      "k-checkbox-lg": currentSize === "large",
    },
    className
  );

  const innerNode = isChecked ? <Icon type={Check} /> : null;
  const labelNode = label || children;

  return (
    <label
      className={rootClasses}
      tabIndex={currentDisabled ? undefined : 0}
      onKeyDown={triggerCheck}
      {...rest}
    >
      <span className="k-checkbox-symbol">
        <input
          type="checkbox"
          tabIndex={-1}
          className="k-checkbox-input"
          disabled={currentDisabled}
          checked={!!isChecked}
          onChange={handleInputChange}
        />
        {innerNode}
      </span>
      {labelNode ? <span className="k-checkbox-label">{labelNode}</span> : null}
    </label>
  );
};

export default Checkbox;
