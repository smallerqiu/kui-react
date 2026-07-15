import React, { useContext } from "react";
import type { SizeType } from "../const/types";
import { getChildren } from "../utils/react-node";
import { SizeContext } from "../config/size-context";

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center" | "baseline";
  vertical?: boolean;
  wrap?: boolean;
  block?: boolean;
  compact?: boolean;
  size?: SizeType | number | (number | string)[];
  split?: React.ReactNode;
  children?: React.ReactNode;
}

const Space: React.FC<SpaceProps> = ({
  align,
  vertical = false,
  wrap = false,
  block = false,
  compact = false,
  size,
  split,
  children,
  className = "",
  style,
  ...rest
}) => {
  const parentSize = useContext(SizeContext);
  const currentSize = size || parentSize;

  const childList = getChildren(children);

  const currentAlign = !vertical && !align ? "center" : align;

  const spaceStyle: React.CSSProperties = { ...style };
  const classes = [
    "k-space",
    vertical ? "k-space-vertical" : "",
    compact ? "k-space-compact" : "",
    wrap ? "k-space-wrap" : "",
    block ? "k-space-block" : "",
    currentAlign ? `k-space-align-${currentAlign}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!compact) {
    if (Array.isArray(currentSize)) {
      spaceStyle.gap = `${currentSize[1]}px ${currentSize[0]}px`;
    } else if (typeof currentSize === "string") {
      const sizes: Record<string, number> = { small: 8, medium: 16, large: 24, default: 16 };
      spaceStyle.gap = `${sizes[currentSize] || 16}px`;
    } else if (typeof currentSize === "number") {
      spaceStyle.gap = `${currentSize}px`;
    } else if (!currentSize) {
      spaceStyle.gap = "8px";
    }
  }

  const vNodes: React.ReactNode[] = [];
  const pre = vertical ? "vertical-" : "";

  for (let i = 0; i < childList.length; i++) {
    const itemClasses = [
      i === 0 ? `k-space-${pre}first-item` : "",
      i > 0 && i < childList.length - 1 ? `k-space-${pre}item` : "",
      i === childList.length - 1 ? `k-space-${pre}last-item` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const p: Record<string, any> = {
      className: itemClasses,
    };

    if (typeof currentSize === "string") {
      p.size = currentSize;
    }

    const item = childList[i];
    const key = React.isValidElement(item) ? (item.key ?? `item-${i}`) : `item-${i}`;

    const child = compact ? (
      React.isValidElement(item) ? (
        React.cloneElement(item as React.ReactElement, { key, ...p })
      ) : (
        <span key={key} {...p}>
          {item}
        </span>
      )
    ) : (
      <div key={key} {...p}>
        {item}
      </div>
    );

    vNodes.push(child);

    if (split && i < childList.length - 1) {
      vNodes.push(
        <React.Fragment key={`split-${i}`}>
          {split}
        </React.Fragment>
      );
    }
  }

  return (
    <SizeContext.Provider value={typeof currentSize === "string" ? (currentSize as SizeType) : undefined}>
      <div className={classes} style={spaceStyle} {...rest}>
        {vNodes}
      </div>
    </SizeContext.Provider>
  );
};

export default Space;
