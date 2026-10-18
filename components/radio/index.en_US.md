# Radio

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

Radio button.

## When to Use

- Used to select a single state from multiple options.
- The legendary choose one of two.

## Examples

[Single Selection](./demo/basic.tsx)

- When used alone, control the selected state with `checked` and `onChange`.

[Radio Group](./demo/group.tsx)

- You can use the `options` attribute to set options, or use child components to set options.

[Group Layout](./demo/vertical.tsx)

- Group layout.

[Disabled / Controllable](./demo/disabled.tsx)

- Set `disabled` to make it unavailable.

[Combined with Button](./demo/radio-buttons.tsx)

- Combine `RadioGroup` and `RadioButton` for usage.

[Themes](./demo/theme.tsx)

- A radio dot has two tiers, while `type="button"` takes the five tiers a button has; writing no `theme` keeps the buttons' own type-driven look.

## Theme

A radio has two looks: `fill` (a shallow filled dot) and `outline` (a bordered one). Leaving `theme` unset gives `fill`, and every value a radio does not paint falls back to `fill` too. The `outline` edge follows `--kui-theme-outline-border`, then `--kui-control-border`, then `--kui-color-border`.

A `RadioGroup` passes its own `theme` down to every option it renders; an option that states its own `theme` or `size` (a button also has `shape`) keeps it. In the `type="button"` style only `fill` switches to the joined layout with one divider between buttons; every other tier keeps the buttons' own adjacent borders.

## Radio API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | checked state | `boolean` | - |
| label | Text prompt | `string` | - |
| value | Value when used in combination | `string \| number` | - |
| disabled | Whether current item is disabled | `boolean` | false |
| readOnly | Whether current item is read-only | `boolean` | false |
| theme | Component theme | `"fill" \| "outline"` | fill |
| onChange | Callback when option state changes | `((e: ChangeEvent) => void)` | - |

`RadioButton` additionally supports `icon`, `theme`, `size`, and `shape`, and is used through `RadioGroup type="button"`.

Use the standalone [Segmented](../segmented/index.en_US.md) component for slider-style selection. `RadioGroup` no longer supports `theme="card"`.

## RadioButton API

In addition to Radio props, RadioButton supports:

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| icon | Icon definition imported from `kui-icons` | `IconType[]` | - |
| theme | Button appearance | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | - |
| size | Button size | `"small" \| "medium" \| "large"` | - |
| shape | Button shape | `"round" \| "default" \| "square" \| "circle"` | - |

## RadioGroup API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | selected value | `T` | - |
| disabled | Disable the entire group | `boolean` | false |
| readOnly | Whether the group is read-only | `boolean` | false |
| size | Button size | `"small" \| "medium" \| "large"` | - |
| direction | Layout direction | `"inline" \| "horizontal" \| "vertical"` | horizontal |
| shape | Button shape | `"round" \| "default" \| "square" \| "circle"` | - |
| theme | Radio option appearance; the button's theme when `type="button"` | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | - |
| onChange | Triggered when option state changes, returns currently selected item | `((value: T) => void)` | - |
| options | Can specify child `radio` items | `RadioOption[]` | - |
| type | Use radio or button-style items | `"button" \| "radio"` | radio |
