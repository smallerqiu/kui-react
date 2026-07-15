import React from "react";
import type { ShapeType } from "../const/types";
import { getChildren } from "../utils/react-node";
import Avatar from "./avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  maxCount?: number;
  shape?: ShapeType;
  size?: number | "large" | "small" | "default";
  children?: React.ReactNode;
}

export interface AvatarGroupContextValue {
  shape?: ShapeType;
  size?: number | "large" | "small" | "default";
}

export const AvatarGroupContext = React.createContext<AvatarGroupContextValue | null>(null);

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  maxCount,
  shape = "circle",
  size = "default",
  children,
  className = "",
  ...rest
}) => {
  const childList = getChildren(children);
  let childrenToShow = [...childList];

  if (maxCount && maxCount < childList.length) {
    childrenToShow = childList.slice(0, maxCount);
    const restCount = childList.length - maxCount;
    childrenToShow.push(
      <Avatar key="avatar-rest-count" shape={shape} size={size}>
        {`+${restCount}`}
      </Avatar>
    );
  }

  const classes = ["k-avatar-group", className].filter(Boolean).join(" ");

  return (
    <AvatarGroupContext.Provider value={{ shape, size }}>
      <div className={classes} {...rest}>
        {childrenToShow}
      </div>
    </AvatarGroupContext.Provider>
  );
};

export default AvatarGroup;
