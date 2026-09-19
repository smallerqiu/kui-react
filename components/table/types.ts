import type { HTMLAttributes, ReactNode } from "react";
import type { ShapeType } from "../const/types";
import type { SizeType } from "../const/types";

export type TableKey = string | number;

export interface SortState {
  key: string;
  order: null | "desc" | "asc";
}

export interface Column<T = Record<string, unknown>> {
  key: string;
  title: ReactNode;
  width?: number;
  fixed?: "left" | "right";
  sorter?: boolean | ((state: SortState) => void);
  render?(value: unknown, record: T, rowIndex: number, column: Column<T>): ReactNode;
  renderHeader?(column: Column<T>, index: number): ReactNode;
  colSpan?: number | ((record: T, index: number) => number);
  rowSpan?: number | ((record: T, index: number) => number);
  children?: Column<T>[];
}

export interface TableProps<T = Record<string, unknown>> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  data?: T[];
  columns?: Column<T>[];
  selectedKeys?: TableKey[];
  defaultSelectedKeys?: TableKey[];
  disabledKeys?: TableKey[];
  rowKey?: string | ((record: T) => TableKey);
  childrenColumnName?: string;
  expandedKeys?: TableKey[];
  defaultExpandedKeys?: TableKey[];
  defaultExpandAllRows?: boolean;
  expandRowByClick?: boolean;
  indentSize?: number;
  scroll?: { x?: number | string; y?: number | string };
  size?: SizeType;
  striped?: boolean;
  bordered?: boolean;
  shape?: ShapeType;
  checkable?: boolean;
  loading?: boolean;
  emptyText?: string;
  header?: ReactNode;
  footer?: ReactNode;
  /** 开启虚拟滚动，用于高效渲染大量行 */
  virtual?: boolean;
  /** 虚拟滚动时每行的高度，单位 `px` */
  itemHeight?: number;
  /** 虚拟滚动时视口外额外渲染的行数量 */
  overscan?: number;
  /** 隐藏的列 key 集合 */
  hiddenColumnKeys?: (string | number)[];
  onSort?: (state: SortState) => void;
  onRowClick?: (record: T, index: number) => void;
  onSelect?: (record: T, selected: boolean, selectedKeys: TableKey[]) => void;
  onSelectAll?: (selected: boolean, selectedKeys: TableKey[]) => void;
  onSelectedKeysChange?: (selectedKeys: TableKey[]) => void;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedKeysChange?: (expandedKeys: TableKey[]) => void;
}

export interface TableTreeRow<T> {
  record: T;
  depth: number;
  hasChildren: boolean;
}
