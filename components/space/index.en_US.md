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

[Alignment](./demo/align.tsx?show=vertical)

- Set the alignment mode.

[Custom Size](./demo/custom-size.tsx?show=vertical)

- Customize spacing size.

[Set Wrapping](./demo/wrap.tsx)

- Wrapping is disabled by default. Set `wrap` explicitly to enable automatic wrapping.

[Divider](./demo/split.tsx)

- Divider between adjacent components.

[Compact Layout Group](./demo/compact.tsx?show=vertical)

- Use `compact` to tightly connect form components and merge borders.

[Button Compact Layout](./demo/compact-button.tsx?show=vertical)

- Example of compactly arranged Button components.

[Vertical Compact Layout](./demo/compact-vertical.tsx)

- Vertical compact layout, currently only supporting Button combinations.

## Space API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| align | Alignment method | `"center" \| "end" \| "start" \| "baseline"` | center |
| vertical | Whether to display vertically | `boolean` | false |
| direction | Layout direction; takes priority over `vertical` | `"horizontal" \| "vertical"` | - |
| size | Spacing; array values are horizontal and vertical gaps | `number \| SizeType \| (string \| number)[]` | - |
| wrap | Whether to wrap | `boolean` | false |
| split | Content rendered between adjacent children | `React.ReactNode` | - |
| compact | Whether to use compact mode | `boolean` | false |
| block | Whether to fill the parent width | `boolean` | false |
