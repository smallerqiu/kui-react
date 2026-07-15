import React from "react";
import { getChildren } from "../utils/react-node";

export type BadgeStatusType = "default" | "success" | "error" | "warning";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: string | number;
  dot?: boolean;
  color?: string;
  status?: BadgeStatusType;
  text?: React.ReactNode;
  maxCount?: number;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  dot = false,
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

    const dotClasses = [
      "k-badge-status-dot",
      status ? `k-badge-status-${status}` : "",
      color && !isHexColor ? `k-badge-status-${color}` : "",
    ]
      .filter(Boolean)
      .join(" ");

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
    const supClasses = [
      !dot && displayCount !== null ? "k-badge-count" : "",
      dot ? "k-badge-dot" : "",
      !hasChildren ? "k-badge-no-child" : "",
      status && !color ? `k-badge-${status}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const supStyle: React.CSSProperties = {
      backgroundColor: color,
    };

    supNode = (
      <sup className={supClasses} style={supStyle}>
        {!dot ? displayCount : null}
      </sup>
    );
  }

  const classes = ["k-badge", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style} {...rest}>
      {children}
      {supNode}
      {statusNodes}
    </div>
  );
};

export default Badge;
