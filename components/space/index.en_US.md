# Space

Set the spacing between components.

## When to Use

Avoid components sticking together, create uniform space.

- Suitable for horizontal spacing of inline elements.
- Can set various horizontal alignment methods.

## Examples

[Basic Usage](./demo/basic.tsx)

- Horizontal spacing between adjacent components.

[Vertical Spacing](./demo/vertical.tsx)

- Vertical spacing between adjacent components.

[Spacing Size](./demo/size.tsx)

- Preset spacing sizes: large, medium, and small. Set `size` to `large` or `medium` to set the spacing to large or medium, respectively. If `size` is not set, the spacing is small.

[Alignment](./demo/align.tsx)

- Set the alignment mode.

[Custom Size](./demo/custom-size.tsx)

- Customize spacing size.

[Set Wrapping](./demo/wrap.tsx)

- When the spacing is horizontal, you can use `wrap` to set whether to wrap automatically. The default is false.

[Divider](./demo/split.tsx)

- Divider between adjacent components.

[Compact Layout Group](./demo/compact.tsx)

- Use `compact` to tightly connect form components and merge borders.

[Button Compact Layout](./demo/compact-button.tsx)

- Example of compactly arranged Button components.

[Vertical Compact Layout](./demo/compact-vertical.tsx)

- Vertical compact layout, currently only supporting Button combinations.

## Space API

| Property | Description                                    | Type                                 | Default |
| -------- | ---------------------------------------------- | ------------------------------------ | ------- |
| align    | Alignment method                               | `start`, `end`, `center`, `baseline` | center  |
| vertical | Whether to display vertically                  | bool                                 | false   |
| size     | Spacing size                                   | `small`, `medium`, `large`, number   | small   |
| wrap     | Whether to wrap                                | bool                                 | false   |
| split    | Set split                                      | v-slot                               | -       |
| compact  | Whether to use compact mode                    | bool                                 | false   |
| block    | Option to adjust width to parent element width | bool                                 | false   |
