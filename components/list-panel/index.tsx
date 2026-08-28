import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import Card from "../card";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

export interface ListPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  summary?: string | number | ReactNode;
  bordered?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
  size?: SizeType;
  selectedCount?: number;
  filters?: ReactNode;
  actions?: ReactNode;
  selection?: ReactNode | ((count: number) => ReactNode);
  footer?: ReactNode;
  children?: ReactNode;
}
export default function ListPanel({
  summary,
  bordered = false,
  theme = "outline",
  shape = "round",
  size = "medium",
  selectedCount = 0,
  filters,
  actions,
  selection,
  footer,
  children,
  className,
  ...rest
}: ListPanelProps) {
  const hasToolbar =
    filters || actions || summary !== undefined || (selectedCount > 0 && selection);
  return (
    <Card
      {...rest}
      className={clsx("k-list-panel", className)}
      bordered={bordered}
      theme={theme}
      shape={shape}
      size={size}
    >
      {hasToolbar && (
        <div
          className={clsx(
            "k-list-panel-toolbar",
            selectedCount > 0 && selection && "k-list-panel-toolbar-selection",
          )}
        >
          {selectedCount > 0 && selection ? (
            <div className="k-list-panel-selection">
              {typeof selection === "function" ? selection(selectedCount) : selection}
            </div>
          ) : (
            <>
              <div className="k-list-panel-filters">{filters}</div>
              {(summary !== undefined || actions) && (
                <div className="k-list-panel-toolbar-extra">
                  {summary !== undefined && <div className="k-list-panel-summary">{summary}</div>}
                  {actions}
                </div>
              )}
            </>
          )}
        </div>
      )}
      <div className="k-list-panel-content">{children}</div>
      {footer && <div className="k-list-panel-footer">{footer}</div>}
    </Card>
  );
}
