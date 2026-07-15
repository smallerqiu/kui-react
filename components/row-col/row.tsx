import React from "react";

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gutter?: number | [number, number];
  type?: string;
  justify?: "start" | "end" | "center" | "space-around" | "space-between";
  align?: "top" | "middle" | "bottom";
  children?: React.ReactNode;
}

export const RowContext = React.createContext<number | [number, number] | undefined>(undefined);

const Row: React.FC<RowProps> = ({
  gutter,
  type = "flex",
  justify,
  align,
  children,
  className = "",
  style,
  ...rest
}) => {
  const classes = [
    "k-row",
    type === "flex" ? "k-row-flex" : "",
    justify ? `k-row-flex-${justify}` : "",
    align ? `k-row-flex-${align}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const rowStyle: React.CSSProperties = { ...style };

  if (Array.isArray(gutter)) {
    const [v = 0, h = 0] = gutter;
    if (v === h && v > 0) {
      rowStyle.margin = `-${v / 2}px`;
    } else if (v > 0 && h > 0) {
      rowStyle.margin = `-${h / 2}px -${v / 2}px`;
    } else {
      if (v > 0) {
        rowStyle.marginLeft = `-${v / 2}px`;
        rowStyle.marginRight = `-${v / 2}px`;
      }
      if (h > 0) {
        rowStyle.marginTop = `-${h / 2}px`;
        rowStyle.marginBottom = `-${h / 2}px`;
      }
    }
  } else if (gutter && gutter > 0) {
    rowStyle.marginLeft = `-${gutter / 2}px`;
    rowStyle.marginRight = `-${gutter / 2}px`;
  }

  return (
    <RowContext.Provider value={gutter}>
      <div className={classes} style={rowStyle} {...rest}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

export default Row;
