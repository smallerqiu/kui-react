# Segmented

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
| value | Selected value | string \| number | - |
| defaultValue | Initial selected value | string \| number | - |
| options | Option data | SegmentedOption[] | [] |
| disabled | Disable all options | boolean | false |
| readOnly | Read-only state | boolean | false |
| block | Fill the parent width | boolean | false |
| direction | Layout direction | `horizontal \| vertical` | horizontal |
| size | Size | SizeType | medium |
| shape | Shape | ShapeType | round |
| onChange | Triggered when selection changes | `(value: string \| number) => void` | - |
| renderLabel | Custom option content | `(option, selected) => ReactNode` | - |

### SegmentedOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | Option content | ReactNode | - |
| value | Option value | string \| number | - |
| icon | Option icon | IconType[] | - |
| disabled | Disable this option | boolean | false |
