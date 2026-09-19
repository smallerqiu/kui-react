# Card

Universal card container.

## When to Use

The most basic card container, can carry text, lists, images, paragraphs, often used in backend overview pages.

## Examples

[Basic Usage](./demo/basic.tsx)

- Set the title and icon via `title` and `icon`.

[Card Size](./demo/size.tsx)

- Use `size` to adjust the spacing density of the card header and content.

[Border](./demo/border.tsx)

- Use `bordered` to control whether the border is displayed.

[Border and Title](./demo/notitle.tsx)

- Control the border with the `bordered` property and the title with the `title` property.

[Cover](./demo/cover.tsx?show=vertical)

- Use `cover` and `CardMeta` to display a card with cover content.

[Appearance and Shape](./demo/appearance.tsx)

- Use `theme`, `shape`, and `size` to adjust the card appearance.

## Card API

| Property | Description                        | Type                       | Default |
| -------- | ---------------------------------- | -------------------------- | ------- |
| title    | Card title                         | ReactNode                  | -       |
| icon     | Icon for the card title            | IconType[]                 | -       |
| bordered | Whether the card displays a border | boolean                    | false   |
| theme    | Surface theme                      | default,fill,outline,plain | fill    |
| shape    | Surface shape                      | round,square,circle        | round   |
| size     | Card size                          | small,medium,large         | medium  |
| extra    | Card title extension               | ReactNode                  | -       |
| cover    | Card cover                         | string,ReactNode           | -       |

### CardMeta

| Property    | Description | Type             | Default |
| ----------- | ----------- | ---------------- | ------- |
| avatar      | Avatar      | string,ReactNode | -       |
| title       | Title       | ReactNode        | -       |
| description | Description | ReactNode        | -       |
