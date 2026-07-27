import React, { useEffect, useRef, useState } from "react";
import type { ShapeType, SizeType } from "../const/types";

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  radius?: number;
  loading?: boolean;
  delay?: number;
  shape?: ShapeType;
  size?: number | SizeType;
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
  const [show, setShow] = useState(loading);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (loading) {
      setShow(true);
    } else {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), delay);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loading, delay]);

  const wrapperClasses = [
    "k-skeleton k-skeleton-ele",
    animated ? "k-skeleton-animated" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const innerStyle: React.CSSProperties = {};
  if (!isNaN(Number(size)) && typeof size === "number") {
    innerStyle.width = `${size}px`;
    innerStyle.height = `${size}px`;
  }
  if (radius) {
    innerStyle.borderRadius = `${radius}px`;
  }

  const innerClasses = [
    "k-skeleton-avatar",
    size === "large" ? "k-skeleton-avatar-lg" : "",
    size === "small" ? "k-skeleton-avatar-sm" : "",
    shape && shape !== "round" ? `k-skeleton-avatar-${shape}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} {...rest}>
      {children && !show ? children : <span className={innerClasses} style={innerStyle} />}
    </div>
  );
};

export default SkeletonAvatar;
