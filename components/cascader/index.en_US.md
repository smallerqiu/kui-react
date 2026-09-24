# Cascader

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

A cascading selection box.

## When to Use

- Used for selecting from a set of related data collections, such as provinces/cities/districts, company hierarchies, or category classifications.
- Ideal for selecting from large datasets by separating them into multiple hierarchical levels for easier navigation.
- Offers a better user experience compared to the Select component by allowing selections to be completed within a single floating layer.

## Examples

[Basic](./demo/basic.tsx)

- The most basic cascader usage. Enable `showAllLevels` to display the complete administrative path selected by the user in the input box.

[Trigger and Levels](./demo/hover.tsx)

- Hover trigger + Display only the last level. In e-commerce back-office systems when managing products or publishing listings, category trees are often extremely deep. Using `expandTrigger="hover"` significantly reduces the number of clicks required, while `showAllLevels="false"` keeps the interface cleaner after selection.

[Disabled](./demo/disabled.tsx)

- When assigning system permissions or dispatching work orders, certain departments or inactive sub-branches (e.g., subsidiaries under rectification) need to be grayed out entirely. Utilizing the `disabled` property allows locking all paths underneath with one setting.

[Async Loading](./demo/async.tsx)

- Load child options on demand. Loading state is shown and failed loads can be retried.

[Size](./demo/size.tsx)

- Demonstrates the component's strong visual adaptability across different `size` constraints, suitable for various layouts such as compact modal forms or spacious configuration panels.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | array of path values (e.g., `['zhejiang', 'hangzhou', 'xihu']`). | `CascaderValue` | - |
| open | dropdown visibility. | `boolean` | - |
| theme | Component theme. | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | `fill` |
| bordered | Whether to display the border. | `boolean` | `true` |
| shape | Component shape. | `"round" \| "default" \| "square" \| "circle"` | - |
| showArrow | Whether to display the dropdown arrow. | `boolean` | `true` |
| icon | Custom prefix icon. | `import("../icon").IconType[]` | - |
| arrowIcon | Custom dropdown arrow. | `import("../icon").IconType[]` | - |
| emptyText | Empty-state text. | `string` | - |
| loadData | Loads children asynchronously; return them or update `option.children` | `import("./types").CascaderLoadData` | - |
| placement | Popup placement. | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | `bottom-left` |
| onChange | Called when a path is selected or cleared. | `((value: CascaderValue) => void)` | - |
| onExpandChange | Called when the expanded path changes. | `((value: CascaderValue) => void)` | - |
| onOpenChange | Called when dropdown visibility changes. | `((open: boolean) => void)` | - |
| options | Tree-structured data source for cascading options. | `CascaderOption[]` | `[]` |
| placeholder | Fallback placeholder text displayed when no path is selected. | `string` | `"Please select"` |
| disabled | Whether to completely disable interaction for the entire component. | `boolean` | `false` |
| readOnly | Whether the component is read-only. | `boolean` | `false` |
| clearable | Whether to support clearing the selected path with one click. | `boolean` | `true` |
| size | Size specification of the component. Options: `'large'` \| `'small'` \| `undefined`. | `"small" \| "medium" \| "large"` | `undefined` |
| expandTrigger | Interaction mode for expanding the next-level menu. Options: `'click'` or `'hover'`. | `"hover" \| "click"` | `'click'` |
| showAllLevels | Whether to display the full selected ancestor path. If `false`, only the final leaf node is shown in the input box. | `boolean` | `true` |
| separator | Separator between labels of different levels when `showAllLevels` is enabled. | `string` | `" / "` |

## CascaderOption

When configuring the `options` data source for `Cascader`, each node must conform to the `CascaderOption` object specification. It supports infinite nesting:

| Property | Description                                                                                                                                                                  | Type               | Default     |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- | :---------- |
| value    | **Required.** Unique identifier for the current node (often corresponds to backend `id` or `code`). The selected path is composed of these values.                           | `string \| number` | -           |
| label    | **Required.** Plain text content displayed to users in the dropdown menu and input box (e.g., `"Zhejiang"`, `"Hangzhou"`).                                                   | `string`           | -           |
| disabled | Whether to disable the current option. When enabled, the row appears grayed out and unclickable, and all its child levels will be locked synchronously.                      | `boolean`          | `false`     |
| children | Data source for the next-level child nodes. When this property exists and the array is not empty, a right-facing expansion arrow is automatically rendered on the component. | `CascaderOption[]` | `undefined` |
| isLeaf   | Whether this is a leaf node. Set to `false` when children can be loaded.                                                                                                     | `boolean`          | `undefined` |
