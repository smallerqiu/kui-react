import clsx from "clsx";
import { useContext, type CSSProperties, type HTMLAttributes } from "react";
import { GridContext, type ResponsiveValue } from "./useBreakpoint";

export interface GridItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  span?: ResponsiveValue<number>;
  rowSpan?: ResponsiveValue<number>;
  columnStart?: ResponsiveValue<number>;
  rowStart?: ResponsiveValue<number>;
  suffix?: boolean;
}

export default function GridItem({
  span = 1,
  rowSpan = 1,
  columnStart,
  rowStart,
  suffix = false,
  className,
  style,
  children,
  ...rest
}: GridItemProps) {
  const context = useContext(GridContext);
  const currentSpan = context?.resolveResponsive(span, 1) ?? 1;
  const currentRowSpan = context?.resolveResponsive(rowSpan, 1) ?? 1;
  const currentColumnStart = context?.resolveResponsive(columnStart, 0) ?? 0;
  const currentRowStart = context?.resolveResponsive(rowStart, 0) ?? 0;
  const itemStyle: CSSProperties = {};

  if (currentSpan === 0) itemStyle.display = "none";
  else {
    const safeSpan = Math.max(1, Math.floor(currentSpan));
    const safeRowSpan = Math.max(1, Math.floor(currentRowSpan));
    if (suffix) itemStyle.gridColumn = `${-safeSpan - 1} / -1`;
    else if (currentColumnStart > 0)
      itemStyle.gridColumn = `${Math.floor(currentColumnStart)} / span ${safeSpan}`;
    else if (safeSpan !== 1) itemStyle.gridColumn = `span ${safeSpan}`;

    if (currentRowStart > 0)
      itemStyle.gridRow = `${Math.floor(currentRowStart)} / span ${safeRowSpan}`;
    else if (safeRowSpan !== 1) itemStyle.gridRow = `span ${safeRowSpan}`;
  }
  Object.assign(itemStyle, style);

  return (
    <div {...rest} className={clsx("k-grid-item", className)} style={itemStyle}>
      {children}
    </div>
  );
}
