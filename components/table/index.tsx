import clsx from "clsx";
import { ChevronDown, ChevronRight, Triangle } from "kui-icons";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type UIEvent,
} from "react";
import { Checkbox, type ChangeEvent } from "../checkbox";
import Empty from "../empty";
import Icon from "../icon";
import Spin from "../spin";
import type { Column, SortState, TableKey, TableProps } from "./types";
import {
  countColumnLeaves,
  flattenColumns,
  flattenTreeData,
  getRecordValue,
} from "./utils";

export type { Column, SortState, TableKey, TableProps } from "./types";
interface MatrixCell {
  rowSpan: number;
  colSpan: number;
  show: boolean;
}

export default function Table<T extends object = Record<string, unknown>>({
  data = [],
  columns = [],
  selectedKeys,
  defaultSelectedKeys = [],
  disabledKeys = [],
  rowKey = "key",
  childrenColumnName = "children",
  expandedKeys,
  defaultExpandedKeys = [],
  defaultExpandAllRows = false,
  expandRowByClick = false,
  indentSize = 20,
  scroll = {},
  size,
  striped,
  bordered = false,
  shape = "round",
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
  onExpand,
  onExpandedKeysChange,
  className,
  ...rest
}: TableProps<T>) {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const controlledSelection = selectedKeys !== undefined;
  const [innerSelected, setInnerSelected] = useState(new Set(selectedKeys ?? defaultSelectedKeys));
  const [innerExpanded, setInnerExpanded] = useState(
    () =>
      new Set<TableKey>(
        defaultExpandAllRows
          ? flattenTreeData({
              data,
              childrenColumnName,
              getKey: (record) => {
                if (typeof rowKey === "function") return rowKey(record);
                const key = getRecordValue(record, rowKey);
                return typeof key === "string" || typeof key === "number" ? key : "";
              },
            })
              .filter((row) => row.hasChildren)
              .map((row) =>
                typeof rowKey === "function"
                  ? rowKey(row.record)
                  : ((getRecordValue(row.record, rowKey) as TableKey) ?? "")
              )
          : defaultExpandedKeys
      )
  );
  const [sort, setSort] = useState<SortState>({ key: "", order: null });
  const [ping, setPing] = useState({ left: false, right: false });
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const selected = controlledSelection ? new Set(selectedKeys) : innerSelected;
  const currentExpanded = expandedKeys === undefined ? innerExpanded : new Set(expandedKeys);
  const leaves = useMemo(() => flattenColumns(columns), [columns]);
  const split = scroll.y != null;
  const keyOf = (record: T) => {
    if (typeof rowKey === "function") return rowKey(record);
    const key = getRecordValue(record, rowKey);
    return typeof key === "string" || typeof key === "number" ? key : "";
  };
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
          headerColSpan: countColumnLeaves(item),
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
    clsx({
      "k-table-cell-fix-left": column.fixed === "left",
      "k-table-cell-fix-left-last": column.fixed === "left" && leaves[index + 1]?.fixed !== "left",
      "k-table-cell-fix-right": column.fixed === "right",
      "k-table-cell-fix-right-first":
        column.fixed === "right" && leaves[index - 1]?.fixed !== "right",
      "k-table-cell-sorter": column.sorter,
    });

  const sortRecords = (records: T[]) => {
    const result = [...records];
    if (
      sort.key &&
      sort.order &&
      leaves.find((column) => column.key === sort.key)?.sorter === true
    ) {
      result.sort((a, b) => {
        const first = getRecordValue(a, sort.key),
          second = getRecordValue(b, sort.key);
        if (first === second) return 0;
        const comparison =
          (typeof first === "number" && typeof second === "number") ||
          (typeof first === "string" && typeof second === "string")
            ? first > second
              ? 1
              : -1
            : 0;
        return sort.order === "asc" ? comparison : -comparison;
      });
    }
    return result;
  };
  const allRows = flattenTreeData({ data, childrenColumnName, getKey: keyOf });
  const rows = flattenTreeData({
    data,
    childrenColumnName,
    expandedKeys: currentExpanded,
    getKey: keyOf,
    sortRecords,
  });
  const treeEnabled = allRows.some((row) => row.hasChildren);
  const matrix = useMemo(() => {
    const result: MatrixCell[][] = rows.map(() =>
      leaves.map(() => ({ rowSpan: 1, colSpan: 1, show: true }))
    );
    rows.forEach(({ record }, row) =>
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
  }, [leaves, rows]);

  const enabled = allRows
    .map((row) => row.record)
    .filter((record) => !isDisabled(keyOf(record)));
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
    allRows.forEach(({ record }) => {
      const key = keyOf(record);
      if (!isDisabled(key)) {
        if (checked) {
          next.add(key);
        } else {
          next.delete(key);
        }
      }
    });
    const keys = commitSelection(next);
    onSelectAll?.(checked, keys);
  };
  const toggleOne = (event: ChangeEvent, record: T) => {
    const key = keyOf(record);
    if (isDisabled(key)) return;
    const next = new Set(selected);
    if (event.checked) {
      next.add(key);
    } else {
      next.delete(key);
    }
    const keys = commitSelection(next);
    onSelect?.(record, event.checked, keys);
  };
  const toggleExpand = (record: T) => {
    const key = keyOf(record);
    const next = new Set(currentExpanded);
    const nextExpanded = !next.has(key);
    if (nextExpanded) next.add(key);
    else next.delete(key);
    if (expandedKeys === undefined) setInnerExpanded(next);
    onExpandedKeysChange?.([...next]);
    onExpand?.(nextExpanded, record);
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
                      type={Triangle}
                      reverseFill
                      className={clsx("k-table-sorter-up", {
                        "k-table-sorter-active": sort.key === column.key && sort.order === "asc",
                      })}
                    />
                    <Icon
                      type={Triangle}
                      reverseFill
                      className={clsx("k-table-sorter-down", {
                        "k-table-sorter-active": sort.key === column.key && sort.order === "desc",
                      })}
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
      {rows.map(({ record, depth, hasChildren }, rowIndex) => (
        <tr
          key={keyOf(record)}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest(".k-checkbox, .k-table-tree-toggle")) return;
            if (expandRowByClick && hasChildren) toggleExpand(record);
            onRowClick?.(record, rowIndex);
          }}
        >
          {checkable && (
            <td
              className="k-table-cell-fix-left"
              style={{ width: 50, left: 0 }}
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
            const value = getRecordValue(record, column.key);
            const content =
              column.render?.(value, record, rowIndex, column) ?? (value as ReactNode);
            return (
              <td
                key={column.key}
                rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
                colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
                className={fixedClass(column, colIndex)}
                style={fixed[column.key]}
              >
                {treeEnabled && colIndex === 0 ? (
                  <div className="k-table-tree-cell" style={{ paddingLeft: depth * indentSize }}>
                    {hasChildren ? (
                      <button
                        type="button"
                        className="k-table-tree-toggle"
                        aria-label={currentExpanded.has(keyOf(record)) ? "Collapse row" : "Expand row"}
                        aria-expanded={currentExpanded.has(keyOf(record))}
                        onClick={() => toggleExpand(record)}
                      >
                        <Icon
                          type={currentExpanded.has(keyOf(record)) ? ChevronDown : ChevronRight}
                        />
                      </button>
                    ) : (
                      <span className="k-table-tree-indent" />
                    )}
                    <span className="k-table-tree-content">{content}</span>
                  </div>
                ) : (
                  content
                )}
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
  const empty = !rows.length || !columns.length;
  return (
    <div
      {...rest}
      className={clsx(
        "k-table",
        {
          "k-table-striped": striped,
          "k-table-sm": size === "small",
          "k-table-lg": size === "large",
          "k-table-bordered": bordered,
          [`k-table-${shape}`]: shape,
          "k-table-ping-left": ping.left,
          "k-table-ping-right": ping.right,
        },
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
