import { resolvePaintedTheme, useConfigAppearance } from "../config/use-config-appearance";
import type { ThemeType } from "../const/types";
import clsx from "clsx";
import { useMemo, useState } from "react";
import Empty from "../empty";

// A board has no plate of its own — the surfaces are its columns — so it answers the four surface tiers
// plus `fill`, and never `underlined`: "keep only the bottom border" on a column that holds a whole list
// is not an appearance preset (see `.kui-theme-value` in `styles/less-css-var.less`). A tier outside this
// list must not reach the class list: `k-kanban-<tier>` with no LESS block is the "class ships, nothing
// paints" bug, and a board's own look is `fill`, so the guard falls back to it.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

export interface KanbanColumnData {
  key: string | number;
  title: string;
  color?: string;
  [key: string]: unknown;
}
export interface KanbanItemData {
  [key: string]: unknown;
}
export interface KanbanMoveEvent {
  item: KanbanItemData;
  from: string | number;
  to: string | number;
}
const toRenderKey = (value: unknown) => `${typeof value}:${String(value)}`;
export interface KanbanProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  columns?: KanbanColumnData[];
  data?: KanbanItemData[];
  rowKey?: string;
  statusKey?: string;
  draggable?: boolean;
  emptyText?: string;
  minColumnWidth?: number | string;
  theme?: ThemeType;
  onMove?: (event: KanbanMoveEvent) => void;
  onItemClick?: (item: KanbanItemData, column: KanbanColumnData) => void;
  columnTitle?: (column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode;
  item?: (item: KanbanItemData, column: KanbanColumnData, index: number) => React.ReactNode;
  empty?: (column: KanbanColumnData) => React.ReactNode;
  footer?: (column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode;
}
export default function Kanban({
  columns = [],
  data = [],
  rowKey = "id",
  statusKey = "status",
  draggable = true,
  emptyText,
  minColumnWidth = 250,
  theme: themeProp,
  onMove,
  onItemClick,
  columnTitle,
  item,
  empty,
  footer,
  className,
  style,
  ...rest
}: KanbanProps) {
  const [draggingKey, setDraggingKey] = useState<unknown>();
  const [dragOverKey, setDragOverKey] = useState<string | number>();
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "fill";
  const width = typeof minColumnWidth === "number" ? `${minColumnWidth}px` : minColumnWidth;
  const grouped = useMemo(() => {
    const groups = new Map<string | number, KanbanItemData[]>();
    columns.forEach((column) => groups.set(column.key, []));
    data.forEach((entry) => {
      const status = entry[statusKey];
      if (typeof status !== "string" && typeof status !== "number") return;
      groups.get(status)?.push(entry);
    });
    return groups;
  }, [columns, data, statusKey]);
  const move = (entry: KanbanItemData | undefined, column: KanbanColumnData) => {
    if (!entry || entry[statusKey] === column.key) return;
    const from = entry[statusKey];
    if (typeof from !== "string" && typeof from !== "number") return;
    onMove?.({ item: entry, from, to: column.key });
  };
  return (
    <div
      {...rest}
      className={clsx("k-kanban", `k-kanban-${theme}`, className)}
      style={
        {
          ...style,
          "--k-kanban-column-width": width,
          "--k-kanban-columns": columns.length,
        } as React.CSSProperties
      }
    >
      {columns.map((column, columnIndex) => {
        const items = grouped.get(column.key) || [];
        return (
          <section
            key={toRenderKey(column.key)}
            className={clsx(
              "k-kanban-column",
              dragOverKey === column.key && "k-kanban-column-drag-over",
            )}
            onDragOver={(event) => {
              if (draggable) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDragOverKey(column.key);
              }
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null))
                setDragOverKey(undefined);
            }}
            onDrop={(event) => {
              event.preventDefault();
              move(
                data.find((entry) => entry[rowKey] === draggingKey),
                column,
              );
              setDraggingKey(undefined);
              setDragOverKey(undefined);
            }}
            aria-label={column.title}
          >
            <header className="k-kanban-column-header">
              {columnTitle?.(column, items) ?? (
                <>
                  <i style={{ background: column.color }} />
                  <strong>{column.title}</strong>
                  <em>{items.length}</em>
                </>
              )}
            </header>
            <div className="k-kanban-column-content" role="list">
              {items.map((entry, index) => (
                <div
                  key={toRenderKey(entry[rowKey])}
                  className={clsx(
                    "k-kanban-item",
                    draggingKey === entry[rowKey] && "k-kanban-item-dragging",
                  )}
                  draggable={draggable}
                  tabIndex={draggable || onItemClick ? 0 : undefined}
                  role="listitem"
                  aria-keyshortcuts={draggable ? "Alt+ArrowLeft Alt+ArrowRight" : undefined}
                  onDragStart={(event) => {
                    setDraggingKey(entry[rowKey]);
                    event.dataTransfer.setData("text/plain", String(entry[rowKey]));
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => setDraggingKey(undefined)}
                  onClick={() => onItemClick?.(entry, column)}
                  onKeyDown={(event) => {
                    if (draggable && event.altKey) {
                      const step =
                        event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
                      const target = columns[columnIndex + step];
                      if (step && target) {
                        event.preventDefault();
                        move(entry, target);
                      }
                    }
                    if (onItemClick && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      onItemClick(entry, column);
                    }
                  }}
                >
                  {item?.(entry, column, index) ?? String(entry.title ?? entry[rowKey] ?? "")}
                </div>
              ))}
              {!items.length && (empty?.(column) ?? <Empty description={emptyText} />)}
            </div>
            {footer && <footer className="k-kanban-column-footer">{footer(column, items)}</footer>}
          </section>
        );
      })}
    </div>
  );
}
