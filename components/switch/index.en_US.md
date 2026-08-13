# Switch

Switch selector.

## When to Use

- When representing switch state/transition between two states.
- The difference from checkbox is that switching a switch directly triggers a state change, while checkbox is generally used for state marking and needs to cooperate with submission operations.

## Examples

[Basic Usage](./demo/basic.tsx)

- Use `checked` and `onChange` to control the switch state.

[Text / Icon](./demo/with-text.tsx)

- Use `trueText` and `falseText` for text, or pass custom React nodes through `checkedChildren` and `unCheckedChildren`.

[Disabled / Controllable](./demo/disabled.tsx)

- Use the `disabled` attribute to set whether the component is disabled.

[Two Sizes](./demo/size.tsx)

- `size="small"` indicates a small switch.

[Loading](./demo/loading.tsx)

- Indicates that the switch operation is still in progress.

### API

| Property           | Description                                                               | Type                     | Default |
| ------------------ | ------------------------------------------------------------------------- | ------------------------ | ------- |
| checked            | Controlled switch state                                                   | boolean                     | -       |
| defaultChecked     | Initial switch state in uncontrolled mode                                 | boolean                     | false   |
| disabled           | Disable switch                                                            | boolean                     | false   |
| loading            | Loading state; interaction is disabled while loading                      | boolean                  | false   |
| type               | Theme color, can pass `success`, `warning`, `danger`, `primary`           | string                   | -       |
| size               | Component size, when value is `small` displays small size                 | string                   | -       |
| checkedChildren    | Custom content for the checked state                            | ReactNode                     | -       |
| unCheckedChildren  | Custom content for the unchecked state                          | ReactNode                     | -       |
| trueText           | Text displayed when `checked` is `true`                                   | string                   | -       |
| falseText          | Text displayed when `checked` is `false`                                  | string                   | -       |
| valueType          | The type of output value for the unit option                              | [string,number,boolean]     | boolean    |
| onChange           | Triggered when `checked` changes, callback                                | (value: boolean) => void | -       |
