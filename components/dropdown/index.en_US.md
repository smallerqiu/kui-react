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

[Multi-level Menu](./demo/cascading.tsx)

- The passed menu has multiple levels.

## Dropdown API

| Property     | Description                                                                         | Type                | Default     |
| ------------ | ----------------------------------------------------------------------------------- | ------------------- | ----------- |
| open         | Controlled visibility                                                              | boolean             | -           |
| show         | Deprecated; use `open` instead                                                     | boolean             | -           |
| defaultOpen  | Initial visibility in uncontrolled mode                                            | boolean             | false       |
| trigger      | Trigger method. Supports 3 methods: hover (default), click, custom                  | string              | hover       |
| placement    | Menu popup position: bottomLeft bottomCenter bottomRight topLeft topCenter topRight | string              | bottom-left |
| theme        | The component renders the theme, defaulting to 'fill'.                              | string              | fill        |
| arrow        | Whether to display the arrow                                                        | boolean                | false       |
| target       | Element that triggers the dropdown                                                  | ReactNode               | -           |
| disabled     | Whether dropdown triggering is allowed                                              | boolean                | false       |
| onOpenChange | Triggered when opening or closing a Dropdown                                        | (opened:boolean)=>void | -           |
| overlay      | Dropdown overlay content                                                           | ReactNode           | -           |

## DropdownButton API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| size | Button size | SizeType | - |
| shape | Button shape | ShapeType | - |
| disabled | Whether disabled | boolean | false |
| icon | Dropdown trigger icon | IconType | Ellipsis |
| theme | Button theme | ThemeType | - |
| arrow | Whether to show the dropdown arrow | boolean | false |
| placement | Dropdown placement | DropPlacementsType | bottom-right |
| onClick | Main button click callback | (event: MouseEvent<HTMLButtonElement>) => void | - |
| overlay | Dropdown overlay content | ReactNode | - |
