import clsx from "clsx";
import React from "react";

export interface RowProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  gutter?: number | [number, number];
  justify?: "start" | "end" | "center" | "space-around" | "space-between";
  align?: "top" | "middle" | "bottom";
  children?: React.ReactNode;
}

const Row: React.FC<RowProps> = ({
  gutter,
  justify = "start",
  align = "top",
  children,
  className = "",
  style,
  ...rest
}) => {
  const classes = clsx(
    "k-row",
    {
      [`k-row-${justify}`]: justify,
      [`k-row-${align}`]: align,
    },
    className,
  );

  const rowStyle: React.CSSProperties & Record<`--${string}`, string> = {};

  if (Array.isArray(gutter)) {
    const [columnGap = 0, rowGap = 0] = gutter;
    rowStyle.columnGap = `${Math.max(0, columnGap)}px`;
    rowStyle.rowGap = `${Math.max(0, rowGap)}px`;
    rowStyle["--k-row-column-gap"] = `${Math.max(0, columnGap)}px`;
  } else if (gutter && gutter > 0) {
    rowStyle.columnGap = `${gutter}px`;
    rowStyle["--k-row-column-gap"] = `${gutter}px`;
  }
  Object.assign(rowStyle, style);

  return (
    <div className={classes} style={rowStyle} {...rest}>
      {children}
    </div>
  );
};

export default Row;
