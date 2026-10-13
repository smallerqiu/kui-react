import type { HTMLAttributes, ReactNode } from "react";
import type { ShapeType } from "../const/types";
import type { SizeType } from "../const/types";

export type TableKey = string | number;

export interface SortState {
  key: string;
  order: null | "desc" | "asc";
}

export interface TableEllipsisOptions {
  /** 截断到第几行，默认 `1`（单行不换行） */
  rows?: number;
  /**
   * 悬停提示。默认用被截断的那段文本；传字符串或节点换成指定内容；`false` 关掉提示。
   * 只有真的被截断才会弹，没截断的格子不会多出气泡。
   */
  tooltip?: boolean | ReactNode;
}

export interface Column<T = Record<string, unknown>> {
  key: string;
  title: ReactNode;
  width?: number;
  fixed?: "left" | "right";
  sorter?: boolean | ((state: SortState) => void);
  /**
   * 内容超出列宽时显示省略号。`true` 单行、数字或 `rows` 是多行，`tooltip` 定制悬停提示。
   * 表格级 `ellipsis` 打开时，这一列写 `false` 可以单独关掉。
   */
  ellipsis?: boolean | number | TableEllipsisOptions;
  render?(value: unknown, record: T, rowIndex: number, column: Column<T>): ReactNode;
  renderHeader?(column: Column<T>, index: number): ReactNode;
  colSpan?: number | ((record: T, index: number) => number);
  rowSpan?: number | ((record: T, index: number) => number);
  children?: Column<T>[];
}

export interface TableProps<T = Record<string, unknown>> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect" | "defaultValue" | "defaultChecked"
> {
  data?: T[];
  columns?: Column<T>[];
  /**
   * 给所有列打开省略号，省得一列列写 `ellipsis`。
   * `true` 单行、数字或 `rows` 是多行，`tooltip` 定制悬停提示；某一列想留完整内容就在那列写 `ellipsis: false`。
   */
  ellipsis?: boolean | number | TableEllipsisOptions;
  selectedKeys?: TableKey[];
  disabledKeys?: TableKey[];
  rowKey?: string | ((record: T) => TableKey);
  childrenColumnName?: string;
  expandedKeys?: TableKey[];
  expandAllRows?: boolean;
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
