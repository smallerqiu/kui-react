import clsx from "clsx";
import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
  type ReactElement,
  type RefAttributes,
} from "react";
import { flushSync } from "react-dom";
import { getVirtualRange, normalizeItemHeight } from "./range";

export type VirtualListKey = string | number;
export interface VirtualListRef {
  scrollToIndex: (index: number, align?: "auto" | "start" | "center" | "end") => void;
  container: HTMLDivElement | null;
}
export interface VirtualListProps<T = unknown> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onScroll"
> {
  data?: T[];
  height?: number | string;
  itemHeight?: number;
  overscan?: number;
  itemKey?: string | ((item: T, index: number) => VirtualListKey);
  children?: (item: T, index: number) => React.ReactNode;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

function VirtualListInner<T>(
  {
    data = [],
    height = 300,
    itemHeight = 32,
    overscan = 5,
    itemKey,
    children,
    className,
    style,
    onScroll,
    ...rest
  }: VirtualListProps<T>,
  forwardedRef: ForwardedRef<VirtualListRef>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef(0);
  const pendingScrollTopRef = useRef(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const safeItemHeight = normalizeItemHeight(itemHeight);
  const range = getVirtualRange({
    count: data.length,
    scrollTop,
    viewportHeight,
    itemHeight: safeItemHeight,
    overscan,
  });
  useEffect(() => {
    const update = () => setViewportHeight(containerRef.current?.clientHeight ?? 0);
    update();
    if (typeof ResizeObserver === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver(update);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(
    () => () => {
      cancelAnimationFrame(scrollFrameRef.current);
    },
    [],
  );
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const maxScrollTop = Math.max(0, data.length * safeItemHeight - container.clientHeight);
    if (container.scrollTop > maxScrollTop) {
      container.scrollTop = maxScrollTop;
      setScrollTop(maxScrollTop);
    }
  }, [data.length, safeItemHeight]);
  useImperativeHandle(
    forwardedRef,
    () => ({
      container: containerRef.current,
      scrollToIndex(index, align = "auto") {
        const container = containerRef.current;
        if (!container || !data.length) return;
        const normalizedIndex = Number.isFinite(index) ? Math.floor(index) : 0;
        const target = Math.max(0, Math.min(normalizedIndex, data.length - 1));
        const top = target * safeItemHeight;
        const bottom = top + safeItemHeight;
        const maxScrollTop = Math.max(0, data.length * safeItemHeight - container.clientHeight);
        let nextScrollTop = container.scrollTop;
        if (align === "start") nextScrollTop = top;
        else if (align === "center")
          nextScrollTop = top - container.clientHeight / 2 + safeItemHeight / 2;
        else if (align === "end") nextScrollTop = bottom - container.clientHeight;
        else if (top < container.scrollTop) nextScrollTop = top;
        else if (bottom > container.scrollTop + container.clientHeight)
          nextScrollTop = bottom - container.clientHeight;
        container.scrollTop = Math.max(0, Math.min(nextScrollTop, maxScrollTop));
        setScrollTop(container.scrollTop);
      },
    }),
    [data.length, safeItemHeight],
  );
  const getKey = (item: T, index: number): VirtualListKey => {
    if (typeof itemKey === "function") return itemKey(item, index);
    if (typeof itemKey === "string" && item && typeof item === "object") {
      const value = (item as Record<string, unknown>)[itemKey];
      if (typeof value === "string" || typeof value === "number") return value;
    }
    return index;
  };
  const actualHeight = typeof height === "number" ? `${height}px` : height;
  return (
    <div
      {...rest}
      ref={containerRef}
      className={clsx("k-virtual-list", "k-scroll", className)}
      style={{ ...style, height: actualHeight }}
      onScroll={(event) => {
        pendingScrollTopRef.current = event.currentTarget.scrollTop;
        if (!scrollFrameRef.current) {
          scrollFrameRef.current = requestAnimationFrame(() => {
            scrollFrameRef.current = 0;
            flushSync(() => setScrollTop(pendingScrollTopRef.current));
          });
        }
        onScroll?.(event);
      }}
    >
      <div className="k-virtual-list-spacer" style={{ height: `${range.total}px` }}>
        <div
          className="k-virtual-list-items"
          style={{ transform: `translateY(${range.offset}px)` }}
        >
          {data.slice(range.start, range.end).map((item, localIndex) => {
            const index = range.start + localIndex;
            return (
              <div
                key={getKey(item, index)}
                className="k-virtual-list-item"
                style={{ height: `${safeItemHeight}px` }}
                data-index={index}
              >
                {children?.(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
const VirtualListBase = React.forwardRef(VirtualListInner);
VirtualListBase.displayName = "VirtualList";
const VirtualList = VirtualListBase as <T = unknown>(
  props: VirtualListProps<T> & RefAttributes<VirtualListRef>,
) => ReactElement | null;
export default VirtualList;
