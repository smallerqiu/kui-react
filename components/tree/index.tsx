import clsx from "clsx";
import { ChevronRight, CircleMinus, CirclePlus } from "kui-icons";
import {
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { TransitionGroup } from "react-transition-group";
import { getTransitionProps } from "../base/transition-props";
import Transition from "../base/transition";
import { Button } from "../button";
import Checkbox, { type ChangeEvent } from "../checkbox";
import Icon from "../icon";
import VirtualList from "../virtual-list";
import { buildTree, updateParentIndeterminate, type TreeNode } from "./utils";

export interface TreeExpandEvent {
  key: string;
  expanded: boolean;
  node: TreeNode;
}
export interface TreeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect" | "onDragStart" | "onDragEnter" | "onDragLeave" | "onDrop" | "onDragEnd"
> {
  data?: TreeNode[];
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
  onDrop?: (nodes: { dragNode: TreeNode; dropNode: TreeNode }, event: DragEvent) => void;
  onDragEnd?: (node: TreeNode, event: DragEvent) => void;
  loadData?: (node: TreeNode) => Promise<unknown>;
}
export type { BuildTreeOptions, TreeNode } from "./utils";

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

export default function Tree({
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
  onDragEnd,
  loadData,
  className,
  ...rest
}: TreeProps) {
  const [innerSelected, setInnerSelected] = useState(defaultSelectedKeys);
  const [innerExpanded, setInnerExpanded] = useState(defaultExpandedKeys);
  const [innerChecked, setInnerChecked] = useState(defaultCheckedKeys);
  const [loadingKeys, setLoadingKeys] = useState(new Set<string>());
  const [dropKey, setDropKey] = useState<string>();
  const [version, setVersion] = useState(0);
  const dragRef = useRef<TreeNode | null>(null);
  const selected = selectedKeys ?? innerSelected;
  const expanded = expandedKeys ?? innerExpanded;
  const checked = checkedKeys ?? innerChecked;
  const flat = useMemo(() => {
    void version;
    return buildTree({
      data,
      selectedKeys: selected,
      expandedKeys: expanded,
      checkedKeys: checked,
      hasLoad: !!loadData,
      checkable,
      checkStrictly,
    });
  }, [data, selected, expanded, checked, loadData, checkable, checkStrictly, version]);
  const byKey = useMemo(() => new Map(flat.map((node) => [node.key, node])), [flat]);

  const commitExpanded = (keys: string[]) => {
    if (!expandedKeys) setInnerExpanded(keys);
    onExpandedKeysChange?.(keys);
  };
  const expand = async (node: TreeNode) => {
    if (node.isLeaf || loadingKeys.has(node.key)) return;
    const nextExpanded = !expanded.includes(node.key);
    if (nextExpanded && loadData && !node.children?.length) {
      setLoadingKeys((current) => new Set(current).add(node.key));
      try {
        await loadData(findRaw(data, node.key) ?? node);
        setVersion((value) => value + 1);
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
  const moveRawNode = (dragKey: string, targetKey: string) => {
    const rawDragNode = findRaw(data, dragKey);
    const target = findRaw(data, targetKey);
    if (!rawDragNode || !target || findRaw(rawDragNode.children ?? [], targetKey)) return false;

    let moved: TreeNode | undefined;
    const remove = (nodes: TreeNode[]): boolean => {
      const index = nodes.findIndex((item) => item.key === dragKey);
      if (index >= 0) {
        moved = nodes.splice(index, 1)[0];
        return true;
      }
      return nodes.some((item) => item.children && remove(item.children));
    };
    remove(data);
    if (!moved) return false;
    (target.children ??= []).push(moved);
    if (!expanded.includes(targetKey)) commitExpanded([...expanded, targetKey]);
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

  const renderNode = (node: TreeNode) => (
    <div
      key={node.key}
      className={clsx("k-tree-item", {
        "k-tree-item-disabled": node.disabled,
        "k-tree-item-drop": dropKey === node.key,
        "k-tree-item-extra-hidden": !showExtra,
        "k-tree-item-selected": directory && selected.includes(node.key),
      })}
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
            event.dataTransfer.dropEffect = "move";
          }
        }}
        onDragEnter={(event) => {
          if (draggable && dragRef.current?.key !== node.key && !node.disabled) {
            event.preventDefault();
            setDropKey(node.key);
            onDragEnter?.(node, event);
          }
        }}
        onDragLeave={(event) => {
          if (dropKey === node.key) setDropKey(undefined);
          onDragLeave?.(node, event);
        }}
        onDrop={(event) => {
          const dragNode = dragRef.current;
          if (!draggable || !dragNode || dragNode.key === node.key || node.disabled) return;
          event.preventDefault();
          const moved = moveRawNode(dragNode.key, node.key);
          setDropKey(undefined);
          if (moved) onDrop?.({ dragNode, dropNode: node }, event);
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

  return (
    <div
      {...rest}
      className={clsx(
        "k-tree",
        { "k-tree-show-line": showLine, "k-tree-directory": directory },
        className,
      )}
    >
      {virtual ? (
        <VirtualList
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
}
