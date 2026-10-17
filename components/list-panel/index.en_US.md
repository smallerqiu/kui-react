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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| summary | Summary content | `ReactNode` | - |
| filters | Filter area | `ReactNode` | - |
| actions | Action area | `ReactNode` | - |
| selection | Bulk action toolbar | `ReactNode \| ((count: number) => ReactNode)` | - |
| footer | Footer area | `ReactNode` | - |
| bordered | Whether to show a border | `boolean` | true |
| theme | Appearance theme | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | outline |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | round |
| size | Size | `"small" \| "medium" \| "large"` | medium |
| selectedCount | Selected item count | `number` | 0 |

## Theme

`theme` supports five looks — `outline`, `fill`, `plain`, `solid`, `dashed` — and is `outline` when you write nothing. `underlined` belongs to a control you type into, so a list panel falls back to `outline`.

The panel starts no plate of its own: the tier is drawn on the card underneath it, so a tier moves the whole panel's surface and frame, and `bordered={false}` only takes the frame away without changing tier. Under `solid` the panel sits on the primary colour and the two parts it colours itself invert with it — the result summary takes the plate's light ink, and the bulk-action strip swaps its grey plate for a pale wash over the primary. Everything else inside the panel is your own content and follows the panel's text colour.
