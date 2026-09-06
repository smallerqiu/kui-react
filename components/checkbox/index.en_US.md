# Checkbox

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

## API

| Property       | Description                                                | Type                              | Default |
| -------------- | ---------------------------------------------------------- | --------------------------------- | ------- |
| checked        | Controlled checked state                                   | boolean                           | -       |
| defaultChecked | Initial checked state in uncontrolled mode                 | boolean                           | false   |
| label          | Content to display                                         | ReactNode                         | -       |
| value          | Value represented in a group                               | unknown                           | -       |
| disabled       | Whether the current item is disabled                       | boolean                           | false   |
| readOnly       | Whether the current item is read-only                      | boolean                           | false   |
| indeterminate  | Combined auxiliary option controls the indeterminate state | boolean                           | false   |
| theme          | Component theme                                            | ThemeType                         | fill    |
| valueType      | Standalone output value type                               | 'string' \| 'number' \| 'boolean' | boolean |
| onChange       | Callback when the option state changes                     | (e: ChangeEvent) => void          | -       |

## CheckboxGroup API

| Property     | Description                                                                    | Type                                  | Default    |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------- | ---------- |
| value        | Controlled selected values                                                     | (string \| number)[]                  | -          |
| defaultValue | Initial selected values in uncontrolled mode                                   | (string \| number)[]                  | []         |
| disabled     | Whether the component is disabled                                              | boolean                               | false      |
| readOnly     | Whether the component is read-only                                             | boolean                               | false      |
| onChange     | Triggered when the option state changes, returns the currently selected values | (value: (string \| number)[]) => void | -          |
| direction    | Layout direction                                                               | 'horizontal' \| 'vertical'            | horizontal |
| options      | Can specify child `checkbox` items                                             | CheckboxOption[]                      | -          |
| theme        | Component theme                                                                | ThemeType                             | fill       |
| size         | Checkbox size                                                                  | SizeType                              | -          |

Each item in `options` also supports `disabled` and `readOnly`.
