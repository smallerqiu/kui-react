import clsx from "clsx";
import { useEffect, useRef, type HTMLAttributes } from "react";
import { CountUp, type CountUpOptions } from "./utils/countup";
import { Odometer } from "./utils/odometer";

export interface CountUpNumberProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number;
  separator?: string;
  duration?: number;
  precision?: number;
  type?: "rollup" | "countup";
  autoAnimate?: boolean;
  autoAnimateOnce?: boolean;
}

export default function CountUpNumber({
  value,
  separator = ",",
  duration = 1.2,
  precision = 0,
  type = "countup",
  autoAnimate = false,
  autoAnimateOnce = false,
  className,
  ...rest
}: CountUpNumberProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<CountUp | null>(null);
  const currentValue = value ?? 0;

  useEffect(() => {
    if (!elementRef.current) return;
    const options: CountUpOptions = {
      duration,
      separator,
      decimalPlaces: precision,
      autoAnimate,
      autoAnimateOnce,
      plugin: type === "rollup" ? new Odometer({ duration, lastDigitDelay: 0 }) : undefined,
    };
    const count = new CountUp(elementRef.current, currentValue, options);
    countRef.current = count;
    if (!autoAnimate) count.start();
    return () => {
      count.onDestroy();
      if (countRef.current === count) countRef.current = null;
    };
  }, [autoAnimate, autoAnimateOnce, currentValue, duration, precision, separator, type]);

  useEffect(() => {
    countRef.current?.update(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (countRef.current) countRef.current.options.decimalPlaces = precision;
  }, [precision]);

  return <span {...rest} ref={elementRef} className={clsx("k-stat-countup-number", className)} />;
}
