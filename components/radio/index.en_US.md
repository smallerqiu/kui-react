# Radio

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

## Radio API

| Property       | Description                                | Type                     | Default |
| -------------- | ------------------------------------------ | ------------------------ | ------- |
| checked        | Controlled checked state                   | boolean                  | -       |
| defaultChecked | Initial checked state in uncontrolled mode | boolean                  | false   |
| label          | Text prompt                                | string                   | -       |
| value          | Value when used in combination             | string \| number         | -       |
| disabled       | Whether current item is disabled           | boolean                  | false   |
| readOnly       | Whether current item is read-only          | boolean                  | false   |
| onChange       | Callback when option state changes         | (e: ChangeEvent) => void | -       |

`RadioButton` additionally supports `icon`, `theme`, `size`, and `shape`, and is used through `RadioGroup type="button"`.

Use the standalone [Segmented](../segmented/index.en_US.md) component for slider-style selection. `RadioGroup` no longer supports `theme="card"`.

## RadioGroup API

| Property     | Description                                                          | Type                              | Default    |
| ------------ | -------------------------------------------------------------------- | --------------------------------- | ---------- |
| value        | Controlled selected value                                            | string \| number                  | -          |
| defaultValue | Initial selected value in uncontrolled mode                          | string \| number                  | -          |
| disabled     | Disable the entire group                                             | boolean                           | false      |
| readOnly     | Whether the group is read-only                                       | boolean                           | false      |
| size         | Button size                                                          | SizeType                          | -          |
| direction    | Layout direction                                                     | 'horizontal' \| 'vertical'        | horizontal |
| shape        | Button shape                                                         | ShapeType                         | -          |
| theme        | Button theme                                                         | ThemeType                         | -          |
| onChange     | Triggered when option state changes, returns currently selected item | (value: string \| number) => void | -          |
| options      | Can specify child `radio` items                                      | RadioOption[]                     | -          |
| type         | Use radio or button-style items                                      | 'radio' \| 'button'               | radio      |
