import clsx from "clsx";
import { X } from "kui-icons";
import React, { useState } from "react";
import Icon from "../icon";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

export interface InputTagProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  allowDuplicates?: boolean;
  max?: number;
  separators?: string[];
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  onChange?: (value: string[]) => void;
  onAdd?: (value: string) => void;
  onRemove?: (value: string, index: number) => void;
}
const InputTag: React.FC<InputTagProps> = ({
  value,
  defaultValue = [],
  placeholder,
  disabled = false,
  allowDuplicates = false,
  max,
  separators = [","],
  size,
  shape,
  theme = "fill",
  onChange,
  onAdd,
  onRemove,
  className,
  ...rest
}) => {
  const [inner, setInner] = useState(defaultValue);
  const [draft, setDraft] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const tags = value ?? inner;
  const commit = (raw = draft) => {
    const text = raw.trim();
    if (!text || (max !== undefined && tags.length >= max)) return;
    if (
      !allowDuplicates &&
      tags.some((tag) => tag.toLocaleLowerCase() === text.toLocaleLowerCase())
    ) {
      setDraft("");
      return;
    }
    const next = [...tags, text];
    if (value === undefined) setInner(next);
    setDraft("");
    onChange?.(next);
    onAdd?.(text);
  };
  const remove = (index: number) => {
    if (disabled) return;
    const removed = tags[index];
    const next = tags.filter((_, i) => i !== index);
    if (value === undefined) setInner(next);
    onChange?.(next);
    onRemove?.(removed, index);
  };
  return (
    <div
      {...rest}
      data-multiple=""
      className={clsx(
        "k-input",
        "k-input-tag",
        {
          "k-input-disabled": disabled,
          "k-input-sm": size === "small",
          "k-input-lg": size === "large",
          "k-input-circle": shape === "circle",
          "k-input-square": shape === "square",
          [`k-input-${theme}`]: theme !== "outline",
        },
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <span className="k-select-tag k-input-tag-item" key={`${tag}-${index}`}>
          {tag}
          <Icon
            type={X}
            onClick={(event) => {
              event.stopPropagation();
              remove(index);
            }}
          />
        </span>
      ))}
      <input
        ref={inputRef}
        className="k-input-text k-input-tag-input"
        disabled={disabled}
        value={draft}
        placeholder={!tags.length ? placeholder : undefined}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commit();
            event.preventDefault();
          } else if (event.key === "Backspace" && !draft) remove(tags.length - 1);
          else if (separators.includes(event.key)) {
            commit();
            event.preventDefault();
          }
        }}
      />
    </div>
  );
};
export default InputTag;
