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
| theme | Theme | `"fill" \| "outline"` | fill |
| onMove | Called when a card moves | `((event: KanbanMoveEvent) => void)` | - |
| onItemClick | Called when a card is clicked | `((item: KanbanItemData, column: KanbanColumnData) => void)` | - |
| columnTitle | Custom column title renderer | `((column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode)` | - |
| item | Custom card renderer | `((item: KanbanItemData, column: KanbanColumnData, index: number) => React.ReactNode)` | - |
| empty | Custom empty column renderer | `((column: KanbanColumnData) => React.ReactNode)` | - |
| footer | Custom column footer renderer | `((column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode)` | - |

When a card is focused, press `Alt + ←` or `Alt + →` to move it to an adjacent column.
