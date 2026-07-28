import clsx from "clsx";
import { useContext, type CSSProperties, type HTMLAttributes } from "react";
import { GridContext, type ResponsiveValue } from "./useBreakpoint";

type ItemDimension = number | string;

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: ResponsiveValue<ItemDimension>;
  rowSpan?: ResponsiveValue<ItemDimension>;
  offset?: ResponsiveValue<number>;
  suffix?: boolean;
}

export default function GridItem({
  span = 1,
  rowSpan = 1,
  offset = 0,
  suffix = false,
  className,
  style,
  children,
  ...rest
}: GridItemProps) {
  const context = useContext(GridContext);
  const currentSpan = context?.resolveResponsive(span, 1) ?? 1;
  const currentRowSpan = context?.resolveResponsive(rowSpan, 1) ?? 1;
  const currentOffset = context?.resolveResponsive(offset, 0) ?? 0;
  const itemStyle: CSSProperties = { ...style };

  if (currentSpan === 0) itemStyle.display = "none";
  else if (currentSpan !== 1) itemStyle.gridColumn = `span ${currentSpan} / span ${currentSpan}`;
  if (currentOffset > 0) {
    itemStyle.gridColumnStart = `span ${Number(currentSpan) + currentOffset}`;
    if (currentSpan === 1) itemStyle.gridColumnEnd = "span 1";
  }
  if (currentRowSpan !== 1) {
    itemStyle.gridRow = `span ${currentRowSpan} / span ${currentRowSpan}`;
  }
  if (suffix) {
    itemStyle.gridColumnStart = "-1";
    itemStyle.justifySelf = "end";
  }

  return (
    <div {...rest} className={clsx("k-grid-item", className)} style={itemStyle}>
      {children}
    </div>
  );
}
