import clsx from "clsx";
import { useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import { Odometer } from "./utils/odometer";

export interface RollUpProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "defaultValue" | "defaultChecked"
> {
  value?: number;
  text?: string;
  duration?: number;
  precision?: number;
}

export default function RollUp({
  value = 0,
  text,
  duration = 0.3,
  precision = 0,
  className,
  ...rest
}: RollUpProps) {
  const element = useRef<HTMLSpanElement>(null);
  const odometer = useRef<Odometer | null>(null);
  const formatted =
    text ??
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(value);
  const [initialText] = useState(formatted);
  useLayoutEffect(() => {
    const instance = new Odometer({ duration });
    odometer.current = instance;
    return () => {
      instance.destroy();
      odometer.current = null;
    };
  }, [duration]);
  useLayoutEffect(() => {
    if (element.current) odometer.current?.render(element.current, formatted, value);
  }, [formatted, value, duration]);
  return (
    <span {...rest} className={clsx("k-roll-number", className)} ref={element}>
      {initialText}
    </span>
  );
}
