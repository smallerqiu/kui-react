import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
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

  const spinClasses = clsx(
    { "k-spin-loading": spinning },
    mode && spinning ? `k-spin-${mode}` : ""
  );

  const rootClasses = clsx(
    "k-spin",
    {
      "k-spin-lg": size === "large",
      "k-spin-sm": size === "small",
      "k-spin-only": children == null,
    },
    className
  );

  const spinNode = <div className={spinClasses} />;

  return (
    <div className={rootClasses} {...rest}>
      {spinNode}
      {children}
    </div>
  );
};

export default Spin;
