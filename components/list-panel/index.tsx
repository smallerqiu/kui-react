import { resolvePaintedTheme, useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import Card from "../card";
import type { SizeType, SurfaceShapeType, SurfaceThemeType } from "../const/types";

// The five tiers the card this panel renders actually paints.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

export interface ListPanelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "defaultValue" | "defaultChecked"
> {
  summary?: ReactNode;
  bordered?: boolean;
  // The panel draws no plate of its own — the card it renders paints the tier — so it answers every tier
  // the card can, and it resolves the tier here: the panel is the caller of that card and the one that
  // decides which appearance it asks for, and its own look is the outlined card, so a tier the card cannot
  // paint lands on `outline` rather than on the card's own `fill`.
  // `shape` makes no such choice. The panel has no corner of its own, so what it was given goes to the
  // card untouched, and the card resolves an inherited shape the same way it resolves one written on it.
  theme?: SurfaceThemeType;
  shape?: SurfaceShapeType;
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
  theme: themeProp,
  shape: shapeProp,
  size: sizeProp,
  selectedCount = 0,
  filters,
  actions,
  selection,
  footer,
  children,
  className,
  ...rest
}: ListPanelProps) {
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "outline";
  const size = sizeProp ?? inheritedAppearance.size ?? "medium";
  const hasNode = (node: ReactNode) => node !== null && node !== undefined && node !== false;
  const selectionContent = typeof selection === "function" ? selection(selectedCount) : selection;
  const hasSummary = hasNode(summary);
  const hasSelection =
    Number.isFinite(selectedCount) && selectedCount > 0 && hasNode(selectionContent);
  const hasFilters = hasNode(filters);
  const hasActions = hasNode(actions);
  const hasToolbar = hasFilters || hasActions || hasSummary || hasSelection;
  return (
    <Card
      {...rest}
      className={clsx("k-list-panel", !bordered && "k-list-panel-borderless", className)}
      bordered={bordered}
      theme={theme}
      shape={shapeProp}
      size={size}
    >
      {hasToolbar && (
        <div
          className={clsx("k-list-panel-toolbar", hasSelection && "k-list-panel-toolbar-selection")}
          role="toolbar"
        >
          {hasSelection ? (
            <div className="k-list-panel-selection">{selectionContent}</div>
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
