import { createContext, useEffect, useState, type RefObject } from "react";

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

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const match = breakpointMap.find(([width]) => entry.contentRect.width >= width);
        setActive(match?.[1] ?? "xs");
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
