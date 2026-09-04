# Input

Input content via mouse or keyboard, the most basic wrapper for form fields.

## When to Use

- When user input is required for form fields.
- Provides combined input fields, searchable input fields, and size selection.

## Examples

[Basic Usage](./demo/basic.tsx)

- Use `value` and `onChange` to control the input value.

[Theme](./demo/theme.tsx)

- Use `theme` to set the theme, and `shape` for rounded corners.

[With Icon](./demo/icon.tsx)

- By setting the `icon` attribute, you can add an icon to the input field, which is only effective for `input`. This allows for quick implementation of features like password visibility toggle or search.

[Extension, Prefix and Suffix](./demo/suffix.tsx?show=vertical)

- suffix, prefix extension.

[Input Group](./demo/group.tsx?show=vertical)

- Use `InputGroup` to tightly connect components and merge borders. Default is `true`.

[Size](./demo/size.tsx)

- `large` for large size, `small` for small size.

[Events](./demo/event.tsx)

- This example tests whether component events are triggered normally.

[Textarea](./demo/textarea.tsx)

- Control the number of rows via `rows`.

## Input API

| Property            | Description                                                         | Type                    | Default |
| ------------------- | ------------------------------------------------------------------- | ----------------------- | ------- |
| value               | Controlled input value                                              | string, number          | -       |
| defaultValue        | Initial input value in uncontrolled mode                            | string, number          | ""      |
| size                | Button size, optional values `small`, `large`, default not selected | string                  | -       |
| icon                | Input box icon                                                      | string                  | -       |
| suffix              | Extension suffix                                                    | string, ReactNode       | -       |
| prefix              | Extension prefix                                                    | string, ReactNode       | -       |
| theme               | The theme of Input                                                  | string                  | fill    |
| shape               | Input shape                                                         | ShapeType               | -       |
| inputType           | Custom style class prefix                                           | string                  | input   |
| controls            | Control area used by components such as InputNumber                 | ReactNode               | -       |
| disabled            | Whether the input is disabled                                       | boolean                 | false   |
| multiple            | Whether native multiple input is enabled                            | boolean                 | false   |
| clearable           | Whether to show the clear button                                    | boolean                 | false   |
| visiblePasswordIcon | Whether to show the toggle button or control password visibility    | boolean                 | true    |
| onSearch            | Search event callback                                               | (value: string) => void | -       |
| onIconClick         | Callback for icon click event                                       | (e: Event) => void      | -       |
| onClear             | Callback for pressing the clear button                              | () => void              | -       |
| onChange            | Callback when the input box content changes                         | (value: string) => void | -       |

## Input Group API

| Property | Description                                                                         | Type    | Default |
| -------- | ----------------------------------------------------------------------------------- | ------- | ------- |
| block    | Whether to inherit the parent width                                                 | boolean | false   |
| compact  | Whether to use compact mode                                                         | boolean | false   |
| size     | Spacing of child components, optional values `small`, `large`, default not selected | string  | -       |

## TextArea API

| Property     | Description                                                  | Type                    | Default |
| ------------ | ------------------------------------------------------------ | ----------------------- | ------- |
| value        | Controlled input value                                       | string, number          | -       |
| defaultValue | Initial value in uncontrolled mode                           | string, number          | ""      |
| size         | Size, optional values `small`, `large`, default not selected | string                  | -       |
| theme        | Theme                                                        | ThemeType               | fill    |
| shape        | Shape                                                        | ShapeType               | -       |
| rows         | Default row count                                            | number                  | 2       |
| disabled     | Whether disabled                                             | boolean                 | false   |
| onChange     | Callback when the content changes                            | (value: string) => void | -       |
