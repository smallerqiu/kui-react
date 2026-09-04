# InputTag

Turns continuous input into an editable tag collection.

## Examples

[Basic](./demo/basic.tsx)

- Press Enter to add and Backspace to remove tags.

[Controlled](./demo/controlled.tsx)

- Manage the tag collection with `value` and `onChange`.

[Separators](./demo/separators.tsx)

- Commit tags with comma or semicolon.

[Limit](./demo/limit.tsx)

- Use `max` to limit total tags and `maxTagCount` to limit visible tags.

[Size](./demo/size.tsx?show=vertical)

- Different sizes.

[Appearance](./demo/appearance.tsx)

- Shows theme, shape, and disabled states.

## InputTag API

| Property        | Description                                        | Type                           | Default |
| --------------- | -------------------------------------------------- | ------------------------------ | ------- |
| value           | Controlled tags                                    | string[]                       | -       |
| defaultValue    | Initial tags                                       | string[]                       | []      |
| placeholder     | Placeholder                                        | string                         | -       |
| disabled        | Disabled state                                     | boolean                        | false   |
| readOnly        | Read-only while remaining focusable                | boolean                        | false   |
| clearable       | Whether to show the clear button                   | boolean                        | false   |
| block           | Fill the parent width                              | boolean                        | false   |
| size            | Size                                               | small\|medium\|large           | medium  |
| theme           | Theme                                              | fill\|outline\|plain           | fill    |
| shape           | Shape                                              | circle\|square\|round\|default | default |
| allowDuplicates | Allow duplicate tags                               | boolean                        | false   |
| max             | Maximum tag count                                  | number                         | -       |
| maxTagCount     | Maximum visible tags; the remainder is shown as +N | number                         | -       |
| separators      | Commit keys                                        | string[]                       | [',']   |
| onChange        | Tags change                                        | function                       | -       |
| onAdd           | Tag added                                          | function                       | -       |
| onRemove        | Tag removed                                        | function                       | -       |
| onClear         | Tags cleared                                       | function                       | -       |
