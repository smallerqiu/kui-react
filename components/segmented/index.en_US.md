# Segmented

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

Switch quickly between mutually exclusive options.

## Examples

[Basic](./demo/basic.tsx)

- Control the selected option with `value` and `onChange`.

[Size and layout](./demo/options.tsx)

- Supports sizes, block layout, vertical layout, and disabled options.

[Options with icons](./demo/icon.tsx)

- Add an icon with `options[].icon`.

[Custom labels](./demo/label.tsx)

- Customize option content with `renderLabel` and respond to its selected state.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected value | `SegmentedValue` | - |
| options | Option data | `SegmentedOption[]` | [] |
| disabled | Disable all options | `boolean` | false |
| readOnly | Read-only state | `boolean` | false |
| block | Fill the parent width | `boolean` | false |
| direction | Layout direction | `"horizontal" \| "vertical"` | horizontal |
| size | Size | `"small" \| "medium" \| "large"` | medium |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | round |
| onChange | Triggered when selection changes | `((value: SegmentedValue) => void)` | - |
| renderLabel | Custom option content | `((option: SegmentedOption, selected: boolean) => React.ReactNode)` | - |

### SegmentedOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | Option content | ReactNode | - |
| value | Option value | string \| number | - |
| icon | Option icon | IconType[] | - |
| disabled | Disable this option | boolean | false |
