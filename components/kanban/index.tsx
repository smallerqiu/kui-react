import clsx from "clsx";
import { useState } from "react";
import Empty from "../empty";
import type { ThemeType } from "../const/types";

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
export interface KanbanProps extends React.HTMLAttributes<HTMLDivElement> {
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
  emptyText = "暂无数据",
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
      {columns.map((column) => {
        const items = data.filter((entry) => entry[statusKey] === column.key);
        return (
          <section
            key={column.key}
            className={clsx(
              "k-kanban-column",
              dragOverKey === column.key && "k-kanban-column-drag-over",
            )}
            onDragOver={(event) => {
              if (draggable) {
                event.preventDefault();
                setDragOverKey(column.key);
              }
            }}
            onDragLeave={() => setDragOverKey(undefined)}
            onDrop={() => {
              const moved = data.find((entry) => entry[rowKey] === draggingKey);
              if (moved && moved[statusKey] !== column.key)
                onMove?.({
                  item: moved,
                  from: moved[statusKey] as string | number,
                  to: column.key,
                });
              setDraggingKey(undefined);
              setDragOverKey(undefined);
            }}
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
            <div className="k-kanban-column-content">
              {items.map((entry, index) => (
                <div
                  key={String(entry[rowKey])}
                  className="k-kanban-item"
                  draggable={draggable}
                  onDragStart={() => setDraggingKey(entry[rowKey])}
                  onDragEnd={() => setDraggingKey(undefined)}
                  onClick={() => onItemClick?.(entry, column)}
                >
                  {item?.(entry, column, index)}
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
