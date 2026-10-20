# FeedbackPanel

Presents feedback, supporting details, and follow-up actions.

[Basic](./demo/basic.tsx?show=vertical)

- Basic usage of FeedbackPanel

[Kinds](./demo/kinds.tsx?show=vertical)

- Demonstrate different feedback kinds

[Appearance](./demo/appearance.tsx?show=vertical)

- `theme` only decides how much the panel plates itself; the 4px status stripe and the icon are content, so none of the five looks repaints them.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| kind | Feedback kind | `"positive" \| "negative" \| "caution" \| "neutral"` | neutral |
| heading | Heading | `ReactNode` | - |
| description | Description | `ReactNode` | - |
| symbol | Custom icon or content | `ReactNode \| IconType[]` | - |
| compact | Compact layout | `boolean` | false |
| actions | Action content | `ReactNode` | - |
| theme | Appearance theme | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | outline |
| shape | Shape | `"round" \| "square"` | round |
| children | Detail content | ReactNode | - |

## Theme

`theme` supports five looks — `fill`, `outline`, `plain`, `solid`, `dashed` — and is `outline` when you write nothing. `underlined` belongs to a control you type into, so a feedback panel falls back to `outline`.

`solid` fills the whole panel with the primary colour and inverts its heading, description, detail plate and icon chip; the 4px stripe beside it reports the `kind`, so it is content rather than chrome and none of the five looks repaints it.
