import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import type { SizeType, SpinModeType } from "../const/types";

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  spinning?: boolean;
  delay?: number;
  size?: SizeType;
  mode?: SpinModeType;
  children?: React.ReactNode;
}

const Spin: React.FC<SpinProps> = ({
  spinning: spinningProp = true,
  delay = 0,
  size,
  mode = "rotate",
  children,
  className = "",
  ...rest
}) => {
  const [spinning, setSpinning] = useState(spinningProp);
  const [previousState, setPreviousState] = useState({ spinningProp, delay });
  if (previousState.spinningProp !== spinningProp || previousState.delay !== delay) {
    setPreviousState({ spinningProp, delay });
    if (!spinningProp) setSpinning(false);
    else if (delay <= 0) setSpinning(true);
  }
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (spinningProp && delay > 0) {
      timerRef.current = setTimeout(() => {
        setSpinning(true);
        timerRef.current = null;
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [spinningProp, delay]);

  const spinClasses = clsx({ "k-spin-loading": spinning, [`k-spin-${mode}`]: mode && spinning });

  const rootClasses = clsx(
    "k-spin",
    {
      "k-spin-lg": size === "large",
      "k-spin-sm": size === "small",
      "k-spin-only": children == null,
    },
    className,
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
