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
  readOnly?: boolean;
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
  readOnly = false,
  clearable = true,
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
  onClick,
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
  const addValues = (items: string[]) => {
    if (disabled || readOnly) return;
    const next = [...tags];
    const added: string[] = [];
    for (const item of items) {
      const text = item.trim();
      if (!text || (max !== undefined && next.length >= max)) continue;
      if (
        !allowDuplicates &&
        next.some((tag) => tag.toLocaleLowerCase() === text.toLocaleLowerCase())
      )
        continue;
      next.push(text);
      added.push(text);
    }
    if (!added.length) return;
    update(next);
    added.forEach((text) => onAdd?.(text));
  };
  const commit = (raw = draft) => {
    addValues([raw]);
    setDraft("");
  };
  const remove = (index: number) => {
    if (disabled || readOnly || index < 0) return;
    const removed = tags[index];
    update(tags.filter((_, itemIndex) => itemIndex !== index));
    onRemove?.(removed, index);
  };
  const clear = (event: React.SyntheticEvent) => {
    if (disabled || readOnly) return;
    event.stopPropagation();
    setDraft("");
    update([]);
    onClear?.();
  };
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setDraft(nextValue);
    if ((event.nativeEvent as InputEvent).isComposing) return;
    const activeSeparators = separators.filter(Boolean).sort((a, b) => b.length - a.length);
    if (!activeSeparators.some((separator) => nextValue.includes(separator))) return;
    const pattern = new RegExp(
      activeSeparators.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
      "g",
    );
    const items = nextValue.split(pattern);
    const trailing = activeSeparators.some((separator) => nextValue.endsWith(separator));
    setDraft(trailing ? "" : (items.pop() ?? ""));
    addValues(items);
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
          "k-input-tag-readonly": readOnly,
          "k-input-tag-has-clear": clearable && tags.length > 0,
          "k-input-tag-sm": size === "small",
          "k-input-tag-block": block,
          "k-input-tag-lg": size === "large",
          [`k-input-tag-${shape}`]: shape,
          [`k-input-tag-${theme}`]: theme,
        },
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) inputRef.current?.focus();
      }}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
    >
      {visibleTags.map((tag, index) => (
        <Tag
          key={`${tag}-${index}`}
          className="k-input-tag-item"
          size={size}
          shape={shape}
          theme={theme}
          compact
          closeable={!disabled && !readOnly}
          onClose={() => remove(index)}
        >
          {tag}
        </Tag>
      ))}
      {hiddenTags.length > 0 && (
        <Tooltip
          title={
            <div className="k-input-tag-tooltip-tags">
              <Space wrap size={4}>
                {hiddenTags.map((tag, index) => (
                  <Tag
                    key={`${tag}-${index}`}
                    size={size}
                    shape={shape}
                    theme={theme}
                    compact
                    closeable={!disabled && !readOnly}
                    onClose={() => remove(displayCount + index)}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          }
        >
          <Tag
            className="k-input-tag-item k-input-tag-rest"
            size={size}
            shape={shape}
            theme={theme}
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
        readOnly={readOnly}
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
      {clearable && tags.length > 0 && !disabled && !readOnly && (
        <Icon
          className="k-input-tag-clearable"
          type={CircleX}
          role="button"
          tabIndex={0}
          aria-label="Clear"
          onPointerDown={(event) => event.preventDefault()}
          onClick={clear}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") clear(event);
          }}
        />
      )}
    </div>
  );
};

export default InputTag;
