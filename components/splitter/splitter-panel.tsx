import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SplitterPanelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  size?: number | string;
  min?: number | string;
  max?: number | string;
  resizable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function SplitterPanel(props: SplitterPanelProps) {
  const { className, children, ...rest } = props;
  delete rest.size;
  delete rest.min;
  delete rest.max;
  delete rest.resizable;
  delete rest.collapsible;
  delete rest.collapsed;
  delete rest.onCollapsedChange;
  return (
    <div {...rest} className={clsx("k-splitter-panel", className)}>
      {children}
    </div>
  );
}
