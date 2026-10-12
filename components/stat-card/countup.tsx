import clsx from "clsx";
import { useEffect, useRef, type HTMLAttributes } from "react";
import { CountUp, type CountUpOptions } from "./utils/countup";
import { Odometer } from "./utils/odometer";

export interface CountUpNumberProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "defaultValue" | "defaultChecked"
> {
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
  const renderedValueRef = useRef(currentValue);

  useEffect(() => {
    latestValueRef.current = currentValue;
  }, [currentValue]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observeVisibility = autoAnimate && typeof IntersectionObserver !== "undefined";
    // The digit-roll plugin already refuses to move when the user asked for less
    // motion; the counting path has to make the same call, otherwise the default
    // `type` still animates for those visitors.
    const reducedMotion =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const safeDuration =
      reducedMotion || !Number.isFinite(duration) ? 0 : Math.max(0, duration);
    const safePrecision = Number.isFinite(precision)
      ? Math.min(100, Math.max(0, Math.floor(precision)))
      : 0;
    const options: CountUpOptions = {
      duration: type === "rollup" ? 0 : safeDuration,
      separator,
      decimalPlaces: safePrecision,
      autoAnimate: observeVisibility,
      autoAnimateOnce,
      plugin:
        type === "rollup"
          ? new Odometer({ duration: safeDuration, mode: "continuous" })
          : undefined,
    };
    const count = new CountUp(elementRef.current, latestValueRef.current, options);
    countRef.current = count;
    renderedValueRef.current = latestValueRef.current;
    if (!observeVisibility) count.start();
    return () => {
      count.onDestroy();
      if (countRef.current === count) countRef.current = null;
    };
  }, [autoAnimate, autoAnimateOnce, duration, precision, separator, type]);

  useEffect(() => {
    if (renderedValueRef.current === currentValue) return;
    renderedValueRef.current = currentValue;
    countRef.current?.update(currentValue);
  }, [currentValue]);

  return <span {...rest} ref={elementRef} className={clsx("k-stat-countup-number", className)} />;
}
