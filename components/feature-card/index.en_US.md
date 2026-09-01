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

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| icon | Icon | IconType[] | - |
| title | Title | ReactNode | - |
| desc | Description | ReactNode | - |
| bordered | Whether to show a border | boolean | false |
| theme | Appearance theme | ThemeType | fill |
| shape | Card shape | ShapeType | round |
| size | Card size | small\|medium\|large | medium |
| direction | Content direction | horizontal\|vertical | horizontal |
| clickable | Enable interaction | boolean | false |
| disabled | Disable interaction | boolean | false |
| color | Icon accent color | string | - |
| iconBackground | Icon container background | string | auto |

## Events

| Event | Description | Callback |
| --- | --- | --- |
| onClick | Emitted when clicked | (event: MouseEvent) => void |
