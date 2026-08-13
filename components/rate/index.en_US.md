# Rate

Rating component.

## When to Use

- Display evaluations.
- Quickly rate things.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage.

[Text Display / Allow Clear](./demo/tips.tsx)

- Add text display to the rating component.

[Other Characters](./demo/character.tsx)

- Stars can be replaced with other characters, such as letters, numbers, font icons, or even Chinese characters.

## Rate API

| Property          | Description                                 | Type                    | Default |
| ----------------- | ------------------------------------------- | ----------------------- | ------- |
| value             | Current controlled value                    | number                  | -       |
| defaultValue      | Initial value in uncontrolled mode          | number                  | 0       |
| allowClear        | Whether to allow clearing by clicking again | bool                    | false   |
| allowHalf         | Whether to allow half selection             | bool                    | false   |
| showScore         | Whether to show score                       | bool                    | false   |
| character         | Custom character                            | string                  | -       |
| count             | Total number of stars                       | number                  | -       |
| icon              | Custom display icon                         | Icon                    | -       |
| size              | Icon size                                   | number                  | -       |
| color             | Icon color                                  | string                  | -       |
| disabled          | Read-only, cannot interact                  | string                  | -       |
| tooltips          | Custom prompt information for each item     | string[]                | -       |
| onChange          | Callback when selecting                     | (value: number) => void | -       |
| symbolReverseFill | Symbol Inverted Fill Color                  | bool                    | false   |
| strokeWidth       | Symbol Border Unit                          | number                  | 1       |
