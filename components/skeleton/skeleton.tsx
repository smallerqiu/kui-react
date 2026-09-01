import clsx from "clsx";
import React from "react";
import type { ShapeType, SizeType } from "../const/types";
import { useSkeletonLoading } from "./use-skeleton-loading";

export interface SkeletonAvatarConfig {
  size?: SizeType;
  shape?: ShapeType;
}

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  animated?: boolean;
  loading?: boolean;
  delay?: number;
  /** @deprecated Use titleWidth instead. */
  title?: number;
  titleWidth?: number;
  rows?: number;
  avatar?: boolean | SkeletonAvatarConfig;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({
  animated = false,
  loading = false,
  delay = 500,
  title,
  titleWidth = 35,
  rows = 3,
  avatar,
  children,
  className = "",
  ...rest
}) => {
  const show = useSkeletonLoading(loading, delay);

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
      <div className="k-skeleton-header" aria-hidden="true">
        <span className={avatarClasses} />
      </div>
    );
  };

  const renderContent = () => {
    const rowCount = Number.isFinite(rows) ? Math.max(0, Math.floor(rows)) : 3;
    const rawTitleWidth = title ?? titleWidth;
    const normalizedTitleWidth = Number.isFinite(rawTitleWidth)
      ? Math.min(100, Math.max(0, rawTitleWidth))
      : 35;
    const lines = new Array(rowCount).fill("");
    return (
      <div className="k-skeleton-content" aria-hidden="true">
        {normalizedTitleWidth > 0 ? (
          <div className="k-skeleton-title" style={{ width: `${normalizedTitleWidth}%` }} />
        ) : null}
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
    <div className={classes} {...rest} aria-busy={loading || undefined}>
      {children != null && !show ? children : [renderAvatar(), renderContent()]}
    </div>
  );
};

export default Skeleton;
