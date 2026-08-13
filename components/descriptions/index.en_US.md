# Descriptions

Display multiple read-only fields in groups.

## When to Use

Commonly seen in detail page information display.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Simple display.

[Bordered](./demo/bordered.tsx?show=vertical)

- List with borders and background colors.

[Custom Size](./demo/size.tsx?show=vertical)

- Customize the size to adapt to various containers.

[Vertical](./demo/vertical.tsx?show=vertical)

- Vertical list.

[Vertical Bordered](./demo/vertical-bordered.tsx?show=vertical)

- Vertical list with borders and background colors.

## API

| Property | Description                                                                     | Type                       | Default    |
| -------- | ------------------------------------------------------------------------------- | -------------------------- | ---------- |
| bordered | Whether to show the border                                                      | bool                       | false      |
| column   | The number of DescriptionItems in one row                                       | number                     | 3          |
| extra    | The operation area of the description list, displayed in the upper right corner | string, ReactNode               | -          |
| layout   | Description layout                                                              | horizontal \| vertical     | horizontal |
| size     | Set the size of the list. Can be set to medium, small                           | default \| medium \| small | default    |
| title    | The title of the description list, displayed at the very top                    | string, ReactNode               | -          |

## Item props

| Property | Description                 | Type           | Default |
| -------- | --------------------------- | -------------- | ------- |
| label    | Description of the content  | string \| ReactNode | -       |
| span     | number of columns displayed | number         | 1       |
| type     | Show title or content       | string         | -       |
