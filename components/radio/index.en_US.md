# Radio

Radio button.

## When to Use

- Used to select a single state from multiple options.
- The legendary choose one of two.

## Examples

[Single Selection](./demo/basic.tsx)

- When used alone, control the selected state with `checked` and `onChange`.

[Multiple Selection](./demo/group.tsx)

- You can use the `options` attribute to set options, or use child components to set options.

[Group Layout](./demo/vertical.tsx)

- Group layout.

[Disabled / Controllable](./demo/disabled.tsx)

- Set `disabled` to make it unavailable.

[Combined with Button](./demo/radio-buttons.tsx)

- Combine `RadioGroup` and `RadioButton` for usage.

## Radio API

| Property   | Description                        | Type                     | Default |
| ---------- | ---------------------------------- | ------------------------ | ------- |
| checked    | Controlled checked state           | boolean                  | -       |
| defaultChecked | Initial checked state in uncontrolled mode | boolean          | false   |
| label      | Text prompt                        | string, number           | -       |
| value      | Value when used in combination     | string 、 number         | -       |
| disabled   | Whether current item is disabled   | bool                     | false   |
| onChange   | Callback when option state changes | (e: ChangeEvent) => void | -       |

## RadioGroup API

| Property   | Description                                                                                    | Type                              | Default    |
| ---------- | ---------------------------------------------------------------------------------------------- | --------------------------------- | ---------- |
| value      | Controlled selected value                                                                  | string, number                    | -          |
| defaultValue | Initial selected value in uncontrolled mode                                              | string, number                    | -          |
| size       | Button size, optional values: `small`, `large`, default not selected                           | string                            | -          |
| direction  | Layout direction, optional values: `horizontal`, `vertical`                                    | string                            | horizontal |
| shape      | `button`'s shape property, displays rounded corners                                            | string                            | -          |
| theme      | `button`'s theme property                                                                      | string                            | -          |
| onChange   | Triggered when option state changes, returns currently selected item                           | (value: string \| number) => void | -          |
| options    | Can specify child `radio` items                                                                | RadioOption[]                     | -          |
| type       | If using `options` to render children and children are `button`, need to specify `type=button` | string                            | -          |
