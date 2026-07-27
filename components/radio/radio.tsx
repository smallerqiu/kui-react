import React, { useContext, useEffect, useState } from "react";
import type { SizeType, ThemeType } from "../const/types";
import { RadioGroupContext } from "./radio-group";
import type { ChangeEvent } from "./types";

export interface RadioProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, "onChange"> {
  checked?: boolean;
  value?: any;
  label?: string;
  theme?: ThemeType;
  size?: SizeType;
  onChange?: (e: ChangeEvent) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Radio = React.forwardRef<HTMLLabelElement, RadioProps>(
  (
    {
      checked = false,
      value,
      label,
      theme = "fill",
      size,
      onChange,
      children,
      className = "",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const group = useContext(RadioGroupContext);
    const isGroup = !!group;
    const groupChecked = isGroup ? group.value === value : false;

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
      if (currentDisabled || isChecked) return;
      emitValue(e.target.checked);
    };

    const triggerCheck = (e: React.KeyboardEvent<HTMLLabelElement>) => {
      if (e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        if (currentDisabled || isChecked) return;
        emitValue(true);
      }
    };

    const classes = [
      "k-radio",
      currentTheme === "fill" ? "k-radio-fill" : "",
      currentDisabled ? "k-radio-disabled" : "",
      isChecked ? "k-radio-checked" : "",
      currentSize === "large" ? "k-radio-lg" : "",
      currentSize === "small" ? "k-radio-sm" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const labelNode = label || children;

    return (
      <label
        ref={ref}
        className={classes}
        tabIndex={currentDisabled ? undefined : 0}
        onKeyDown={triggerCheck}
        {...rest}
      >
        <span className="k-radio-symbol">
          <input
            type="radio"
            tabIndex={-1}
            className="k-radio-input"
            disabled={currentDisabled}
            onChange={handleInputChange}
            checked={!!isChecked}
          />
        </span>
        {labelNode ? <span className="k-radio-label">{labelNode}</span> : null}
      </label>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
