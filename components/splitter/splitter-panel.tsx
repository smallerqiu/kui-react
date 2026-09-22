import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SplitterPanelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  size?: number | string;
  min?: number | string;
  max?: number | string;
}

export function SplitterPanel(props: SplitterPanelProps) {
  const { className, children, ...rest } = props;
  return (
    <div {...rest} className={clsx("k-splitter-panel", className)}>
      {children}
    </div>
  );
}
