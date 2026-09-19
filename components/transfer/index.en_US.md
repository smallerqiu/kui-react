# Transfer

Move and select items between two lists.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

- Move items between available and selected lists.

[Search and operations](./demo/search.tsx?show=vertical)

- Search list content and customize operation labels.

[Theme](./demo/theme.tsx?show=vertical)

- Supports `outline` and `fill`; the search input follows the Transfer theme.

[Disabled](./demo/disabled.tsx?show=vertical)

- Disable individual items or the entire transfer.

[Custom content](./demo/custom.tsx?show=vertical)

- Customize items, footers, and filtering with a render function and filter function.

[Events](./demo/events.tsx?show=vertical)

- Listen for move and selection changes.

[Pagination](./demo/pagination.tsx?show=vertical)

- Compose simple pagination in the footer for larger data sets.

## API

| Property          | Description                     | Type                                 | Default        |
| ----------------- | ------------------------------- | ------------------------------------ | -------------- |
| dataSource        | Source data                     | TransferItem[]                       | []             |
| targetKeys        | Controlled target items         | (string\|number)[]                   | []             |
| defaultTargetKeys | Initial target items            | (string\|number)[]                   | []             |
| titles            | Titles for both lists           | [ReactNode, ReactNode]               | Source, Target |
| operations        | Right and left operation labels | [string, string]                     | ['', '']       |
| searchable        | Whether searchable              | boolean                              | false          |
| disabled          | Whether disabled                | boolean                              | false          |
| readOnly          | Whether read-only               | boolean                              | false          |
| theme             | Appearance theme                | 'outline' \| 'fill'                  | outline        |
| filterOption      | Custom filter                   | (keyword, item) => boolean           | -              |
| item              | Custom list item renderer       | (item) => ReactNode                  | -              |
| footer            | Custom list footer renderer     | (direction) => ReactNode             | -              |
| onChange          | Emitted after moving items      | (event: TransferChangeEvent) => void | -              |
| onSelectChange    | Selection callback              | (sourceKeys, targetKeys) => void     | -              |
| onSearch          | Search box callback             | (direction, value) => void           | -              |

### TransferItem

| Property    | Description       | Type             | Default |
| ----------- | ----------------- | ---------------- | ------- |
| key         | Unique key        | string \| number | -       |
| title       | Item title        | string           | -       |
| description | Item description  | string           | -       |
| disabled    | Disable this item | boolean          | false   |
