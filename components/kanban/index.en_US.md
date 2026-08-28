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
| columns | Kanban columns | KanbanColumnData[] | [] |
| data | Card data | KanbanItemData[] | [] |
| rowKey | Unique data field | string | id |
| statusKey | Status field | string | status |
| draggable | Whether dragging is enabled | boolean | true |
| emptyText | Empty column text | string | No data |
| minColumnWidth | Minimum column width | number\|string | 250 |
| theme | Theme | ThemeType | fill |
| onMove | Called when a card moves | (event) => void | - |
| onItemClick | Called when a card is clicked | (item, column) => void | - |