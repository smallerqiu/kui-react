import { createContext, useLayoutEffect, useState, type RefObject } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

const breakpointMap: Array<[number, Breakpoint]> = [
  [1600, "xxl"],
  [1200, "xl"],
  [992, "lg"],
  [768, "md"],
  [576, "sm"],
  [0, "xs"],
];

export interface GridContextValue {
  breakpoint: Breakpoint;
  resolveResponsive: <T>(value: ResponsiveValue<T> | undefined, fallback: T) => T;
}

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
export const GridContext = createContext<GridContextValue | null>(null);

export function useBreakpoint(elementRef: RefObject<HTMLElement | null>): Breakpoint {
  const [active, setActive] = useState<Breakpoint>("md");

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const update = (width: number) => {
      const match = breakpointMap.find(([point]) => width >= point);
      setActive(match?.[1] ?? "xs");
    };
    update(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        update(entry.contentRect.width);
      });
    });
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [elementRef]);

  return active;
}
