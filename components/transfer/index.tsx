import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "kui-icons";
import { useMemo, useState } from "react";
import { Button } from "../button";
import Checkbox from "../checkbox";
import Input from "../input";
import type { ThemeType } from "../const/types";

export interface TransferItem {
  key: string | number;
  title: string;
  description?: string;
  disabled?: boolean;
  [key: string]: unknown;
}
export interface TransferChangeEvent {
  targetKeys: Array<string | number>;
  direction: "left" | "right";
  movedKeys: Array<string | number>;
}
export interface TransferProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  dataSource?: TransferItem[];
  targetKeys?: Array<string | number>;
  defaultTargetKeys?: Array<string | number>;
  titles?: [React.ReactNode, React.ReactNode];
  operations?: [string, string];
  searchable?: boolean;
  disabled?: boolean;
  theme?: ThemeType;
  filterOption?: (keyword: string, item: TransferItem) => boolean;
  item?: (item: TransferItem) => React.ReactNode;
  footer?: (direction: "left" | "right") => React.ReactNode;
  onChange?: (event: TransferChangeEvent) => void;
  onSelectChange?: (sourceKeys: Array<string | number>, targetKeys: Array<string | number>) => void;
}

export default function Transfer({
  dataSource = [],
  targetKeys,
  defaultTargetKeys = [],
  titles = ["Source", "Target"],
  operations = ["Add", "Remove"],
  searchable = false,
  disabled = false,
  theme = "outline",
  filterOption,
  item,
  footer,
  onChange,
  onSelectChange,
  className,
  ...rest
}: TransferProps) {
  const [innerTargets, setInnerTargets] = useState(defaultTargetKeys);
  const [sourceSelected, setSourceSelected] = useState<Array<string | number>>([]);
  const [targetSelected, setTargetSelected] = useState<Array<string | number>>([]);
  const [queries, setQueries] = useState(["", ""]);
  const targets = targetKeys ?? innerTargets;
  const lists = useMemo(
    () => [
      dataSource.filter((item) => !targets.includes(item.key)),
      dataSource.filter((item) => targets.includes(item.key)),
    ],
    [dataSource, targets],
  );
  const filter = (items: TransferItem[], query: string) =>
    items.filter(
      (item) =>
        !query ||
        (filterOption
          ? filterOption(query, item)
          : item.title.toLowerCase().includes(query.toLowerCase())),
    );
  const move = (direction: "left" | "right") => {
    const selected = direction === "right" ? sourceSelected : targetSelected;
    const moved = lists[direction === "right" ? 0 : 1]
      .filter((item) => selected.includes(item.key) && !item.disabled)
      .map((item) => item.key);
    if (!moved.length) return;
    const next =
      direction === "right"
        ? [...targets, ...moved]
        : targets.filter((key) => !moved.includes(key));
    if (targetKeys === undefined) setInnerTargets(next);
    onChange?.({ targetKeys: next, direction, movedKeys: moved });
    setSourceSelected([]);
    setTargetSelected([]);
  };
  const toggle = (side: 0 | 1, key: string | number) => {
    const setter = side === 0 ? setSourceSelected : setTargetSelected;
    const selected = side === 0 ? sourceSelected : targetSelected;
    const next = selected.includes(key)
      ? selected.filter((item) => item !== key)
      : [...selected, key];
    setter(next);
    onSelectChange?.(side === 0 ? next : sourceSelected, side === 1 ? next : targetSelected);
  };
  return (
    <div
      {...rest}
      className={clsx("k-transfer", `k-transfer-${theme}`, disabled && "is-disabled", className)}
    >
      {[0, 1].map((side) => (
        <div className="k-transfer-list" key={side}>
          <div className="k-transfer-header">
            <strong>{titles[side]}</strong>
            <span>{lists[side].length}</span>
          </div>
          {searchable && (
            <div className="k-transfer-search">
              <Input
                value={queries[side]}
                onChange={(value) =>
                  setQueries((old) => {
                    const next = [...old] as [string, string];
                    next[side] = String(value);
                    return next;
                  })
                }
                placeholder="Search"
              />
            </div>
          )}
          <div className="k-transfer-body">
            {filter(lists[side], queries[side]).map((entry) => {
              const selected = (side === 0 ? sourceSelected : targetSelected).includes(entry.key);
              return (
                <div
                  key={entry.key}
                  className={clsx(
                    "k-transfer-item",
                    selected && "is-selected",
                    entry.disabled && "is-disabled",
                  )}
                  onClick={() => !disabled && !entry.disabled && toggle(side as 0 | 1, entry.key)}
                >
                  <Checkbox
                    checked={selected}
                    disabled={disabled || entry.disabled}
                    onChange={() => undefined}
                  />
                  <span className="k-transfer-item-content">
                    {item?.(entry) ?? (
                      <>
                        <span>{entry.title}</span>
                        {entry.description && <small>{entry.description}</small>}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          {footer && (
            <div className="k-transfer-footer">{footer(side === 0 ? "left" : "right")}</div>
          )}
        </div>
      ))}
      <div className="k-transfer-operations">
        <Button
          icon={ArrowRight}
          disabled={disabled || !sourceSelected.length}
          onClick={() => move("right")}
        >
          {operations[0]}
        </Button>
        <Button
          icon={ArrowLeft}
          disabled={disabled || !targetSelected.length}
          onClick={() => move("left")}
        >
          {operations[1]}
        </Button>
      </div>
    </div>
  );
}
