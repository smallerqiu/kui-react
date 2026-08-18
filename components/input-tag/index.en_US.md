# InputTag

Turns continuous input into an editable tag collection.

## Examples

[Basic](./demo/basic.tsx)

[Controlled](./demo/controlled.tsx)
[Separators](./demo/separators.tsx)
[Limit](./demo/limit.tsx)
[Appearance](./demo/appearance.tsx)

## InputTag API

| Property        | Description          | Type                           | Default |
| --------------- | -------------------- | ------------------------------ | ------- |
| value           | Controlled tags      | string[]                       | -       |
| defaultValue    | Initial tags         | string[]                       | []      |
| placeholder     | Placeholder          | string                         | -       |
| disabled        | Disabled state       | boolean                        | false   |
| size            | Size                 | small\|medium\|large           | medium  |
| theme           | Theme                | fill\|outline\|plain           | fill    |
| shape           | Shape                | circle\|square\|round\|default | default |
| allowDuplicates | Allow duplicate tags | boolean                        | false   |
| max             | Maximum tag count    | number                         | -       |
| separators      | Commit keys          | string[]                       | [',']   |
| onChange        | Tags change          | function                       | -       |
| onAdd           | Tag added            | function                       | -       |
| onRemove        | Tag removed          | function                       | -       |
