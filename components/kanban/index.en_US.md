# Kanban

Displays tasks in status columns and supports drag-and-drop movement.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Drag cards between status columns.

[Custom Content](./demo/custom.tsx?show=vertical)

- Customize column titles, cards, empty states, and footer actions.

[Custom Fields](./demo/fields.tsx?show=vertical)

- Configure data fields with `rowKey` and `statusKey`.

[Theme](./demo/theme.tsx?show=vertical)

- Switch the Kanban theme.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Kanban columns | `KanbanColumnData[]` | [] |
| data | Card data | `KanbanItemData[]` | [] |
| rowKey | Unique data field | `string` | id |
| statusKey | Status field | `string` | status |
| draggable | Whether dragging is enabled | `boolean` | true |
| emptyText | Empty column text; defaults to the global locale | `string` | - |
| minColumnWidth | Minimum column width | `string \| number` | 250 |
| theme | Surface theme | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain" \| "underlined"` | `fill` |
| onMove | Called when a card moves | `((event: KanbanMoveEvent) => void)` | - |
| onItemClick | Called when a card is clicked | `((item: KanbanItemData, column: KanbanColumnData) => void)` | - |
| columnTitle | Custom column title renderer | `((column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode)` | - |
| item | Custom card renderer | `((item: KanbanItemData, column: KanbanColumnData, index: number) => React.ReactNode)` | - |
| empty | Custom empty column renderer | `((column: KanbanColumnData) => React.ReactNode)` | - |
| footer | Custom column footer renderer | `((column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode)` | - |

When a card is focused, press `Alt + ←` or `Alt + →` to move it to an adjacent column.
## Theme

`theme` supports five looks — `fill`, `outline`, `plain`, `solid`, `dashed` — and is `fill` when you write nothing. `underlined` belongs to a control you type into, so a board falls back to `fill`.

The tier paints each column rather than the whole board: `fill` puts a pale plate under the column, `outline` draws the library's border colour around it, `plain` leaves it without a plate or a frame, and `dashed` turns that frame into a dashed line. `solid` fills the column with the primary colour and inverts its title, its count chip and the cards inside it, the keyboard ring included. The dot in a column header comes from `column.color` — that is board data rather than a surface, so no tier touches it. The hint that marks the column a card is being dragged over — a primary edge under a pale primary wash — shows under every look, and a `solid` column draws that edge in its plate's own inverted ink.
