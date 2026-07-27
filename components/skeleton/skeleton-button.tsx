import React, { useEffect, useRef, useState } from "react";
import type { ShapeType, SizeType } from "../const/types";

export interface SkeletonButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  loading?: boolean;
  delay?: number;
  block?: boolean;
  width?: number;
  size?: SizeType;
  shape?: ShapeType;
  children?: React.ReactNode;
}

const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  animated = false,
  loading = false,
  delay = 500,
  block = false,
  width,
  size,
  shape,
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
    block ? "k-skeleton-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const innerStyle: React.CSSProperties = {};
  if (width) innerStyle.width = `${width}px`;

  const innerClasses = [
    "k-skeleton-btn",
    size === "large" ? "k-skeleton-btn-lg" : "",
    size === "small" ? "k-skeleton-btn-sm" : "",
    shape && shape !== "round" ? `k-skeleton-btn-${shape}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} {...rest}>
      {children && !show ? children : <span className={innerClasses} style={innerStyle} />}
    </div>
  );
};

export default SkeletonButton;
