import clsx from "clsx";
import React, { useContext } from "react";
import { RowContext } from "./row-context";

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: number;
  offset?: number;
  flex?: string | number;
  children?: React.ReactNode;
}

const Col: React.FC<ColProps> = ({
  span,
  offset,
  flex,
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

  const classes = clsx(
    "k-col",
    { [`k-col-${span}`]: span, [`k-col-offset-${offset}`]: offset && offset > 0 && offset <= 24 },
    className
  );

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
