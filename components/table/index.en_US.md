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
    key: '1',
    name: 'Li Lei',
    age: 32,
    address: 'Wu Han Guanggu No. 328',
  },
  {
    key: '2',
    name: 'Hu Cong',
    age: 28,
    address: 'Wu Han Guanggu No. 198',
  },
];

const columns = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Age',
    key: 'age',
  },
  {
    title: 'Address',
    key: 'address',
  },
];

<Table :data="dataSource" :columns="columns" />;
```

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- A regular table.

[Basic Usage (Using render)](./demo/base-render.tsx?show=vertical)

- Use custom `render` to initialize the table.

[Custom Table Header](./demo/custom-header.tsx?show=vertical)

- A table with a customizable header. You can define the header via `#header-`.

[Custom Header and Footer](./demo/bordered.tsx?show=vertical)

- Add table border lines, header, and footer.

[Sorting](./demo/table-sorter.tsx?show=vertical)

- `sorter=true` sorts existing data. When set to a `function`, you can define custom sorting rules.

[Table Row/Column Span](./demo/col-row-span.tsx?show=vertical)

- Headers support only column spanning; use colSpan inside column definitions to configure. The table supports row and column spanning; in renders, use cell props colSpan or rowSpan. When set to 0, the cell will not render.

[Editable Cells](./demo/table-edit.tsx?show=vertical)

- A table with cell editing functionality.

[Fixed Header/Columns](./demo/fixed-col-header.tsx?show=vertical)

- For data with many columns, you can fix the front and back columns and scroll horizontally to view other data. You need to set the table's width `scroll.x` and `scroll.y`.

[Header Grouping](./demo/header-span.tsx?show=vertical)

- `columns[n]` can nest `children` to render grouped headers.

[Checkbox Selection](./demo/table-check.tsx?show=vertical)

- Set `checkable=true` to automatically enable multi-selection. > Note: The default selection dependency is `key`. You can customize it via the `rowKey` attribute, e.g., `rowKey="ID"`.

[Dynamically Control Table Properties](./demo/control.tsx?show=vertical)

- Select different configuration combinations to see the effects.

## Table API

| Property     | Description                                              | Type                                                                         | Default |
| ------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| bordered     | Whether to display borders                               | boolean                                                                         | false   |
| checkable    | Whether to show checkboxes                               | boolean                                                                         | false   |
| selectedKeys | Collection of selected keys                              | (string \| number)[]                                                        | -       |
| defaultSelectedKeys | Initial selected keys in uncontrolled mode       | (string \| number)[]                                                        | []      |
| disabledKeys | Disabled key set                                         | (string \| number)[]                                                        | -       |
| size         | Display compact mode when the value is `small`           | string                                                                       | -       |
| emptyText    | Prompt displayed when there is no data                   | string                                                                       | No Data |
| loading      | Table asynchronous loading mode                          | boolean                                                                         | false   |
| data         | Structured data to be displayed                          | T[]                                                                          | []      |
| columns      | Configuration description of table columns               | Column[]                                                                     | []      |
| header       | Custom table header content                              | ReactNode                                                                    | -       |
| footer       | Custom table footer content                              | ReactNode                                                                    | -       |
| rowKey       | Basis for selection                                      | string \| (record: T) => string \| number                                   | key     |
| scroll       | Scrollable table area                                    | { x?: number \| string; y?: number \| string }                              | {}      |
| striped      | Whether to display zebra stripes                         | boolean                                                                         | false   |
| onRowClick   | Triggered when clicking a row                            | (record: T, index: number) => void                                           | -       |
| onSort       | Triggered when clicking to sort                          | (state: SortState) => void                                                   | -       |
| onSelect     | Triggered when clicking the checkbox                     | (record: T, selected: boolean, selectedKeys: (string \| number)[]) => void   | -       |
| onSelectAll  | Triggered when clicking the header checkbox of the Table | (selected: boolean, selectedKeys: (string \| number)[]) => void              | -       |
| onSelectedKeysChange | Called when selected keys change                 | (selectedKeys: (string \| number)[]) => void                                | -       |

## Column API

| Property | Description                                                        | Type                                                                           | Default |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------- |
| title    | Header display text                                                | string                                                                         | -       |
| key      | Corresponding column field name                                    | string                                                                         | -       |
| fixed    | Column fixed direction                                             | left,right                                                                     | -       |
| sorter   | Sorting, when `true`, local sorting is enabled                     | boolean \| (state: SortState) => void                                          | -       |
| width    | Column width                                                       | number                                                                         | -       |
| rowSpan  | Row span, or a function returning it                                | number \| (record: T, index: number) => number | - |
| colSpan  | Column span, or a function returning it                             | number \| (record: T, index: number) => number | - |
| render   | Custom cell rendering                                               | (value: unknown, record: T, rowIndex: number, column: Column<T>) => ReactNode | - |
| renderHeader | Custom header rendering                                         | (column: Column<T>, index: number) => ReactNode | - |
| children | Nested header columns                                               | Column<T>[] | - |
