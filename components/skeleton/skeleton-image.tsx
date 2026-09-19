import clsx from "clsx";
import { Images } from "kui-icons";
import React from "react";
import Icon from "../icon";
import { useSkeletonLoading } from "./use-skeleton-loading";

export interface SkeletonImageProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  loading?: boolean;
  delay?: number;
  radius?: number;
  size?: number | number[];
  children?: React.ReactNode;
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({
  animated = false,
  loading = false,
  delay = 500,
  radius,
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
  if (radius !== undefined) innerStyle.borderRadius = `${radius}px`;
  if (typeof size === "number" && Number.isFinite(size)) {
    const value = Math.max(0, size);
    innerStyle.width = `${value}px`;
    innerStyle.height = `${value}px`;
    innerStyle.minWidth = `${value}px`;
    innerStyle.minHeight = `${value}px`;
  }
  if (Array.isArray(size)) {
    const width = Number.isFinite(size[0]) ? Math.max(0, size[0]) : 96;
    const height = Number.isFinite(size[1]) ? Math.max(0, size[1]) : width;
    innerStyle.width = `${width}px`;
    innerStyle.height = `${height}px`;
    innerStyle.minWidth = `${width}px`;
    innerStyle.minHeight = `${height}px`;
  }

  return (
    <div className={wrapperClasses} {...rest} aria-busy={loading || undefined}>
      {children != null && !show ? (
        children
      ) : (
        <span className="k-skeleton-image" style={innerStyle} aria-hidden="true">
          <Icon type={Images} className="k-skeleton-image-icon" />
        </span>
      )}
    </div>
  );
};

export default SkeletonImage;
