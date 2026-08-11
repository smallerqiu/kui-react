import clsx from "clsx";
import React, { useState } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
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
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = value ?? innerValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (value === undefined) {
      setInnerValue(v);
    }
    onChange?.(v);
    onInput?.(e as any);
  };

  const classes = clsx(
    "k-textarea",
    {
      "k-textarea-fill": theme === "fill",
      "k-textarea-outline": theme === "outline",
      "k-textarea-sm": size === "small",
      "k-textarea-square": shape === "square",
      "k-textarea-lg": size === "large",
    },
    className
  );

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
