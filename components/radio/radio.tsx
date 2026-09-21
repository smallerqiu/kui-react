import { useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { createFormFieldComponent } from "../form/field-context";
import React, { useContext, useState } from "react";
import type { SizeType, ThemeType } from "../const/types";
import { RadioGroupContext } from "./radio-group-context";
import type { ChangeEvent } from "./types";

export interface RadioProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: string | number;
  label?: string;
  theme?: ThemeType;
  size?: SizeType;
  onChange?: (e: ChangeEvent) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
}

const Radio = React.forwardRef<HTMLLabelElement, RadioProps>(
  (
    {
      checked,
      defaultChecked = false,
      value,
      label,
      theme: themeProp,
      size: sizeProp,
      onChange,
      children,
      className = "",
      id,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      disabled = false,
      readOnly = false,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const inheritedAppearance = useConfigAppearance();
    const theme = themeProp ?? inheritedAppearance.theme ?? "fill";
    const size = sizeProp ?? inheritedAppearance.size;
    const group = useContext(RadioGroupContext);
    const isGroup = !!group;
    const groupChecked = isGroup ? group.value === value : false;

    const [localChecked, setLocalChecked] = useState(defaultChecked);
    const isChecked = isGroup ? groupChecked : (checked ?? localChecked);
    const currentDisabled = disabled || (isGroup && group.disabled);
    const currentReadOnly = readOnly || Boolean(isGroup && group.readOnly);
    const currentTheme = themeProp ?? group?.theme ?? theme;
    const currentSize = sizeProp ?? group?.size ?? size;

    const emitValue = (newChecked: boolean) => {
      if (!isGroup && checked === undefined) {
        setLocalChecked(newChecked);
      }
      const labelVal = label ?? String(value ?? "");
      const eventObj: ChangeEvent = {
        checked: newChecked,
        value: value,
        label: typeof labelVal === "string" ? labelVal : "",
      };
      onChange?.(eventObj);
      group?.onChange?.(eventObj);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currentDisabled || currentReadOnly || isChecked) return;
      emitValue(e.target.checked);
    };

    const classes = clsx(
      "k-radio",
      {
        "k-radio-fill": currentTheme === "fill",
        "k-radio-disabled": currentDisabled,
        "k-radio-readonly": currentReadOnly,
        "k-radio-checked": isChecked,
        "k-radio-lg": currentSize === "large",
        "k-radio-sm": currentSize === "small",
      },
      className,
    );

    const labelNode = label ?? children;

    return (
      <label
        ref={ref}
        className={classes}
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
        <span className="k-radio-symbol">
          <input
            id={id}
            type="radio"
            className="k-radio-input"
            name={group?.name}
            disabled={currentDisabled}
            readOnly={currentReadOnly}
            aria-readonly={currentReadOnly || undefined}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired}
            onClick={(event) => {
              if (currentReadOnly) event.preventDefault();
            }}
            onChange={handleInputChange}
            checked={!!isChecked}
          />
        </span>
        {labelNode ? <span className="k-radio-label">{labelNode}</span> : null}
      </label>
    );
  },
);

Radio.displayName = "Radio";

export default createFormFieldComponent(Radio, {
  valueProp: "checked",
  getFieldValue: (value) => value === true || value === 1 || value === "1",
  getChangeValue: (event) => (event as ChangeEvent).checked,
});
