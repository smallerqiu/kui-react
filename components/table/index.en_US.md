# Table

Display row and column data.

## When to Use

- When there is a large amount of structured data to display.
- When complex behaviors such as sorting, searching, pagination, and custom operations are needed on the data.

## Simple Example

Specify the table's data source data as an array.

```js
const dataSource = [
  {
    key: "1",
    name: "Li Lei",
    age: 32,
    address: "Wu Han Guanggu No. 328",
  },
  {
    key: "2",
    name: "Hu Cong",
    age: 28,
    address: "Wu Han Guanggu No. 198",
  },
];

const columns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Age",
    key: "age",
  },
  {
    title: "Address",
    key: "address",
  },
];

<Table data={dataSource} columns={columns} />;
```

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- A regular table.

[Tree Data](./demo/tree.tsx?show=vertical)

- Tree mode is enabled automatically when records contain `children`. Controlled expansion, default expansion, indentation, selection, and row-click expansion are supported.

[Basic Usage (Using render)](./demo/base-render.tsx?show=vertical)

- Use custom `render` to initialize the table.

[Custom Table Header](./demo/custom-header.tsx?show=vertical)

- Use the column `renderHeader` callback to customize header content.

[Custom Header and Footer](./demo/bordered.tsx?show=vertical)

- Add table border lines, header, and footer.

[Sorting](./demo/table-sorter.tsx?show=vertical)

- `sorter=true` sorts existing data. When set to a `function`, you can define custom sorting rules.

[Table Row/Column Span](./demo/col-row-span.tsx?show=vertical)

- Headers support only column spanning; use colSpan inside column definitions to configure. The table supports row and column spanning; in renders, use cell props colSpan or rowSpan. When set to 0, the cell will not render.

[Editable Cells](./demo/table-edit.tsx?show=vertical)

- A table with cell editing functionality.

[Fixed Header/Columns](./demo/fixed-col-header.tsx?show=vertical)

- For tables with many columns, fix columns on either side and scroll horizontally. `scroll.x` sets the minimum content width and `scroll.y` sets the vertical viewport height.

[Header Grouping](./demo/header-span.tsx?show=vertical)

- `columns[n]` can nest `children` to render grouped headers.

[Checkbox Selection](./demo/table-check.tsx?show=vertical)

- Set `checkable=true` to automatically enable multi-selection. > Note: The default selection dependency is `key`. You can customize it via the `rowKey` attribute, e.g., `rowKey="ID"`.

[Dynamically Control Table Properties](./demo/control.tsx?show=vertical)

- Select different configuration combinations to see the effects.

[Virtual Scrolling](./demo/virtual.tsx?show=vertical)

- Use virtual scrolling with `scroll.y` for large, fixed-height data sets. Fixed columns and striped rows are supported; cell spans should not be used in virtual mode.

[Column Settings](./demo/column-setting.tsx?show=vertical)

- Use `hiddenColumnKeys` to control which columns are hidden.

## Table API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| bordered | Whether to display borders | `boolean` | false |
| checkable | Whether to show checkboxes | `boolean` | false |
| selectedKeys | Collection of selected keys | `TableKey[]` | - |
| disabledKeys | Disabled key set | `TableKey[]` | - |
| size | Display compact mode when the value is `small` | `"small" \| "medium" \| "large"` | - |
| emptyText | Prompt displayed when there is no data | `string` | No Data |
| loading | Table asynchronous loading mode | `boolean` | false |
| data | Structured data to be displayed | `T[]` | [] |
| columns | Configuration description of table columns | `Column<T>[]` | [] |
| header | Custom table header content | `ReactNode` | - |
| footer | Custom table footer content | `ReactNode` | - |
| rowKey | Basis for selection | `string \| ((record: T) => TableKey)` | key |
| childrenColumnName | Field containing child records | `string` | children |
| expandedKeys | expanded row keys | `TableKey[]` | - |
| expandAllRows | Expand every tree node on initialization or when this prop changes (explicit expandedKeys takes precedence) | `boolean` | false |
| expandRowByClick | Toggle expansion by clicking a row | `boolean` | false |
| indentSize | Indentation per tree level | `number` | 20 |
| scroll | Scrollable table area | `{ x?: number \| string; y?: number \| string; }` | {} |
| striped | Whether to display zebra stripes | `boolean` | false |
| virtual | Whether to enable virtual scrolling | `boolean` | false |
| itemHeight | Virtual row height | `number` | 44 |
| overscan | Extra virtual rows rendered outside the viewport | `number` | 5 |
| hiddenColumnKeys | Hidden column key collection | `(string \| number)[]` | [] |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | round |
| onRowClick | Triggered when clicking a row | `((record: T, index: number) => void)` | - |
| onSort | Triggered when clicking to sort | `((state: SortState) => void)` | - |
| onSelect | Triggered when clicking the checkbox | `((record: T, selected: boolean, selectedKeys: TableKey[]) => void)` | - |
| onSelectAll | Triggered when clicking the header checkbox of the Table | `((selected: boolean, selectedKeys: TableKey[]) => void)` | - |
| onSelectedKeysChange | Called when selected keys change | `((selectedKeys: TableKey[]) => void)` | - |
| onExpand | Called when a row expands or collapses | `((expanded: boolean, record: T) => void)` | - |
| onExpandedKeysChange | Called when expanded keys change | `((expandedKeys: TableKey[]) => void)` | - |

## TableColumnSetting API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column definitions; only top-level columns without children appear in the settings. | `Column<T>[]` | [] |
| hiddenColumnKeys | Hidden column keys. Update this value in the change callback and pass the same value to Table. | `(string \| number)[]` | [] |
| onHiddenColumnKeysChange | Called with the new hidden keys when a column is toggled or Reset is clicked. | `((keys: (string \| number)[]) => void)` | - |
| disabledKeys | Column keys excluded from the settings; their hidden state is preserved on reset. | `(string \| number)[]` | [] |
| title | Popup title and default trigger button text. | `string` | 'Column settings' |
| resetText | Reset button text. Reset shows all configurable columns. | `string` | 'Reset' |
| showReset | Show the reset button. | `boolean` | true |
| size | Size of the default trigger button and checkboxes. | `"small" \| "medium" \| "large"` | - |
| children | Custom trigger content. | `ReactNode` | - |

## Column API

| Property     | Description                                    | Type                                                                          | Default |
| ------------ | ---------------------------------------------- | ----------------------------------------------------------------------------- | ------- |
| title        | Header display text                            | string                                                                        | -       |
| key          | Corresponding column field name                | string                                                                        | -       |
| fixed        | Column fixed direction                         | `'left' \| 'right'`                                                           | -       |
| sorter       | Sorting, when `true`, local sorting is enabled | boolean \| (state: SortState) => void                                         | -       |
| width        | Column width                                   | number                                                                        | -       |
| rowSpan      | Row span, or a function returning it           | number \| (record: T, index: number) => number                                | -       |
| colSpan      | Column span, or a function returning it        | number \| (record: T, index: number) => number                                | -       |
| render       | Custom cell rendering                          | (value: unknown, record: T, rowIndex: number, column: Column<T>) => ReactNode | -       |
| renderHeader | Custom header rendering                        | (column: Column<T>, index: number) => ReactNode                               | -       |
| children     | Nested header columns                          | Column<T>[]                                                                   | -       |
