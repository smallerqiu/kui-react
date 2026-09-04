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

| Property         | Description                                    | Type                                 | Default |
| ---------------- | ---------------------------------------------- | ------------------------------------ | ------- |
| openKeys         | Expanded panel keys in controlled mode         | (string \| number)[]                 | -       |
| defaultOpenKeys  | Initially expanded keys in uncontrolled mode   | (string \| number)[]                 | []      |
| accordion        | Whether at most one panel can be expanded      | boolean                              | false   |
| sample           | Whether to enable simple mode                  | boolean                              | false   |
| theme            | Theme                                          | ThemeType                            | outline |
| shape            | Shape                                          | ShapeType                            | round   |
| onChange         | Called with the key of the panel being toggled | (key: string \| number) => void      | -       |
| onOpenKeysChange | Called with all expanded keys after a change   | (keys: (string \| number)[]) => void | -       |

## Panel

| Property | Description                    | Type             | Default |
| -------- | ------------------------------ | ---------------- | ------- |
| title    | Panel title                    | ReactNode        | -       |
| key      | Unique panel identifier        | string \| number | -       |
| disabled | Whether the panel is disabled  | boolean          | false   |
| extra    | Extra content beside the title | ReactNode        | -       |
