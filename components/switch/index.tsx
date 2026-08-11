import clsx from "clsx";
import { Loading } from "kui-icons";
import React, { useState } from "react";
import type { SizeType, ValueType } from "../const/types";
import Icon from "../icon";
import { getValueWithType } from "../utils/checked";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type"
> {
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
  checked,
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
  const [innerChecked, setInnerChecked] = useState(false);
  const currentChecked = checked ?? innerChecked;

  const change = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      return;
    }
    const nextChecked = !currentChecked;
    if (checked === undefined) setInnerChecked(nextChecked);

    const val = getValueWithType(nextChecked, valueType);
    onChange?.(val);
    onClick?.(e);
  };

  const classes = clsx(
    "k-switch",
    {
      "k-switch-checked": currentChecked,
      "k-switch-disabled": disabled || loading,
      [`k-switch-${type}`]: type,
      "k-switch-sm": size === "small",
    },
    className
  );

  const loadNode = loading ? <Icon spin type={Loading} className="k-switch-loading" /> : null;

  const currentCheckedChildren = checkedChildren || trueText;
  const currentUnCheckedChildren = unCheckedChildren || falseText;

  const showInner = size !== "small" && (currentCheckedChildren || currentUnCheckedChildren);

  const textNode = showInner ? (
    <span className="k-switch-inner">
      {currentChecked ? currentCheckedChildren : currentUnCheckedChildren}
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
