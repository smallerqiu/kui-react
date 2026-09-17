import { useConfigAppearance } from "../config/use-config-appearance";
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
  theme: themeProp,
  size: sizeProp,
  children,
  className = "",
  style,
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const theme = themeProp ?? inheritedAppearance.theme ?? "fill";
  const size = sizeProp ?? inheritedAppearance.size;
  const parentSize = useContext(SizeContext);
  const currentSize = sizeProp ?? parentSize ?? size;

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
    className,
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
        const childProps = child.props as {
          className?: string;
          children?: React.ReactNode;
        };
        const nestedChildren = getChildren(childProps.children);
        const nextChildren =
          nestedChildren.length === 1 &&
          React.isValidElement<{ className?: string }>(nestedChildren[0])
            ? React.cloneElement(nestedChildren[0], {
                className: clsx(nestedChildren[0].props.className, itemClass),
              })
            : childProps.children;
        return React.cloneElement(child as React.ReactElement<{ className?: string; children?: React.ReactNode }>, {
          className: itemClass,
          children: nextChildren,
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
