import type { Column, TableKey, TableTreeRow } from "./types";

export const flattenColumns = <T,>(columns: Column<T>[]): Column<T>[] =>
  columns.flatMap((column) =>
    column.children?.length ? flattenColumns(column.children) : column
  );

export const countColumnLeaves = <T,>(column: Column<T>): number =>
  column.children?.length
    ? column.children.reduce((sum, child) => sum + countColumnLeaves(child), 0)
    : 1;

export const getRecordValue = <T extends object>(record: T, key: string): unknown =>
  key in record ? (record as Record<string, unknown>)[key] : undefined;

export const getTreeChildren = <T extends object>(record: T, childrenColumnName: string): T[] => {
  const children = getRecordValue(record, childrenColumnName);
  return Array.isArray(children) ? (children as T[]) : [];
};

interface FlattenTreeOptions<T extends object> {
  data: T[];
  childrenColumnName: string;
  expandedKeys?: Set<TableKey>;
  getKey: (record: T) => TableKey;
  sortRecords?: (records: T[]) => T[];
}

export const flattenTreeData = <T extends object>({
  data,
  childrenColumnName,
  expandedKeys,
  getKey,
  sortRecords = (records) => records,
}: FlattenTreeOptions<T>): TableTreeRow<T>[] => {
  const rows: TableTreeRow<T>[] = [];
  const visit = (records: T[], depth: number) => {
    sortRecords(records).forEach((record) => {
      const children = getTreeChildren(record, childrenColumnName);
      rows.push({ record, depth, hasChildren: children.length > 0 });
      if (children.length && (!expandedKeys || expandedKeys.has(getKey(record)))) {
        visit(children, depth + 1);
      }
    });
  };
  visit(data, 0);
  return rows;
};
