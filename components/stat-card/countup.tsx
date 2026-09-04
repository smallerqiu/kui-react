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
  const latestValueRef = useRef(currentValue);

  useEffect(() => {
    latestValueRef.current = currentValue;
  }, [currentValue]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observeVisibility = autoAnimate && typeof IntersectionObserver !== "undefined";
    const safeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 0;
    const safePrecision = Number.isFinite(precision)
      ? Math.min(100, Math.max(0, Math.floor(precision)))
      : 0;
    const options: CountUpOptions = {
      duration: safeDuration,
      separator,
      decimalPlaces: safePrecision,
      autoAnimate: observeVisibility,
      autoAnimateOnce,
      plugin:
        type === "rollup" ? new Odometer({ duration: safeDuration, lastDigitDelay: 0 }) : undefined,
    };
    const count = new CountUp(elementRef.current, latestValueRef.current, options);
    countRef.current = count;
    if (!observeVisibility) count.start();
    return () => {
      count.onDestroy();
      if (countRef.current === count) countRef.current = null;
    };
  }, [autoAnimate, autoAnimateOnce, duration, precision, separator, type]);

  useEffect(() => {
    countRef.current?.update(currentValue);
  }, [currentValue]);

  return <span {...rest} ref={elementRef} className={clsx("k-stat-countup-number", className)} />;
}
