import clsx from "clsx";
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
  const [previousLoading, setPreviousLoading] = useState(loading);
  if (previousLoading !== loading) {
    setPreviousLoading(loading);
    if (loading) setShow(true);
  }
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), delay);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loading, delay]);

  const wrapperClasses = clsx(
    "k-skeleton k-skeleton-ele",
    { "k-skeleton-animated": animated },
    className
  );

  const innerStyle: React.CSSProperties = {};
  if (width) innerStyle.width = `${width}px`;

  const innerClasses = clsx("k-skeleton-text", {
    "k-skeleton-text-lg": size === "large",
    "k-skeleton-text-sm": size === "small",
  });

  return (
    <div className={wrapperClasses} {...rest}>
      {children && !show ? children : <span className={innerClasses} style={innerStyle} />}
    </div>
  );
};

export default SkeletonText;
