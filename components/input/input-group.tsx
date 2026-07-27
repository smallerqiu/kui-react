import React, { useContext } from "react";
import type { SizeType, ThemeType } from "../const/types";
import { getChildren } from "../utils/react-node";
import { SizeContext } from "../config/size-context";

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

  const classes = [
    "k-input-group",
    compact ? "k-input-group-compact" : "",
    block ? "k-input-group-block" : "",
    theme === "fill" ? "k-input-group-fill" : "",
    currentSize === "large" ? "k-input-group-lg" : "",
    currentSize === "small" ? "k-input-group-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
        const itemClass = [
          child.props.className || "",
          i === 0 ? "k-input-group-first-item" : "",
          i > 0 && i < childList.length - 1 ? "k-input-group-item" : "",
          i === childList.length - 1 ? "k-input-group-last-item" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return React.cloneElement(child, {
          className: itemClass,
          key: child.key || `item-${i}`,
        } as any);
      }
      return child;
    });
  }

  return (
    <SizeContext.Provider value={typeof currentSize === "string" ? (currentSize as SizeType) : undefined}>
      <div className={classes} style={rootStyle} {...rest}>
        {processedChildren}
      </div>
    </SizeContext.Provider>
  );
};

export default InputGroup;
