import clsx from "clsx";
import { Check } from "kui-icons";
import React from "react";
import Icon from "../icon";

export interface OptionSelectEvent {
  value: string | number;
  label: string | number;
}

export interface OptionProps extends Omit<
  React.HTMLAttributes<HTMLLIElement>,
  "onSelect" | "defaultValue" | "defaultChecked"
> {
  value: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  active?: boolean;
  multiple?: boolean;
  onSelect?: (event: OptionSelectEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
}

const Option: React.FC<OptionProps> = ({
  value,
  label,
  disabled = false,
  checked = false,
  active = false,
  multiple = false,
  onSelect,
  onClick,
  onMouseEnter,
  children,
  className = "",
  ...rest
}) => {
  const labelText = label ?? children ?? value;

  const handleSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) return;
    onSelect?.({
      value,
      label: typeof labelText === "string" || typeof labelText === "number" ? labelText : value,
    });
    onClick?.(event);
  };

  const classes = clsx(
    "k-select-item",
    {
      "k-select-item-selected": checked,
      "k-select-item-active": active,
      "k-select-item-disabled": disabled,
    },
    className,
  );

  return (
    <li
      {...rest}
      className={classes}
      onClick={handleSelect}
      onMouseEnter={disabled ? undefined : onMouseEnter}
      aria-disabled={disabled}
    >
      <span>
        {labelText}
        {multiple ? <Icon type={Check} /> : null}
      </span>
    </li>
  );
};

export default Option;
