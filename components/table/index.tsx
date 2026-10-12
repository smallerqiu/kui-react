import { useValue } from "../utils/use-value";
import { useConfigAppearance, normalizeSurfaceShape } from "../config/use-config-appearance";
import clsx from "clsx";
import { ChevronDown, ChevronRight, Triangle } from "kui-icons";
import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type UIEvent,
} from "react";
import { flushSync } from "react-dom";
import { Checkbox, type ChangeEvent } from "../checkbox";
import { ConfigContext } from "../config/config-context";
import Empty from "../empty";
import Icon from "../icon";
import zhCN from "../locale/zh-CN";
import Spin from "../spin";
import { getVirtualRange } from "../virtual-list/range";
import type { Column, SortState, TableKey, TableProps } from "./types";
import {
  compareSortValues,
  countColumnLeaves,
  flattenColumns,
  flattenTreeData,
  getRecordValue,
  inheritColumnFixed,
  mergeExpandAllRows,
  resolveRowKey,
} from "./utils";

export type { Column, SortState, TableKey, TableProps, TableTreeRow } from "./types";
export { TableColumnSetting } from "./column-setting";
export type { TableColumnSettingProps } from "./column-setting";
interface MatrixCell {
  rowSpan: number;
  colSpan: number;
  show: boolean;
}

/**
 * 表头单元格 = 列配置 + 这一格在表头网格里占的位置。
 * `headerColSpan` 就是它覆盖的叶子列数，配合 `leafStart` 得到区间
 * `[leafStart, leafStart + headerColSpan)`，sticky 偏移和固定类都由这个区间算出。
 */
type HeaderCell<T> = Column<T> & {
  headerColSpan: number;
  headerRowSpan: number;
  leafStart: number;
  /** 区间内叶子列方向不一致时为 `undefined`，这一格就不参与 sticky */
  headerFixed?: "left" | "right";
};

/**
 * 默认值必须是稳定引用。每次渲染都新建的 `[]` / `{}` 会让
 * `visibleColumns → leaves → sortRecords → rows → matrix` 这条 memo 链整段失效，
 * 等于每次无关重渲染都重新扁平化、重新排序、重新铺合并矩阵。
 */
const EMPTY_DATA: [] = [];
const EMPTY_COLUMNS: [] = [];
const EMPTY_KEYS: TableKey[] = [];
const EMPTY_SCROLL: { x?: number | string; y?: number | string } = {};

/**
 * 列宽基准，与 kui-vue `components/table/index.tsx` 的同名常量保持一致。
 *
 * 规矩只有一条：**`<col>` 落地的宽度、算 sticky 偏移的宽度、表格内容的最小宽度，三处都从同一个
 * `width ?? 150` 出发**。写了 `width` 的列（固定与否都一样）照原值写进 colgroup，偏移也按原值累加；
 * 没写 `width` 的固定列按 150 落地；没写 `width` 的普通列在 colgroup 上留 `auto` 去吸收容器撑出来的
 * 多余宽度，但在最小宽度里按 150 计——容器比这份下限还窄时先出横向滚动条，而不是把 `auto` 列一路压到
 * 表头一个字一行。反过来把带宽度的普通列也写成 `auto` 是不行的——`table-layout: fixed`
 * 下它们会被固定列的确切宽度挤到 0 宽，横向能滚的距离也一并消失，固定列就"看着没生效"。
 */
const DEFAULT_COLUMN_WIDTH = 150;
/** 勾选列宽度：colgroup、行内单元格样式和固定列的左偏移三处共用 */
const SELECTION_COLUMN_WIDTH = 50;
/** 一列的宽度基准：写了 `width` 照原值，没写按 150。sticky 偏移和表格最小宽度都走它。 */
const widthBasisOf = (column: { width?: number }) => column.width ?? DEFAULT_COLUMN_WIDTH;
/** colgroup 落地的宽度：有 `width` 照写，缺宽度的固定列按 150，缺宽度的普通列交给 `auto`。 */
const colgroupWidthOf = (column: { fixed?: "left" | "right"; width?: number }): number | "auto" =>
  column.width ?? (column.fixed ? DEFAULT_COLUMN_WIDTH : "auto");

/**
 * 分栏表头要按真实滚动条宽度给表头容器让出一条槽位（见 `styles/index.less` 的 `k-table-split-header`），
 * 这个值只能量、不能写死：新内核走 `.k-scroll` 的 `::-webkit-scrollbar { width }` 拿到 8px，
 * Firefox 走 `scrollbar-width`（不认长度值的旧版退回 `thin` 的约 11px），更老的 Safari/Windows 是 15/17px。
 * 探针必须带 `k-scroll` 类——量裸 `div` 得到的是浏览器默认滚动条宽度，不是库自己那套。
 * 顺带一提 `overflow: scroll` 让两条轴都出滚动条，`offsetWidth - clientWidth` 才是纵向那一条的宽度。
 *
 * kui-react 与 kui-vue 的 `components/table/index.tsx` 里是逐字节相同的副本，改一边必须同步另一边。
 */
const measureScrollbarWidth = (): number => {
  if (typeof document === "undefined") return 0;
  const probe = document.createElement("div");
  probe.className = "k-scroll";
  probe.style.cssText =
    "position:absolute;top:-9999px;left:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width;
};

interface RowExpansionOptions {
  /** 当前数据里所有父行的 key，由调用方 memo 好后传进来 */
  parentKeys: Set<TableKey>;
  expandedKeys?: TableKey[];
  expandAllRows?: boolean;
}

/**
 * 行展开状态。`expandedKeys` 提供时完全受控；否则 `expandAllRows` 决定初始是否全部展开，
 * 并且此后 `data` 变化只补“新出现的父行”（见 `mergeExpandAllRows`），
 * 用户手动展开或折叠过的行不会被异步到达的数据覆盖。
 * “新出现”以本次数据里的父行为准，所以从数据里消失又回来的父行算新行、会重新展开，
 * 组件不记住它曾被折叠（kui-vue 同口径）。
 */
function useRowExpansion({ parentKeys, expandedKeys, expandAllRows }: RowExpansionOptions) {
  const controlSource = useMemo(
    () => ({ expandedKeys, expandAllRows }),
    [expandedKeys, expandAllRows],
  );
  const [state, setState] = useState(() => ({
    controlSource,
    parentKeys,
    keys: new Set<TableKey>(expandedKeys ?? (expandAllRows ? parentKeys : [])),
  }));

  let keys = state.keys;
  if (!Object.is(state.controlSource, controlSource)) {
    // 受控值或 expandAllRows 本身变化：整份替换，关掉 expandAllRows 仍然会全部折叠
    keys = new Set(expandedKeys ?? (expandAllRows ? parentKeys : []));
    setState({ controlSource, parentKeys, keys });
  } else if (expandedKeys === undefined && expandAllRows) {
    // 只有数据在变：补上新增的父行，其余保持用户的选择。
    // 记住的父行集合每次都跟着数据走，所以从数据里消失又回来的父行算“新增父行”、会重新展开——
    // 作者定的语义是不记住它曾被折叠（与 kui-vue 里无条件写回 `knownParentKeys` 的写法一致）。
    const merged = mergeExpandAllRows(state.parentKeys, parentKeys, state.keys);
    if (state.parentKeys !== parentKeys || merged.changed) {
      keys = merged.changed ? merged.keys : state.keys;
      setState({ controlSource, parentKeys, keys });
    }
  }

  return [
    keys,
    (next: Set<TableKey>) => setState((previous) => ({ ...previous, keys: next })),
  ] as const;
}

export default function Table<T extends object = Record<string, unknown>>({
  data = EMPTY_DATA,
  columns = EMPTY_COLUMNS,
  selectedKeys,
  disabledKeys = EMPTY_KEYS,
  rowKey = "key",
  childrenColumnName = "children",
  expandedKeys,
  expandAllRows = false,
  expandRowByClick = false,
  indentSize = 20,
  scroll = EMPTY_SCROLL,
  size: sizeProp,
  striped,
  bordered = false,
  shape: shapeProp,
  checkable,
  loading,
  emptyText,
  header,
  footer,
  virtual = false,
  itemHeight = 44,
  overscan = 5,
  hiddenColumnKeys = EMPTY_KEYS,
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
  const inheritedAppearance = useConfigAppearance();
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  const tableLocale = locale?.k?.table;
  const size = sizeProp ?? inheritedAppearance.size;
  const shape = normalizeSurfaceShape(shapeProp ?? inheritedAppearance.shape ?? "round");
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  /** 分栏表头里真正承担裁剪与横向同步的是内层（见 `styles/index.less` 的 `.k-table-thead-inner`）。 */
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef(0);
  const [innerSelected, setInnerSelected] = useValue(selectedKeys, (next) => new Set(next ?? []));
  const [sort, setSort] = useState<SortState>({ key: "", order: null });
  const [ping, setPing] = useState({ left: false, right: false });
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const selected = innerSelected;
  const visibleColumns = useMemo(() => {
    const filter = (items: Column<T>[]): Column<T>[] =>
      items.flatMap((column) => {
        if (hiddenColumnKeys.includes(column.key)) return [];
        if (!column.children?.length) return [column];
        const children = filter(column.children);
        return children.length ? [{ ...column, children }] : [];
      });
    return filter(columns);
  }, [columns, hiddenColumnKeys]);
  // 分组父列上的 `fixed` 先向下继承，之后 `leaves` 与 `headerInfo` 只需认叶子列上的方向。
  const inheritedColumns = useMemo(() => inheritColumnFixed(visibleColumns), [visibleColumns]);
  const leaves = useMemo(() => flattenColumns(inheritedColumns), [inheritedColumns]);
  /**
   * 表格内容的最小宽度：每列的宽度基准之和（没写 `width` 的普通列按 150 计），再加勾选列的 50。
   * `<col>` 上它们仍是 `auto`，宽容器里照旧平摊多余空间；这一份只是下限，容器比它还窄就出横向
   * 滚动条。`scroll.x` 显式给了则照旧以 `scroll.x` 为准。
   */
  const contentMinWidth = useMemo(
    () =>
      leaves.reduce((sum, column) => sum + widthBasisOf(column), 0) +
      (checkable ? SELECTION_COLUMN_WIDTH : 0),
    [leaves, checkable],
  );
  const splitHeader = scroll.y != null;
  const virtualEnabled = virtual && splitHeader;
  const rawId = useId();
  // 分栏后表头和表体是两张 table，表体单元格与表头之间不再有任何结构关系可读，
  // 屏幕阅读器只会念"单元格 张三"。这里给每个表头格生成 id，表体格用 `aria-labelledby` 指回去，
  // 把列名还给单元格。只在分栏时生成：单 table 的 DOM 本来就带这层关系，多发 id 只是加噪音。
  // `useId()` 的值带冒号（`:r1:`），先洗成合法字符；后缀用遍历序号而不是列 key，
  // key 里可能有 `.`、`:` 这类要被替换的字符，洗完两列可能撞成同一个 id。
  const headCellIds = useMemo(() => {
    const ids = new Map<TableKey, string>();
    if (!splitHeader) return ids;
    const prefix = `k-table-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}-`;
    const visit = (items: Column<T>[]) =>
      items.forEach((item) => {
        ids.set(item.key, `${prefix}${ids.size}`);
        if (item.children?.length) visit(item.children);
      });
    visit(inheritedColumns);
    return ids;
  }, [splitHeader, rawId, inheritedColumns]);
  const keyOf = useCallback((record: T) => resolveRowKey(record, rowKey), [rowKey]);
  const isDisabled = (key: string | number) => disabledKeys.includes(key);

  // 扁平化整棵树是 Table 最贵的一步，必须 memo：`matrix`、`renderedRows`、虚拟窗口
  // 这些下游 memo 都以 `rows`/`allRows` 的引用为键，引用每次渲染都变的话它们全部失效。
  const allRows = useMemo(
    () => flattenTreeData({ data, childrenColumnName, getKey: keyOf }),
    [data, childrenColumnName, keyOf],
  );
  const parentKeys = useMemo(
    () =>
      new Set(
        allRows.filter((row) => row.hasChildren).map((row) => resolveRowKey(row.record, rowKey)),
      ),
    [allRows, rowKey],
  );
  const [currentExpanded, setInnerExpanded] = useRowExpansion({
    parentKeys,
    expandedKeys,
    expandAllRows,
  });

  const headerInfo = useMemo(() => {
    let maxDepth = 1;
    const depth = (items: Column<T>[], level = 1) =>
      items.forEach((item) =>
        item.children?.length
          ? depth(item.children, level + 1)
          : (maxDepth = Math.max(maxDepth, level)),
      );
    depth(inheritedColumns);
    // 一个表头格覆盖 `headerColSpan` 个叶子列，`leafStart` 记下它从哪个叶子列开始。
    // 只有整段区间固定方向一致，这一格才跟着 sticky：偏移是按叶子列累加的，
    // 跨了非固定列的分组格一浮动就会盖住本该滚走的内容。
    const fixedDirectionOf = (leafStart: number, leafCount: number) => {
      const direction = leaves[leafStart]?.fixed;
      if (!direction) return undefined;
      for (let index = leafStart + 1; index < leafStart + leafCount; index += 1) {
        if (leaves[index]?.fixed !== direction) return undefined;
      }
      return direction;
    };
    const headerRows: HeaderCell<T>[][] = [];
    const visit = (items: Column<T>[], level: number, startAt: number) => {
      headerRows[level] ??= [];
      let cursor = startAt;
      items.forEach((item) => {
        const leafStart = cursor;
        const headerColSpan = countColumnLeaves(item);
        headerRows[level].push({
          ...item,
          headerColSpan,
          headerRowSpan: item.children?.length ? 1 : maxDepth - level,
          leafStart,
          headerFixed: fixedDirectionOf(leafStart, headerColSpan),
        });
        cursor += headerColSpan;
        if (item.children?.length) visit(item.children, level + 1, leafStart);
      });
    };
    visit(inheritedColumns, 0, 0);
    return { rows: headerRows, maxDepth };
  }, [inheritedColumns, leaves]);

  const fixed = useMemo(() => {
    const header: Record<string, CSSProperties> = {};
    const body: Record<string, CSSProperties> = {};
    // 每个叶子列左右两侧已经排开的固定宽度。叶子格按自己那一格取，
    // 分组表头格按它覆盖的区间端点取，两处共用同一份基准才不会露缝。
    const leftBefore: number[] = [];
    const rightAfter: number[] = [];
    let left = checkable ? SELECTION_COLUMN_WIDTH : 0;
    leaves.forEach((column, index) => {
      leftBefore[index] = left;
      if (column.fixed === "left") {
        body[column.key] = { position: "sticky", left };
        left += widthBasisOf(column);
      }
    });
    let right = 0;
    for (let index = leaves.length - 1; index >= 0; index -= 1) {
      rightAfter[index] = right;
      const column = leaves[index];
      if (column.fixed === "right") {
        body[column.key] = { position: "sticky", right };
        right += widthBasisOf(column);
      }
    }
    headerInfo.rows.forEach((row) => {
      row.forEach((cell) => {
        const lastLeaf = cell.leafStart + cell.headerColSpan - 1;
        if (cell.headerFixed === "left") {
          header[cell.key] = { position: "sticky", left: leftBefore[cell.leafStart] ?? 0 };
        } else if (cell.headerFixed === "right") {
          header[cell.key] = { position: "sticky", right: rightAfter[lastLeaf] ?? 0 };
        }
      });
    });
    return { header, body };
  }, [checkable, leaves, headerInfo]);
  // `colSpan` 是合并单元格的横向跨度，末列判定要按区间末尾算，不然合并行的行末格会被当成中间格。
  const fixedClass = (column: Column<T>, index: number, colSpan = 1) =>
    clsx({
      "k-table-cell-fix-left": column.fixed === "left",
      "k-table-cell-fix-left-last": column.fixed === "left" && leaves[index + 1]?.fixed !== "left",
      "k-table-cell-fix-right": column.fixed === "right",
      "k-table-cell-fix-right-first":
        column.fixed === "right" && leaves[index - 1]?.fixed !== "right",
      "k-table-cell-sorter": column.sorter,
      "k-table-cell-last-column": index + colSpan === leaves.length,
    });
  /**
   * 表头格的固定类按它覆盖的叶子区间判断。`*-last`/`*-first` 决定横向滚动时 ping 阴影画在哪一格的
   * 边沿上，分组表头若改用叶子下标去查会拿到 `-1`，把不该画阴影的父格标成最后一列固定格。
   *
   * `k-table-cell-last-column` 同理必须按区间末尾算：bordered 时只有真的盖到最后一列的格子才让出
   * 右边框。表头每一行的格数不一样（分组格占 `colSpan`），行末那一格往往并不是最后一列。
   */
  const headerFixedClass = (cell: HeaderCell<T>) =>
    clsx({
      "k-table-cell-fix-left": cell.headerFixed === "left",
      "k-table-cell-fix-left-last":
        cell.headerFixed === "left" &&
        leaves[cell.leafStart + cell.headerColSpan]?.fixed !== "left",
      "k-table-cell-fix-right": cell.headerFixed === "right",
      "k-table-cell-fix-right-first":
        cell.headerFixed === "right" && leaves[cell.leafStart - 1]?.fixed !== "right",
      "k-table-cell-sorter": cell.sorter,
      "k-table-cell-last-column": cell.leafStart + cell.headerColSpan === leaves.length,
    });

  const sortRecords = useCallback(
    (records: T[]) => {
      const result = [...records];
      if (
        sort.key &&
        sort.order &&
        leaves.find((column) => column.key === sort.key)?.sorter === true
      ) {
        result.sort((a, b) => {
          const comparison = compareSortValues(
            getRecordValue(a, sort.key),
            getRecordValue(b, sort.key),
          );
          return sort.order === "asc" ? comparison : -comparison;
        });
      }
      return result;
    },
    [leaves, sort],
  );
  const rows = useMemo(
    () =>
      flattenTreeData({
        data,
        childrenColumnName,
        expandedKeys: currentExpanded,
        getKey: keyOf,
        sortRecords,
      }),
    [data, childrenColumnName, currentExpanded, keyOf, sortRecords],
  );
  const virtualRange = useMemo(() => {
    if (!virtualEnabled) return { start: 0, end: rows.length, offset: 0, total: 0 };
    return getVirtualRange({
      count: rows.length,
      scrollTop,
      viewportHeight,
      itemHeight,
      overscan,
    });
  }, [virtualEnabled, rows.length, scrollTop, viewportHeight, itemHeight, overscan]);
  const treeEnabled = useMemo(() => allRows.some((row) => row.hasChildren), [allRows]);
  const matrix = useMemo(() => {
    const hasMergedCells = leaves.some(
      (column) => column.rowSpan !== undefined || column.colSpan !== undefined,
    );
    if (!hasMergedCells) return [];
    const result: MatrixCell[][] = rows.map(() =>
      leaves.map(() => ({ rowSpan: 1, colSpan: 1, show: true })),
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
        const normalizedRowSpan = Number.isFinite(rowSpan) ? Math.max(0, Math.floor(rowSpan)) : 1;
        const normalizedColSpan = Number.isFinite(colSpan) ? Math.max(0, Math.floor(colSpan)) : 1;
        if (normalizedRowSpan === 0 || normalizedColSpan === 0) {
          result[row][col].show = false;
          return;
        }
        result[row][col] = {
          rowSpan: normalizedRowSpan,
          colSpan: normalizedColSpan,
          show: true,
        };
        for (let r = 0; r < normalizedRowSpan; r++)
          for (let c = 0; c < normalizedColSpan; c++)
            if (r || c) {
              const cell = result[row + r]?.[col + c];
              if (cell) cell.show = false;
            }
      }),
    );
    return result;
  }, [leaves, rows]);

  // 全选状态要遍历整棵树，同样得 memo 住，否则每次无关重渲染都重算一遍
  const enabled = useMemo(
    () =>
      allRows.map((row) => row.record).filter((record) => !disabledKeys.includes(keyOf(record))),
    [allRows, disabledKeys, keyOf],
  );
  const checkedCount = useMemo(
    () => enabled.filter((record) => selected.has(keyOf(record))).length,
    [enabled, selected, keyOf],
  );
  const allChecked = enabled.length > 0 && checkedCount === enabled.length;
  const indeterminate = checkedCount > 0 && checkedCount < enabled.length;
  const commitSelection = (next: Set<string | number>) => {
    const keys = [...next];
    setInnerSelected(next);
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
    setInnerExpanded(next);
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
    // 用 currentTarget 而不是 target：单元格里可滚动的内容（代码块、下拉面板）也会把 scroll 事件
    // 冒泡上来，那些元素的滚动量不能当成表格自身的。
    const body = bodyRef.current ?? event.currentTarget;
    // 表头是另一张 table，横向必须跟着表体走。同步要放在下面的 rAF 节流**之前**：
    // 节流一帧半帧的，表头就会比表体慢一拍，拖动滚动条时肉眼能看到错位。
    // 同步的是内层那一圈裁剪盒（`.k-table-thead-inner`），外层只负责边框、圆角和让出槽位。
    if (splitHeader && headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = body.scrollLeft;
    }
    if (scrollFrameRef.current) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = 0;
      const max = Math.max(0, body.scrollWidth - body.clientWidth);
      const update = () => {
        if (virtualEnabled) setScrollTop(body.scrollTop);
        const nextPing = { left: body.scrollLeft > 0.5, right: body.scrollLeft < max - 0.5 };
        setPing((current) =>
          current.left === nextPing.left && current.right === nextPing.right ? current : nextPing,
        );
      };
      if (virtualEnabled) flushSync(update);
      else update();
    });
  };
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const measure = () => {
      setViewportHeight(body.clientHeight);
      const max = Math.max(0, body.scrollWidth - body.clientWidth);
      const nextPing = { left: body.scrollLeft > 0.5, right: body.scrollLeft < max - 0.5 };
      setPing((current) =>
        current.left === nextPing.left && current.right === nextPing.right ? current : nextPing,
      );
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(body);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(scrollFrameRef.current);
      };
    }
    return () => cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  // 分栏表头要按真实滚动条宽度给表头容器让出一条槽位，这个值只能实测（见 `measureScrollbarWidth`）。
  // 直接写 CSS 变量而不是 state：它只影响一条样式，用 state 会把整张表（含上千行）重新渲染一遍。
  // `scroll.y` 撤掉时把变量清空，免得表头容器还白让一条槽位。
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty(
      "--k-table-scrollbar-width",
      splitHeader ? `${measureScrollbarWidth()}px` : "",
    );
  }, [splitHeader]);

  // 滚轮停在表头上时不该什么都不动：表头外层压根不是滚动口（内层 `overflow: hidden`，也滚不动），
  // 得把滚动量转交给表体。这里必须用原生监听器——React 根上的 `onWheel` 是 passive 的，
  // passive 里 `preventDefault()` 无效，而我们要在"确实滚动了"时吃掉浏览器自身的滚动（否则会双滚）。
  useEffect(() => {
    const wrapper = headerWrapperRef.current;
    const body = bodyRef.current;
    if (!splitHeader || !wrapper || !body) return;
    const onWheel = (event: WheelEvent) => {
      // `deltaMode` 1 = 行、2 = 页，直接当像素用会滚得只剩一点点或一下翻一页。
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? body.clientHeight : 1;
      const maxTop = Math.max(0, body.scrollHeight - body.clientHeight);
      const maxLeft = Math.max(0, body.scrollWidth - body.clientWidth);
      const nextTop = Math.min(maxTop, Math.max(0, body.scrollTop + event.deltaY * unit));
      const nextLeft = Math.min(maxLeft, Math.max(0, body.scrollLeft + event.deltaX * unit));
      if (nextTop === body.scrollTop && nextLeft === body.scrollLeft) return;
      event.preventDefault();
      body.scrollTo({ top: nextTop, left: nextLeft });
      // 表体的 scroll 事件会照常触发 `handleScroll`，表头的横向偏移由那里同步。
    };
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [splitHeader]);

  const colgroup = (
    <colgroup>
      {checkable && <col style={{ width: SELECTION_COLUMN_WIDTH }} />}
      {leaves.map((column) => (
        // 宽度基准与 sticky 偏移共用同一个函数：写了 width 就照写，别用 auto 挤掉它。
        <col key={column.key} style={{ width: colgroupWidthOf(column) }} />
      ))}
    </colgroup>
  );
  const thead = (
    <thead>
      {headerInfo.rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {checkable && rowIndex === 0 && (
            <th
              rowSpan={headerInfo.maxDepth}
              className={clsx("k-table-cell-fix-left", {
                "k-table-cell-fix-left-last": ping.left,
                // 叶子列全被隐藏时，勾选格就是这一行的最后一格，边框口径要跟着走
                "k-table-cell-last-column": !leaves.length,
              })}
              style={{ left: 0 }}
            >
              <Checkbox
                checked={allChecked}
                indeterminate={indeterminate}
                onChange={toggleAll}
                disabled={!enabled.length}
                // 表头全选格没有文字，可访问名必须走 locale
                aria-label={tableLocale?.selectAllRows || "Select all"}
              />
            </th>
          )}
          {row.map((column, index) => (
            <th
              key={column.key}
              id={splitHeader ? headCellIds.get(column.key) : undefined}
              colSpan={column.headerColSpan}
              rowSpan={column.headerRowSpan}
              className={headerFixedClass(column)}
              style={fixed.header[column.key]}
              // 与 kui-vue 一致：可排序的表头可聚焦，用 aria-sort 暴露当前方向，
              // Enter/Space 与点击等价。不可排序的表头既不带 tabindex 也不带 aria-sort。
              tabIndex={column.sorter ? 0 : undefined}
              aria-sort={
                !column.sorter
                  ? undefined
                  : sort.key !== column.key || !sort.order
                    ? "none"
                    : sort.order === "asc"
                      ? "ascending"
                      : "descending"
              }
              onClick={() => changeSort(column)}
              onKeyDown={(event) => {
                if (!column.sorter || (event.key !== "Enter" && event.key !== " ")) return;
                event.preventDefault();
                changeSort(column);
              }}
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
        </tr>
      ))}
    </thead>
  );
  const renderedRows = useMemo(() => {
    const start = virtualRange.start;
    const end = virtualRange.end;
    return rows.slice(start, end).map((row, idx) => ({
      ...row,
      rowIndex: start + idx,
    }));
  }, [rows, virtualRange]);

  const tbody = (
    <tbody>
      {virtualEnabled && virtualRange.offset > 0 && (
        <tr className="k-table-virtual-spacer k-table-virtual-spacer-top" aria-hidden="true">
          <td
            className="k-table-cell-last-column"
            colSpan={leaves.length + (checkable ? 1 : 0)}
            style={{ height: virtualRange.offset }}
          />
        </tr>
      )}
      {renderedRows.map(({ record, depth, hasChildren, rowIndex }) => (
        <tr
          key={keyOf(record)}
          className={virtualEnabled && rowIndex % 2 === 1 ? "k-table-row-even" : undefined}
          style={virtualEnabled ? { height: itemHeight } : undefined}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest(".k-checkbox, .k-table-tree-toggle")) return;
            if (expandRowByClick && hasChildren) toggleExpand(record);
            onRowClick?.(record, rowIndex);
          }}
        >
          {checkable && (
            <td
              className={clsx("k-table-cell-fix-left", {
                "k-table-cell-fix-left-last": ping.left,
                "k-table-cell-last-column": !leaves.length,
              })}
              style={{ width: SELECTION_COLUMN_WIDTH, left: 0 }}
            >
              <Checkbox
                checked={selected.has(keyOf(record))}
                disabled={isDisabled(keyOf(record))}
                onChange={(event) => toggleOne(event, record)}
                // 行首选择框同样只有控件本身能被读，名字得由 locale 提供
                aria-label={tableLocale?.selectRow || "Select row"}
              />
            </td>
          )}
          {leaves.map((column, colIndex) => {
            const cell = matrix[rowIndex]?.[colIndex] ?? { rowSpan: 1, colSpan: 1, show: true };
            if (!cell.show) return null;
            const value = getRecordValue(record, column.key);
            const content =
              column.render?.(value, record, rowIndex, column) ?? (value as ReactNode);
            return (
              <td
                key={column.key}
                // 分栏后这一格和表头不在同一张 table 里，列名只能靠 id 关联回去（见 `headCellIds`）
                aria-labelledby={splitHeader ? headCellIds.get(column.key) : undefined}
                rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
                colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
                className={fixedClass(column, colIndex, cell.colSpan)}
                style={fixed.body[column.key]}
              >
                {treeEnabled && colIndex === 0 ? (
                  <div className="k-table-tree-cell" style={{ paddingLeft: depth * indentSize }}>
                    {hasChildren ? (
                      <button
                        type="button"
                        className="k-table-tree-toggle"
                        aria-label={
                          currentExpanded.has(keyOf(record))
                            ? tableLocale?.collapseRow || "Collapse row"
                            : tableLocale?.expandRow || "Expand row"
                        }
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
      {virtualEnabled &&
        virtualRange.offset + (virtualRange.end - virtualRange.start) * itemHeight <
          virtualRange.total && (
          <tr className="k-table-virtual-spacer k-table-virtual-spacer-bottom" aria-hidden="true">
            <td
              className="k-table-cell-last-column"
              colSpan={leaves.length + (checkable ? 1 : 0)}
              style={{
                height:
                  virtualRange.total -
                  virtualRange.offset -
                  (virtualRange.end - virtualRange.start) * itemHeight,
              }}
            />
          </tr>
        )}
    </tbody>
  );
  const tableStyle: CSSProperties = {
    width: "100%",
    // `scroll.x` 是调用方显式给的内容最小宽度，优先；没写时用上面那份下限，
    // 于是窄容器是"横向滚动"而不是"把列压瘪到表头竖排换行"。
    minWidth: scroll.x || (contentMinWidth ? `${contentMinWidth}px` : "100%"),
    tableLayout: "fixed",
  };
  const empty = !rows.length || !visibleColumns.length;
  return (
    <div
      {...rest}
      ref={rootRef}
      className={clsx(
        "k-table",
        {
          "k-table-striped": striped,
          "k-table-sm": size === "small",
          "k-table-lg": size === "large",
          "k-table-bordered": bordered,
          "k-table-has-footer": !!footer,
          "k-table-split-header": splitHeader,
          [`k-table-${shape}`]: shape,
          "k-table-ping-left": ping.left,
          "k-table-ping-right": ping.right,
          "k-table-virtual": virtualEnabled,
        },
        className,
      )}
    >
      {header && <div className="k-table-header">{header}</div>}
      {/* 分栏表头：表头单独一张 table，和表体共用同一份 `colgroup`，宽度与固定列偏移天然对齐；
          横向滚动靠 `handleScroll` 同步 `scrollLeft`，纵向靠右边那条槽位让开表体的滚动条。
          槽位由外层 `padding-inline-end` 让出，裁剪和同步放在内层 `.k-table-thead-inner`：
          `overflow: hidden` 只裁到 padding box，裁不出外层那条槽位，表头内容会一路画进去（见 LESS 注释）。 */}
      {splitHeader && (
        <div className="k-table-thead" ref={headerWrapperRef}>
          <div className="k-table-thead-inner" ref={headerScrollRef}>
            <table style={tableStyle}>
              {colgroup}
              {thead}
            </table>
          </div>
        </div>
      )}
      <div
        className="k-table-body k-scroll"
        ref={bodyRef}
        style={{
          overflowY: scroll.y ? "scroll" : "auto",
          overflowX: data.length ? "auto" : "hidden",
          maxHeight: scroll.y,
        }}
        onScroll={handleScroll}
      >
        <table style={tableStyle}>
          {colgroup}
          {!splitHeader && thead}
          {tbody}
        </table>
        {empty && loading && <div className="k-table-loading-placeholder" aria-hidden="true" />}
        {empty && !loading && <Empty description={emptyText || tableLocale?.emptyText} />}
      </div>
      {footer && <div className="k-table-footer">{footer}</div>}
      {loading && <Spin />}
    </div>
  );
}
