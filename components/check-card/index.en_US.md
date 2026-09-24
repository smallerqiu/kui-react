# CheckCard

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

Present richer choices with a title, description, and optional symbol.

## When to Use

- Use standalone for a toggleable boolean choice, such as accepting an agreement.
- Use inside `CheckCardGroup` for a single choice among multiple cards, such as an account or plan type.

## Examples

[Standalone](./demo/basic.tsx?show=vertical)

- A standalone card can be selected and deselected.

[Single-selection group](./demo/group.tsx?show=vertical)

- Groups use radio semantics and support arrow-key navigation.

[Custom symbol](./demo/custom.tsx?show=vertical)

- Use the `symbol` and `checkedSymbol` properties to set card icons.

[Appearance and disabled](./demo/appearance.tsx?show=vertical)

- Themes, sizes, shapes, and disabled states.

## CheckCard API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | checked state | `boolean` | - |
| value | Option value inside a group | `import("./types").CheckCardValue` | - |
| title | Title | `React.ReactNode` | - |
| description | Description | `React.ReactNode` | - |
| symbol | Unchecked symbol | `import("../icon").IconType[]` | - |
| checkedSymbol | Checked symbol | `import("../icon").IconType[]` | - |
| showIndicator | Whether to show the indicator | `boolean` | true |
| disabled | Whether disabled | `boolean` | false |
| readOnly | Whether read-only | `boolean` | false |
| theme | Theme | `"fill" \| "outline"` | outline |
| size | Size | `"small" \| "medium" \| "large"` | medium |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | round |
| onChange | State change callback | `((event: import("./types").CheckCardChangeEvent) => void)` | - |

## CheckCardGroup API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | value | `CheckCardValue` | - |
| options | Options | `import("./types").CheckCardOption[]` | - |
| disabled | Whether disabled | `boolean` | false |
| readOnly | Whether read-only | `boolean` | false |
| direction | Layout direction | `"horizontal" \| "vertical"` | horizontal |
| theme | Card theme | `"fill" \| "outline"` | outline |
| size | Card size | `"small" \| "medium" \| "large"` | medium |
| shape | Card shape | `"round" \| "default" \| "square" \| "circle"` | round |
| onChange | Selected value callback | `((value: CheckCardValue) => void)` | - |

## CheckCardOption

| Property      | Description                      | Type             | Default |
| ------------- | -------------------------------- | ---------------- | ------- |
| value         | Option value                     | string \| number | -       |
| title         | Title                            | ReactNode        | -       |
| description   | Description                      | ReactNode        | -       |
| symbol        | Unchecked symbol                 | IconType[]       | -       |
| checkedSymbol | Checked symbol                   | IconType[]       | -       |
| disabled      | Whether this option is disabled  | boolean          | false   |
| readOnly      | Whether this option is read-only | boolean          | false   |
