import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
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
  const text = String(value).trim();
  if (text.endsWith("%")) return (Number.parseFloat(text) / 100) * total;
  if (text.endsWith("px")) return Number.parseFloat(text);
  return Number.isFinite(Number(text)) ? (Number.parseFloat(text) / 100) * total : null;
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
  const [sizes, setSizes] = useState<number[]>([]);
  const panels = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<SplitterPanelProps>[];

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
    limitsRef.current = { min, max };
    sizesRef.current = next;
    setSizes(next);
  }, [direction, panels.length]);

  useEffect(() => {
    initialize();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(initialize);
    if (containerRef.current) observer?.observe(containerRef.current);
    return () => observer?.disconnect();
  }, [initialize]);

  const emitSizes = (callback?: (value: number[]) => void) => {
    callback?.(sizesRef.current.map((value) => Number(value.toFixed(3))));
  };

  const handleMouseDown = (index: number, event: ReactMouseEvent) => {
    event.preventDefault();
    dragRef.current = index;
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.classList.add("k-splitter-dragging");
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
      const pairTotal = sizesRef.current[active] + sizesRef.current[active + 1];
      const offset = sizesRef.current.slice(0, active).reduce((sum, value) => sum + value, 0);
      let first = position - offset;
      first = Math.max(
        limitsRef.current.min[active],
        Math.min(limitsRef.current.max[active], first)
      );
      first = Math.min(first, pairTotal - limitsRef.current.min[active + 1]);
      const next = [...sizesRef.current];
      next[active] = first;
      next[active + 1] = pairTotal - first;
      sizesRef.current = next;
      setSizes(next);
      emitSizes(onResize);
    };
    const up = () => {
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.classList.remove("k-splitter-dragging");
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      emitSizes(onResizeEnd);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return (
    <div
      {...rest}
      ref={containerRef}
      className={["k-splitter", `is-${direction}`, className].filter(Boolean).join(" ")}
    >
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
              onMouseDown={(event) => handleMouseDown(index, event)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
