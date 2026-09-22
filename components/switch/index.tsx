import { useValue } from "../utils/use-value";
import { useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { createFormFieldComponent } from "../form/field-context";
import { Loading } from "kui-icons";
import React from "react";
import type { ShapeType, SizeType, ValueType } from "../const/types";
import Icon from "../icon";
import { getValueWithType } from "../utils/checked";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type" | "defaultValue" | "defaultChecked"
> {
  checked?: boolean;
  valueType?: ValueType;
  type?: string;
  color?: string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  size?: SizeType;
  shape?: ShapeType;
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
  color,
  disabled = false,
  readOnly = false,
  loading = false,
  size: sizeProp,
  shape: shapeProp,
  trueText,
  falseText,
  checkedChildren,
  unCheckedChildren,
  onChange,
  className = "",
  style,
  onClick,
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const shape = shapeProp ?? inheritedAppearance.shape ?? "round";
  const [innerChecked, setInnerChecked] = useValue(checked, (next) => next ?? false);
  const currentChecked = innerChecked;

  const change = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || readOnly || loading) {
      return;
    }
    const nextChecked = !currentChecked;
    setInnerChecked(nextChecked);

    const val = getValueWithType(nextChecked, valueType);
    onChange?.(val);
    onClick?.(e);
  };

  const classes = clsx(
    "k-switch",
    {
      "k-switch-checked": currentChecked,
      "k-switch-disabled": disabled || loading,
      "k-switch-readonly": readOnly,
      [`k-switch-${type}`]: type,
      "k-switch-sm": size === "small",
      [`k-switch-${shape}`]: shape,
    },
    className,
  );

  const loadNode = loading ? <Icon spin type={Loading} className="k-switch-loading" /> : null;

  const currentCheckedChildren = checkedChildren ?? trueText;
  const currentUnCheckedChildren = unCheckedChildren ?? falseText;

  const showInner = size !== "small" && (currentCheckedChildren || currentUnCheckedChildren);

  const textNode = showInner ? (
    <span className="k-switch-inner">
      {currentChecked ? currentCheckedChildren : currentUnCheckedChildren}
    </span>
  ) : null;

  return (
    <button
      className={classes}
      style={{ ...(color ? { "--kui-switch-color": color } : {}), ...style } as React.CSSProperties}
      onClick={change}
      disabled={disabled || loading}
      role="switch"
      aria-checked={currentChecked}
      aria-readonly={readOnly || undefined}
      type="button"
      {...rest}
    >
      {textNode}
      {loadNode}
    </button>
  );
};

export default createFormFieldComponent(Switch, {
  valueProp: "checked",
  getFieldValue: (value) => value === true || value === 1 || value === "1",
});
