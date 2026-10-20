# FeatureCard

Displays a product capability or feature highlight.

[Basic](./demo/basic.tsx?show=vertical)

- Displays a basic feature card with an icon, title, and description.

[Bordered](./demo/bordered.tsx?show=vertical)

- Use `bordered` to control whether the border is displayed.

[Sizes](./demo/size.tsx?show=vertical)

- Use `size` to scale padding, icon and typography together.

[Navigation entry](./demo/interactive.tsx?show=vertical)

- Combine `direction="vertical"` and `clickable` for a keyboard-accessible feature entry.

[Appearance](./demo/appearance.tsx?show=vertical)

- Shares the `theme` appearance system with the other surface components; `solid` plates the icon and the title on the primary colour.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| icon | Icon or custom icon node | `ReactNode \| IconType[]` | - |
| title | Title | `ReactNode` | - |
| desc | Description | `ReactNode` | - |
| extra | Trailing content | `ReactNode` | - |
| bordered | Whether to show a border | `boolean` | false |
| theme | Appearance theme | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | fill |
| shape | Card shape | `"round" \| "square"` | round |
| size | Card size | `"small" \| "medium" \| "large"` | medium |
| direction | Content direction | `"horizontal" \| "vertical"` | horizontal |
| clickable | Enable interaction, keyboard control, and button semantics | `boolean` | false |
| disabled | Disable interaction | `boolean` | false |
| color | Icon accent color | `string` | primary |
| iconBackground | Icon background, generated from `color` when omitted | `string` | auto |

## Events

| Event   | Description          | Callback                    |
| ------- | -------------------- | --------------------------- |
| onClick | Emitted when clicked | (event: MouseEvent) => void |

## Theme

`theme` supports five looks — `fill`, `outline`, `plain`, `solid`, `dashed` — and is `fill` when you write nothing. `underlined` belongs to a control you type into, so a card falls back to `fill`.

`solid` fills the whole card with the primary colour, inverts its title and description, and turns the icon container into a translucent inverted chip; `bordered` draws the same edge as `theme="outline"`.
