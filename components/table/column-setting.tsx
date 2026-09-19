import { useState, type ReactNode } from "react";
import { Button } from "../button";
import { CheckboxGroup } from "../checkbox";
import type { SizeType } from "../const/types";
import Poptip from "../poptip";
import type { Column } from "./types";

export interface TableColumnSettingProps<T = Record<string, unknown>> {
  /** 所有列定义 */
  columns?: Column<T>[];
  /** 当前隐藏的列 key 集合 */
  hiddenColumnKeys?: (string | number)[];
  /** 隐藏列变化时触发 */
  onHiddenColumnKeysChange?: (keys: (string | number)[]) => void;
  /** 禁用的列 key 集合 */
  disabledKeys?: (string | number)[];
  /** 标题文案 */
  title?: string;
  /** 重置按钮文案 */
  resetText?: string;
  /** 按钮大小 */
  size?: SizeType;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 自定义按钮内容 */
  children?: ReactNode;
}

/**
 * 表格列设置组件，用于动态显示/隐藏列
 * 与 kui-vue 一致，使用 CheckboxGroup 简单列表
 */
export function TableColumnSetting<T extends object = Record<string, unknown>>({
  columns = [],
  hiddenColumnKeys = [],
  onHiddenColumnKeysChange,
  disabledKeys = [],
  title = "Column settings",
  resetText = "Reset",
  size,
  showReset = true,
  children,
}: TableColumnSettingProps<T>) {
  const [open, setOpen] = useState(false);

  // 构建可配置的列列表（不含分组列）
  const leafColumns = columns.filter((col) => !col.children?.length);
  const configurableColumns = leafColumns.filter((col) => !disabledKeys.includes(col.key));

  // 当前可见的列 keys
  const visibleKeys = configurableColumns
    .map((col) => col.key)
    .filter((key) => !hiddenColumnKeys.includes(key)) as (string | number)[];

  // 构建 CheckboxGroup 的选项
  const options = configurableColumns.map((col) => ({
    label: String(col.title),
    value: col.key,
  }));

  const handleUpdate = (values: (string | number)[]) => {
    const selected = new Set(values.map(String));
    const configurable = new Set(configurableColumns.map((col) => String(col.key)));
    const next = [
      ...hiddenColumnKeys.filter((key) => !configurable.has(String(key))),
      ...configurableColumns.map((col) => col.key).filter((key) => !selected.has(String(key))),
    ];
    onHiddenColumnKeysChange?.(next);
  };

  const handleReset = () => {
    handleUpdate(configurableColumns.map((col) => col.key));
  };

  const content = (
    <div className="k-table-column-setting" onClick={(e) => e.stopPropagation()}>
      <CheckboxGroup
        value={visibleKeys}
        options={options}
        direction="vertical"
        size={size}
        onChange={handleUpdate}
      />
      {showReset && (
        <Button
          className="k-table-column-setting-reset"
          theme="plain"
          size="small"
          onClick={handleReset}
        >
          {resetText}
        </Button>
      )}
    </div>
  );

  return (
    <Poptip
      trigger="click"
      placement="bottom-right"
      title={title}
      content={content}
      open={open}
      onOpenChange={setOpen}
    >
      {children ?? <Button size={size}>{title}</Button>}
    </Poptip>
  );
}
