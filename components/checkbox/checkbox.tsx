import clsx from "clsx";
import { Check } from "kui-icons";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import type { SizeType, ThemeType, ValueType } from "../const/types";
import Icon from "../icon";
import { getValueWithType } from "../utils/checked";
import { CheckboxGroupContext } from "./checkbox-group-context";

export interface ChangeEvent {
  value?: unknown;
  label?: React.ReactNode;
  checked: boolean;
}

export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  valueType?: ValueType;
  value?: unknown;
  label?: React.ReactNode;
  theme?: ThemeType;
  disabled?: boolean;
  readOnly?: boolean;
  indeterminate?: boolean;
  size?: SizeType;
  onChange?: (e: ChangeEvent) => void;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  defaultChecked = false,
  valueType = "boolean",
  value,
  label,
  theme = "fill",
  disabled = false,
  readOnly = false,
  indeterminate = false,
  size,
  onChange,
  children,
  className = "",
  ...rest
}) => {
  const group = useContext(CheckboxGroupContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const isGroup = !!group;
  const groupChecked = isGroup && group.value ? group.value.indexOf(value) > -1 : false;

  const [localChecked, setLocalChecked] = useState(defaultChecked);
  const isChecked = isGroup ? groupChecked : (checked ?? localChecked);
  const currentDisabled = disabled || (isGroup && group.disabled);
  const currentReadOnly = readOnly || Boolean(isGroup && group.readOnly);
  const currentTheme = isGroup && group.theme ? group.theme : theme;
  const currentSize = isGroup && group.size ? group.size : size;

  const emitValue = (newChecked: boolean) => {
    if (!isGroup && checked === undefined) {
      setLocalChecked(newChecked);
    }
    const labelVal =
      label ??
      children ??
      (typeof value === "string" || typeof value === "number" ? value : undefined);
    const eventObj: ChangeEvent = {
      checked: newChecked,
      value: isGroup ? value : getValueWithType(newChecked, valueType),
      label: labelVal,
    };
    onChange?.(eventObj);
    group?.onChange?.(eventObj);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentDisabled || currentReadOnly) return;
    emitValue(e.target.checked);
  };

  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const rootClasses = clsx(
    "k-checkbox",
    {
      "k-checkbox-fill": currentTheme === "fill",
      "k-checkbox-disabled": currentDisabled,
      "k-checkbox-readonly": currentReadOnly,
      "k-checkbox-checked": isChecked && !indeterminate,
      "k-checkbox-indeterminate": indeterminate,
      "k-checkbox-sm": currentSize === "small",
      "k-checkbox-lg": currentSize === "large",
    },
    className,
  );

  const innerNode = isChecked && !indeterminate ? <Icon type={Check} /> : null;
  const labelNode = label ?? children;

  return (
    <label className={rootClasses} aria-readonly={currentReadOnly || undefined} {...rest}>
      <span className="k-checkbox-symbol">
        <input
          type="checkbox"
          ref={inputRef}
          className="k-checkbox-input"
          disabled={currentDisabled}
          readOnly={currentReadOnly}
          aria-checked={indeterminate ? "mixed" : isChecked}
          aria-readonly={currentReadOnly || undefined}
          onClick={(event) => {
            if (currentReadOnly) event.preventDefault();
          }}
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
