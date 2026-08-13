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

| Property      | Description                                                   | Type                  | Default |
| ------------- | ------------------------------------------------------------- | --------------------- | ------- |
| checked       | Controlled checked state                                     | boolean               | -       |
| defaultChecked | Initial checked state in uncontrolled mode                  | boolean               | false   |
| label         | The text to display                                           | string 、 number      | -       |
| value         | The value represented when used in combination                | String、number        | -       |
| disabled      | Whether the current item is disabled                          | bool                  | false   |
| indeterminate | Combined auxiliary option controls the indeterminate state    | bool                  | false   |
| theme         | The component renders the theme, defaulting to 'fill'.        | string                | fill    |
| valueType     | The type of output value for the unit option                  | [string,number,bool]  | bool    |
| onChange      | Callback when the option state changes                        | (e:ChangeEvent)=>void | -       |

## CheckboxGroup API

| Property   | Description                                                                            | Type             | Default    |
| ---------- | -------------------------------------------------------------------------------------- | ---------------- | ---------- |
| value      | Controlled selected values                                                              | any[]            | -          |
| defaultValue | Initial selected values in uncontrolled mode                                          | any[]            | []         |
| disabled   | Whether the component is disabled                                                      | bool             | false      |
| onChange   | Triggered when the option state changes, returns the currently selected item and state | (any[])=>void    | -          |
| direction  | Layout direction, optional values `horizontal`, `vertical`                             | string           | horizontal |
| options    | Can specify child `checkbox` items                                                     | CheckboxOption[] | -          |
| size       | set the size of Checkbox                                                               | string           | -          |
