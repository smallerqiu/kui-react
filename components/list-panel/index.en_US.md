# ListPanel

Provides a consistent layout for filters, result summaries, list content, and pagination. It can contain a Table, Kanban, or card list.

## Examples

[Query List](./demo/basic.tsx?show=vertical)

- Organize filters and result counts with `filters` and `summary`.

[Toolbar Actions](./demo/actions.tsx?show=vertical)

- Place reset, create, and other list-level controls in `actions`.

[Pagination and Appearance](./demo/footer.tsx?show=vertical)

- Put pagination in `footer` and adjust appearance with `size`, `shape`, and `theme`.

[Bulk Actions](./demo/selection.tsx?show=vertical)

- Replace the regular toolbar with `selection` while Table rows are selected.

## API

| Property      | Description              | Type                                      | Default |
| ------------- | ------------------------ | ----------------------------------------- | ------- |
| summary       | Summary content          | ReactNode                                 | -       |
| filters       | Filter area              | ReactNode                                 | -       |
| actions       | Action area              | ReactNode                                 | -       |
| selection     | Bulk action toolbar      | ReactNode \| (count: number) => ReactNode | -       |
| footer        | Footer area              | ReactNode                                 | -       |
| bordered      | Whether to show a border | boolean                                   | false   |
| theme         | Theme                    | ThemeType                                 | outline |
| shape         | Shape                    | ShapeType                                 | round   |
| size          | Size                     | SizeType                                  | medium  |
| selectedCount | Selected item count      | number                                    | 0       |
