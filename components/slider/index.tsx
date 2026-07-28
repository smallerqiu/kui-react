import clsx from "clsx";
import {
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { SizeContext } from "../config/size-context";
import Thumb from "./thumb";

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: number | number[];
  defaultValue?: number | number[];
  modelValue?: number | number[];
  min?: number;
  max?: number;
  step?: number | null;
  disabled?: boolean;
  vertical?: boolean;
  reverse?: boolean;
  range?: boolean;
  marks?: Record<number, string>;
  size?: "small" | number;
  included?: boolean;
  tipFormatter?: (value: number) => string | number;
  tooltipVisible?: boolean | null;
  onChange?: (value: number | number[]) => void;
}

export default function Slider({
  value,
  defaultValue,
  modelValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  vertical = false,
  reverse = false,
  range = false,
  marks,
  size: sizeProp,
  included = true,
  tipFormatter,
  tooltipVisible = null,
  onChange,
  className,
  ...rest
}: SliderProps) {
  const contextSize = useContext(SizeContext);
  const size = sizeProp ?? (contextSize === "small" ? "small" : undefined);
  const controlled = value ?? modelValue;
  const initial = controlled ?? defaultValue ?? (range ? [min, min] : min);
  const [internal, setInternal] = useState<number | number[]>(initial);
  const current = controlled ?? internal;
  const currentRef = useRef(current);
  currentRef.current = current;
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [dragging, setDragging] = useState(-1);

  const markValues = Object.keys(marks ?? {})
    .map(Number)
    .sort((a, b) => a - b);
  const snap = (raw: number) => {
    const clamped = Math.max(min, Math.min(max, raw));
    const candidates = [...markValues];
    if (step != null && step > 0) {
      const count = Math.round((clamped - min) / step);
      candidates.push(min + step * count);
    }
    if (!candidates.length) return clamped;
    return Math.max(
      min,
      Math.min(
        max,
        candidates.reduce((best, item) =>
          Math.abs(item - clamped) < Math.abs(best - clamped) ? item : best
        )
      )
    );
  };
  const normalize = (next: number | number[]) =>
    range
      ? (Array.isArray(next) ? next : [min, min]).map(snap).sort((a, b) => a - b)
      : snap(Array.isArray(next) ? next[0] : next);

  const commit = (next: number | number[]) => {
    const normalized = normalize(next);
    currentRef.current = normalized;
    if (controlled === undefined) setInternal(normalized);
    onChange?.(normalized);
  };

  const valueFromPoint = (clientX: number, clientY: number) => {
    const rect = railRef.current!.getBoundingClientRect();
    const ratio = vertical
      ? (rect.bottom - clientY) / rect.height
      : (clientX - rect.left) / rect.width;
    const logical = reverse ? 1 - ratio : ratio;
    return snap(min + Math.max(0, Math.min(1, logical)) * (max - min));
  };
  const moveThumb = (index: number, nextValue: number) => {
    if (!range) return commit(nextValue);
    const values = [...(currentRef.current as number[])];
    values[index] = nextValue;
    commit(values);
  };
  const startDrag = (index: number) => {
    if (disabled) return;
    setDragging(index);
    const move = (event: globalThis.MouseEvent | TouchEvent) => {
      event.preventDefault();
      const point = "touches" in event ? event.touches[0] : event;
      moveThumb(index, valueFromPoint(point.clientX, point.clientY));
    };
    const end = () => {
      setDragging(-1);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
  };
  const handleRailClick = (event: ReactMouseEvent) => {
    if (disabled) return;
    const next = valueFromPoint(event.clientX, event.clientY);
    if (!range) return commit(next);
    const values = current as number[];
    moveThumb(Math.abs(next - values[0]) <= Math.abs(next - values[1]) ? 0 : 1, next);
  };
  const handleKey = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    const direction = ["ArrowRight", "ArrowUp"].includes(event.key)
      ? 1
      : ["ArrowLeft", "ArrowDown"].includes(event.key)
        ? -1
        : 0;
    if (!direction || disabled) return;
    event.preventDefault();
    const values = range ? [...(current as number[])] : [current as number];
    const amount = step ?? 1;
    moveThumb(index, snap(values[index] + direction * amount));
    requestAnimationFrame(() => thumbRefs.current[index]?.focus());
  };
  const percent = (number: number) => (max === min ? 0 : ((number - min) / (max - min)) * 100);
  const values = range ? (current as number[]) : [current as number];
  const first = range ? percent(values[0]) : 0;
  const last = percent(values[values.length - 1]);
  const trackStyle: CSSProperties = vertical
    ? reverse
      ? { top: `${first}%`, height: `${last - first}%` }
      : { bottom: `${first}%`, height: `${last - first}%` }
    : reverse
      ? { right: `${first}%`, width: `${last - first}%` }
      : { left: `${first}%`, width: `${last - first}%` };

  return (
    <div
      {...rest}
      className={clsx(
        "k-slider",
        disabled && "k-slider-disabled",
        vertical && "k-slider-vertical",
        reverse && "k-slider-reverse",
        className
      )}
    >
      <div className="k-slider-bar">
        <div className="k-slider-rail" ref={railRef} onClick={handleRailClick} />
        {included && <div className="k-slider-track" style={trackStyle} />}
        {marks && (
          <div className="k-slider-marks">
            {markValues.map((mark) => {
              const active = range ? mark >= values[0] && mark <= values[1] : mark <= values[0];
              const position: CSSProperties = vertical
                ? reverse
                  ? { top: `${percent(mark)}%` }
                  : { bottom: `${percent(mark)}%` }
                : reverse
                  ? { right: `${percent(mark)}%` }
                  : { left: `${percent(mark)}%` };
              return (
                <div key={mark} className="k-slider-mark-item" style={position}>
                  <span className={clsx("k-slider-mark-dot", active && "is-active")} />
                  <div className={clsx("k-slider-mark-text", active && "is-active")}>
                    {marks[mark]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {values.map((number, index) => (
          <Thumb
            key={index}
            ref={(element) => {
              thumbRefs.current[index] = element;
            }}
            value={number}
            min={min}
            max={max}
            size={size}
            vertical={vertical}
            reverse={reverse}
            disabled={disabled}
            tooltipVisible={tooltipVisible}
            tipFormatter={tipFormatter}
            dragging={dragging === index}
            onDragStart={() => startDrag(index)}
            onKeyDown={(event) => handleKey(event, index)}
          />
        ))}
      </div>
    </div>
  );
}
