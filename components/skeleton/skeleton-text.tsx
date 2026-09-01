import clsx from "clsx";
import React from "react";
import type { SizeType } from "../const/types";
import { useSkeletonLoading } from "./use-skeleton-loading";

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  loading?: boolean;
  delay?: number;
  width?: number;
  size?: SizeType | "default";
  children?: React.ReactNode;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  animated = false,
  loading = false,
  delay = 500,
  width,
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
  if (width !== undefined) innerStyle.width = `${width}px`;

  const innerClasses = clsx("k-skeleton-text", {
    "k-skeleton-text-lg": size === "large",
    "k-skeleton-text-sm": size === "small",
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

export default SkeletonText;
