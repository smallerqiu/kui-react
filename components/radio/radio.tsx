import clsx from "clsx";
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
      theme = "fill",
      size,
      onChange,
      children,
      className = "",
      disabled = false,
      readOnly = false,
      ...rest
    },
    ref,
  ) => {
    const group = useContext(RadioGroupContext);
    const isGroup = !!group;
    const groupChecked = isGroup ? group.value === value : false;

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
      const labelVal = label || children || String(value);
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

    const triggerCheck = (e: React.KeyboardEvent<HTMLLabelElement>) => {
      if (e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        if (currentDisabled || currentReadOnly || isChecked) return;
        emitValue(true);
      }
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

    const labelNode = label || children;

    return (
      <label
        ref={ref}
        className={classes}
        tabIndex={currentDisabled ? undefined : 0}
        onKeyDown={triggerCheck}
        aria-readonly={currentReadOnly || undefined}
        {...rest}
      >
        <span className="k-radio-symbol">
          <input
            type="radio"
            tabIndex={-1}
            className="k-radio-input"
            disabled={currentDisabled}
            readOnly={currentReadOnly}
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

export default Radio;
