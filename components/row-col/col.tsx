import clsx from "clsx";
import React, { useContext } from "react";
import { RowContext } from "./row-context";

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: number;
  offset?: number;
  order?: number;
  push?: number;
  pull?: number;
  flex?: string | number;
  xs?: ColResponsiveSize;
  sm?: ColResponsiveSize;
  md?: ColResponsiveSize;
  lg?: ColResponsiveSize;
  xl?: ColResponsiveSize;
  xxl?: ColResponsiveSize;
  children?: React.ReactNode;
}

export interface ColSize {
  span?: number;
  offset?: number;
  order?: number;
  push?: number;
  pull?: number;
}

export type ColResponsiveSize = number | ColSize;

const Col: React.FC<ColProps> = ({
  span,
  offset,
  order,
  push,
  pull,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  children,
  className = "",
  style,
  ...rest
}) => {
  const gutter = useContext(RowContext);

  const parseFlex = (flexVal: number | string) => {
    if (typeof flexVal === "number") {
      return `${flexVal} ${flexVal} auto`;
    }
    if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flexVal)) {
      return `0 0 ${flexVal}`;
    }
    return flexVal;
  };

  const gridClasses: string[] = [];
  const addGridClasses = (value: ColResponsiveSize | undefined, breakpoint?: string) => {
    if (value === undefined) return;
    const prefix = breakpoint ? `k-col-${breakpoint}` : "k-col";
    if (typeof value === "number") {
      if (value >= 0 && value <= 24) gridClasses.push(`${prefix}-${value}`);
      return;
    }
    (["span", "offset", "order", "push", "pull"] as const).forEach((key) => {
      const current = value[key];
      if (current !== undefined && current >= 0 && current <= 24) {
        gridClasses.push(key === "span" ? `${prefix}-${current}` : `${prefix}-${key}-${current}`);
      }
    });
  };

  addGridClasses(span);
  addGridClasses({ offset, order, push, pull });
  (["xs", "sm", "md", "lg", "xl", "xxl"] as const).forEach((breakpoint) => {
    addGridClasses({ xs, sm, md, lg, xl, xxl }[breakpoint], breakpoint);
  });

  const classes = clsx("k-col", gridClasses, className);

  const colStyle: React.CSSProperties = { ...style };

  if (Array.isArray(gutter)) {
    const [v = 0, h = 0] = gutter;
    if (v === h && v > 0) {
      colStyle.padding = `${v / 2}px`;
    } else if (v > 0 && h > 0) {
      colStyle.padding = `${h / 2}px ${v / 2}px`;
    } else {
      if (v > 0) {
        colStyle.paddingLeft = `${v / 2}px`;
        colStyle.paddingRight = `${v / 2}px`;
      }
      if (h > 0) {
        colStyle.paddingTop = `${h / 2}px`;
        colStyle.paddingBottom = `${h / 2}px`;
      }
    }
  } else if (gutter && gutter > 0) {
    colStyle.paddingLeft = `${gutter / 2}px`;
    colStyle.paddingRight = `${gutter / 2}px`;
  }

  if (flex !== undefined) {
    colStyle.flex = parseFlex(flex);
  }

  return (
    <div className={classes} style={colStyle} {...rest}>
      {children}
    </div>
  );
};

export default Col;
