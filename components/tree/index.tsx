import { useValue } from "../utils/use-value";
import clsx from "clsx";
import { ChevronRight, CircleMinus, CirclePlus } from "kui-icons";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { TransitionGroup } from "react-transition-group";
import { getTransitionProps } from "../base/transition-props";
import Transition from "../base/transition";
import { Button } from "../button";
import Checkbox, { type ChangeEvent } from "../checkbox";
import Icon from "../icon";
import Spin from "../spin";
import VirtualList from "../virtual-list";
import type { VirtualListRef } from "../virtual-list";
import type {
  TreeDropEvent,
  TreeDropPosition,
  TreeExpandEvent,
  TreeExpose,
  TreeFieldNames,
} from "./types";
import { buildTree, updateParentIndeterminate, type TreeNode, type TreeNodeData } from "./utils";

export interface TreeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "onSelect"
  | "onDragStart"
  | "onDragEnter"
  | "onDragLeave"
  | "onDrop"
  | "onDragEnd"
  | "defaultValue"
  | "defaultChecked"
> {
  data?: TreeNodeData[];
  selectedKeys?: string[];
  expandedKeys?: string[];
  checkedKeys?: string[];
  directory?: boolean;
  disabled?: boolean;
  checkable?: boolean;
  draggable?: boolean;
  showLine?: boolean;
  showIcon?: boolean;
  showExtra?: boolean;
  multiple?: boolean;
  checkStrictly?: boolean;
  selectAsCheck?: boolean;
  queryKey?: string;
  /** 开启虚拟滚动，用于高效渲染大量节点 */
  virtual?: boolean;
  /** 虚拟滚动容器高度，`virtual` 开启时生效 */
  height?: number | string;
  /** 虚拟滚动时每个节点的高度，单位 `px` */
  itemHeight?: number;
  /** 虚拟滚动时视口外额外渲染的节点数量 */
  overscan?: number;
  loading?: boolean;
  fieldNames?: TreeFieldNames;
  renderTitle?: (node: TreeNode) => ReactNode;
  renderExtra?: (node: TreeNode) => ReactNode;
  onExpand?: (result: TreeExpandEvent) => void;
  onExpandedKeysChange?: (keys: string[]) => void;
  onCheck?: (node: TreeNode, checked: boolean, checkedKeys: string[]) => void;
  onCheckedKeysChange?: (keys: string[]) => void;
  onSelect?: (node: TreeNode, selectedKeys: string[]) => void;
  onSelectedKeysChange?: (keys: string[]) => void;
  onDragStart?: (node: TreeNode, event: DragEvent) => void;
  onDragEnter?: (node: TreeNode, event: DragEvent) => void;
  onDragLeave?: (node: TreeNode, event: DragEvent) => void;
  onDrop?: (nodes: TreeDropEvent, event: DragEvent) => void;
  onLoadError?: (error: unknown, node: TreeNode) => void;
  onDragEnd?: (node: TreeNode, event: DragEvent) => void;
  loadData?: (node: TreeNode) => Promise<unknown>;
}
export type { BuildTreeOptions, TreeNode, TreeNodeData } from "./utils";
export type {
  TreeDropEvent,
  TreeDropPosition,
  TreeExpandEvent,
  TreeExpose,
  TreeFieldNames,
} from "./types";

const findRaw = (nodes: TreeNode[], key: string): TreeNode | undefined => {
  for (const node of nodes) {
    if (node.key === key) return node;
    const child = node.children && findRaw(node.children, key);
    if (child) return child;
  }
};

function TreeTransitionNode({
  children,
  in: show,
  appear,
  onExited,
}: {
  children: ReactElement;
  in?: boolean;
  appear?: boolean;
  onExited?: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const transitionProps = getTransitionProps("k-tree-slide");
  return (
    <Transition
      {...transitionProps}
      show={show}
      appear={appear}
      nodeRef={nodeRef}
      onAfterLeave={(element) => {
        transitionProps.onAfterLeave?.(element);
        onExited?.();
      }}
    >
      {children}
    </Transition>
  );
}

const Tree = forwardRef<TreeExpose, TreeProps>(function Tree(
  {
    data = [],
    selectedKeys,
    expandedKeys,
    checkedKeys,
    directory,
    disabled = false,
    checkable,
    draggable,
    showLine,
    showIcon = true,
    showExtra,
    multiple,
    checkStrictly,
    selectAsCheck,
    queryKey,
    virtual = false,
    height = 300,
    itemHeight = 28,
    overscan = 5,
    loading,
    fieldNames,
    renderTitle,
    renderExtra,
    onExpand,
    onExpandedKeysChange,
    onCheck,
    onCheckedKeysChange,
    onSelect,
    onSelectedKeysChange,
    onDragStart,
    onDragEnter,
    onDragLeave,
    onDrop,
    onLoadError,
    onDragEnd,
    loadData,
    className,
    ...rest
  }: TreeProps,
  ref,
) {
  const [innerSelected, setInnerSelected] = useValue(selectedKeys, (next): string[] => next ?? []);
  const [innerExpanded, setInnerExpanded] = useValue(expandedKeys, (next): string[] => next ?? []);
  const [innerChecked, setInnerChecked] = useValue(checkedKeys, (next): string[] => next ?? []);
  const [loadingKeys, setLoadingKeys] = useState(new Set<string>());
  const [loadedKeys, setLoadedKeys] = useState(new Set<string>());
  const [dropKey, setDropKey] = useState<string>();
  const [dropPosition, setDropPosition] = useState<TreeDropPosition>("inside");
  const [focusedKey, setFocusedKey] = useState<string>();
  const [version, setVersion] = useState(0);
  const dragRef = useRef<TreeNode | null>(null);
  const dropPositionRef = useRef<TreeDropPosition>("inside");
  const rootRef = useRef<HTMLDivElement>(null);
  const virtualListRef = useRef<VirtualListRef>(null);
  const selected = innerSelected;
  const expanded = innerExpanded;
  const checked = innerChecked;
  // `expand` 是 async：await 期间可能已经有别的节点完成展开，或者受控的
  // `expandedKeys` 从外部变了。异步分支写回时要拿最新已提交的值，而不是点击
  // 那一刻的闭包快照。用 layout effect 同步（渲染期直接写 ref 违反 ref 约定）。
  const expandedRef = useRef(expanded);
  useLayoutEffect(() => {
    expandedRef.current = expanded;
  });
  const normalizedData = useMemo(() => {
    // loadData may mutate nodes in place; version invalidates the normalized snapshot.
    void version;
    const names = {
      key: fieldNames?.key ?? "key",
      title: fieldNames?.title ?? "title",
      children: fieldNames?.children ?? "children",
      disabled: fieldNames?.disabled ?? "disabled",
      isLeaf: fieldNames?.isLeaf ?? "isLeaf",
    };
    const normalize = (nodes: TreeNodeData[], path = "kui-tree"): TreeNode[] =>
      nodes.map((raw, index) => {
        const children = raw[names.children];
        // 缺 `key` 的节点按所在**路径**合成兜底 key（`kui-tree-0`、`kui-tree-0-1`）。
        // 直接留空串会让所有缺 key 的节点共用同一个键：React 报 duplicate key，
        // `byKey`/`expandedKeys`/`checkedKeys` 也全撞在一起，展开或勾选一个节点
        // 会连带命中其它节点。用路径而不是渲染下标，折叠或过滤时同一个节点的键才不动。
        const key = String(raw[names.key] ?? "") || `${path}-${index}`;
        const list = Array.isArray(children)
          ? normalize(children as TreeNodeData[], key)
          : undefined;
        return {
          ...raw,
          key,
          title: raw[names.title] as TreeNode["title"],
          disabled: disabled || Boolean(raw[names.disabled]),
          // 异步加载过却仍然没有子节点：当作叶子（与 vue 版同语义），否则这个节点会
          // 永远挂着一个空展开。但 `isLeaf: false` 是文档里写明的“强制作为父节点”，
          // 不能因为一次空结果就被推翻——`react-api` 的既有用例正是钉这条契约的。
          isLeaf:
            raw[names.isLeaf] === false
              ? false
              : raw[names.isLeaf] === true || (loadedKeys.has(key) && !list?.length)
                ? true
                : undefined,
          children: list,
        };
      });
    return normalize(data);
  }, [data, disabled, fieldNames, loadedKeys, version]);
  const flat = useMemo(() => {
    void version;
    return buildTree({
      data: normalizedData,
      selectedKeys: selected,
      expandedKeys: expanded,
      checkedKeys: checked,
      hasLoad: !!loadData,
      checkable,
      checkStrictly,
    });
  }, [normalizedData, selected, expanded, checked, loadData, checkable, checkStrictly, version]);
  const byKey = useMemo(() => new Map(flat.map((node) => [node.key, node])), [flat]);

  const commitExpanded = useCallback(
    (keys: string[]) => {
      setInnerExpanded(keys);
      onExpandedKeysChange?.(keys);
    },
    [setInnerExpanded, onExpandedKeysChange],
  );
  const expand = async (node: TreeNode) => {
    if (node.disabled || node.isLeaf || loadingKeys.has(node.key)) return;
    const nextExpanded = !expanded.includes(node.key);
    // `loadedKeys` 让同一个节点只请求一次（vue 版的文档就是这么写的：
    // “成功后同一节点不会重复加载”）。之前只按“当前有没有 children”判断，
    // 于是加载回来是空的、或者 data 是在别处异步替换的，每次展开都再发一次请求。
    if (nextExpanded && loadData && !loadedKeys.has(node.key) && !node.children?.length) {
      setLoadingKeys((current) => new Set(current).add(node.key));
      try {
        await loadData(findRaw(normalizedData, node.key) ?? node);
        setLoadedKeys((current) => new Set(current).add(node.key));
        setVersion((value) => value + 1);
      } catch (error) {
        onLoadError?.(error, node);
        return;
      } finally {
        setLoadingKeys((current) => {
          const next = new Set(current);
          next.delete(node.key);
          return next;
        });
      }
    }
    const current = expandedRef.current;
    const keys = nextExpanded
      ? current.includes(node.key)
        ? current
        : [...current, node.key]
      : current.filter((key) => key !== node.key);
    commitExpanded(keys);
    onExpand?.({ key: node.key, expanded: nextExpanded, node });
  };
  const commitChecked = (keys: string[]) => {
    setInnerChecked(keys);
    onCheckedKeysChange?.(keys);
  };
  const toggleCheck = (event: ChangeEvent, node: TreeNode) => {
    if (node.disabled) return;
    const states = new Map(
      flat.map((item) => [item.key, { checked: checked.includes(item.key), indeterminate: false }]),
    );
    states.get(node.key)!.checked = event.checked;
    if (!checkStrictly) {
      const updateChildren = (parent: string) =>
        flat
          .filter((item) => item.parentKey === parent)
          .forEach((child) => {
            if (!child.disabled) {
              states.get(child.key)!.checked = event.checked;
              updateChildren(child.key);
            }
          });
      updateChildren(node.key);
      flat.forEach((item) => {
        item.checked = states.get(item.key)!.checked;
        item.indeterminate = false;
      });
      [...flat].reverse().forEach((item) => {
        if (item.parentKey) updateParentIndeterminate(flat, item.parentKey);
      });
    }
    const keys = flat
      .filter((item) => (checkStrictly ? states.get(item.key)!.checked : item.checked))
      .map((item) => item.key);
    commitChecked(keys);
    onCheck?.(node, event.checked, keys);
  };
  const selectNode = (node: TreeNode) => {
    if (node.disabled) return;
    if (selectAsCheck && checkable)
      return toggleCheck({ checked: !checked.includes(node.key) }, node);
    const keys = multiple
      ? selected.includes(node.key)
        ? selected.filter((key) => key !== node.key)
        : [...selected, node.key]
      : selected.includes(node.key)
        ? []
        : [node.key];
    setInnerSelected(keys);
    onSelectedKeysChange?.(keys);
    onSelect?.(node, keys);
  };
  const moveRawNode = (dragKey: string, targetKey: string, position: TreeDropPosition) => {
    const names = {
      key: fieldNames?.key ?? "key",
      children: fieldNames?.children ?? "children",
      isLeaf: fieldNames?.isLeaf ?? "isLeaf",
    };
    type Location = { node: TreeNodeData; list: TreeNodeData[]; index: number };
    const locate = (nodes: TreeNodeData[], key: string): Location | undefined => {
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        if (String(node[names.key] ?? "") === key) return { node, list: nodes, index };
        const children = node[names.children];
        if (Array.isArray(children)) {
          const found = locate(children as TreeNodeData[], key);
          if (found) return found;
        }
      }
    };
    const drag = locate(data, dragKey);
    const target = locate(data, targetKey);
    if (!drag || !target) return false;
    const dragChildren = drag.node[names.children];
    if (Array.isArray(dragChildren) && locate(dragChildren as TreeNodeData[], targetKey))
      return false;
    const [moved] = drag.list.splice(drag.index, 1);
    if (!moved) return false;
    if (position === "inside") {
      let children = target.node[names.children];
      if (!Array.isArray(children)) {
        children = [];
        target.node[names.children] = children;
      }
      target.node[names.isLeaf] = false;
      (children as TreeNodeData[]).push(moved);
    } else {
      const refreshed = locate(data, targetKey);
      if (!refreshed) return false;
      refreshed.list.splice(refreshed.index + (position === "after" ? 1 : 0), 0, moved);
    }
    if (position === "inside" && !expanded.includes(targetKey))
      commitExpanded([...expanded, targetKey]);
    setVersion((value) => value + 1);
    return true;
  };
  const canDropOn = (node: TreeNode) => {
    const dragNode = dragRef.current;
    if (!dragNode || node.disabled || node.key === dragNode.key) return false;
    let current: TreeNode | undefined = node;
    while (current?.parentKey) {
      if (current.parentKey === dragNode.key) return false;
      current = byKey.get(current.parentKey);
    }
    return true;
  };
  const updateDropTarget = (event: DragEvent<HTMLElement>, node: TreeNode) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = event.clientY - rect.top;
    const position: TreeDropPosition =
      offset < rect.height / 3 ? "before" : offset > (rect.height * 2) / 3 ? "after" : "inside";
    dropPositionRef.current = position;
    setDropPosition(position);
    setDropKey(node.key);
  };
  const query = queryKey?.trim().toLocaleLowerCase() ?? "";
  const visible = query
    ? (() => {
        const matchedKeys = new Set<string>();
        flat.forEach((node) => {
          if (
            !String(node.title ?? "")
              .toLocaleLowerCase()
              .includes(query)
          )
            return;
          let current: TreeNode | undefined = node;
          while (current) {
            matchedKeys.add(current.key);
            current = current.parentKey ? byKey.get(current.parentKey) : undefined;
          }
        });
        return flat.filter((node) => matchedKeys.has(node.key));
      })()
    : flat.filter((node) => {
        let current = node;
        while (current.parentKey) {
          const parent = byKey.get(current.parentKey);
          if (!parent?.expanded) return false;
          current = parent;
        }
        return true;
      });

  const focusNode = useCallback(
    (key: string) => {
      setFocusedKey(key);
      const index = visible.findIndex((node) => node.key === key);
      if (virtual && index >= 0) virtualListRef.current?.scrollToIndex(index);
      requestAnimationFrame(() => {
        const element = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>("[data-tree-key]") ?? [],
        ).find((item) => item.dataset.treeKey === key);
        element?.focus({ preventScroll: virtual });
        if (!virtual) element?.scrollIntoView?.({ block: "nearest" });
      });
    },
    [visible, virtual],
  );
  useImperativeHandle(
    ref,
    () => ({
      getNode: (key) => byKey.get(key),
      getCheckedNodes: () => flat.filter((node) => checked.includes(node.key)),
      getSelectedNodes: () => flat.filter((node) => selected.includes(node.key)),
      scrollTo: (key) => {
        const index = visible.findIndex((node) => node.key === key);
        if (index < 0) return;
        if (virtual) virtualListRef.current?.scrollToIndex(index, "center");
        else focusNode(key);
      },
      expandAll: () => commitExpanded(flat.filter((node) => !node.isLeaf).map((node) => node.key)),
      collapseAll: () => commitExpanded([]),
    }),
    [byKey, checked, commitExpanded, flat, focusNode, selected, visible, virtual],
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (focusedKey !== undefined && byKey.get(focusedKey)?.disabled) return;
    const nodes = visible.filter((node) => !node.disabled);
    if (!nodes.length) return;
    let index = nodes.findIndex((node) => node.key === focusedKey);
    if (index < 0) index = 0;
    const node = nodes[index];
    let target: TreeNode | undefined;
    if (event.key === "ArrowDown") target = nodes[Math.min(index + 1, nodes.length - 1)];
    else if (event.key === "ArrowUp") target = nodes[Math.max(index - 1, 0)];
    else if (event.key === "Home") target = nodes[0];
    else if (event.key === "End") target = nodes[nodes.length - 1];
    else if (event.key === "ArrowRight") {
      if (!node.isLeaf && !expanded.includes(node.key)) void expand(node);
      else target = nodes.find((item) => item.parentKey === node.key);
    } else if (event.key === "ArrowLeft") {
      if (!node.isLeaf && expanded.includes(node.key)) void expand(node);
      else target = node.parentKey ? byKey.get(node.parentKey) : undefined;
    } else if (event.key === "Enter") selectNode(node);
    else if (event.key === " ") {
      if (checkable) toggleCheck({ checked: !checked.includes(node.key) }, node);
      else selectNode(node);
    } else return;
    event.preventDefault();
    if (target) focusNode(target.key);
  };

  const tabStopKey =
    visible.find((node) => node.key === focusedKey && !node.disabled)?.key ??
    visible.find((node) => !node.disabled)?.key;

  const renderNode = (node: TreeNode) => (
    <div
      key={node.key}
      className={clsx("k-tree-item", {
        "k-tree-item-disabled": node.disabled,
        "k-tree-item-drop": dropKey === node.key,
        [`k-tree-item-drop-${dropPosition}`]: dropKey === node.key && !node.disabled,
        "k-tree-item-extra-hidden": !showExtra,
        "k-tree-item-selected": directory && selected.includes(node.key),
      })}
      role="treeitem"
      tabIndex={tabStopKey === node.key ? 0 : -1}
      data-tree-key={node.key}
      aria-level={(node.level ?? 0) + 1}
      aria-selected={selected.includes(node.key) || undefined}
      aria-checked={
        checkable ? (node.indeterminate ? "mixed" : checked.includes(node.key)) : undefined
      }
      aria-expanded={node.isLeaf ? undefined : expanded.includes(node.key)}
      aria-disabled={node.disabled || undefined}
      onFocus={() => setFocusedKey(node.key)}
      onClick={
        directory
          ? () => {
              selectNode(node);
              void expand(node);
            }
          : undefined
      }
    >
      {node.visiblePrefixes?.map((line, prefix) => (
        <span key={prefix} className={line ? "k-tree-indent-line" : "k-tree-indent-empty"} />
      ))}
      {!node.isLeaf ? (
        <span
          className={clsx("k-tree-arrow", {
            "k-tree-arrow-open": expanded.includes(node.key),
          })}
          onClick={(event) => {
            event.stopPropagation();
            void expand(node);
          }}
        >
          <Button
            size="small"
            type="text"
            // 树用 roving tabindex：整棵树只有一个 `treeitem` 能被 Tab 命中，方向键在
            // 节点间移动。箭头是原生 `<button>`，留着它每个非叶子节点都多一个 Tab
            // 停靠点，焦点走进去后方向键也回不到树上。展开动作交给 `treeitem` 的
            // ArrowLeft/ArrowRight，这里只保留点击。
            tabIndex={-1}
            loading={loadingKeys.has(node.key)}
            disabled={node.disabled}
            icon={
              showLine ? (expanded.includes(node.key) ? CircleMinus : CirclePlus) : ChevronRight
            }
          />
        </span>
      ) : (
        <span className="k-tree-arrow-placeholder" />
      )}
      {checkable && (
        <Checkbox
          checked={checked.includes(node.key)}
          indeterminate={!!node.indeterminate}
          disabled={node.disabled}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onChange={(event) => toggleCheck(event, node)}
        />
      )}
      <span
        className={clsx("k-tree-title", {
          "k-tree-title-selected": selected.includes(node.key),
        })}
        draggable={draggable && !node.disabled}
        onClick={!directory ? () => selectNode(node) : undefined}
        onDragStart={(event) => {
          if (!draggable || node.disabled) return;
          dragRef.current = node;
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", node.key);
          if (!node.isLeaf && expanded.includes(node.key)) void expand(node);
          onDragStart?.(node, event);
        }}
        onDragOver={(event) => {
          if (!draggable || !canDropOn(node)) {
            setDropKey(undefined);
            return;
          }
          event.preventDefault();
          updateDropTarget(event, node);
          event.dataTransfer.dropEffect = "move";
        }}
        onDragEnter={(event) => {
          if (!draggable || !canDropOn(node)) {
            setDropKey(undefined);
            return;
          }
          event.preventDefault();
          updateDropTarget(event, node);
          onDragEnter?.(node, event);
        }}
        onDragLeave={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            event.currentTarget.contains(event.relatedTarget)
          )
            return;
          if (dropKey === node.key) setDropKey(undefined);
          onDragLeave?.(node, event);
        }}
        onDrop={(event) => {
          const dragNode = dragRef.current;
          if (!draggable || !dragNode || !canDropOn(node)) return;
          event.preventDefault();
          const position = dropPositionRef.current;
          const moved = moveRawNode(dragNode.key, node.key, position);
          setDropKey(undefined);
          if (moved) onDrop?.({ dragNode, dropNode: node, dropPosition: position }, event);
          dropPositionRef.current = "inside";
          dragRef.current = null;
        }}
        onDragEnd={(event) => {
          setDropKey(undefined);
          dropPositionRef.current = "inside";
          dragRef.current = null;
          onDragEnd?.(node, event);
        }}
      >
        {node.icon && showIcon && <Icon type={node.icon} className="k-tree-icon" />}
        {renderTitle?.(node) ?? node.title}
      </span>
      {renderExtra && <span className="k-tree-item-extra">{renderExtra(node)}</span>}
    </div>
  );

  const content = (
    <div
      {...rest}
      ref={rootRef}
      className={clsx(
        "k-tree",
        { "k-tree-show-line": showLine, "k-tree-directory": directory },
        className,
      )}
      role="tree"
      aria-multiselectable={multiple || undefined}
      aria-busy={loading || loadingKeys.size > 0 || undefined}
      onKeyDown={handleKeyDown}
    >
      {virtual ? (
        <VirtualList
          ref={virtualListRef}
          data={visible}
          height={height}
          itemHeight={itemHeight}
          overscan={overscan}
          itemKey="key"
          // `k-tree-virtual-list` 那条规则负责把 `.k-tree-item` 拉成整行高、
          // 去掉 `margin-bottom`；漏了它，虚拟滚动里每行只有 24px 内容加 4px 外边距，
          // hover/选中背景条带不满 `itemHeight`，和 vue 版对不上。
          className="k-tree-node-list k-tree-virtual-list"
        >
          {(node) => renderNode(node)}
        </VirtualList>
      ) : (
        <div className="k-tree-node-list">
          <TransitionGroup component={null}>
            {visible.map((node) => {
              return <TreeTransitionNode key={node.key}>{renderNode(node)}</TreeTransitionNode>;
            })}
          </TransitionGroup>
        </div>
      )}
    </div>
  );
  return loading ? <Spin spinning>{content}</Spin> : content;
});

export default Tree;
