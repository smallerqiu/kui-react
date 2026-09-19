import clsx from "clsx";
import { useMemo, useState } from "react";
import Empty from "../empty";

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
export interface KanbanProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: KanbanColumnData[];
  data?: KanbanItemData[];
  rowKey?: string;
  statusKey?: string;
  draggable?: boolean;
  emptyText?: string;
  minColumnWidth?: number | string;
  theme?: "fill" | "outline";
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
  theme = "fill",
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
