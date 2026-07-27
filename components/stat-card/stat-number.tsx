import type { HTMLAttributes, ReactNode } from "react";
import CountUp from "./countup";

export interface StatNumberProps extends Omit<HTMLAttributes<HTMLDivElement>, "prefix"> {
  value?: number;
  modelValue?: number;
  separator?: string;
  duration?: number;
  precision?: number;
  type?: "rollup" | "countup";
  prefix?: ReactNode;
  suffix?: ReactNode;
  autoAnimate?: boolean;
  autoAnimateOnce?: boolean;
}

export default function StatNumber({
  value,
  modelValue,
  separator,
  duration = 1,
  precision = 0,
  type = "countup",
  prefix,
  suffix,
  autoAnimate = true,
  autoAnimateOnce = true,
  className,
  ...rest
}: StatNumberProps) {
  return (
    <div {...rest} className={["k-stat-number", className].filter(Boolean).join(" ")}>
      {prefix != null && <span className="k-stat-number-prefix">{prefix}</span>}
      <CountUp
        value={value ?? modelValue ?? 0}
        separator={separator}
        duration={duration}
        precision={precision}
        type={type}
        autoAnimate={autoAnimate}
        autoAnimateOnce={autoAnimateOnce}
      />
      {suffix != null && <span className="k-stat-number-suffix">{suffix}</span>}
    </div>
  );
}
