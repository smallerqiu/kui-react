import React from "react";
import type { SizeType } from "../const/types";
import { SizeContext } from "../config/size-context";

export type FlexSizeType = SizeType | number | (string | number)[];
export type FlexAlignType = "start" | "flex-start" | "end" | "flex-end" | "center" | "baseline";
export type FlexJustifyType =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";

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

  const flexStyle: React.CSSProperties = { ...style };

  const classes = [
    "k-flex",
    vertical ? "k-flex-vertical" : "",
    wrap ? "k-flex-wrap" : "",
    currentAlign ? `k-flex-align-${currentAlign}` : "",
    justify ? `k-flex-justify-${justify}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (Array.isArray(size)) {
    flexStyle.gap = `${size[1]}px ${size[0]}px`;
  } else if (typeof size === "string" && /small|medium|large/.test(size)) {
    const sizes: Record<string, number> = { small: 8, medium: 16, large: 24, default: 16 };
    flexStyle.gap = `${sizes[size]}px`;
  } else if (size !== undefined && size !== null) {
    flexStyle.gap = `${size}px`;
  }

  return (
    <SizeContext.Provider value={typeof size === "string" ? (size as SizeType) : undefined}>
      <div className={classes} style={flexStyle} {...rest}>
        {children}
      </div>
    </SizeContext.Provider>
  );
};

export default Flex;
