import clsx from "clsx";
import React, { useState } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

export interface TextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  theme?: ThemeType;
  shape?: ShapeType;
  size?: SizeType;
  onChange?: (value: string) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
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
    },
    ref
  ) => {
    const [innerValue, setInnerValue] = useState(defaultValue);
    const currentValue = value ?? innerValue;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      if (value === undefined) {
        setInnerValue(v);
      }
      onChange?.(v);
    };

    const classes = clsx(
      "k-textarea",
      {
        "k-textarea-fill": theme === "fill",
        "k-textarea-outline": theme === "outline",
        "k-textarea-plain": theme === "plain",
        "k-textarea-sm": size === "small",
        "k-textarea-square": shape === "square",
        "k-textarea-circle": shape === "circle",
        "k-textarea-lg": size === "large",
      },
      className
    );

    return (
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        className={classes}
        disabled={disabled}
        value={currentValue ?? ""}
        onChange={handleChange}
        onInput={onInput}
        {...rest}
      />
    );
  }
);
TextArea.displayName = "TextArea";

export default TextArea;
