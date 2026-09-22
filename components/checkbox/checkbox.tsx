import { useValue } from "../utils/use-value";
import { useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { createFormFieldComponent } from "../form/field-context";
import { Check } from "kui-icons";
import React, { useContext, useLayoutEffect, useRef } from "react";
import type { SizeType, ThemeType, ValueType } from "../const/types";
import Icon from "../icon";
import { getValueWithType } from "../utils/checked";
import { CheckboxGroupContext } from "./checkbox-group-context";

export interface ChangeEvent {
  value?: unknown;
  label?: React.ReactNode;
  checked: boolean;
}

export interface CheckboxProps extends Omit<
  React.HTMLAttributes<HTMLLabelElement>,
  "onChange" | "defaultValue" | "defaultChecked"
> {
  checked?: boolean;
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
  valueType = "boolean",
  value,
  label,
  theme: themeProp,
  disabled = false,
  readOnly = false,
  indeterminate = false,
  size: sizeProp,
  onChange,
  children,
  className = "",
  id,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  onClick,
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const theme = themeProp ?? inheritedAppearance.theme ?? "fill";
  const size = sizeProp ?? inheritedAppearance.size;
  const group = useContext(CheckboxGroupContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const isGroup = !!group;
  const groupChecked = isGroup && group.value ? group.value.indexOf(value) > -1 : false;

  const [localChecked, setLocalChecked] = useValue(checked, (next) => next ?? false);
  const isChecked = isGroup ? groupChecked : localChecked;
  const currentDisabled = disabled || (isGroup && group.disabled);
  const currentReadOnly = readOnly || Boolean(isGroup && group.readOnly);
  const currentTheme = themeProp ?? group?.theme ?? theme;
  const currentSize = sizeProp ?? group?.size ?? size;

  const emitValue = (newChecked: boolean) => {
    if (!isGroup) {
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
    <label
      className={rootClasses}
      aria-readonly={currentReadOnly || undefined}
      {...rest}
      onClick={(event) => {
        if (currentDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
    >
      <span className="k-checkbox-symbol">
        <input
          id={id}
          type="checkbox"
          ref={inputRef}
          className="k-checkbox-input"
          disabled={currentDisabled}
          readOnly={currentReadOnly}
          aria-checked={indeterminate ? "mixed" : isChecked}
          aria-readonly={currentReadOnly || undefined}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
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

export default createFormFieldComponent(Checkbox, {
  valueProp: "checked",
  getFieldValue: (value) => value === true || value === 1 || value === "1",
  getChangeValue: (event) => (event as ChangeEvent).checked,
});
