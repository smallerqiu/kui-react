import clsx from "clsx";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { getVirtualRange } from "./range";

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

const VirtualList = React.forwardRef<VirtualListRef, VirtualListProps>(
  (
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
    },
    forwardedRef,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const range = getVirtualRange({
      count: data.length,
      scrollTop,
      viewportHeight,
      itemHeight,
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
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const maxScrollTop = Math.max(0, data.length * itemHeight - container.clientHeight);
      if (container.scrollTop > maxScrollTop) {
        container.scrollTop = maxScrollTop;
        setScrollTop(maxScrollTop);
      }
    }, [data, itemHeight]);
    useImperativeHandle(
      forwardedRef,
      () => ({
        container: containerRef.current,
        scrollToIndex(index, align = "auto") {
          const container = containerRef.current;
          if (!container || !data.length) return;
          const target = Math.max(0, Math.min(Math.floor(index), data.length - 1));
          const top = target * itemHeight;
          const bottom = top + itemHeight;
          if (align === "start") container.scrollTop = top;
          else if (align === "center")
            container.scrollTop = top - container.clientHeight / 2 + itemHeight / 2;
          else if (align === "end") container.scrollTop = bottom - container.clientHeight;
          else if (top < container.scrollTop) container.scrollTop = top;
          else if (bottom > container.scrollTop + container.clientHeight)
            container.scrollTop = bottom - container.clientHeight;
          setScrollTop(container.scrollTop);
        },
      }),
      [data.length, itemHeight],
    );
    const getKey = (item: unknown, index: number): VirtualListKey => {
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
          setScrollTop(event.currentTarget.scrollTop);
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
                  style={{ height: `${itemHeight}px` }}
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
  },
);
VirtualList.displayName = "VirtualList";
export default VirtualList;
