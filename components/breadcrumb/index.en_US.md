# Breadcrumb

Displays the current page's position in the system hierarchy and allows navigation upwards.

## When to Use

- When the system has more than two levels of hierarchy.
- When you need to inform the user 'where you are'.
- When upward navigation functionality is needed.

## Examples

[Basic Usage](./demo/basic.tsx)

- Add navigation links via `href`.

[Set Icon](./demo/icon.tsx)

- Set the icon via `icon`.

[Separator](./demo/separator.tsx)

- Set the separator via `separator`.

## BreadcrumbItem API

| Property  | Description                                                                   | Type   | Default |
| --------- | ----------------------------------------------------------------------------- | ------ | ------- |
| separator | Custom separator                                                              | string | /       |
| href      | Custom link function                                                          | string | -       |
| replace   | When routing jumps, enabling `replace` will not add a new record to `history` | boolean   | false   |
| icon      | Button icon                                                                   | string | -       |
