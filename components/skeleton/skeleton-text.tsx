import React, { useEffect, useRef, useState } from "react";
import type { SizeType } from "../const/types";

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  loading?: boolean;
  delay?: number;
  width?: number;
  size?: SizeType;
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
  if (width) innerStyle.width = `${width}px`;

  const innerClasses = [
    "k-skeleton-text",
    size === "large" ? "k-skeleton-text-lg" : "",
    size === "small" ? "k-skeleton-text-sm" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} {...rest}>
      {children && !show ? children : <span className={innerClasses} style={innerStyle} />}
    </div>
  );
};

export default SkeletonText;
