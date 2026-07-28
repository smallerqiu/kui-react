import clsx from "clsx";
import React, { useContext } from "react";
import { SizeContext } from "../config/size-context";
import type { SizeType } from "../const/types";
import { getChildren } from "../utils/react-node";

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
  const currentSize = size ?? parentSize;

  const childList = getChildren(children);

  const currentAlign = !vertical && !align ? "center" : align;

  const spaceStyle: React.CSSProperties = { ...style };
  const classes = clsx(
    "k-space",
    {
      "k-space-vertical": vertical,
      "k-space-compact": compact,
      "k-space-wrap": wrap,
      "k-space-block": block,
      [`k-space-align-${currentAlign}`]: currentAlign,
    },
    className
  );

  const toCssLength = (value: number | string | undefined) => {
    if (typeof value === "number") return `${value}px`;
    if (typeof value === "string") return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
    return "0px";
  };

  if (!compact) {
    if (Array.isArray(currentSize)) {
      const horizontal = currentSize[0];
      const vertical = currentSize[1] ?? horizontal;
      spaceStyle.gap = `${toCssLength(vertical)} ${toCssLength(horizontal)}`;
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

  const cloneCompactChild = (item: React.ReactElement, itemClassName: string, key: React.Key) => {
    const itemProps = item.props as { children?: React.ReactNode; className?: string };
    const nestedChildren = getChildren(itemProps.children);
    let nextChildren = itemProps.children;

    // Vue 会把组件上的 class 自动透传到根节点；React 没有这一机制。
    // 对 Dropdown / Tooltip 这类单触发器组件，同时把 compact 类合并到触发元素。
    if (nestedChildren.length === 1 && React.isValidElement(nestedChildren[0])) {
      const trigger = nestedChildren[0] as React.ReactElement<{ className?: string }>;
      nextChildren = React.cloneElement(trigger, {
        className: clsx(trigger.props.className, itemClassName),
      });
    }

    return React.cloneElement(
      item as React.ReactElement<{
        className?: string;
        size?: SizeType;
        children?: React.ReactNode;
      }>,
      {
        key,
        className: clsx(itemProps.className, itemClassName),
        children: nextChildren,
        ...(typeof currentSize === "string" && typeof item.type !== "string"
          ? { size: currentSize }
          : null),
      }
    );
  };

  for (let i = 0; i < childList.length; i++) {
    const itemClasses = clsx({
      [`k-space-${pre}first-item`]: i === 0,
      [`k-space-${pre}item`]: i > 0 && i < childList.length - 1,
      [`k-space-${pre}last-item`]: i === childList.length - 1,
    });

    const item = childList[i];
    const key = React.isValidElement(item) ? (item.key ?? `item-${i}`) : `item-${i}`;

    const child = compact ? (
      React.isValidElement(item) ? (
        cloneCompactChild(item, itemClasses, key)
      ) : (
        <span key={key} className={itemClasses}>
          {item}
        </span>
      )
    ) : (
      <div key={key} className={itemClasses}>
        {item}
      </div>
    );

    vNodes.push(child);

    if (split && i < childList.length - 1) {
      vNodes.push(<React.Fragment key={`split-${i}`}>{split}</React.Fragment>);
    }
  }

  return (
    <SizeContext.Provider
      value={typeof currentSize === "string" ? (currentSize as SizeType) : undefined}
    >
      <div {...rest} className={classes} style={spaceStyle}>
        {vNodes}
      </div>
    </SizeContext.Provider>
  );
};

export default Space;
