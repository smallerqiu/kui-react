import {
  forwardRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import Tooltip from "../tooltip";

export interface ThumbProps {
  value: number;
  min?: number;
  max?: number;
  vertical?: boolean;
  size?: "small" | number;
  reverse?: boolean;
  disabled?: boolean;
  tooltipVisible?: boolean | null;
  tipFormatter?: (value: number) => string | number;
  dragging?: boolean;
  onDragStart?: (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

const Thumb = forwardRef<HTMLDivElement, ThumbProps>(function Thumb(
  {
    value,
    min = 0,
    max = 100,
    vertical = false,
    size,
    reverse = false,
    disabled = false,
    tooltipVisible = null,
    tipFormatter,
    dragging = false,
    onDragStart,
    onKeyDown,
  },
  ref
) {
  const [hovered, setHovered] = useState(false);
  const percent = max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const thumbSize = size === "small" ? 18 : typeof size === "number" ? size : 24;
  const position = `calc(${percent}% + ${(0.5 - percent / 100) * thumbSize}px)`;
  const style: CSSProperties = vertical
    ? reverse
      ? { top: position, transform: "translate(-50%, -50%)" }
      : { bottom: position, transform: "translate(-50%, 50%)" }
    : reverse
      ? { right: position, transform: "translate(50%, -50%)" }
      : { left: position, transform: "translate(-50%, -50%)" };
  const shown = tooltipVisible === true || (tooltipVisible !== false && (dragging || hovered));

  return (
    <Tooltip
      title={tipFormatter ? tipFormatter(value) : String(value)}
      disabled={disabled || tooltipVisible === false}
      show={shown && !disabled}
      placement={vertical ? "right" : "top"}
    >
      <div
        ref={ref}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        tabIndex={disabled ? undefined : 0}
        className={[
          "k-slider-thumb",
          dragging && "is-dragging",
          size === "small" && "k-slider-thumb-sm",
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) onDragStart?.(event);
        }}
        onTouchStart={(event) => {
          event.stopPropagation();
          if (!disabled) onDragStart?.(event);
        }}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    </Tooltip>
  );
});

export default Thumb;
