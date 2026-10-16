# Checkbox

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

Checkbox for multiple selections.

## When to Use

- When making multiple selections from a set of options.
- Used alone, it can represent switching between two states, similar to a switch. The difference is that switching a switch directly triggers a state change, while a checkbox is generally used for state marking and needs to cooperate with submission operations.

## Examples

[Single Selection](./demo/basic.tsx)

- When used alone, control the checked state with `checked` and `onChange`.

[Multiple Selection](./demo/group.tsx)

- You can use the `options` property to define options, or use child components instead.

[Group Layout](./demo/group-layout.tsx)

- Group layout.

[Disabled / Controlled](./demo/disabled.tsx)

- Set disabled state via `disabled`.

[Select All](./demo/check-all.tsx)

- Select-all combination.

## Theme

A check box has two looks: `fill` (a shallow filled square) and `outline` (a bordered one). Leaving `theme` unset gives `fill`, and every value a check box does not paint falls back to `fill` too. The `outline` edge follows `--kui-theme-outline-border`, then `--kui-control-border`, then `--kui-color-border`.

A `CheckboxGroup` passes its own `theme` down to every box it renders, and a stand-alone box inherits from `ConfigProvider`; the checked and disabled states always win over the tier.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | checked state | `boolean` | - |
| label | Content to display | `React.ReactNode` | - |
| value | Value represented in a group | `unknown` | - |
| disabled | Whether the current item is disabled | `boolean` | false |
| readOnly | Whether the current item is read-only | `boolean` | false |
| indeterminate | Combined auxiliary option controls the indeterminate state | `boolean` | false |
| theme | Component theme | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| valueType | Standalone output value type | `"string" \| "number" \| "boolean"` | boolean |
| onChange | Callback when the option state changes | `((e: ChangeEvent) => void)` | - |

## CheckboxGroup API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | selected values | `T[]` | - |
| disabled | Whether the component is disabled | `boolean` | false |
| readOnly | Whether the component is read-only | `boolean` | false |
| onChange | Triggered when the option state changes, returns the currently selected values | `((value: T[]) => void)` | - |
| direction | Layout direction | `"inline" \| "horizontal" \| "vertical"` | horizontal |
| options | Can specify child `checkbox` items | `CheckboxOption<string \| number>[]` | - |
| theme | Component theme | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| size | Checkbox size | `"small" \| "medium" \| "large"` | - |

Each item in `options` also supports `disabled` and `readOnly`.
