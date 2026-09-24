# FeedbackPanel

Presents feedback, supporting details, and follow-up actions.

[Basic](./demo/basic.tsx?show=vertical)

- Basic usage of FeedbackPanel

[Kinds](./demo/kinds.tsx?show=vertical)

- Demonstrate different feedback kinds

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| kind | Feedback kind | `"positive" \| "negative" \| "caution" \| "neutral"` | neutral |
| heading | Heading | `ReactNode` | - |
| description | Description | `ReactNode` | - |
| symbol | Custom icon or content | `ReactNode \| IconType[]` | - |
| compact | Compact layout | `boolean` | false |
| actions | Action content | `ReactNode` | - |
| theme | Appearance | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | outline |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | round |
| children | Detail content | ReactNode | - |
