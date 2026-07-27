import React, { useEffect, useRef, useState } from "react";
import type { ShapeType, SizeType } from "../const/types";

export interface SkeletonAvatarConfig {
  size?: SizeType;
  shape?: ShapeType;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  loading?: boolean;
  delay?: number;
  title?: number;
  rows?: number;
  avatar?: boolean | SkeletonAvatarConfig;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({
  animated = false,
  loading = false,
  delay = 500,
  title = 35,
  rows = 3,
  avatar,
  children,
  className = "",
  ...rest
}) => {
  const [show, setShow] = useState(loading);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (loading) {
      setShow(true);
    } else {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setShow(false);
      }, delay);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loading, delay]);

  const renderAvatar = () => {
    if (!avatar) return null;
    let size = "large";
    let shape = "circle";
    if (typeof avatar === "object") {
      if (avatar.size) size = avatar.size;
      if (avatar.shape) shape = avatar.shape;
    }
    const avatarClasses = [
      "k-skeleton-avatar",
      size === "large" ? "k-skeleton-avatar-lg" : "",
      size === "small" ? "k-skeleton-avatar-sm" : "",
      shape === "circle" ? "k-skeleton-avatar-circle" : "",
      shape === "square" ? "k-skeleton-avatar-square" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="k-skeleton-header">
        <span className={avatarClasses} />
      </div>
    );
  };

  const renderContent = () => {
    const lines = new Array(rows).fill("");
    return (
      <div className="k-skeleton-content">
        {title > 0 ? <div className="k-skeleton-title" style={{ width: `${title}%` }} /> : null}
        <ul className="k-skeleton-paragraph">
          {lines.map((_, i) => (
            <li key={i} />
          ))}
        </ul>
      </div>
    );
  };

  const classes = ["k-skeleton", animated ? "k-skeleton-animated" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children && !show ? children : [renderAvatar(), renderContent()]}
    </div>
  );
};

export default Skeleton;
