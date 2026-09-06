# Menu

Navigation menu list for pages and functions.

## When to Use

The navigation menu is the soul of a website. Users rely on navigation to jump between pages. Generally divided into top navigation and side navigation. Top navigation provides global categories and functions, while side navigation provides a multi-level structure to accommodate and arrange the website architecture.

## Examples

[Top Navigation](./demo/basic.tsx?show=vertical)

- Horizontal top navigation menu.

[Inline Menu](./demo/inline.tsx?show=vertical)

- Vertical menu, with submenus embedded within the menu area.

[Expand Only Current Parent Menu](./demo/accordion.tsx?show=vertical)

- Clicking a menu item collapses all other expanded menus, keeping the menu focused and clean.

[Vertical Menu](./demo/vertical.tsx?show=vertical)

- Submenus appear as popups.

[Theme](./demo/theme.tsx?show=vertical)

- Supports local `light|dark` themes and inherits the global theme when omitted.

[Switch Menu Type](./demo/mode.tsx?show=vertical)

- Demonstrates dynamic mode switching.

[Collapsible Inline Menu](./demo/collapsed.tsx?show=vertical)

- Inline menus can be collapsed/expanded.

## API

### MenuAPI

| Property         | Description                                          | Type                                   | Default    |
| ---------------- | ---------------------------------------------------- | -------------------------------------- | ---------- |
| value            | Currently selected menu items                        | string[]                               | -          |
| defaultValue     | Initially selected menu items in uncontrolled mode   | string[]                               | []         |
| theme            | Local theme; inherits global theme when omitted      | `light` \| `dark`                      | -          |
| items            | Menu data                                            | MenuOptionsProps[]                     | -          |
| openKeys         | Currently expanded SubMenu menu item key array       | string[]                               | -          |
| defaultOpenKeys  | Initially expanded SubMenu keys in uncontrolled mode | string[]                               | []         |
| selectedKeys     | Currently selected menu items                        | string[]                               | -          |
| mode             | Menu type                                            | `vertical` \| `horizontal` \| `inline` | `vertical` |
| onSelect         | Called when MenuItem is clicked                      | (data: MenuSelectEvent) => void        | -          |
| onOpenChange     | Callback when SubMenu expands/collapses              | (openKeys: string[]) => void           | -          |
| onChange         | Called when the selected key collection changes      | (selectedKeys: string[]) => void       | -          |
| accordion        | Whether only one menu item can be expanded           | boolean                                | false      |
| inlineCollapsed  | Whether the menu is collapsed in inline mode         | boolean                                | false      |
| collapsedTooltip | Whether leaf items show a tooltip when collapsed     | boolean                                | true       |

### Menu(items)

| Property | Description                | Type               | Default |
| -------- | -------------------------- | ------------------ | ------- |
| icon     | Item icon                  | IconType           | -       |
| disabled | Whether disabled           | boolean            | false   |
| key      | Unique identifier for item | string             | -       |
| title    | Menu item content          | ReactNode          | -       |
| children | Menu children              | MenuOptionsProps[] | -       |

### MenuItem

| Property | Description                | Type                  | Default |
| -------- | -------------------------- | --------------------- | ------- |
| icon     | Item icon                  | IconType \| ReactNode | -       |
| disabled | Whether disabled           | boolean               | false   |
| itemKey  | Unique identifier for item | string                | -       |
| title    | Menu item content          | ReactNode             | -       |

### SubMenu

| Property | Description                | Type      | Default |
| -------- | -------------------------- | --------- | ------- |
| icon     | Item icon                  | IconType  | -       |
| disabled | Whether disabled           | boolean   | false   |
| itemKey  | Unique identifier for item | string    | -       |
| title    | Submenu item content       | ReactNode | -       |

### MenuGroup

| Property | Description | Type      | Default |
| -------- | ----------- | --------- | ------- |
| title    | Group title | ReactNode | -       |
