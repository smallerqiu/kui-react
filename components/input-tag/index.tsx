import clsx from "clsx";
import { CircleX } from "kui-icons";
import React, { useRef, useState } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import Icon from "../icon";
import Space from "../space";
import Tag from "../tag";
import Tooltip from "../tooltip";

export interface InputTagProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  block?: boolean;
  allowDuplicates?: boolean;
  max?: number;
  maxTagCount?: number;
  separators?: string[];
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  onChange?: (value: string[]) => void;
  onAdd?: (value: string) => void;
  onRemove?: (value: string, index: number) => void;
  onClear?: () => void;
}

const InputTag: React.FC<InputTagProps> = ({
  value,
  defaultValue = [],
  placeholder,
  disabled = false,
  clearable = false,
  block = false,
  allowDuplicates = false,
  max,
  maxTagCount,
  separators = [","],
  size = "medium",
  shape,
  theme = "fill",
  onChange,
  onAdd,
  onRemove,
  onClear,
  className,
  ...rest
}) => {
  const [inner, setInner] = useState(defaultValue);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = value ?? inner;

  const update = (next: string[]) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  const commit = (raw = draft) => {
    const text = raw.trim();
    if (!text || (max !== undefined && tags.length >= max)) {
      setDraft("");
      return;
    }
    if (
      !allowDuplicates &&
      tags.some((tag) => tag.toLocaleLowerCase() === text.toLocaleLowerCase())
    ) {
      setDraft("");
      return;
    }
    update([...tags, text]);
    setDraft("");
    onAdd?.(text);
  };
  const remove = (index: number) => {
    if (disabled || index < 0) return;
    const removed = tags[index];
    update(tags.filter((_, itemIndex) => itemIndex !== index));
    onRemove?.(removed, index);
  };
  const clear = (event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation();
    setDraft("");
    update([]);
    onClear?.();
  };
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setDraft(nextValue);
    if ((event.nativeEvent as InputEvent).isComposing) return;
    const separator = separators.find((item) => item && nextValue.endsWith(item));
    if (!separator) return;
    const text = nextValue.slice(0, -separator.length);
    setDraft(text);
    commit(text);
  };

  const hasDisplayLimit = typeof maxTagCount === "number" && Number.isFinite(maxTagCount);
  const displayCount = hasDisplayLimit ? Math.max(0, Math.floor(maxTagCount)) : tags.length;
  const visibleTags = tags.slice(0, displayCount);
  const hiddenTags = tags.slice(displayCount);

  return (
    <div
      {...rest}
      className={clsx(
        "k-input-tag",
        {
          "k-input-tag-disabled": disabled,
          "k-input-tag-has-clear": clearable && tags.length > 0,
          "k-input-tag-sm": size === "small",
          "k-input-tag-block": block,
          "k-input-tag-lg": size === "large",
          [`k-input-tag-${shape}`]: shape,
          [`k-input-tag-${theme}`]: theme,
        },
        className
      )}
      onClick={() => !disabled && inputRef.current?.focus()}
    >
      {visibleTags.map((tag, index) => (
        <Tag
          key={`${tag}-${index}`}
          className="k-input-tag-item"
          size={size}
          shape={shape}
          theme="fill"
          compact
          closeable={!disabled}
          onClose={() => remove(index)}
        >
          {tag}
        </Tag>
      ))}
      {hiddenTags.length > 0 && (
        <Tooltip
          title={
            <Space wrap size={4}>
              {hiddenTags.map((tag, index) => (
                <Tag
                  key={`${tag}-${index}`}
                  size="small"
                  shape={shape}
                  theme="fill"
                  compact
                  closeable={!disabled}
                  onClose={() => remove(displayCount + index)}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          }
        >
          <Tag
            className="k-input-tag-item k-input-tag-rest"
            size={size}
            shape={shape}
            theme="fill"
            compact
          >
            +{hiddenTags.length}...
          </Tag>
        </Tooltip>
      )}
      <input
        ref={inputRef}
        className="k-input-text k-input-tag-input"
        disabled={disabled}
        value={draft}
        placeholder={!tags.length ? placeholder : undefined}
        onChange={inputHandler}
        onBlur={() => commit()}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === "Enter") {
            commit(event.currentTarget.value);
            event.preventDefault();
          } else if (event.key === "Backspace" && !draft) {
            remove(tags.length - 1);
          } else if (separators.includes(event.key)) {
            commit(event.currentTarget.value);
            event.preventDefault();
          }
        }}
      />
      {clearable && tags.length > 0 && !disabled && (
        <Icon className="k-input-tag-clearable" type={CircleX} onClick={clear} />
      )}
    </div>
  );
};

export default InputTag;
