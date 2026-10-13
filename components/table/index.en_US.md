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

- Use the column `renderHeader` callback to customize header content. kui-vue deliberately has no such prop; on that side the header is customized with the `#header-columnKey` slot.

[Custom Header and Footer](./demo/bordered.tsx?show=vertical)

- Add table border lines, header, and footer.

[Sorting](./demo/table-sorter.tsx?show=vertical)

- `sorter=true` sorts existing data. When set to a `function`, you can define custom sorting rules. Sortable headers are focusable (`tabindex=0`), and `Enter` or `Space` works the same as clicking. The direction is exposed through `aria-sort` (`none`/`ascending`/`descending`), and each activation cycles ascending -> descending -> unsorted.

[Table Row/Column Span](./demo/col-row-span.tsx?show=vertical)

- Headers support only column spanning; use colSpan inside column definitions to configure. The table supports row and column spanning; in renders, use cell props colSpan or rowSpan. When set to 0, the cell will not render.

[Editable Cells](./demo/table-edit.tsx?show=vertical)

- A table with cell editing functionality.

[Fixed Header/Columns](./demo/fixed-col-header.tsx?show=vertical)

- For tables with many columns, fix columns on either side and scroll horizontally. `scroll.x` sets the minimum content width (when it is omitted the table falls back to the sum of each column's width basis) and `scroll.y` sets the vertical viewport height **of the body**, so the whole table is the header plus that height. With `scroll.y` the header is split into its own `table` next to the body: the header wrapper is narrowed by the measured vertical scrollbar width, so the two scrollports have the same content width and both the `auto` column widths and the sticky offsets line up on their own. Clipping lives on the layer inside the wrapper: the wrapper itself only reserves the scrollbar gutter with end padding, and `overflow: hidden` cannot clip past its own padding box, so clipping there would let the header paint through the gutter. That inner layer takes its `scrollLeft` from the body, and wheel events over the header are forwarded to the body.

[Header Grouping](./demo/header-span.tsx?show=vertical)

- `columns[n]` can nest `children` to render grouped headers.

[Checkbox Selection](./demo/table-check.tsx?show=vertical)

- Set `checkable=true` to automatically enable multi-selection. > Note: The default selection dependency is `key`. You can customize it via the `rowKey` attribute, e.g., `rowKey="ID"`. If a row yields no `string`/`number` for `rowKey`, the component falls back to a stable key generated per record object and warns once in the console; providing a `rowKey` for every row is still recommended.
- Column `key`, `rowKey` and `childrenColumnName` share one value reader: it looks the whole name up first, and only when that misses and the name contains `.` does it walk segment by segment, so `{ user: { name: "Ann" } }` works with `key="user.name"` and `{ tags: ["x", "y"] }` with `key="tags.1"`. Hitting `null` or a non-object while walking yields an empty value instead of throwing; `__proto__`, `constructor` and `prototype` never resolve. A whole name always wins, so `{ "a.b": 1 }` with `key="a.b"` reads that literal field (kui-react behaves the same). Note for vue: the column `key` doubles as the slot name, so dotted keys need a dynamic slot (`v-slot:[...]`).

[Nested Values](./demo/nested-value.tsx?show=vertical)

- Dotted `a.b` names work for column keys, `rowKey` and `childrenColumnName`; a missing link renders as an empty cell, so the data does not need flattening first.

[Dynamically Control Table Properties](./demo/control.tsx?show=vertical)

- Select different configuration combinations to see the effects.

[Virtual Scrolling](./demo/virtual.tsx?show=vertical)

- Use virtual scrolling with `scroll.y` for large, fixed-height data sets. Fixed columns and striped rows are supported. Same-row `colSpan` keeps working in virtual mode; cross-row `rowSpan` does not — when the window starts inside a span its anchor row is not rendered, so that row is missing one cell and shifts left by a column (kui-vue behaves identically, and both repos have a test pinning this down).

[Column Settings](./demo/column-setting.tsx?show=vertical)

- Use `TableColumnSetting` to show or hide columns dynamically; give its `hiddenKeys` and Table's `hiddenColumnKeys` the same value.

[Ellipsis](./demo/ellipsis.tsx?show=vertical)

- A cell whose content is wider than the column is cut with an ellipsis: set `ellipsis` on the column, or on the Table to cover every column at once (content from `render` included) and opt a column back out with `ellipsis: false`. One line by default, `rows` for several; the hover tip is on by default and only shows when the cell really got clipped.

- All Table texts come from the `k.table` locale keys: `emptyText` for the empty state, `columnSettings`/`resetColumns` for the column panel, `expandRow`/`collapseRow` for the tree toggle's accessible name and `selectRow`/`selectAllRows` for the row and header checkboxes. An explicit `emptyText`, `title` or `resetText` prop takes precedence over the locale.

- Fixed columns need a definite width: a fixed column without `width` falls back to 150, and the selection column is 50. Any column that declares `width` — fixed or not — gets that exact value on its `<col>`; only width-less non-fixed columns use `auto` to absorb the remaining width. Writing `auto` for a column that declared a width would squeeze it to 0 px under `table-layout: fixed`, which also destroys the horizontal scroll range and makes the fixed columns look inert. The `<col>` width, the sticky offset of the next fixed cell and the selection cell width all derive from that single basis.
- A narrow container scrolls instead of crushing columns: without `scroll.x` the table's `min-width` is the sum of every column's width basis (a declared `width` as-is, 150 when omitted, plus 50 for the selection column), so a shrinking viewport produces a horizontal scrollbar rather than headers wrapping down to one letter per line. Those columns still get `auto` in `<col>`, so in a wide container they keep absorbing the leftover space. An explicit `scroll.x` takes precedence.
- The shadow at a fixed column's edge only exists while that side can actually still scroll: in the neutral state it is `content: none`, so the 30px box is not generated at all. Were it always there, this absolutely positioned descendant would count towards the scroll container's scrollable area, and with no `left`/`right` it lands at its static position and reaches past the cell — a fixed column narrower than 30px then invents a bit of scroll distance, which makes "show a horizontal scrollbar" and "paint the shadow" trigger each other and the scrollbar and shadow blink at a critical window width.

- With `scroll.y` the header is a separate table: a grouped multi-row header stays whole inside its own wrapper and only the body scrolls, so no per-row sticky offset is computed. Body cells then have no structural relation to their header cell, so every header cell gets an `id` and the cells in the same column point back at it with `aria-labelledby` — screen readers still announce the column name. Without `scroll.y` the header is part of the body's `table` and no ids are emitted.

- A grouped parent column can carry `fixed` too: the direction is inherited by every leaf column under it (a leaf's own explicit `fixed` wins), and the group header cell derives its sticky offset from the leaf range it spans — it only participates in fixing when that whole range shares one direction.

- With `expandAllRows` and no controlled `expandedKeys`, a `data` change only expands the parent rows that are new to the data; rows the user expanded or collapsed by hand stay as they were. A parent row that left the data and comes back counts as new and is expanded again (neither kui-react nor kui-vue remembers that it had been collapsed).

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
| ellipsis | Turn on the ellipsis for every column at once, so you do not have to write `ellipsis` on each one; `true` is a single line, a number or `rows` clamps to several lines, and `tooltip` customizes the hover tip. A column that must show its full content opts out with `ellipsis: false`. | `number \| boolean \| TableEllipsisOptions` | - |
| header | Custom table header content | `ReactNode` | - |
| footer | Custom table footer content | `ReactNode` | - |
| rowKey | Unique row identity used by selection and expansion; a field name or an accessor function reading the key from a record | `string \| ((record: T) => TableKey)` | key |
| childrenColumnName | Field containing child records | `string` | children |
| expandedKeys | expanded row keys | `TableKey[]` | - |
| expandAllRows | Expand every tree node on initialization; when `data` changes later only newly arrived parent rows are expanded, while rows the user expanded or collapsed by hand are kept (explicit expandedKeys takes precedence) | `boolean` | false |
| expandRowByClick | Toggle expansion by clicking a row | `boolean` | false |
| indentSize | Indentation per tree level | `number` | 20 |
| scroll | Scroll configuration; `x` is the minimum content width and `y` is the vertical viewport height of the body | `{ x?: number \| string; y?: number \| string; }` | {} |
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
| columns | Column definitions; the settings list every leaf column recursively, including children of grouped headers. | `Column<T>[]` | [] |
| hiddenKeys | Hidden column keys. Update this value in the change callback and pass the same value to Table's `hiddenColumnKeys`. | `(string \| number)[]` | [] |
| onHiddenKeysChange | Called with the new hidden keys when a column is toggled or Reset is clicked. | `((keys: (string \| number)[]) => void)` | - |
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
| ellipsis     | Cell content overflows into an ellipsis        | boolean \| number \| TableEllipsisOptions                                     | -       |
| width        | Column width                                   | number                                                                        | -       |
| rowSpan      | Row span, or a function returning it           | number \| (record: T, index: number) => number                                | -       |
| colSpan      | Column span, or a function returning it        | number \| (record: T, index: number) => number                                | -       |
| render       | Custom cell rendering                          | (value: unknown, record: T, rowIndex: number, column: Column<T>) => ReactNode | -       |
| renderHeader | Custom header rendering                        | (column: Column<T>, index: number) => ReactNode                               | -       |
| children     | Nested header columns                          | Column<T>[]                                                                   | -       |

## TableEllipsisOptions

| Property | Description                                                                              | Type                 | Default |
| -------- | ---------------------------------------------------------------------------------------- | -------------------- | ------- |
| rows     | How many lines to keep before the ellipsis                                                | number               | 1       |
| tooltip  | Hover tip; omitted or `true` uses the clipped text, a value replaces it, `false` turns it off | boolean \| ReactNode | -       |
