# TreeSelect

Tree selection control.

## When to Use

Similar to the Select selection control, when the selectable data structure is a tree structure, TreeSelect can be used, such as company hierarchy, subject system, classification directory, etc.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage.

[Multiple Selection](./demo/multiple.tsx)

- A tree select component that supports multiple selections.

[Checkable](./demo/checkable.tsx)

- Use checkboxes to enable multi-selection.

[Disabled](./demo/disabled.tsx)

- Disabled state.

[Asynchronous Loading](./demo/sync.tsx)

- Click to expand a node and load data dynamically.

[Size](./demo/size.tsx)

- The select box sizes are: `small`, `default`, `large`.

[Weird Definition](./demo/theme.tsx)

- Some strange and unusual things.

## TreeSelect API

| Property         | Description                                                                     | Type                              | Default       |
| ---------------- | ------------------------------------------------------------------------------- | --------------------------------- | ------------- |
| value            | Controlled selected value                                                        | TreeSelectValue                   | -             |
| defaultValue     | Initial selected value in uncontrolled mode                                      | TreeSelectValue                   | -             |
| open             | Controlled dropdown visibility                                                    | boolean                           | -             |
| defaultOpen      | Initial dropdown visibility in uncontrolled mode                                  | boolean                           | false         |
| width            | Component width                                                                 | string, number                    | -             |
| placement        | Dropdown placement                                                              | DropPlacementsType                | bottom-left   |
| maxTagCount      | Maximum number of tags displayed in multiple mode                               | number                            | -             |
| filterable       | Whether search filtering is enabled                                             | boolean                           | false         |
| block            | Whether to fill the parent width                                                | boolean                           | false         |
| options          | Compatibility data source alias for `treeData`                                  | TreeNode[]                        | []            |
| arrowIcon        | Custom dropdown arrow icon                                                      | IconType[]                        | -             |
| placeholder      | Default text of selector                                                        | string                            | Please select |
| disabled         | Whether current item is disabled                                                | boolean                              | false         |
| size             | Component size, provides two sizes: `small`, `large`, default is normal         | string                            | -             |
| emptyText        | Prompt displayed when no data                                                   | string                            | 'No data yet' |
| multiple         | Whether to display in multiple selection mode                                   | boolean                              | false         |
| loading          | Asynchronous loading state                                                      | boolean                              | false         |
| clearable        | Whether options can be cleared                                                  | boolean                              | false         |
| bordered         | Whether to show border                                                          | boolean                              | true          |
| showArrow        | Whether to show dropdown button                                                 | boolean                              | true          |
| theme            | The theme of TreeSelect                                                         | string                            | fill          |
| icon             | Custom icon                                                                     | string                            | -             |
| shape            | When shape='circle', displays rounded corners                                   | string                            | -             |
| treeLoadData     | Method to asynchronously load data                                              | (node: TreeNode) => Promise<unknown\> | -          |
| treeData         | Array of nestable node properties, data to generate `tree`                      | TreeNode[]                        | []            |
| treeCheckable    | Whether to show checkbox                                                        | boolean                              | false         |
| treeShowLine     | Whether to show connecting lines                                                | boolean                              | false         |
| treeShowIcon     | Whether to show icons                                                           | boolean                              | true          |
| treeExpandedKeys | Specify expanded nodes                                                          | string[]                          | []            |
| treeSelectedKeys | Controlled selected Tree nodes                                                  | string[]                          | -             |
| treeCheckedKeys  | Controlled checked Tree nodes                                                   | string[]                          | -             |
| treeCheckStrictly | Whether parent and child checked states are independent                        | boolean                           | false         |
| treeExpandedAll  | Whether all non-leaf nodes are expanded initially                               | boolean                           | false         |

## TreeSelect Events

| Property     | Description                                      | Callback Parameters                                       |
| ------------ | ------------------------------------------------ | --------------------------------------------------------- |
| onTreeSelect | Triggered when tree node is clicked              | (value: string, label: string, selected: boolean) => void |
| onSearch     | Triggered during search                          | (e: InputEvent) => void                                   |
| onChange     | Triggered when the value changes                 | (value: string\|string[]) => void                         |
| onTreeExpand | Triggered when a tree node is expanded           | (result: TreeExpandEvent) => void                         |
| onTreeExpandedKeysChange | Called when Tree expanded keys change | (keys: string[]) => void                    |
| onTreeCheckedKeysChange | Called when Tree checked keys change   | (keys: string[]) => void                    |
| onOpenChange | Triggered when the dropdown expands or collapses | (open: boolean) => void                                   |
| onClear      | Triggered when cleared                           | () => void                                                |
