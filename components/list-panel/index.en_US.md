# ListPanel

Organizes filters, summaries, list content, and footer pagination in one panel.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Combine filters and a table in one panel.

[Actions](./demo/actions.tsx?show=vertical)

- Place filters and action buttons in the toolbar.

[Footer](./demo/footer.tsx?show=vertical)

- Place pagination below the list.

[Selection](./demo/selection.tsx?show=vertical)

- Show batch actions after selecting list items.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| summary | Summary content | ReactNode | - |
| filters | Filter area | ReactNode | - |
| actions | Action area | ReactNode | - |
| selection | Selection area | ReactNode\|(count) => ReactNode | - |
| footer | Footer area | ReactNode | - |
| bordered | Whether to show a border | boolean | false |
| theme | Theme | ThemeType | outline |
| shape | Shape | ShapeType | round |
| size | Size | SizeType | medium |
| selectedCount | Selected item count | number | 0 |