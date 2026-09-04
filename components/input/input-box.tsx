import clsx from "clsx";
import React from "react";

export interface InputBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  multiple?: boolean;
  disabled?: boolean;
  size?: string;
  theme?: string;
  shape?: string;
  inputType?: string;
  value?: string | number | readonly string[];
  showPassword?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

const InputBox: React.FC<InputBoxProps> = ({
  multiple,
  disabled,
  size,
  type,
  theme,
  shape,
  inputType,
  value,
  showPassword,
  inputRef,
  className = "",
  onFocus,
  onBlur,
  onInput,
  ...rest
}) => {
  let currentType = type;
  if (showPassword === true && currentType === "password") {
    currentType = "text";
  }

  const classes = clsx(
    {
      [`k-${inputType}`]: !multiple,
      [`k-${inputType}-text`]: multiple,
      [`k-${inputType}-disabled`]: disabled,
      [`k-${inputType}-sm`]: size === "small" && !multiple,
      [`k-${inputType}-lg`]: size === "large" && !multiple,
      [`k-${inputType}-${theme}`]: theme !== "solid" && !multiple && theme,
      [`k-${inputType}-circle`]: shape === "circle" && !multiple,
      [`k-${inputType}-square`]: shape === "square" && !multiple,
    },
    className,
  );
  return (
    <input
      ref={inputRef}
      className={classes}
      data-single=""
      disabled={disabled}
      type={currentType}
      value={value ?? ""}
      onFocus={onFocus}
      onBlur={onBlur}
      onInput={onInput}
      {...rest}
    />
  );
};

export default InputBox;
