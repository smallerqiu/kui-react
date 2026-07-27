import type { HTMLAttributes } from "react";

export interface SplitterPanelProps extends HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  min?: number | string;
  max?: number | string;
}

export function SplitterPanel({
  className,
  children,
  size: _,
  min: __,
  max: ___,
  ...rest
}: SplitterPanelProps) {
  return (
    <div {...rest} className={["k-splitter-panel", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
