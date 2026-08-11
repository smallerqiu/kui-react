import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import type { ShapeType, SizeType } from "../const/types";

export interface SkeletonAvatarConfig {
  size?: SizeType;
  shape?: ShapeType;
}

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
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
  const [previousLoading, setPreviousLoading] = useState(loading);
  if (previousLoading !== loading) {
    setPreviousLoading(loading);
    if (loading) setShow(true);
  }
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading) {
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
    const avatarClasses = clsx("k-skeleton-avatar", {
      "k-skeleton-avatar-lg": size === "large",
      "k-skeleton-avatar-sm": size === "small",
      "k-skeleton-avatar-circle": shape === "circle",
      "k-skeleton-avatar-square": shape === "square",
    });

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

  const classes = clsx("k-skeleton", { "k-skeleton-animated": animated }, className);

  return (
    <div className={classes} {...rest}>
      {children && !show ? children : [renderAvatar(), renderContent()]}
    </div>
  );
};

export default Skeleton;
