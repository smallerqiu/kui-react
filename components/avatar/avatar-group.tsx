import clsx from "clsx";
import React from "react";
import type { ShapeType } from "../const/types";
import { getChildren } from "../utils/react-node";
import Avatar from "./avatar";
import { AvatarGroupContext } from "./avatar-group-context";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  maxCount?: number;
  spacing?: number;
  shape?: ShapeType;
  size?: number | "large" | "small" | "default";
  children?: React.ReactNode;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  maxCount,
  spacing,
  shape = "circle",
  size = "default",
  children,
  className = "",
  style,
  ...rest
}) => {
  const childList = getChildren(children);
  let childrenToShow = [...childList];

  if (maxCount != null && maxCount >= 0 && maxCount < childList.length) {
    const visibleCount = Math.floor(maxCount);
    childrenToShow = childList.slice(0, visibleCount);
    const restCount = childList.length - visibleCount;
    childrenToShow.push(
      <Avatar key="avatar-rest-count" shape={shape} size={size}>
        {`+${restCount}`}
      </Avatar>
    );
  }

  const classes = clsx("k-avatar-group", className);
  const defaultOverlap =
    typeof size === "number"
      ? Math.max(0, Math.round(size / 4))
      : { small: 6, default: 8, large: 10 }[size];
  const overlap = Math.max(0, spacing ?? defaultOverlap);
  const groupStyle = {
    ...style,
    "--kui-avatar-group-overlap": `-${overlap}px`,
  } as React.CSSProperties;

  return (
    <AvatarGroupContext.Provider value={{ shape, size }}>
      <div className={classes} style={groupStyle} {...rest}>
        {childrenToShow}
      </div>
    </AvatarGroupContext.Provider>
  );
};

export default AvatarGroup;
