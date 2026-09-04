import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import Card from "../card";
import type { ShapeType, SizeType } from "../const/types";

export interface ListPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  summary?: ReactNode;
  bordered?: boolean;
  theme?: "fill" | "outline" | "plain";
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
  bordered = true,
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
  const hasNode = (node: ReactNode) => node !== null && node !== undefined && node !== false;
  const hasSummary = hasNode(summary);
  const hasSelection = Number.isFinite(selectedCount) && selectedCount > 0 && hasNode(selection);
  const hasFilters = hasNode(filters);
  const hasActions = hasNode(actions);
  const hasToolbar = hasFilters || hasActions || hasSummary || hasSelection;
  return (
    <Card
      {...rest}
      className={clsx("k-list-panel", !bordered && "k-list-panel-borderless", className)}
      bordered={bordered}
      theme={theme}
      shape={shape}
      size={size}
    >
      {hasToolbar && (
        <div
          className={clsx("k-list-panel-toolbar", hasSelection && "k-list-panel-toolbar-selection")}
          role="toolbar"
        >
          {hasSelection ? (
            <div className="k-list-panel-selection">
              {typeof selection === "function" ? selection(selectedCount) : selection}
            </div>
          ) : (
            <>
              {hasFilters && <div className="k-list-panel-filters">{filters}</div>}
              {(hasSummary || hasActions) && (
                <div className="k-list-panel-toolbar-extra">
                  {hasSummary && (
                    <div className="k-list-panel-summary" aria-live="polite">
                      {summary}
                    </div>
                  )}
                  {hasActions && actions}
                </div>
              )}
            </>
          )}
        </div>
      )}
      <div className="k-list-panel-content">{children}</div>
      {hasNode(footer) && <div className="k-list-panel-footer">{footer}</div>}
    </Card>
  );
}
