import clsx from "clsx";
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

  const wrapperClasses = clsx(
    "k-skeleton k-skeleton-ele",
    { "k-skeleton-animated": animated },
    className
  );

  const innerStyle: React.CSSProperties = {};
  if (!isNaN(Number(size)) && typeof size === "number") {
    innerStyle.width = `${size}px`;
    innerStyle.height = `${size}px`;
  }
  if (radius) {
    innerStyle.borderRadius = `${radius}px`;
  }

  const innerClasses = clsx("k-skeleton-avatar", {
    "k-skeleton-avatar-lg": size === "large",
    "k-skeleton-avatar-sm": size === "small",
    [`k-skeleton-avatar-${shape}`]: shape && shape !== "round",
  });

  return (
    <div className={wrapperClasses} {...rest}>
      {children && !show ? children : <span className={innerClasses} style={innerStyle} />}
    </div>
  );
};

export default SkeletonAvatar;
