import clsx from "clsx";
import { Check } from "kui-icons";
import React from "react";
import Icon from "../icon";

export interface OptionSelectEvent {
  value: string | number;
  label: string | number;
}

export interface OptionProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "onSelect"> {
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
  onMouseEnter,
  children,
  className = "",
  ...rest
}) => {
  const labelText = label || children || value;

  const handleSelect = () => {
    if (disabled) return;
    onSelect?.({
      value,
      label: typeof labelText === "string" || typeof labelText === "number" ? labelText : value,
    });
  };

  const classes = clsx(
    "k-select-item",
    {
      "k-select-item-selected": checked,
      "k-select-item-active": active,
      "k-select-item-disabled": disabled,
    },
    className
  );

  return (
    <li className={classes} onClick={handleSelect} onMouseEnter={onMouseEnter} {...rest}>
      <span>
        {labelText}
        {multiple ? <Icon type={Check} /> : null}
      </span>
    </li>
  );
};

export default Option;
