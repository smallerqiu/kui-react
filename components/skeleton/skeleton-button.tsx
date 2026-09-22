import { useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import React from "react";
import type { ShapeType, SizeType } from "../const/types";
import { useSkeletonLoading } from "./use-skeleton-loading";

export interface SkeletonButtonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  animated?: boolean;
  loading?: boolean;
  delay?: number;
  block?: boolean;
  width?: number;
  size?: SizeType | "default";
  shape?: ShapeType;
  children?: React.ReactNode;
}

const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  animated = false,
  loading = false,
  delay = 500,
  block = false,
  width,
  size: sizeProp,
  shape: shapeProp,
  children,
  className = "",
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const shape = shapeProp ?? inheritedAppearance.shape;
  const show = useSkeletonLoading(loading, delay);

  const wrapperClasses = clsx(
    "k-skeleton k-skeleton-ele",
    { "k-skeleton-animated": animated, "k-skeleton-block": block },
    className,
  );

  const innerStyle: React.CSSProperties = {};
  if (width !== undefined) innerStyle.width = `${width}px`;

  const innerClasses = clsx("k-skeleton-btn", {
    "k-skeleton-btn-lg": size === "large",
    "k-skeleton-btn-sm": size === "small",
    [`k-skeleton-btn-${shape}`]: !!shape && shape !== "default",
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

export default SkeletonButton;
