import type { ReactNode, Key } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import { resolvePaintedTheme, SURFACE_THEMES } from "../config/use-config-appearance";
import Space from "../space";
import Tag from "../tag";
import Tooltip from "../tooltip";

interface SelectionTagsOptions {
  labels: ReactNode[];
  maxTagCount?: number;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  disabled?: boolean;
  readOnly?: boolean;
  onRemove: (index: number) => void;
  overflowSize?: SizeType;
  tagClass?: string;
  restClass?: string;
  tooltipClass?: string;
  keys?: Key[];
}

// Keep overflow indexes tied to the original selection, including maxTagCount=0.
export function renderSelectionTags({
  labels,
  maxTagCount,
  size = "medium",
  shape,
  theme,
  disabled,
  readOnly,
  onRemove,
  overflowSize = size,
  tagClass,
  restClass,
  tooltipClass,
  keys,
}: SelectionTagsOptions) {
  const count =
    typeof maxTagCount === "number" && Number.isFinite(maxTagCount)
      ? Math.max(0, Math.floor(maxTagCount))
      : labels.length;
  // The control that owns these chips resolves six tiers; a chip paints five. `underlined` on a select
  // therefore lands on the filled chip the tag itself would have fallen back to — the value handed to
  // `Tag` is exactly the one its own guard produced, which is what lets `Tag`'s prop be typed by what it
  // paints. Resolving here cannot let a provider repaint a chip: the tier always arrives defined.
  const chipTheme = resolvePaintedTheme(theme, SURFACE_THEMES) ?? "fill";
  const renderTag = (label: ReactNode, index: number, overflow = false) => (
    <Tag
      key={`${keys?.[index] ?? label}-${index}`}
      className={overflow ? undefined : tagClass}
      size={overflow ? overflowSize : size}
      shape={shape}
      theme={chipTheme}
      compact
      closeable={!disabled && !readOnly}
      onClose={() => onRemove(index)}
    >
      {label}
    </Tag>
  );
  const tags = labels.slice(0, count).map((label, index) => renderTag(label, index));
  const hidden = labels.slice(count);
  const preview = (
    <Space wrap size={4} theme-mode="dark">
      {hidden.map((label, index) => renderTag(label, count + index, true))}
    </Space>
  );
  if (hidden.length)
    tags.push(
      <Tooltip
        key="tag-more"
        title={tooltipClass ? <div className={tooltipClass}>{preview}</div> : preview}
      >
        <Tag className={restClass} size={size} shape={shape} theme={chipTheme} compact>
          +{hidden.length}...
        </Tag>
      </Tooltip>,
    );
  return tags;
}
