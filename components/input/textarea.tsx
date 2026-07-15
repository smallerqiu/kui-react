import React, { useState, useEffect } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value?: any;
  defaultValue?: any;
  theme?: ThemeType;
  shape?: ShapeType;
  size?: SizeType;
  onChange?: (value: string) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  defaultValue = "",
  theme = "fill",
  shape,
  size,
  placeholder,
  rows = 2,
  disabled = false,
  onChange,
  className = "",
  onInput,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(value !== undefined ? value : defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (value === undefined) {
      setCurrentValue(v);
    }
    onChange?.(v);
    onInput?.(e as any);
  };

  const classes = [
    "k-textarea",
    theme === "fill" ? "k-textarea-fill" : "",
    theme === "outline" ? "k-textarea-outline" : "",
    size === "small" ? "k-textarea-sm" : "",
    shape === "square" ? "k-textarea-square" : "",
    size === "large" ? "k-textarea-lg" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      className={classes}
      disabled={disabled}
      value={currentValue ?? ""}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default TextArea;
