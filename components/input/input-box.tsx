import React from "react";

export interface InputBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  multiple?: boolean;
  disabled?: boolean;
  size?: string;
  theme?: string;
  shape?: string;
  inputType?: string;
  value?: any;
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

  const classes = [
    !multiple ? `k-${inputType}` : "",
    multiple ? `k-${inputType}-text` : "",
    disabled ? `k-${inputType}-disabled` : "",
    size === "small" && !multiple ? `k-${inputType}-sm` : "",
    size === "large" && !multiple ? `k-${inputType}-lg` : "",
    theme !== "solid" && !multiple && theme ? `k-${inputType}-${theme}` : "",
    shape === "circle" && !multiple ? `k-${inputType}-circle` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <input
      ref={inputRef}
      className={classes}
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
