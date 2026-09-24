# Dropdown

A list that drops down.

## When to Use

When there are too many operation commands on the page, this component can be used to accommodate operation elements. Clicking or hovering over the trigger point will display a dropdown menu. Selections can be made in the list, and corresponding commands can be executed.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest dropdown menu.

[Right-click menu](./demo/right-menu.tsx?show=vertical)

- By default, the menu is triggered by hovering, but it can also be triggered by clicking the right mouse button.

[Button with a dropdown menu](./demo/dropdown-buttons.tsx)

- On the left is the button, and on the right is an additional related function menu. The icon property can be set to modify the icon on the right.

[Other Elements](./demo/divider.tsx)

- Dividers and disabled menu items.

[Popup Position](./demo/placement.tsx)

- Supports 6 popup positions.

[Arrow](./demo/arrow.tsx)

- Set `arrow` to display an arrow pointing to the trigger.

[Multi-level Menu](./demo/cascading.tsx)

- The passed menu has multiple levels.

## Dropdown API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| open | visibility | `boolean` | - |
| show | Deprecated; use `open` instead | `boolean` | - |
| trigger | Trigger method | `"hover" \| "click" \| "contextmenu"` | `hover` |
| placement | Dropdown placement | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | `bottom-left` |
| arrow | Whether to display the arrow | `boolean` | false |
| target | Ref of an external trigger element | `React.RefObject<HTMLElement \| null>` | - |
| disabled | Whether dropdown triggering is allowed | `boolean` | false |
| onOpenChange | Triggered when opening or closing a Dropdown | `((opened: boolean) => void)` | - |
| overlay | Dropdown overlay content | `React.ReactNode` | - |

## DropdownButton API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| size | Button size | `"small" \| "medium" \| "large"` | - |
| shape | Button shape | `"round" \| "default" \| "square" \| "circle"` | - |
| disabled | Whether disabled | `boolean` | false |
| icon | Dropdown trigger icon | `IconType[]` | Ellipsis |
| theme | Button theme | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | - |
| arrow | Whether to show the dropdown arrow | `boolean` | false |
| placement | Dropdown placement | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | bottom-right |
| onClick | Main button click callback | `((e: React.MouseEvent<HTMLButtonElement>) => void)` | - |
| overlay | Dropdown overlay content | `React.ReactNode` | - |
