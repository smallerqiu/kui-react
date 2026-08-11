import React, { useContext } from "react";
import { Button } from "../button";
import type { ShapeType, SizeType } from "../const/types";
import type { IconType } from "../icon";
import { RadioGroupContext } from "./radio-group-context";
import type { ChangeEvent } from "./types";

export interface RadioButtonProps extends Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  label?: string;
  value?: any;
  theme?: string;
  disabled?: boolean;
  checked?: boolean;
  icon?: IconType[];
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (event: ChangeEvent) => void;
  children?: React.ReactNode;
}

const RadioButton = React.forwardRef<any, RadioButtonProps>(
  (
    {
      label,
      value,
      theme,
      disabled = false,
      checked = false,
      icon,
      size,
      shape,
      onChange,
      children,
      ...rest
    },
    ref
  ) => {
    const group = useContext(RadioGroupContext);
    const isGroup = !!group;

    const groupChecked = isGroup ? group.value === value : false;
    const isChecked = isGroup ? groupChecked : checked;
    const currentDisabled = disabled || (isGroup && group.disabled);
    const currentTheme = isGroup && group.theme ? group.theme : theme;
    const currentSize = isGroup && group.size ? group.size : size;
    const currentShape = isGroup && group.shape ? group.shape : shape;

    const labelText = label || children || String(value);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (currentDisabled || isChecked) return;
      const nextChecked = true;
      const eventObj: ChangeEvent = {
        checked: nextChecked,
        value: value,
        label: typeof labelText === "string" ? labelText : "",
      };
      onChange?.(eventObj);
      group?.onChange?.(eventObj);
      e.preventDefault();
    };

    return (
      <Button
        ref={ref}
        disabled={currentDisabled}
        size={currentSize}
        icon={icon}
        theme={currentTheme as any}
        shape={currentShape}
        type={isChecked ? "primary" : "default"}
        onClick={handleClick as any}
        {...(rest as any)}
      >
        {labelText}
      </Button>
    );
  }
);

RadioButton.displayName = "RadioButton";

export default RadioButton;
