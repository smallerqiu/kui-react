# Tree

## When to Use

Folders, organizational structures, biological classifications, countries and regions, etc. Most structures in the world are tree structures. Using `tree control` can fully display the hierarchical relationships and have interactive functions such as expand/collapse and selection.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage, showing selectable items with default expansion.

[Checkable](./demo/checkable.tsx)

- Set the `checkable` attribute to allow nodes to be checked.

[Extended Node](./demo/custom-render.tsx)

- Extended node for a tree item.

[Disabled Node](./demo/disabled.tsx)

- Set the `disabled` attribute to disable a node.

[Asynchronous Loading](./demo/sync.tsx)

- Click to expand a node and load data dynamically. `isLeaf=true` indicates the current node is a leaf node and has no children.

[Custom Icon](./demo/icon.tsx)

- You can customize icons for different nodes.

[Group Control](./demo/directory.tsx?show=vertical)

- Displays directories, connecting lines, drag-and-drop, checkboxes, icons, and extensions.

## Tree API

| Property      | Description                                                                                                       | Type                              | Default |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------- |
| data          | Array of nestable node properties, data to generate `tree`                                                        | TreeNode[]                        | []      |
| checkable     | Whether to show checkbox                                                                                          | boolean                              | false   |
| draggable     | Whether it can be dragged                                                                                         | boolean                              | false   |
| showLine      | Whether to show connecting lines                                                                                  | boolean                              | false   |
| showIcon      | Whether to show icons                                                                                             | boolean                              | true    |
| extra         | Extension element                                                                                                 | ReactNode(node)                        | -       |
| showExtra     | Whether to show extension elements by default                                                                     | boolean                              | false   |
| checkStrictly | In checkable state, node selection is completely controlled (parent-child node selection state no longer related) | boolean                              | false   |
| checkedKeys   | Tree nodes with checked checkboxes                                                                                | string[]                          | []      |
| defaultCheckedKeys | Initial checked nodes in uncontrolled mode                                                                  | string[]                          | []      |
| expandedKeys  | Specify expanded nodes                                                                                            | string[]                          | []      |
| defaultExpandedKeys | Initial expanded nodes in uncontrolled mode                                                                | string[]                          | []      |
| selectedKeys  | Selected nodes                                                                                                    | string[]                          | []      |
| defaultSelectedKeys | Initial selected nodes in uncontrolled mode                                                                | string[]                          | []      |
| selectAsCheck | Toggle checked state when selecting a node                                                                         | boolean                           | false   |
| queryKey      | Query key used for filtering or highlighting                                                                       | string                            | -       |
| renderTitle   | Custom node title renderer                                                                                          | (node: TreeNode) => ReactNode     | -       |
| renderExtra   | Custom node extra-content renderer                                                                                  | (node: TreeNode) => ReactNode     | -       |
| multiple      | Whether to support multiple selection                                                                             | boolean                              | false   |
| loading       | Asynchronous loading state                                                                                        | boolean                              | false   |
| loadData      | Method to asynchronously load data                                                                                | (node: TreeNode) => Promise<unknown\> | -    |
| directory     | Does not display as a directory tree                                                                              | boolean                              | false   |

## Tree Events

| Property | Description | Type |
| --- | --- | --- |
| onExpand | Called when a node expands or collapses | (result: TreeExpandEvent) => void |
| onExpandedKeysChange | Called when expanded keys change | (keys: string[]) => void |
| onCheck | Called when a checkbox changes | (node: TreeNode, checked: boolean, keys: string[]) => void |
| onCheckedKeysChange | Called when checked keys change | (keys: string[]) => void |
| onSelect | Called when a node is selected | (node: TreeNode, keys: string[]) => void |
| onSelectedKeysChange | Called when selected keys change | (keys: string[]) => void |
| onDragStart | Called when dragging starts | (node: TreeNode, event: DragEvent) => void |
| onDragEnter | Called when a dragged node enters | (node: TreeNode, event: DragEvent) => void |
| onDragLeave | Called when a dragged node leaves | (node: TreeNode, event: DragEvent) => void |
| onDrop | Called when a node is dropped | (nodes, event: DragEvent) => void |
| onDragEnd | Called when dragging ends | (node: TreeNode, event: DragEvent) => void |

## TreeNode API

| Property | Description                                                                           | Type       | Default |
| -------- | ------------------------------------------------------------------------------------- | ---------- | ------- |
| title    | Node title                                                                            | string     | -       |
| icon     | Custom icon                                                                           | string     | -       |
| disabled | Whether node is disabled                                                              | boolean       | false   |
| children | Child nodes                                                                           | TreeNode[] | -       |
| isLeaf   | Set as leaf node (effective when loadData is set). false will force it as parent node | boolean       | false   |
