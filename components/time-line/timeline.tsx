import clsx from "clsx";
import type { HTMLAttributes } from "react";

export type TimelineMode = "left" | "right" | "center" | "alternate";

export interface TimelineProps extends Omit<
  HTMLAttributes<HTMLUListElement>,
  "defaultValue" | "defaultChecked"
> {
  mode?: TimelineMode;
}

export default function TimeLine({ mode = "left", className, children, ...rest }: TimelineProps) {
  return (
    <ul {...rest} className={clsx("k-time-line", `k-time-line-${mode}`, className)}>
      {children}
    </ul>
  );
}
