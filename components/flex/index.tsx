import clsx from "clsx";
import React from "react";
import type { SizeType } from "../const/types";

export type FlexSizeType = SizeType | number | (string | number)[];
export type FlexAlignType = "start" | "flex-start" | "end" | "flex-end" | "center" | "baseline";
export type FlexJustifyType =
  "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: FlexAlignType;
  justify?: FlexJustifyType;
  vertical?: boolean;
  wrap?: boolean;
  size?: FlexSizeType;
  children?: React.ReactNode;
}

const Flex: React.FC<FlexProps> = ({
  align,
  justify,
  vertical = false,
  wrap = false,
  size,
  children,
  className = "",
  style,
  ...rest
}) => {
  const currentAlign = !vertical && !align ? "center" : align;

  const flexStyle: React.CSSProperties = {};

  const classes = clsx(
    "k-flex",
    {
      "k-flex-vertical": vertical,
      "k-flex-wrap": wrap,
      [`k-flex-align-${currentAlign}`]: currentAlign,
      [`k-flex-justify-${justify}`]: justify,
    },
    className,
  );

  const toCssLength = (value: number | string | undefined) => {
    if (typeof value === "number") return `${value}px`;
    if (typeof value === "string") return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
    return "0px";
  };

  if (Array.isArray(size)) {
    const horizontal = size[0];
    const vertical = size[1] ?? horizontal;
    flexStyle.gap = `${toCssLength(vertical)} ${toCssLength(horizontal)}`;
  } else if (typeof size === "string" && /small|medium|large/.test(size)) {
    const sizes: Record<string, number> = { small: 8, medium: 16, large: 24, default: 16 };
    flexStyle.gap = `${sizes[size]}px`;
  } else if (size !== undefined && size !== null) {
    flexStyle.gap = toCssLength(size);
  }
  Object.assign(flexStyle, style);

  return (
    <div className={classes} style={flexStyle} {...rest}>
      {children}
    </div>
  );
};

export default Flex;
