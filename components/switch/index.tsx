import React, { useState, useEffect } from "react";
import { Loading } from "kui-icons";
import type { SizeType, ValueType } from "../const/types";
import Icon from "../icon";
import { getValueWithType } from "../utils/checked";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  valueType?: ValueType;
  type?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: SizeType;
  trueText?: string;
  falseText?: string;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: (value: boolean | number | string) => void;
}

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  valueType = "boolean",
  type,
  disabled = false,
  loading = false,
  size,
  trueText,
  falseText,
  checkedChildren,
  unCheckedChildren,
  onChange,
  className = "",
  onClick,
  ...rest
}) => {
  const [localChecked, setLocalChecked] = useState(checked);

  useEffect(() => {
    setLocalChecked(checked);
  }, [checked]);

  const change = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      return;
    }
    const nextChecked = !localChecked;
    setLocalChecked(nextChecked);

    const val = getValueWithType(nextChecked, valueType);
    onChange?.(val);
    onClick?.(e);
  };

  const classes = [
    "k-switch",
    localChecked ? "k-switch-checked" : "",
    disabled || loading ? "k-switch-disabled" : "",
    type ? `k-switch-${type}` : "",
    size === "small" ? "k-switch-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const loadNode = loading ? <Icon spin type={Loading} className="k-switch-loading" /> : null;

  const currentCheckedChildren = checkedChildren || trueText;
  const currentUnCheckedChildren = unCheckedChildren || falseText;

  const showInner = size !== "small" && (currentCheckedChildren || currentUnCheckedChildren);

  const textNode = showInner ? (
    <span className="k-switch-inner">
      {localChecked ? currentCheckedChildren : currentUnCheckedChildren}
    </span>
  ) : null;

  return (
    <button
      className={classes}
      onClick={change}
      disabled={disabled || loading}
      type="button"
      {...rest}
    >
      {textNode}
      {loadNode}
    </button>
  );
};

export default Switch;
