# Collapse

Content area that can be collapsed/expanded.

## When to Use

- Grouping and hiding complex areas to keep the page tidy.
- 'Accordion' is a special type of collapse panel that only allows a single content area to be expanded.

## Examples

[Basic Usage](./demo/basic.tsx)

- By default, one or multiple panels can be expanded at the same time.

[Accordion](./demo/accordion.tsx)

- Set `accordion` to allow only one panel to be expanded at a time.

[Nested Panels](./demo/nesting.tsx)

- Nested collapse panels.

[Extra Nodes](./demo/extra.tsx)

- Multiple panels can be expanded simultaneously.

[Simple Mode](./demo/sample.tsx)

- Set `sample` to display a borderless, minimal style.

## API

| Property  | Description                                                                                 | Type                            | Default |
| --------- | ------------------------------------------------------------------------------------------- | ------------------------------- | ------- |
| openKeys  | The `name` of the currently expanded panels                                             | string[]                        | -       |
| defaultOpenKeys | Initially expanded panel names in uncontrolled mode                              | string[]                        | []      |
| accordion | Whether to enable accordion mode. When enabled, at most one panel can be expanded at a time | boolean                            | false   |
| sample    | Whether to enable simple mode                                                               | boolean                            | false   |
| theme     | Theme                                                                                       | ThemeType                          | -       |
| shape     | Shape                                                                                       | ShapeType                          | -       |
| onChange  | Callback triggered when switching panels, returns the `name` of the current tab             | (key: string \| number) => void | -       |
| onOpenKeysChange | Callback with all expanded keys when expansion changes                           | (keys: (string \| number)[]) => void | - |

## Panel

| Property | Description                             | Type   | Default |
| -------- | --------------------------------------- | ------ | ------- |
| title    | The title of the currently active panel | string | -       |
| key      | Unique identifier of the panel          | string | -       |
| extra    | Card title extension                    | ReactNode   | -       |
