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

  const classes = [
    "k-select-item",
    checked ? "k-select-item-selected" : "",
    active ? "k-select-item-active" : "",
    disabled ? "k-select-item-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
