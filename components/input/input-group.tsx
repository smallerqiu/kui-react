import clsx from "clsx";
import React, { useContext } from "react";
import { SizeContext } from "../config/size-context";
import type { SizeType, ThemeType } from "../const/types";
import { getChildren } from "../utils/react-node";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  block?: boolean;
  compact?: boolean;
  theme?: ThemeType;
  size?: SizeType | number | number[];
  children?: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({
  block = false,
  compact = true,
  theme = "fill",
  size,
  children,
  className = "",
  style,
  ...rest
}) => {
  const parentSize = useContext(SizeContext);
  const currentSize = size || parentSize;

  const rootStyle: React.CSSProperties = { ...style };

  const classes = clsx(
    "k-input-group",
    {
      "k-input-group-compact": compact,
      "k-input-group-block": block,
      "k-input-group-fill": theme === "fill",
      "k-input-group-lg": currentSize === "large",
      "k-input-group-sm": currentSize === "small",
    },
    className
  );

  if (!compact && currentSize !== undefined) {
    if (typeof currentSize === "number") {
      rootStyle.gap = `${currentSize}px`;
    }
  }

  const childList = getChildren(children);
  let processedChildren = childList;

  if (compact && childList.length > 0) {
    processedChildren = childList.map((child, i) => {
      if (React.isValidElement<{ className?: string }>(child)) {
        const itemClass = clsx(child.props.className || "", {
          "k-input-group-first-item": i === 0,
          "k-input-group-item": i > 0 && i < childList.length - 1,
          "k-input-group-last-item": i === childList.length - 1,
        });
        return React.cloneElement(child, {
          className: itemClass,
          key: child.key || `item-${i}`,
        });
      }
      return child;
    });
  }

  return (
    <SizeContext.Provider
      value={typeof currentSize === "string" ? (currentSize as SizeType) : undefined}
    >
      <div className={classes} style={rootStyle} {...rest}>
        {processedChildren}
      </div>
    </SizeContext.Provider>
  );
};

export default InputGroup;
