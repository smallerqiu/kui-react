import React, { useEffect, useState, useRef } from "react";
import type { SizeType, SpinModeType } from "../const/types.ts";

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  spinning?: boolean;
  delay?: number;
  size?: SizeType;
  mode?: SpinModeType;
  children?: React.ReactNode;
}

const Spin: React.FC<SpinProps> = ({
  spinning: spinningProp = true,
  delay = 500,
  size,
  mode = "rotate",
  children,
  className = "",
  ...rest
}) => {
  const [spinning, setSpinning] = useState(spinningProp);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (spinningProp) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setSpinning(true);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setSpinning(false);
        timerRef.current = null;
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [spinningProp, delay]);

  const spinClasses = [
    spinning ? "k-spin-loading" : "",
    mode && spinning ? `k-spin-${mode}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const rootClasses = [
    "k-spin",
    size === "large" ? "k-spin-lg" : "",
    size === "small" ? "k-spin-sm" : "",
    children == null ? "k-spin-only" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinNode = <div className={spinClasses} />;

  return (
    <div className={rootClasses} {...rest}>
      {spinNode}
      {children}
    </div>
  );
};

export default Spin;
