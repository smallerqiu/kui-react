import clsx from "clsx";
import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { DirectionType } from "../const/types";
import type { SplitterPanelProps } from "./splitter-panel";

export interface SplitterProps extends Omit<HTMLAttributes<HTMLDivElement>, "onResize"> {
  direction?: DirectionType;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  onResizeStart?: (sizes: number[]) => void;
}

const parseToPixels = (value: number | string | undefined, total: number) => {
  if (value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const text = String(value).trim();
  if (text.endsWith("%")) return (Number.parseFloat(text) / 100) * total;
  if (text.endsWith("px")) return Number.parseFloat(text);
  return Number.isFinite(Number(text)) ? Number.parseFloat(text) : null;
};

export function Splitter({
  direction = "horizontal",
  onResize,
  onResizeEnd,
  onResizeStart,
  className,
  children,
  ...rest
}: SplitterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sizesRef = useRef<number[]>([]);
  const limitsRef = useRef({ min: [] as number[], max: [] as number[] });
  const dragRef = useRef<number | null>(null);
  const moveHandlerRef = useRef<((event: MouseEvent) => void) | null>(null);
  const upHandlerRef = useRef<(() => void) | null>(null);
  const bodyCursorRef = useRef("");
  const [sizes, setSizes] = useState<number[]>([]);
  const [limits, setLimits] = useState({ min: [] as number[], max: [] as number[] });
  const [dragging, setDragging] = useState(false);
  const panels = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<SplitterPanelProps>[],
    [children],
  );

  const initialize = useCallback(() => {
    const container = containerRef.current;
    if (!container || panels.length === 0) return;
    const rect = container.getBoundingClientRect();
    const total = (direction === "horizontal" ? rect.width : rect.height) - (panels.length - 1) * 4;
    const min = panels.map((panel) => parseToPixels(panel.props.min, total) ?? 0);
    const max = panels.map((panel) => parseToPixels(panel.props.max, total) ?? total);
    const raw = panels.map((panel) => parseToPixels(panel.props.size, total));
    const defined = raw.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const emptyCount = raw.filter((value) => value == null).length;
    const automatic = emptyCount ? Math.max(0, total - defined) / emptyCount : 0;
    const next = raw.map((value) => value ?? automatic);
    const nextLimits = { min, max };
    limitsRef.current = nextLimits;
    setLimits(nextLimits);
    sizesRef.current = next;
    setSizes(next);
  }, [direction, panels]);

  useEffect(() => {
    initialize();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(initialize);
    if (containerRef.current) observer?.observe(containerRef.current);
    return () => observer?.disconnect();
  }, [initialize]);

  useEffect(() => {
    if (!dragging) return;
    bodyCursorRef.current = document.body.style.cursor;
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.classList.add("k-splitter-dragging");
    return () => {
      document.body.style.cursor = bodyCursorRef.current;
      document.body.classList.remove("k-splitter-dragging");
    };
  }, [direction, dragging]);

  const emitSizes = (callback?: (value: number[]) => void) => {
    callback?.(sizesRef.current.map((value) => Number(value.toFixed(3))));
  };

  const resizePair = (index: number, requestedSize: number) => {
    const pairTotal = sizesRef.current[index] + sizesRef.current[index + 1];
    const lower = Math.max(
      limitsRef.current.min[index],
      pairTotal - limitsRef.current.max[index + 1],
    );
    const upper = Math.min(
      limitsRef.current.max[index],
      pairTotal - limitsRef.current.min[index + 1],
    );
    const first = Math.max(lower, Math.min(upper, requestedSize));
    const next = [...sizesRef.current];
    next[index] = first;
    next[index + 1] = pairTotal - first;
    sizesRef.current = next;
    setSizes(next);
  };

  const handleMouseDown = (index: number, event: ReactMouseEvent) => {
    event.preventDefault();
    dragRef.current = index;
    setDragging(true);
    emitSizes(onResizeStart);

    const move = (moveEvent: MouseEvent) => {
      const container = containerRef.current;
      if (!container || dragRef.current == null) return;
      const active = dragRef.current;
      const rect = container.getBoundingClientRect();
      const position =
        (direction === "horizontal"
          ? moveEvent.clientX - rect.left
          : moveEvent.clientY - rect.top) -
        active * 4;
      const offset = sizesRef.current.slice(0, active).reduce((sum, value) => sum + value, 0);
      resizePair(active, position - offset);
      emitSizes(onResize);
    };
    const up = () => {
      dragRef.current = null;
      setDragging(false);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      moveHandlerRef.current = null;
      upHandlerRef.current = null;
      emitSizes(onResizeEnd);
    };
    moveHandlerRef.current = move;
    upHandlerRef.current = up;
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const handleResizerKeyDown = (index: number, event: ReactKeyboardEvent) => {
    const previousKey = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const nextKey = direction === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (![previousKey, nextKey, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const pairTotal = sizesRef.current[index] + sizesRef.current[index + 1];
    const lower = Math.max(
      limitsRef.current.min[index],
      pairTotal - limitsRef.current.max[index + 1],
    );
    const upper = Math.min(
      limitsRef.current.max[index],
      pairTotal - limitsRef.current.min[index + 1],
    );
    const step = event.shiftKey ? 1 : 10;
    const current = sizesRef.current[index];
    const requested =
      event.key === "Home"
        ? lower
        : event.key === "End"
          ? upper
          : current + (event.key === previousKey ? -step : step);
    emitSizes(onResizeStart);
    resizePair(index, requested);
    emitSizes(onResize);
    emitSizes(onResizeEnd);
  };

  useEffect(
    () => () => {
      if (moveHandlerRef.current) document.removeEventListener("mousemove", moveHandlerRef.current);
      if (upHandlerRef.current) document.removeEventListener("mouseup", upHandlerRef.current);
    },
    [],
  );

  return (
    <div {...rest} ref={containerRef} className={clsx("k-splitter", `is-${direction}`, className)}>
      {panels.map((panel, index) => (
        <Fragment key={panel.key ?? index}>
          <div
            className="k-splitter-item"
            style={{ flexBasis: sizes[index], flexGrow: 0, flexShrink: 0 }}
          >
            {panel}
          </div>
          {index < panels.length - 1 && (
            <div
              className="k-splitter-resizer"
              role="separator"
              tabIndex={0}
              aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
              aria-valuemin={Math.round(limits.min[index] ?? 0)}
              aria-valuemax={Math.round(limits.max[index] ?? 0)}
              aria-valuenow={Math.round(sizes[index] ?? 0)}
              onMouseDown={(event) => handleMouseDown(index, event)}
              onKeyDown={(event) => handleResizerKeyDown(index, event)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
