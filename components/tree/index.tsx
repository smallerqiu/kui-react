import clsx from "clsx";
import { ChevronRight, CircleMinus, CirclePlus } from "kui-icons";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
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
  "onSelect" | "onDragStart" | "onDragEnter" | "onDragLeave" | "onDrop" | "onDragEnd"
> {
  data?: TreeNodeData[];
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  checkedKeys?: string[];
  defaultCheckedKeys?: string[];
  directory?: boolean;
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
export type { TreeDropEvent, TreeDropPosition, TreeExpandEvent, TreeExpose, TreeFieldNames } from "./types";

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

const Tree = forwardRef<TreeExpose, TreeProps>(function Tree({
  data = [],
  selectedKeys,
  defaultSelectedKeys = [],
  expandedKeys,
  defaultExpandedKeys = [],
  checkedKeys,
  defaultCheckedKeys = [],
  directory,
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
}: TreeProps, ref) {
  const [innerSelected, setInnerSelected] = useState(defaultSelectedKeys);
  const [innerExpanded, setInnerExpanded] = useState(defaultExpandedKeys);
  const [innerChecked, setInnerChecked] = useState(defaultCheckedKeys);
  const [loadingKeys, setLoadingKeys] = useState(new Set<string>());
  const [dropKey, setDropKey] = useState<string>();
  const [dropPosition, setDropPosition] = useState<TreeDropPosition>("inside");
  const [focusedKey, setFocusedKey] = useState<string>();
  const [version, setVersion] = useState(0);
  const dragRef = useRef<TreeNode | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const virtualListRef = useRef<VirtualListRef>(null);
  const selected = selectedKeys ?? innerSelected;
  const expanded = expandedKeys ?? innerExpanded;
  const checked = checkedKeys ?? innerChecked;
  const normalizedData = useMemo(() => {
    const names = {
      key: fieldNames?.key ?? "key",
      title: fieldNames?.title ?? "title",
      children: fieldNames?.children ?? "children",
      disabled: fieldNames?.disabled ?? "disabled",
      isLeaf: fieldNames?.isLeaf ?? "isLeaf",
    };
    const normalize = (nodes: TreeNodeData[]): TreeNode[] =>
      nodes.map((raw) => {
        const children = raw[names.children];
        return {
          ...raw,
          key: String(raw[names.key] ?? ""),
          title: raw[names.title] as TreeNode["title"],
          disabled: Boolean(raw[names.disabled]),
          isLeaf: raw[names.isLeaf] === undefined ? undefined : Boolean(raw[names.isLeaf]),
          children: Array.isArray(children) ? normalize(children as TreeNodeData[]) : undefined,
        };
      });
    return normalize(data);
  }, [data, fieldNames]);
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

  const commitExpanded = useCallback((keys: string[]) => {
    if (!expandedKeys) setInnerExpanded(keys);
    onExpandedKeysChange?.(keys);
  }, [expandedKeys, onExpandedKeysChange]);
  const expand = async (node: TreeNode) => {
    if (node.isLeaf || loadingKeys.has(node.key)) return;
    const nextExpanded = !expanded.includes(node.key);
    if (nextExpanded && loadData && !node.children?.length) {
      setLoadingKeys((current) => new Set(current).add(node.key));
      try {
        await loadData(findRaw(normalizedData, node.key) ?? node);
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
    const keys = nextExpanded
      ? [...expanded, node.key]
      : expanded.filter((key) => key !== node.key);
    commitExpanded(keys);
    onExpand?.({ key: node.key, expanded: nextExpanded, node });
  };
  const commitChecked = (keys: string[]) => {
    if (!checkedKeys) setInnerChecked(keys);
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
    if (!selectedKeys) setInnerSelected(keys);
    onSelectedKeysChange?.(keys);
    onSelect?.(node, keys);
  };
  const moveRawNode = (dragKey: string, targetKey: string, position: TreeDropPosition) => {
    const names = {
      key: fieldNames?.key ?? "key",
      children: fieldNames?.children ?? "children",
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
    if (Array.isArray(dragChildren) && locate(dragChildren as TreeNodeData[], targetKey)) return false;
    const [moved] = drag.list.splice(drag.index, 1);
    if (!moved) return false;
    if (position === "inside") {
      let children = target.node[names.children];
      if (!Array.isArray(children)) {
        children = [];
        target.node[names.children] = children;
      }
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

  const focusNode = useCallback((key: string) => {
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
  }, [visible, virtual]);
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
      tabIndex={(focusedKey ?? visible.find((item) => !item.disabled)?.key) === node.key ? 0 : -1}
      data-tree-key={node.key}
      aria-level={(node.level ?? 0) + 1}
      aria-selected={selected.includes(node.key) || undefined}
      aria-checked={checkable ? (node.indeterminate ? "mixed" : checked.includes(node.key)) : undefined}
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
            loading={loadingKeys.has(node.key)}
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
          onDragStart?.(node, event);
        }}
        onDragOver={(event) => {
          if (draggable) {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            const offset = event.clientY - rect.top;
            setDropPosition(
              offset < rect.height / 3
                ? "before"
                : offset > (rect.height * 2) / 3
                  ? "after"
                  : "inside",
            );
            setDropKey(node.key);
            event.dataTransfer.dropEffect = "move";
          }
        }}
        onDragEnter={(event) => {
          if (draggable && dragRef.current?.key !== node.key && !node.disabled) {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            const offset = event.clientY - rect.top;
            setDropPosition(
              offset < rect.height / 3
                ? "before"
                : offset > (rect.height * 2) / 3
                  ? "after"
                  : "inside",
            );
            setDropKey(node.key);
            onDragEnter?.(node, event);
          }
        }}
        onDragLeave={(event) => {
          if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
          if (dropKey === node.key) setDropKey(undefined);
          onDragLeave?.(node, event);
        }}
        onDrop={(event) => {
          const dragNode = dragRef.current;
          if (!draggable || !dragNode || dragNode.key === node.key || node.disabled) return;
          event.preventDefault();
          const position = dropPosition;
          const moved = moveRawNode(dragNode.key, node.key, position);
          setDropKey(undefined);
          if (moved) onDrop?.({ dragNode, dropNode: node, dropPosition: position }, event);
          dragRef.current = null;
        }}
        onDragEnd={(event) => {
          setDropKey(undefined);
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
          className="k-tree-node-list"
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
