# Input

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

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

- `prefix` and `suffix` render inside the input and accept JSX nodes. `addonBefore` and `addonAfter` render outside the input.

[Input Group](./demo/group.tsx?show=vertical)

- Use `InputGroup` to tightly connect components and merge borders. Default is `true`.

[Size](./demo/size.tsx)

- `large` for large size, `small` for small size.

[Events](./demo/event.tsx)

- This example tests whether component events are triggered normally.

[Textarea](./demo/textarea.tsx)

- Control the number of rows via `rows`.

## Input API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | input value | `string \| number \| readonly string[]` | - |
| size | Button size, optional values `small`, `large`, default not selected | `"small" \| "medium" \| "large"` | - |
| icon | Input box icon | `IconType[]` | - |
| suffix | Inline suffix | `React.ReactNode` | - |
| prefix | Inline prefix | `React.ReactNode` | - |
| addonBefore | Addon before the input | `React.ReactNode` | - |
| addonAfter | Addon after the input | `React.ReactNode` | - |
| theme | The theme of Input | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| shape | Input shape | `"round" \| "default" \| "square" \| "circle"` | - |
| inputType | Custom style class prefix | `string` | input |
| controls | Control area used by components such as InputNumber | `React.ReactNode` | - |
| disabled | Whether the input is disabled | boolean | false |
| multiple | Whether native multiple input is enabled | boolean | false |
| clearable | Show the clear button on hover when a value exists | `boolean` | true |
| visiblePasswordIcon | Whether to show the toggle button or control password visibility | `boolean` | true |
| onSearch | Search event callback | `((value: string) => void)` | - |
| onIconClick | Callback for icon click event | `((e: React.MouseEvent) => void)` | - |
| onClear | Callback for pressing the clear button | `(() => void)` | - |
| onChange | Callback when the input box content changes | `((value: string) => void)` | - |

## Input Group API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| block | Whether to inherit the parent width | boolean | false |
| compact | Whether to use compact mode | boolean | true |
| size | Spacing of child components, optional values `small`, `large`, default not selected | `"small" \| "medium" \| "large"` | - |

## TextArea API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | input value | `string \| number \| readonly string[]` | - |
| size | Size, optional values `small`, `large`, default not selected | `"small" \| "medium" \| "large"` | - |
| theme | Theme | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | - |
| rows | Default row count | number | 2 |
| disabled | Whether disabled | boolean | false |
| onChange | Callback when the content changes | `((value: string) => void)` | - |
