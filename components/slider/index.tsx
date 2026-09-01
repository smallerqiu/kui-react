import Big from "big.js";
import clsx from "clsx";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { SizeContext } from "../config/size-context";
import { getClosestStep } from "../utils/number";
import Thumb from "./thumb";

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: number | number[];
  defaultValue?: number | number[];
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
  const config = { min, max, step, marks };
  const sortValue = (next: number | number[]) =>
    Array.isArray(next) ? [...next].sort((a, b) => a - b) : next;
  const formatValue = (next: number | number[]): number | number[] => {
    if (range) {
      const values = Array.isArray(next) ? next : [min, min];
      const first = values[0] ?? min;
      const second = values[1] ?? first;
      return sortValue([first, second].map((item) => getClosestStep(item, config)));
    }
    return getClosestStep(Array.isArray(next) ? (next[0] ?? min) : next, config);
  };

  const sourceValue = value ?? defaultValue ?? (range ? [min, min] : min);
  const [internalValue, setInternalValue] = useState<number | number[]>(() =>
    formatValue(sourceValue),
  );
  const [syncedSource, setSyncedSource] = useState({ value, min, max, step, range, marks });
  const [railWidth, setRailWidth] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const draggingIndexRef = useRef(-1);
  const internalValueRef = useRef(internalValue);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeMoveRef = useRef<((event: globalThis.MouseEvent | TouchEvent) => void) | null>(null);
  const activeUpRef = useRef<(() => void) | null>(null);

  if (
    draggingIndex === -1 &&
    (syncedSource.value !== value ||
      syncedSource.min !== min ||
      syncedSource.max !== max ||
      syncedSource.step !== step ||
      syncedSource.range !== range ||
      syncedSource.marks !== marks)
  ) {
    const next = formatValue(sourceValue);
    setSyncedSource({ value, min, max, step, range, marks });
    setInternalValue(next);
  }

  useEffect(() => {
    internalValueRef.current = internalValue;
  }, [internalValue]);
  const stopDragging = () => {
    draggingIndexRef.current = -1;
    setDraggingIndex(-1);
    if (activeMoveRef.current) {
      document.removeEventListener("mousemove", activeMoveRef.current);
      document.removeEventListener("touchmove", activeMoveRef.current);
    }
    if (activeUpRef.current) {
      document.removeEventListener("mouseup", activeUpRef.current);
      document.removeEventListener("touchend", activeUpRef.current);
      document.removeEventListener("touchcancel", activeUpRef.current);
    }
    activeMoveRef.current = null;
    activeUpRef.current = null;
  };

  useEffect(() => {
    const updateSize = () => {
      if (railRef.current) {
        setRailWidth(vertical ? railRef.current.offsetHeight : railRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateSize);
    if (railRef.current) observer?.observe(railRef.current);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateSize);
      if (activeMoveRef.current) {
        document.removeEventListener("mousemove", activeMoveRef.current);
        document.removeEventListener("touchmove", activeMoveRef.current);
      }
      if (activeUpRef.current) {
        document.removeEventListener("mouseup", activeUpRef.current);
        document.removeEventListener("touchend", activeUpRef.current);
        document.removeEventListener("touchcancel", activeUpRef.current);
      }
    };
  }, [vertical]);

  const getPercent = (next: number) => {
    const difference = max - min;
    return difference === 0 ? 0 : Math.max(0, Math.min(100, ((next - min) / difference) * 100));
  };
  const getValueFromEvent = (event: globalThis.MouseEvent | TouchEvent | ReactMouseEvent) => {
    const rect = railRef.current!.getBoundingClientRect();
    const width = vertical ? rect.height : rect.width;
    const thumbSize = size === "small" ? 18 : 24;
    const radius = thumbSize / 2;
    const point = "touches" in event ? event.touches[0] : event;
    const distance = vertical ? rect.bottom - point.clientY : point.clientX - rect.left;
    const logicalDistance = reverse ? width - distance : distance;
    const available = width - thumbSize;
    const percent =
      available > 0 ? Math.max(0, Math.min(1, (logicalDistance - radius) / available)) : 0;
    const rawValue = new Big(max - min).times(percent).plus(min);
    return getClosestStep(Number(rawValue), config);
  };
  const commit = (next: number | number[]) => {
    internalValueRef.current = next;
    setInternalValue(next);
    onChange?.(next);
  };
  const handleThumbMove = (event: globalThis.MouseEvent | TouchEvent) => {
    if (disabled || draggingIndexRef.current === -1) return;
    if (event.cancelable) event.preventDefault();
    const nextValue = getValueFromEvent(event);
    let nextInternal: number | number[];
    if (range) {
      const oldValues = [...(internalValueRef.current as number[])];
      oldValues[draggingIndexRef.current] = nextValue;
      if (oldValues[0] > oldValues[1]) {
        nextInternal = [oldValues[1], oldValues[0]];
        draggingIndexRef.current = draggingIndexRef.current === 0 ? 1 : 0;
        setDraggingIndex(draggingIndexRef.current);
      } else {
        nextInternal = oldValues;
      }
    } else {
      nextInternal = nextValue;
    }
    if (JSON.stringify(nextInternal) !== JSON.stringify(internalValueRef.current))
      commit(nextInternal);
  };
  const handleRailClick = (event: ReactMouseEvent) => {
    if (disabled) return;
    const nextValue = getValueFromEvent(event);
    if (range) {
      const [first, second] = internalValueRef.current as number[];
      const targetIndex = Math.abs(nextValue - first) <= Math.abs(nextValue - second) ? 0 : 1;
      const nextValues = [...(internalValueRef.current as number[])];
      nextValues[targetIndex] = nextValue;
      commit(sortValue(nextValues));
    } else commit(nextValue);
  };
  const handleThumbDown = (index: number) => {
    if (disabled) return;
    stopDragging();
    draggingIndexRef.current = index;
    setDraggingIndex(index);
    activeMoveRef.current = handleThumbMove;
    activeUpRef.current = stopDragging;
    document.addEventListener("mousemove", activeMoveRef.current);
    document.addEventListener("mouseup", activeUpRef.current);
    document.addEventListener("touchmove", activeMoveRef.current, { passive: false });
    document.addEventListener("touchend", activeUpRef.current);
    document.addEventListener("touchcancel", activeUpRef.current);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    const isPlus = ["ArrowRight", "ArrowUp"].includes(event.key);
    const isMinus = ["ArrowLeft", "ArrowDown"].includes(event.key);
    if (!isPlus && !isMinus) return;
    event.preventDefault();
    const currentValues = range
      ? [...(internalValueRef.current as number[])]
      : [internalValueRef.current as number];
    const targetValue = currentValues[index];
    let nextValue: number;
    if (typeof step !== "number") {
      const markValues = Object.keys(marks ?? {})
        .map(Number)
        .filter((item) => Number.isFinite(item) && item >= min && item <= max)
        .sort((a, b) => a - b);
      if (!markValues.length) return;
      const currentIndex = markValues.indexOf(getClosestStep(targetValue, config));
      const nextIndex = Math.max(
        0,
        Math.min(markValues.length - 1, currentIndex + (isPlus ? 1 : -1)),
      );
      nextValue = markValues[nextIndex];
    } else nextValue = Number(new Big(targetValue).plus(isPlus ? step : -step));

    if (range) {
      const otherIndex = index === 0 ? 1 : 0;
      const otherValue = currentValues[otherIndex];
      const crossed =
        (index === 0 && nextValue > otherValue) || (index === 1 && nextValue < otherValue);
      if (crossed) {
        const nextInternal: number[] = [];
        nextInternal[index] = otherValue;
        nextInternal[otherIndex] = getClosestStep(nextValue, config);
        commit(nextInternal.sort((a, b) => a - b));
        requestAnimationFrame(() => thumbRefs.current[otherIndex]?.focus());
      } else {
        currentValues[index] = nextValue;
        commit(formatValue(currentValues));
      }
    } else commit(formatValue(nextValue));
  };
  const getCoord = (next: number) => {
    const percent = getPercent(next) / 100;
    const thumbSize = size === "small" ? 18 : 24;
    const radius = thumbSize / 2;
    if (railWidth === 0) return 0;
    const edge = 18;
    const thumbPosition = percent * (railWidth - thumbSize) + radius;
    if (thumbPosition < edge) return ((thumbPosition - radius) / (edge - radius)) * edge;
    if (thumbPosition > railWidth - edge) {
      return railWidth - edge + ((thumbPosition - (railWidth - edge)) / (edge - radius)) * edge;
    }
    return thumbPosition;
  };

  const values = range ? (internalValue as number[]) : [internalValue as number];
  const renderTrack = () => {
    if (!included && marks) return null;
    const [first, second] = range ? values : [min, values[0]];
    const startPosition = getCoord(Math.min(first, second));
    const endPosition = getCoord(Math.max(first, second));
    const start = range ? `${startPosition}px` : "0px";
    const length = range ? `${endPosition - startPosition}px` : `${endPosition}px`;
    const style: CSSProperties = vertical
      ? reverse
        ? { top: start, height: length }
        : { bottom: start, height: length }
      : reverse
        ? { right: start, width: length }
        : { left: start, width: length };
    return <div className="k-slider-track" style={style} />;
  };
  const markValues = Object.keys(marks ?? {})
    .map(Number)
    .filter((item) => Number.isFinite(item) && item >= min && item <= max);

  return (
    <div
      {...rest}
      className={clsx(
        "k-slider",
        {
          "k-slider-disabled": disabled,
          "k-slider-vertical": vertical,
          "k-slider-reverse": reverse,
        },
        className,
      )}
    >
      <div className="k-slider-bar">
        <div className="k-slider-rail" ref={railRef} onClick={handleRailClick} />
        {renderTrack()}
        {marks && (
          <div className="k-slider-marks">
            {markValues.map((mark) => {
              const coordinate = getCoord(mark);
              const active = range
                ? mark >= values[0] && mark <= values[1]
                : mark <= (internalValue as number);
              const style: CSSProperties = vertical
                ? reverse
                  ? { top: `${coordinate}px`, transform: "translateY(-50%)" }
                  : { bottom: `${coordinate}px`, transform: "translateY(50%)" }
                : reverse
                  ? { right: `${coordinate}px`, transform: "translateX(50%)" }
                  : { left: `${coordinate}px`, transform: "translateX(-50%)" };
              if (vertical) {
                if (mark === max) style.marginTop = "-4px";
                if (mark === min) style.marginTop = "4px";
              } else {
                if (mark === max) style.marginLeft = "-4px";
                if (mark === min) style.marginLeft = "4px";
              }
              return (
                <div key={mark} className="k-slider-mark-item" style={style}>
                  <span className={clsx("k-slider-mark-dot", { "is-active": active })} />
                  <div className={clsx("k-slider-mark-text", { "is-active": active })}>
                    {marks[mark]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {values.map((currentValue, index) => (
          <Thumb
            key={index}
            ref={(element) => {
              thumbRefs.current[index] = element;
            }}
            value={currentValue}
            min={min}
            max={max}
            size={size}
            vertical={vertical}
            reverse={reverse}
            disabled={disabled}
            tooltipVisible={tooltipVisible}
            tipFormatter={tipFormatter}
            dragging={draggingIndex === index}
            onDragStart={() => handleThumbDown(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        ))}
      </div>
    </div>
  );
}
