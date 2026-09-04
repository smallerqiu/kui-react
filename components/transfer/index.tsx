import clsx from "clsx";
import { ChevronLeft, ChevronRight, Search } from "kui-icons";
import { useMemo, useState } from "react";
import { Button } from "../button";
import Checkbox from "../checkbox";
import Empty from "../empty";
import Input from "../input";

export type TransferKey = string | number;

export interface TransferItem {
  key: TransferKey;
  title: string;
  description?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface TransferChangeEvent {
  targetKeys: TransferKey[];
  direction: "left" | "right";
  movedKeys: TransferKey[];
}

export interface TransferProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  dataSource?: TransferItem[];
  targetKeys?: TransferKey[];
  defaultTargetKeys?: TransferKey[];
  titles?: [React.ReactNode, React.ReactNode];
  operations?: [string, string];
  searchable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  theme?: "outline" | "fill";
  filterOption?: (keyword: string, item: TransferItem) => boolean;
  item?: (item: TransferItem) => React.ReactNode;
  footer?: (direction: "left" | "right") => React.ReactNode;
  onChange?: (event: TransferChangeEvent) => void;
  onSelectChange?: (sourceKeys: TransferKey[], targetKeys: TransferKey[]) => void;
  onSearch?: (direction: "left" | "right", value: string) => void;
}

const EMPTY_ITEMS: TransferItem[] = [];
const EMPTY_KEYS: TransferKey[] = [];

export default function Transfer({
  dataSource = EMPTY_ITEMS,
  targetKeys,
  defaultTargetKeys = EMPTY_KEYS,
  titles = ["Source", "Target"],
  operations = ["", ""],
  searchable = false,
  disabled = false,
  readOnly = false,
  theme = "outline",
  filterOption,
  item: renderItem,
  footer,
  onChange,
  onSelectChange,
  onSearch,
  className,
  ...rest
}: TransferProps) {
  const [innerTargets, setInnerTargets] = useState(defaultTargetKeys);
  const [sourceSelected, setSourceSelected] = useState<TransferKey[]>([]);
  const [targetSelected, setTargetSelected] = useState<TransferKey[]>([]);
  const [queries, setQueries] = useState<[string, string]>(["", ""]);
  const targets = targetKeys ?? innerTargets;
  const targetSet = useMemo(() => new Set(targets), [targets]);
  const itemMap = useMemo(
    () => new Map(dataSource.map((entry) => [entry.key, entry])),
    [dataSource],
  );
  const sourceItems = useMemo(
    () => dataSource.filter((entry) => !targetSet.has(entry.key)),
    [dataSource, targetSet],
  );
  const targetItems = useMemo(
    () => dataSource.filter((entry) => targetSet.has(entry.key)),
    [dataSource, targetSet],
  );
  const [previousDataSource, setPreviousDataSource] = useState(dataSource);
  const [previousTargets, setPreviousTargets] = useState(targets);
  if (previousDataSource !== dataSource || previousTargets !== targets) {
    setPreviousDataSource(dataSource);
    setPreviousTargets(targets);
    setSourceSelected((keys) => keys.filter((key) => itemMap.has(key) && !targetSet.has(key)));
    setTargetSelected((keys) => keys.filter((key) => itemMap.has(key) && targetSet.has(key)));
  }

  const filter = (items: TransferItem[], keyword: string) =>
    keyword
      ? items.filter((entry) =>
          filterOption
            ? filterOption(keyword, entry)
            : `${entry.title} ${entry.description || ""}`
                .toLowerCase()
                .includes(keyword.toLowerCase()),
        )
      : items;

  const visibleSource = filter(sourceItems, queries[0]);
  const visibleTarget = filter(targetItems, queries[1]);

  const notifySelection = (source: TransferKey[], target: TransferKey[]) => {
    onSelectChange?.([...source], [...target]);
  };

  const toggle = (direction: "left" | "right", key: TransferKey) => {
    if (disabled || readOnly || itemMap.get(key)?.disabled) return;
    if (direction === "left") {
      const next = sourceSelected.includes(key)
        ? sourceSelected.filter((entry) => entry !== key)
        : [...sourceSelected, key];
      setSourceSelected(next);
      notifySelection(next, targetSelected);
    } else {
      const next = targetSelected.includes(key)
        ? targetSelected.filter((entry) => entry !== key)
        : [...targetSelected, key];
      setTargetSelected(next);
      notifySelection(sourceSelected, next);
    }
  };

  const selectableKeys = (items: TransferItem[]) =>
    items.filter((entry) => !entry.disabled).map((entry) => entry.key);

  const toggleAll = (direction: "left" | "right", items: TransferItem[]) => {
    if (disabled || readOnly) return;
    const selected = direction === "left" ? sourceSelected : targetSelected;
    const keys = selectableKeys(items);
    const unfilteredKeys = selected.filter((key) => !keys.includes(key));
    const next =
      keys.length > 0 && keys.every((key) => selected.includes(key))
        ? unfilteredKeys
        : [...unfilteredKeys, ...keys];
    if (direction === "left") {
      setSourceSelected(next);
      notifySelection(next, targetSelected);
    } else {
      setTargetSelected(next);
      notifySelection(sourceSelected, next);
    }
  };

  const move = (direction: "left" | "right") => {
    if (disabled || readOnly) return;
    const selected = direction === "right" ? sourceSelected : targetSelected;
    const movedKeys = selected.filter((key) => {
      const entry = itemMap.get(key);
      return entry && !entry.disabled;
    });
    if (!movedKeys.length) return;

    const next =
      direction === "right"
        ? [...new Set([...targets, ...movedKeys])]
        : targets.filter((key) => !movedKeys.includes(key));
    if (targetKeys === undefined) setInnerTargets(next);
    onChange?.({ targetKeys: next, direction, movedKeys: [...movedKeys] });

    if (direction === "right") {
      const nextSource = sourceSelected.filter((key) => !movedKeys.includes(key));
      setSourceSelected(nextSource);
      notifySelection(nextSource, targetSelected);
    } else {
      const nextTarget = targetSelected.filter((key) => !movedKeys.includes(key));
      setTargetSelected(nextTarget);
      notifySelection(sourceSelected, nextTarget);
    }
  };

  const updateSearch = (direction: "left" | "right", value: string) => {
    const side = direction === "left" ? 0 : 1;
    setQueries((current) => {
      const next: [string, string] = [...current];
      next[side] = value;
      return next;
    });
    onSearch?.(direction, value);
  };

  const renderList = (
    direction: "left" | "right",
    items: TransferItem[],
    allItems: TransferItem[],
    title: React.ReactNode,
  ) => {
    const selected = direction === "left" ? sourceSelected : targetSelected;
    const enabledKeys = selectableKeys(items);
    const selectedCount = allItems.filter((entry) => selected.includes(entry.key)).length;
    const allChecked = enabledKeys.length > 0 && enabledKeys.every((key) => selected.includes(key));

    return (
      <section className="k-transfer-list">
        <header className="k-transfer-header">
          <Checkbox
            checked={allChecked}
            disabled={disabled || !enabledKeys.length}
            readOnly={readOnly}
            onChange={() => toggleAll(direction, items)}
          >
            {title}
          </Checkbox>
          <span>
            {selectedCount}/{allItems.length}
          </span>
        </header>
        {searchable && (
          <div className="k-transfer-search">
            <Input
              value={direction === "left" ? queries[0] : queries[1]}
              disabled={disabled}
              theme={theme}
              clearable
              icon={Search}
              placeholder="Search"
              onChange={(value) => updateSearch(direction, String(value))}
            />
          </div>
        )}
        <div
          className="k-transfer-body"
          role="listbox"
          aria-label={typeof title === "string" ? title : direction}
          aria-multiselectable="true"
        >
          {items.length ? (
            items.map((entry) => {
              const selectedItem = selected.includes(entry.key);
              return (
                <div
                  key={entry.key}
                  className={clsx(
                    "k-transfer-item",
                    selectedItem && "is-selected",
                    entry.disabled && "is-disabled",
                  )}
                  role="option"
                  aria-selected={selectedItem}
                  aria-disabled={disabled || entry.disabled}
                  tabIndex={disabled || entry.disabled ? -1 : 0}
                  onClick={() => toggle(direction, entry.key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggle(direction, entry.key);
                    }
                  }}
                >
                  <span
                    className="k-transfer-item-checkbox"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedItem}
                      disabled={disabled || entry.disabled}
                      readOnly={readOnly}
                      onChange={() => toggle(direction, entry.key)}
                    />
                  </span>
                  <span className="k-transfer-item-content">
                    {renderItem?.(entry) ?? entry.title}
                    {entry.description && <small>{entry.description}</small>}
                  </span>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
        </div>
        {footer && <footer className="k-transfer-footer">{footer(direction)}</footer>}
      </section>
    );
  };

  return (
    <div
      {...rest}
      className={clsx(
        "k-transfer",
        `k-transfer-${theme}`,
        disabled && "is-disabled",
        readOnly && "is-readonly",
        className,
      )}
      aria-readonly={readOnly || undefined}
    >
      {renderList("left", visibleSource, sourceItems, titles[0])}
      <div className="k-transfer-operations">
        <Button
          type="primary"
          size="small"
          disabled={disabled || readOnly || !sourceSelected.length}
          icon={ChevronRight}
          onClick={() => move("right")}
        >
          {operations[0]}
        </Button>
        <Button
          type="primary"
          size="small"
          disabled={disabled || readOnly || !targetSelected.length}
          icon={ChevronLeft}
          onClick={() => move("left")}
        >
          {operations[1]}
        </Button>
      </div>
      {renderList("right", visibleTarget, targetItems, titles[1])}
    </div>
  );
}
