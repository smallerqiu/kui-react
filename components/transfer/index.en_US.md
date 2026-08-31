# Transfer

Moves and manages data between two lists.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Move items between available and selected lists.

[Search](./demo/search.tsx?show=vertical)

- Search items in both lists.

[Custom Content](./demo/custom.tsx?show=vertical)

- Customize item, filter, and footer content.

[Disabled](./demo/disabled.tsx?show=vertical)

- Show disabled transfer and disabled items.

[Events](./demo/events.tsx?show=vertical)

- Listen for move and selection changes.

[Pagination](./demo/pagination.tsx?show=vertical)

- Add pagination to the source list.

[Theme](./demo/theme.tsx?show=vertical)

- Compare different themes.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| dataSource | Source data | TransferItem[] | [] |
| targetKeys | Controlled target items | (string\|number)[] | [] |
| defaultTargetKeys | Initial target items | (string\|number)[] | [] |
| titles | Titles for both lists | [ReactNode, ReactNode] | Source, Target |
| operations | Operation labels | [string, string] | Add, Remove |
| searchable | Whether searchable | boolean | false |
| disabled | Whether disabled | boolean | false |
| theme | Theme | ThemeType | outline |
| filterOption | Custom filter | (keyword, item) => boolean | - |
| item | Custom list item renderer | (item) => ReactNode | - |
| footer | Custom list footer renderer | (direction) => ReactNode | - |
| onChange | Move callback | (event) => void | - |
| onSelectChange | Selection callback | (sourceKeys, targetKeys) => void | - |
| onSearch | Search box callback | (direction, value) => void | - |