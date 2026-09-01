import clsx from "clsx";
import React from "react";
import type { ShapeType, SizeType } from "../const/types";
import { useSkeletonLoading } from "./use-skeleton-loading";

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  radius?: number;
  loading?: boolean;
  delay?: number;
  shape?: ShapeType;
  size?: number | SizeType | "default";
  children?: React.ReactNode;
}

const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  animated = false,
  radius,
  loading = false,
  delay = 500,
  shape,
  size,
  children,
  className = "",
  ...rest
}) => {
  const show = useSkeletonLoading(loading, delay);

  const wrapperClasses = clsx(
    "k-skeleton k-skeleton-ele",
    { "k-skeleton-animated": animated },
    className,
  );

  const innerStyle: React.CSSProperties = {};
  if (!isNaN(Number(size)) && typeof size === "number") {
    innerStyle.width = `${size}px`;
    innerStyle.height = `${size}px`;
  }
  if (radius !== undefined) {
    innerStyle.borderRadius = `${radius}px`;
  }

  const avatarShape = shape || "circle";
  const innerClasses = clsx("k-skeleton-avatar", {
    "k-skeleton-avatar-lg": size === "large",
    "k-skeleton-avatar-sm": size === "small",
    [`k-skeleton-avatar-${avatarShape}`]: true,
  });

  return (
    <div className={wrapperClasses} {...rest} aria-busy={loading || undefined}>
      {children != null && !show ? (
        children
      ) : (
        <span className={innerClasses} style={innerStyle} aria-hidden="true" />
      )}
    </div>
  );
};

export default SkeletonAvatar;
