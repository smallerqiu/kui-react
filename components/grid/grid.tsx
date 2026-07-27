import { useCallback, useMemo, useRef, type CSSProperties, type HTMLAttributes } from "react";
import { GridContext, useBreakpoint, type Breakpoint, type ResponsiveValue } from "./useBreakpoint";

type GridDimension = number | string;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: ResponsiveValue<GridDimension>;
  rows?: ResponsiveValue<GridDimension>;
  autoRows?: string;
  xGap?: ResponsiveValue<GridDimension>;
  yGap?: ResponsiveValue<GridDimension>;
  itemMinWidth?: number;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyItems"];
  debug?: boolean;
}

const order: Breakpoint[] = ["xxl", "xl", "lg", "md", "sm", "xs"];

export default function Grid({
  cols = 24,
  rows = "auto",
  autoRows = "auto",
  xGap = 0,
  yGap = 0,
  itemMinWidth,
  align,
  justify,
  debug = false,
  className,
  style,
  children,
  ...rest
}: GridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint(gridRef);

  const resolveResponsive = useCallback(
    <T,>(value: ResponsiveValue<T> | undefined, fallback: T): T => {
      if (value === undefined) return fallback;
      if (typeof value !== "object" || value === null) return value as T;
      const responsive = value as Partial<Record<Breakpoint, T>>;
      const current = order.indexOf(breakpoint);
      for (let index = current; index < order.length; index++) {
        const candidate = responsive[order[index]];
        if (candidate !== undefined) return candidate;
      }
      return fallback;
    },
    [breakpoint]
  );

  const activeCols = resolveResponsive(cols, 24);
  const activeRows = resolveResponsive(rows, "auto");
  const parseGap = (value: GridDimension) => (typeof value === "number" ? `${value}px` : value);
  const gridStyle: CSSProperties = {
    ...style,
    gridTemplateColumns: itemMinWidth
      ? `repeat(auto-fill, minmax(${itemMinWidth}px, 1fr))`
      : typeof activeCols === "number"
        ? `repeat(${activeCols}, minmax(0, 1fr))`
        : activeCols,
    gridTemplateRows:
      typeof activeRows === "number" ? `repeat(${activeRows}, minmax(0, 1fr))` : activeRows,
    columnGap: parseGap(resolveResponsive(xGap, 0)),
    rowGap: parseGap(resolveResponsive(yGap, 0)),
    gridAutoRows: autoRows,
    alignItems: align,
    justifyItems: justify,
  };
  if (debug && typeof activeCols === "number") {
    gridStyle.backgroundImage = `repeating-linear-gradient(to right, rgba(255,0,0,.05) 0, rgba(255,0,0,.05) ${100 / activeCols}%, transparent ${100 / activeCols}%, transparent ${200 / activeCols}%)`;
  }
  const context = useMemo(
    () => ({ breakpoint, resolveResponsive }),
    [breakpoint, resolveResponsive]
  );

  return (
    <GridContext.Provider value={context}>
      <div
        {...rest}
        ref={gridRef}
        className={["k-grid", className].filter(Boolean).join(" ")}
        style={gridStyle}
      >
        {children}
      </div>
    </GridContext.Provider>
  );
}
