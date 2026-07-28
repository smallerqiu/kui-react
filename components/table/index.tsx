import clsx from "clsx";
import { ChevronDown, ChevronUp } from "kui-icons";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type UIEvent,
} from "react";
import { Checkbox, type ChangeEvent } from "../checkbox";
import type { SizeType } from "../const/types";
import Empty from "../empty";
import Icon from "../icon";
import Spin from "../spin";

export interface SortState {
  key: string;
  order: null | "desc" | "asc";
}
export interface Column<T = any> {
  key: string;
  title: ReactNode;
  width?: number;
  fixed?: "left" | "right";
  sorter?: boolean | ((state: SortState) => void);
  render?: (value: any, record: T, rowIndex: number, column: Column<T>) => ReactNode;
  renderHeader?: (column: Column<T>, index: number) => ReactNode;
  colSpan?: number | ((record: T, index: number) => number);
  rowSpan?: number | ((record: T, index: number) => number);
  children?: Column<T>[];
}
export interface TableProps<T = any> extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  data?: T[];
  columns?: Column<T>[];
  selectedKeys?: Array<string | number>;
  defaultSelectedKeys?: Array<string | number>;
  disabledKeys?: Array<string | number>;
  rowKey?: string | ((record: T) => string | number);
  scroll?: { x?: number | string; y?: number | string };
  size?: SizeType;
  striped?: boolean;
  bordered?: boolean;
  checkable?: boolean;
  loading?: boolean;
  emptyText?: string;
  header?: ReactNode;
  footer?: ReactNode;
  onSort?: (state: SortState) => void;
  onRowClick?: (record: T, index: number) => void;
  onSelect?: (record: T, selected: boolean, selectedKeys: Array<string | number>) => void;
  onSelectAll?: (selected: boolean, selectedKeys: Array<string | number>) => void;
  onSelectedKeysChange?: (selectedKeys: Array<string | number>) => void;
}
interface MatrixCell {
  rowSpan: number;
  colSpan: number;
  show: boolean;
}

const flatten = <T,>(columns: Column<T>[]): Column<T>[] =>
  columns.flatMap((column) => (column.children?.length ? flatten(column.children) : column));
const leafCount = <T,>(column: Column<T>): number =>
  column.children?.length ? column.children.reduce((sum, child) => sum + leafCount(child), 0) : 1;

export default function Table<T = any>({
  data = [],
  columns = [],
  selectedKeys,
  defaultSelectedKeys = [],
  disabledKeys = [],
  rowKey = "key",
  scroll = {},
  size,
  striped,
  bordered = false,
  checkable,
  loading,
  emptyText,
  header,
  footer,
  onSort,
  onRowClick,
  onSelect,
  onSelectAll,
  onSelectedKeysChange,
  className,
  ...rest
}: TableProps<T>) {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const controlledSelection = selectedKeys !== undefined;
  const [innerSelected, setInnerSelected] = useState(new Set(selectedKeys ?? defaultSelectedKeys));
  const [sort, setSort] = useState<SortState>({ key: "", order: null });
  const [ping, setPing] = useState({ left: false, right: false });
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const selected = controlledSelection ? new Set(selectedKeys) : innerSelected;
  const leaves = useMemo(() => flatten(columns), [columns]);
  const split = scroll.y != null;
  const keyOf = (record: T) =>
    typeof rowKey === "function" ? rowKey(record) : (record as any)[rowKey];
  const isDisabled = (key: string | number) => disabledKeys.includes(key);

  const headerInfo = useMemo(() => {
    let maxDepth = 1;
    const depth = (items: Column<T>[], level = 1) =>
      items.forEach((item) =>
        item.children?.length
          ? depth(item.children, level + 1)
          : (maxDepth = Math.max(maxDepth, level))
      );
    depth(columns);
    const rows: Array<Array<Column<T> & { headerColSpan: number; headerRowSpan: number }>> = [];
    const visit = (items: Column<T>[], level: number) => {
      rows[level] ??= [];
      items.forEach((item) => {
        rows[level].push({
          ...item,
          headerColSpan: leafCount(item),
          headerRowSpan: item.children?.length ? 1 : maxDepth - level,
        });
        if (item.children?.length) visit(item.children, level + 1);
      });
    };
    visit(columns, 0);
    return { rows, maxDepth };
  }, [columns]);

  const fixed = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};
    let left = checkable ? 50 : 0;
    leaves.forEach((column) => {
      if (column.fixed === "left") {
        styles[column.key] = { position: "sticky", left, transform: "translateZ(0)" };
        left += column.width ?? 150;
      }
    });
    let right = 0;
    [...leaves].reverse().forEach((column) => {
      if (column.fixed === "right") {
        styles[column.key] = { position: "sticky", right, transform: "translateZ(0)" };
        right += column.width ?? 150;
      }
    });
    return styles;
  }, [checkable, leaves]);
  const fixedClass = (column: Column<T>, index: number) =>
    clsx(
      column.fixed === "left" && "k-table-cell-fix-left",
      column.fixed === "left" &&
        leaves[index + 1]?.fixed !== "left" &&
        "k-table-cell-fix-left-last",
      column.fixed === "right" && "k-table-cell-fix-right",
      column.fixed === "right" &&
        leaves[index - 1]?.fixed !== "right" &&
        "k-table-cell-fix-right-first",
      column.sorter && "k-table-cell-sorter"
    );

  const processed = useMemo(() => {
    const result = [...data];
    if (
      sort.key &&
      sort.order &&
      leaves.find((column) => column.key === sort.key)?.sorter === true
    ) {
      result.sort((a, b) => {
        const first = (a as any)[sort.key],
          second = (b as any)[sort.key];
        if (first === second) return 0;
        const comparison = first > second ? 1 : -1;
        return sort.order === "asc" ? comparison : -comparison;
      });
    }
    return result;
  }, [data, leaves, sort]);
  const matrix = useMemo(() => {
    const result: MatrixCell[][] = processed.map(() =>
      leaves.map(() => ({ rowSpan: 1, colSpan: 1, show: true }))
    );
    processed.forEach((record, row) =>
      leaves.forEach((column, col) => {
        if (!result[row][col].show) return;
        const rowSpan =
          typeof column.rowSpan === "function"
            ? column.rowSpan(record, row)
            : (column.rowSpan ?? 1);
        const colSpan =
          typeof column.colSpan === "function"
            ? column.colSpan(record, row)
            : (column.colSpan ?? 1);
        result[row][col] = { rowSpan, colSpan, show: true };
        for (let r = 0; r < rowSpan; r++)
          for (let c = 0; c < colSpan; c++)
            if (r || c) {
              const cell = result[row + r]?.[col + c];
              if (cell) cell.show = false;
            }
      })
    );
    return result;
  }, [leaves, processed]);

  const enabled = data.filter((record) => !isDisabled(keyOf(record)));
  const checkedCount = enabled.filter((record) => selected.has(keyOf(record))).length;
  const allChecked = enabled.length > 0 && checkedCount === enabled.length;
  const indeterminate = checkedCount > 0 && checkedCount < enabled.length;
  const commitSelection = (next: Set<string | number>) => {
    const keys = [...next];
    if (!controlledSelection) setInnerSelected(next);
    onSelectedKeysChange?.(keys);
    return keys;
  };
  const toggleAll = ({ checked }: ChangeEvent) => {
    const next = new Set(selected);
    data.forEach((record) => {
      const key = keyOf(record);
      if (!isDisabled(key)) checked ? next.add(key) : next.delete(key);
    });
    onSelectAll?.(checked, commitSelection(next));
  };
  const toggleOne = (event: ChangeEvent, record: T) => {
    const key = keyOf(record);
    if (isDisabled(key)) return;
    const next = new Set(selected);
    event.checked ? next.add(key) : next.delete(key);
    onSelect?.(record, event.checked, commitSelection(next));
  };
  const changeSort = (column: Column<T>) => {
    if (!column.sorter) return;
    const next: SortState = {
      key: column.key,
      order:
        sort.key !== column.key
          ? "asc"
          : sort.order === "asc"
            ? "desc"
            : sort.order === "desc"
              ? null
              : "asc",
    };
    setSort(next);
    if (typeof column.sorter === "function") column.sorter(next);
    onSort?.(next);
  };
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (split && headerRef.current) headerRef.current.scrollLeft = target.scrollLeft;
    const max = Math.max(0, target.scrollWidth - target.clientWidth);
    setPing({ left: target.scrollLeft > 0.5, right: target.scrollLeft < max - 0.5 });
  };
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    setScrollbarWidth(split ? body.offsetWidth - body.clientWidth - (bordered ? 1 : 0) : 0);
  }, [bordered, data, split]);

  const colgroup = (headerTable = false) => (
    <colgroup>
      {checkable && <col style={{ width: 50 }} />}
      {leaves.map((column) => (
        <col
          key={column.key}
          style={{ width: column.width ?? "auto", minWidth: column.width ?? 150 }}
        />
      ))}
      {headerTable && split && <col style={{ width: scrollbarWidth }} />}
    </colgroup>
  );
  const thead = (
    <thead>
      {headerInfo.rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {checkable && rowIndex === 0 && (
            <th
              rowSpan={headerInfo.maxDepth}
              className="k-table-cell-fix-left"
              style={{ left: 0, zIndex: 3 }}
            >
              <Checkbox
                checked={allChecked}
                indeterminate={indeterminate}
                onChange={toggleAll}
                disabled={data.length > 0 && !enabled.length}
              />
            </th>
          )}
          {row.map((column, index) => (
            <th
              key={column.key}
              colSpan={column.headerColSpan}
              rowSpan={column.headerRowSpan}
              className={fixedClass(column, leaves.indexOf(column))}
              style={fixed[column.key]}
              onClick={() => changeSort(column)}
            >
              <div className="k-table-header-col">
                {column.renderHeader?.(column, index) ?? column.title}
                {column.sorter && (
                  <span className="k-table-sorter">
                    <Icon
                      type={ChevronUp}
                      className={clsx(
                        "k-table-sorter-up",
                        sort.key === column.key && sort.order === "asc" && "k-table-sorter-active"
                      )}
                    />
                    <Icon
                      type={ChevronDown}
                      className={clsx(
                        "k-table-sorter-down",
                        sort.key === column.key && sort.order === "desc" && "k-table-sorter-active"
                      )}
                    />
                  </span>
                )}
              </div>
            </th>
          ))}
          {split && rowIndex === 0 && (
            <th
              rowSpan={headerInfo.maxDepth}
              className="k-table-scrollbar-patch"
              style={{ width: scrollbarWidth }}
            />
          )}
        </tr>
      ))}
    </thead>
  );
  const tbody = (
    <tbody>
      {processed.map((record, rowIndex) => (
        <tr key={keyOf(record)} onClick={() => onRowClick?.(record, rowIndex)}>
          {checkable && (
            <td
              className="k-table-cell-fix-left"
              style={{ width: 50, left: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Checkbox
                checked={selected.has(keyOf(record))}
                disabled={isDisabled(keyOf(record))}
                onChange={(event) => toggleOne(event, record)}
              />
            </td>
          )}
          {leaves.map((column, colIndex) => {
            const cell = matrix[rowIndex]?.[colIndex];
            if (!cell?.show) return null;
            const value = (record as any)[column.key];
            return (
              <td
                key={column.key}
                rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
                colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
                className={fixedClass(column, colIndex)}
                style={fixed[column.key]}
              >
                {column.render?.(value, record, rowIndex, column) ?? value}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
  const tableStyle: CSSProperties = {
    width: typeof scroll.x === "number" ? scroll.x : scroll.x,
    minWidth: scroll.x ? undefined : "100%",
    tableLayout: "fixed",
  };
  const renderTable = (showHeader: boolean, showBody: boolean, headerTable = false) => (
    <table style={tableStyle}>
      {colgroup(headerTable)}
      {showHeader && thead}
      {showBody && tbody}
    </table>
  );
  const empty = !data.length || !columns.length;
  return (
    <div
      {...rest}
      className={clsx(
        "k-table",
        striped && "k-table-striped",
        size === "small" && "k-table-sm",
        size === "large" && "k-table-lg",
        bordered && "k-table-bordered",
        ping.left && "k-table-ping-left",
        ping.right && "k-table-ping-right",
        className
      )}
    >
      {header && <div className="k-table-header">{header}</div>}
      {split && (
        <div className="k-table-thead" ref={headerRef} style={{ overflow: "hidden" }}>
          {renderTable(true, false, true)}
        </div>
      )}
      <div
        className="k-table-body k-scroll"
        ref={bodyRef}
        style={{
          overflowY: scroll.y ? "auto" : undefined,
          overflowX: data.length ? "auto" : "hidden",
          maxHeight: scroll.y,
        }}
        onScroll={handleScroll}
      >
        {renderTable(!split, true)}
        {empty && <Empty description={emptyText} />}
      </div>
      {footer && <div className="k-table-footer">{footer}</div>}
      {loading && <Spin />}
    </div>
  );
}
