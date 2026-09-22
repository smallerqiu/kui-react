import { useValue } from "../utils/use-value";
import { useConfigAppearance } from "../config/use-config-appearance";
import React, { useContext } from "react";
import { createFormFieldComponent } from "../form/field-context";
import { Button } from "../button";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import type { IconType } from "../icon";
import { RadioGroupContext } from "./radio-group-context";
import type { ChangeEvent } from "./types";

export interface RadioButtonProps extends Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  "onChange" | "defaultValue" | "defaultChecked"
> {
  label?: string;
  value?: string | number;
  theme?: ThemeType;
  disabled?: boolean;
  readOnly?: boolean;
  checked?: boolean;
  icon?: IconType[];
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (event: ChangeEvent) => void;
  children?: React.ReactNode;
}

const RadioButton = React.forwardRef<HTMLButtonElement, RadioButtonProps>(
  (
    {
      label,
      value,
      theme: themeProp,
      disabled = false,
      readOnly = false,
      checked,
      icon,
      size: sizeProp,
      shape: shapeProp,
      onChange,
      onClick,
      children,
      ...rest
    },
    ref,
  ) => {
    const inheritedAppearance = useConfigAppearance();
    const theme = themeProp ?? inheritedAppearance.theme;
    const size = sizeProp ?? inheritedAppearance.size;
    const shape = shapeProp ?? inheritedAppearance.shape;
    const group = useContext(RadioGroupContext);
    const isGroup = !!group;
    const [localChecked, setLocalChecked] = useValue(checked, (next) => next ?? false);

    const groupChecked = isGroup ? group.value === value : false;
    const isChecked = isGroup ? groupChecked : localChecked;
    const currentDisabled = disabled || (isGroup && group.disabled);
    const currentReadOnly = readOnly || Boolean(isGroup && group.readOnly);
    const currentTheme = themeProp ?? group?.theme ?? theme;
    const currentSize = sizeProp ?? group?.size ?? size;
    const currentShape = shapeProp ?? group?.shape ?? shape;

    const labelText = label ?? children ?? String(value ?? "");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (currentDisabled || currentReadOnly || isChecked) return;
      const nextChecked = true;
      if (!isGroup) setLocalChecked(nextChecked);
      const eventObj: ChangeEvent = {
        checked: nextChecked,
        value: value,
        label: label ?? String(value ?? ""),
      };
      onChange?.(eventObj);
      group?.onChange?.(eventObj);
      e.preventDefault();
    };

    return (
      <Button
        {...rest}
        ref={ref}
        disabled={currentDisabled}
        size={currentSize}
        icon={icon}
        theme={currentTheme}
        shape={currentShape}
        type={isChecked ? "primary" : "default"}
        onClick={handleClick}
        role="radio"
        aria-checked={isChecked}
        aria-readonly={currentReadOnly || undefined}
        tabIndex={isChecked ? 0 : -1}
      >
        {labelText}
      </Button>
    );
  },
);

RadioButton.displayName = "RadioButton";

export default createFormFieldComponent(RadioButton, {
  valueProp: "checked",
  getFieldValue: (value) => value === true || value === 1 || value === "1",
  getChangeValue: (event) => (event as ChangeEvent).checked,
});
