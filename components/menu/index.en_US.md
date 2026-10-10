# Menu

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

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

[Groups and Dividers](./demo/group.tsx?show=vertical)

- Use `MenuGroup` to classify menu items and `MenuDivider` to insert a separator.

## API

### MenuAPI

| Property         | Description                                      | Type                                   | Default    |
| ---------------- | ------------------------------------------------ | -------------------------------------- | ---------- |
| value            | Currently selected menu items                    | string[]                               | -          |
| theme            | Local theme; inherits global theme when omitted  | `light` \| `dark`                      | -          |
| items            | Menu data                                        | MenuOptionsProps[]                     | -          |
| openKeys         | Currently expanded SubMenu menu item key array   | string[]                               | -          |
| selectedKeys     | Currently selected menu items                    | string[]                               | -          |
| mode             | Menu type                                        | `vertical` \| `horizontal` \| `inline` | `vertical` |
| onSelect         | Called when MenuItem is clicked                  | (data: MenuSelectEvent) => void        | -          |
| onOpenChange     | Callback when SubMenu expands/collapses          | (openKeys: string[]) => void           | -          |
| onChange         | Called when the selected key collection changes  | (selectedKeys: string[]) => void       | -          |
| accordion        | Whether only one menu item can be expanded       | boolean                                | false      |
| inlineCollapsed  | Whether the menu is collapsed in inline mode     | boolean                                | false      |
| collapsedTooltip | Whether leaf items show a tooltip when collapsed | boolean                                | true       |

### Menu(items)

| Property | Description                | Type               | Default |
| -------- | -------------------------- | ------------------ | ------- |
| icon     | Item icon                  | IconType           | -       |
| disabled | Whether disabled           | boolean            | false   |
| key      | Unique identifier for item | string             | -       |
| title    | Menu item content          | ReactNode          | -       |
| children | Menu children              | MenuOptionsProps[] | -       |

### MenuItem

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| icon | Item icon | `React.ReactNode \| IconType[]` | - |
| disabled | Whether disabled | `boolean` | false |
| onClick | Called when the menu item is activated | `React.MouseEventHandler<HTMLLIElement>` | - |
| itemKey | Unique identifier for item | `string` | - |
| title | Menu item content | `React.ReactNode` | - |

### SubMenu

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| icon | Item icon | `IconType[]` | - |
| disabled | Whether disabled | `boolean` | false |
| itemKey | Unique identifier for item | `string` | - |
| title | Submenu item content | `React.ReactNode` | - |

### MenuGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Group title | `React.ReactNode` | - |

### MenuDivider

Has no properties. Rendered as a child of `Menu` or `SubMenu`, it draws a separator line.

## Conventions

- The `items` data structure can only express nested menus; it cannot express groups or separators. Use the children form (see "Groups and Dividers") when you need `MenuGroup` or `MenuDivider`.
- `openKeys` is the set of currently expanded SubMenus and applies to every `mode`: in `inline` it controls the embedded expansion, in `horizontal`/`vertical` it controls whether the matching popup is shown. Switching `mode` never rewrites the expanded state and never emits an extra `onOpenChange`.
- `inlineCollapsed` only applies when `mode="inline"`; passing it in other modes does not change the presentation. Collapsing temporarily hides the inline expansion and expanding restores it; popup expansions opened while collapsed are kept internally and close when an item is selected.
- While the menu is collapsed, an `openKeys` value coming from the parent is written into the expansion memory and takes effect once the menu widens. Values this component reports itself and receives back as props — the collapsed popup path, and the closure after selecting an item — never overwrite that memory. Restoring the expansion reports it once.
- `value` follows the library-wide controlled convention described at the top of this page. `selectedKeys` is fully external — the selection only changes when `onChange` feeds a new value back. When both are provided, `value` wins.
- Selecting an item reports "ancestor SubMenu keys + the item key" through `onChange` and `value`, so parent menus stay highlighted. Clicking an already selected item does not deselect it.
- Popups render under `body` and are linked to their trigger through `aria-controls` / `aria-labelledby`.
- The root of a `mode="horizontal"` menu is `role="menubar"` (arrow keys move sideways between siblings) while `vertical`/`inline` use `role="menu"` (arrow keys move up/down). Submenu lists always declare `aria-orientation="vertical"`, and the wrapper `li` is `role="none"` so it carries no semantics.
- Opening submenus with the keyboard: `ArrowDown` on a submenu item of a `menubar` (the `horizontal` root) and `ArrowRight` on one inside a `vertical`/`inline` list expands it and moves focus straight to the first usable item of the child list; while closed, `Enter`/`Space` behave like a click and also expand. Inside an open list `Escape` unwinds exactly that level and returns focus to its trigger, so the parent stays open. Disabled items are skipped both when choosing the first item and when walking siblings.
