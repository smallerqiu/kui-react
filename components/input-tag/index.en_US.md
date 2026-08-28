# InputTag

Turns continuous input into an editable tag collection.

## Examples

[Basic](./demo/basic.tsx)

[Controlled](./demo/controlled.tsx)
[Separators](./demo/separators.tsx)
[Limit](./demo/limit.tsx)
[Size](./demo/size.tsx?show=vertical)

- Different sizes.
[Appearance](./demo/appearance.tsx)

## InputTag API

| Property        | Description                                        | Type                           | Default |
| --------------- | -------------------------------------------------- | ------------------------------ | ------- |
| value           | Controlled tags                                    | string[]                       | -       |
| defaultValue    | Initial tags                                       | string[]                       | []      |
| placeholder     | Placeholder                                        | string                         | -       |
| disabled        | Disabled state                                     | boolean                        | false   |
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
