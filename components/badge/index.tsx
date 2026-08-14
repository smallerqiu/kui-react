import clsx from "clsx";
import React from "react";
import { getChildren } from "../utils/react-node";

export type BadgeStatusType = "default" | "success" | "error" | "warning";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: string | number;
  dot?: boolean;
  pill?: boolean;
  active?: boolean;
  color?: string;
  status?: BadgeStatusType;
  text?: React.ReactNode;
  maxCount?: number;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  dot = false,
  pill = false,
  active = false,
  color,
  status = "default",
  text,
  maxCount = 99,
  children,
  className = "",
  style,
  ...rest
}) => {
  const childList = getChildren(children);
  const hasChildren = childList.length > 0;

  let displayCount: string | number | null = null;
  if (typeof count === "number" && count > 0) {
    displayCount = count > maxCount ? `${maxCount}+` : count;
  } else if (typeof count === "string" && count.length > 0) {
    displayCount = count;
  }

  const isStatusType = !hasChildren && (status || color) && !dot;

  const statusNodes: React.ReactNode[] = [];
  if (isStatusType && !displayCount) {
    const isHexColor = color && /^#/.test(color);

    const dotClasses = clsx("k-badge-status-dot", {
      "k-badge-status-active": active,
      [`k-badge-status-${status}`]: status,
      [`k-badge-status-${color}`]: color && !isHexColor,
    });

    const dotStyle: React.CSSProperties = {
      backgroundColor: isHexColor ? color : undefined,
    };

    statusNodes.push(<span key="dot" className={dotClasses} style={dotStyle} />);

    if (text) {
      statusNodes.push(
        <span key="text" className="k-badge-status-text">
          {text}
        </span>
      );
    }
  }

  const showSup = displayCount !== null || dot;
  let supNode: React.ReactNode = null;

  if (showSup) {
    const supClasses = clsx({
      "k-badge-count": !dot && displayCount !== null,
      "k-badge-dot": dot,
      "k-badge-no-child": !hasChildren,
      [`k-badge-${status}`]: status && !color,
    });

    const supStyle: React.CSSProperties = {
      backgroundColor: color,
    };

    supNode = (
      <sup className={supClasses} style={supStyle}>
        {!dot ? displayCount : null}
      </sup>
    );
  }

  const classes = clsx("k-badge", { "k-badge-pill": pill }, className);

  return (
    <div className={classes} style={style} {...rest}>
      {children}
      {supNode}
      {statusNodes}
    </div>
  );
};

export default Badge;
