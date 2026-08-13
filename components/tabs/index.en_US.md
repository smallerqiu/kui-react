# Tabs

Tab switching component.

## When to Use

Provide peer areas to accommodate and display large chunks of content, keeping the interface clean.

- Card-style tabs, providing closable styles, often used at the top of containers.
- Standard line-style tabs, used for main function switching inside containers, this is the most commonly used Tabs.

## Examples

[Basic Usage](./demo/basic.tsx)

- The first item is selected by default.

[Disabled](./demo/disabled.tsx)

- Disable a specific tab.

[Centered](./demo/centered.tsx)

- Tabs are centered.

[Icon](./demo/icon.tsx)

- Tabs with icons.

[Extra Content](./demo/extra.tsx)

- You can add extra operations to the right of the tabs.

[Card-style Tabs](./demo/card.tsx)

- Another style of tabs.

[Add and Close Tabs](./demo/closable.tsx)

- Only card-style tabs support adding and closing options. Use `closable={false}` to disable closing.

[Minimalist Tabs](./demo/sample.tsx)

- Simple card presentation mode.

## Tabs API

| Property   | Description                                                     | Type                  | Default |
| ---------- | --------------------------------------------------------------- | --------------------- | ------- |
| value      | Currently active tab panel's key                                | string, number        | -       |
| defaultValue | Initially active key in uncontrolled mode                      | string, number        | First panel |
| card       | Whether tab style is card style                                 | bool                  | false   |
| sample     | Whether tab style is simple style                               | bool                  | false   |
| animated   | Whether to use animation to switch Tabs                         | bool                  | true    |
| centered   | Whether to center the label                                     | bool                  | false   |
| onRemove   | Callback when tab is closed, returns the closed tab's key value | (key: string) => void | -       |
| onChange   | Callback when switching panels                                  | (key: string) => void | -       |
| onTabClick | Callback when tab is clicked                                    | (key: string) => void | -       |

## Tabs.TabPanel API

| Property | Description                    | Type   | Default |
| -------- | ------------------------------ | ------ | ------- |
| key      | Unique identifier of the panel | string | -       |
| title    | Text displayed in tab header   | string | -       |
| icon     | Icon displayed in tab header   | string | -       |
| disabled | Whether tab is disabled        | bool   | false   |
| closable | Whether tab shows close button | bool   | false   |
