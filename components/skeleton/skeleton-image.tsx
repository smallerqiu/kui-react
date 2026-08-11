import clsx from "clsx";
import { Images } from "kui-icons";
import React, { useEffect, useRef, useState } from "react";
import Icon from "../icon";

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
  if (radius) innerStyle.borderRadius = `${radius}px`;
  if (typeof size === "number" && !isNaN(size)) {
    innerStyle.width = `${size}px`;
    innerStyle.height = `${size}px`;
  }
  if (Array.isArray(size)) {
    innerStyle.width = `${size[0]}px`;
    innerStyle.height = `${size[1]}px`;
  }

  return (
    <div className={wrapperClasses} {...rest}>
      {children && !show ? (
        children
      ) : (
        <span className="k-skeleton-image" style={innerStyle}>
          <Icon type={Images} className="k-skeleton-image-icon" />
        </span>
      )}
    </div>
  );
};

export default SkeletonImage;
