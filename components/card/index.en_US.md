# Card

Universal card container.

## When to Use

The most basic card container, can carry text, lists, images, paragraphs, often used in backend overview pages.

## Examples

[Basic Usage](./demo/basic.tsx)

- Set the title and icon via `title` and `icon`.

[Border](./demo/border.tsx)

- Use `bordered` to control whether the border is displayed.

[Border and Title](./demo/notitle.tsx)

- Control the border with the `bordered` property and the title with the `title` property.

[Cover](./demo/cover.tsx)

- Use `cover` and `CardMeta` to display a card with cover content.

| Property | Description                        | Type         | Default |
| -------- | ---------------------------------- | ------------ | ------- |
| title    | Card title                         | ReactNode    | -       |
| icon     | Icon for the card title            | IconType[]   | -       |
| bordered | Whether the card displays a border | boolean         | false   |
| extra    | Card title extension               | ReactNode    | -       |
| cover    | Card cover                         | string,ReactNode | -    |

### CardMeta

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| avatar | Avatar | string,ReactNode | - |
| title | Title | ReactNode | - |
| description | Description | ReactNode | - |
