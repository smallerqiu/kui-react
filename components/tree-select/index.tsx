import clsx from "clsx";
import { ChevronDown, CircleX, LoaderCircle, X } from "kui-icons";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
} from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { ConfigContext } from "../config/config-context";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import Empty from "../empty";
import Icon, { type IconType } from "../icon";
import zhCN from "../locale/zh-CN";
import Tree, { type TreeExpandEvent, type TreeNode } from "../tree";
import { buildTree } from "../tree/utils";

export type TreeSelectValue = string | number | Array<string | number> | null | undefined;

export interface TreeSelectProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "onSelect"
> {
  placeholder?: string;
  size?: SizeType;
  placement?: DropPlacementsType;
  width?: number;
  maxTagCount?: number;
  value?: TreeSelectValue;
  clearable?: boolean;
  filterable?: boolean;
  block?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  loading?: boolean;
  bordered?: boolean;
  showArrow?: boolean;
  options?: TreeNode[];
  theme?: ThemeType;
  emptyText?: string;
  icon?: IconType[];
  shape?: ShapeType;
  arrowIcon?: IconType[];
  treeData?: TreeNode[];
  treeCheckable?: boolean;
  treeShowLine?: boolean;
  treeShowIcon?: boolean;
  treeCheckStrictly?: boolean;
  treeExpandedKeys?: string[];
  treeCheckedKeys?: string[];
  treeSelectedKeys?: string[];
  treeExpandedAll?: boolean;
  treeLoadData?: (node: TreeNode) => Promise<unknown>;
  onChange?: (value: TreeSelectValue) => void;
  onTreeSelect?: (value: string, label: string, selected: boolean) => void;
  onSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
  onTreeExpand?: (value: TreeExpandEvent) => void;
  onTreeExpandedKeysChange?: (keys: string[]) => void;
  onTreeCheckedKeysChange?: (keys: string[]) => void;
  onOpenChange?: (open: boolean) => void;
  onClear?: () => void;
}

const normalize = (value: TreeSelectValue, multiple: boolean) => {
  if (value === null || value === undefined || value === "") return [];
  return (
    multiple ? (Array.isArray(value) ? value : [value]) : [Array.isArray(value) ? value[0] : value]
  )
    .filter((item) => item !== undefined)
    .map(String);
};

export default function TreeSelect({
  placeholder,
  size,
  placement = "bottom-left",
  width,
  maxTagCount,
  value,
  clearable = true,
  filterable,
  block,
  disabled,
  multiple,
  loading,
  bordered = true,
  showArrow = true,
  options,
  theme = "fill",
  emptyText,
  icon,
  shape,
  arrowIcon = ChevronDown,
  treeData,
  treeCheckable,
  treeShowLine,
  treeShowIcon = true,
  treeCheckStrictly,
  treeExpandedKeys,
  treeCheckedKeys,
  treeSelectedKeys,
  treeExpandedAll,
  treeLoadData,
  onChange,
  onTreeSelect,
  onSearch,
  onTreeExpand,
  onTreeExpandedKeysChange,
  onTreeCheckedKeysChange,
  onOpenChange,
  onClear,
  className,
  style,
  ...rest
}: TreeSelectProps) {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  const data = useMemo(() => treeData ?? options ?? [], [options, treeData]);
  const controlledValue = value;
  const [innerValue, setInnerValue] = useState(() => normalize(controlledValue, !!multiple));
  const currentValue =
    controlledValue !== undefined ? normalize(controlledValue, !!multiple) : innerValue;
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [query, setQuery] = useState("");
  const [innerExpanded, setInnerExpanded] = useState<string[]>([]);
  const [innerChecked, setInnerChecked] = useState<string[]>([]);
  const expanded = treeExpandedKeys ?? innerExpanded;
  const checked = treeCheckedKeys ?? innerChecked;
  const [position, setPosition] = useState({ left: 0, top: 0, minWidth: 0, origin: "top" });
  const selectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allNodes = useMemo(() => buildTree({ data, expandedKeys: expanded }), [data, expanded]);
  const labels = useMemo(() => {
    const lookup = new Map(allNodes.map((node) => [node.key, String(node.title ?? node.key)]));
    return currentValue.map((item) => lookup.get(item) ?? item);
  }, [allNodes, currentValue]);

  const updatePosition = useCallback(() => {
    const element = selectionRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const above = placement.startsWith("top");
    const overlayWidth = overlayRef.current?.offsetWidth ?? rect.width;
    const overlayHeight = overlayRef.current?.offsetHeight ?? 0;
    let left = rect.left;
    if (placement.endsWith("right")) left = rect.right - overlayWidth;
    else if (placement === "top" || placement === "bottom")
      left = rect.left + (rect.width - overlayWidth) / 2;
    setPosition({
      left: left + window.scrollX,
      top: (above ? rect.top - overlayHeight : rect.bottom) + window.scrollY,
      minWidth: rect.width,
      origin: above ? "bottom" : "top",
    });
  }, [placement]);

  useEffect(() => {
    if (!visible) return;
    updatePosition();
    const outside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!selectionRef.current?.contains(target) && !overlayRef.current?.contains(target)) {
        setVisible(false);
        setQuery("");
        onOpenChange?.(false);
      }
    };
    const reposition = () => updatePosition();
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [visible, updatePosition, onOpenChange]);
  useEffect(() => {
    if (visible) requestAnimationFrame(updatePosition);
  }, [visible, labels.length, updatePosition]);

  const open = () => {
    if (disabled) return;
    const next = !visible;
    setRendered(true);
    setVisible(next);
    onOpenChange?.(next);
    if (next && (filterable || onSearch)) requestAnimationFrame(() => inputRef.current?.focus());
    if (!next) setQuery("");
  };
  const commit = (keys: string[]) => {
    if (controlledValue === undefined) setInnerValue(keys);
    const result: TreeSelectValue = multiple || treeCheckable ? keys : (keys[0] ?? null);
    onChange?.(result);
  };
  const select = (node: TreeNode) => {
    const exists = currentValue.includes(node.key);
    const keys = multiple
      ? exists
        ? currentValue.filter((key) => key !== node.key)
        : [...currentValue, node.key]
      : [node.key];
    commit(keys);
    onTreeSelect?.(node.key, String(node.title ?? node.key), !exists);
    if (!multiple) {
      setVisible(false);
      onOpenChange?.(false);
    }
    setQuery("");
  };
  const remove = (index: number) =>
    commit(currentValue.filter((_, itemIndex) => itemIndex !== index));
  const clear = () => {
    commit([]);
    setQuery("");
    onClear?.();
  };
  const initialExpanded = treeExpandedAll
    ? allNodes.filter((node) => !node.isLeaf).map((node) => node.key)
    : undefined;
  const selectedForTree = treeSelectedKeys ?? currentValue;
  const checkedForTree = treeCheckedKeys ?? (treeCheckable ? currentValue : checked);
  const placeholderText = placeholder || locale?.k?.select?.placeholder;
  const classes = clsx(
    "k-tree-select",
    {
      "k-tree-select-disabled": disabled,
      "k-tree-select-block": block,
      "k-tree-select-opened": visible,
      "k-tree-select-borderless": !bordered,
      "k-tree-select-lg": size === "large",
      "k-tree-select-sm": size === "small",
      "k-tree-select-fill": theme === "fill",
      "k-tree-select-has-icon": icon,
      "k-tree-select-circle": shape === "circle" && !multiple,
      "k-tree-select-square": shape === "square",
      "k-tree-select-multiple": multiple,
      "k-tree-select-show-search": query,
      "k-tree-select-show-tags": multiple && labels.length,
      "k-tree-select-has-clear": clearable && !disabled && currentValue.length,
    },
    className
  );
  const displayedLabels = maxTagCount && maxTagCount > 0 ? labels.slice(0, maxTagCount) : labels;

  const search = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch?.(event);
  };
  const searchNode = (filterable || onSearch) && (
    <div className="k-tree-select-search-wrap" onClick={(event) => event.stopPropagation()}>
      <input
        ref={inputRef}
        className="k-tree-select-search"
        autoComplete="off"
        value={query}
        onChange={search}
        onKeyDown={(event) => {
          if (event.key === "Backspace" && !query && multiple && currentValue.length)
            remove(currentValue.length - 1);
        }}
      />
      <span className="k-tree-select-search-mirror">{query}</span>
    </div>
  );
  const overlay = rendered && (
    <Teleport to="body">
      <Transition show={visible} name="k-tree-select" nodeRef={overlayRef}>
        <div
          ref={overlayRef}
          className={clsx("k-tree-select-dropdown", "k-scroll", {
            "k-tree-select-dropdown-multiple": multiple,
            "k-tree-select-dropdown-sm": size === "small",
          })}
          style={{
            position: "absolute",
            zIndex: 1050,
            left: position.left,
            top: position.top,
            minWidth: position.minWidth,
            transformOrigin: position.origin,
          }}
        >
          {loading ? (
            <div className="k-tree-select-loading">
              <Icon type={LoaderCircle} spin />
              <span>{locale?.k?.select?.loading}</span>
            </div>
          ) : data.length ? (
            <Tree
              data={data}
              checkable={treeCheckable}
              showLine={treeShowLine}
              showIcon={treeShowIcon}
              multiple={!!multiple || !!treeCheckable}
              checkStrictly={treeCheckStrictly}
              expandedKeys={treeExpandedKeys ?? initialExpanded ?? expanded}
              selectedKeys={selectedForTree}
              checkedKeys={checkedForTree}
              selectAsCheck={treeCheckable}
              loadData={treeLoadData}
              queryKey={query}
              onSelect={select}
              onExpand={(event) => onTreeExpand?.(event)}
              onExpandedKeysChange={(keys) => {
                if (treeExpandedKeys === undefined) setInnerExpanded(keys);
                onTreeExpandedKeysChange?.(keys);
              }}
              onCheck={(_node, _value, keys) => commit(keys)}
              onCheckedKeysChange={(keys) => {
                if (treeCheckedKeys === undefined) setInnerChecked(keys);
                onTreeCheckedKeysChange?.(keys);
              }}
            />
          ) : (
            <Empty description={emptyText || locale?.k?.select?.emptyText} />
          )}
        </div>
      </Transition>
    </Teleport>
  );

  return (
    <>
      <div
        {...rest}
        ref={selectionRef}
        tabIndex={disabled ? -1 : 0}
        className={classes}
        style={{ ...style, width: width ? `${width}px` : style?.width }}
        onClick={open}
      >
        {icon && <Icon type={icon} className="k-tree-select-icon" />}
        <div className="k-tree-select-selection">
          {multiple ? (
            <div className="k-tree-select-labels">
              {displayedLabels.map((label, index) => (
                <span className="k-tree-select-tag" key={`${currentValue[index]}-${index}`}>
                  {label}
                  <Icon
                    type={X}
                    onClick={(event) => {
                      event.stopPropagation();
                      remove(index);
                    }}
                  />
                </span>
              ))}
              {maxTagCount && labels.length > maxTagCount ? (
                <span className="k-tree-select-tag">+{labels.length - maxTagCount}...</span>
              ) : null}
              {searchNode}
            </div>
          ) : (
            <>
              {query ? null : labels[0] && <div className="k-tree-select-label">{labels[0]}</div>}
              {searchNode}
            </>
          )}
          {!labels.length && !query && (
            <div className="k-tree-select-placeholder">{placeholderText}</div>
          )}
        </div>
        <span className="k-tree-select-suffix">
          {showArrow && !onSearch && <Icon className="k-tree-select-arrow" type={arrowIcon} />}
          {clearable && !disabled && currentValue.length > 0 && (
            <Icon
              className="k-tree-select-clearable"
              type={CircleX}
              onClick={(event) => {
                event.stopPropagation();
                clear();
              }}
            />
          )}
        </span>
      </div>
      {overlay}
    </>
  );
}
