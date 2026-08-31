# FeedbackPanel

Presents feedback, supporting details, and follow-up actions.

[Basic](./demo/basic.tsx?show=vertical)

- Basic usage of FeedbackPanel

[Kinds](./demo/kinds.tsx?show=vertical)

- Demonstrate different feedback kinds

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| kind | Feedback kind | positive,negative,caution,neutral | neutral |
| heading | Heading | ReactNode | - |
| description | Description | ReactNode | - |
| symbol | Custom icon or content | IconType[],ReactNode | - |
| compact | Compact layout | boolean | false |
| actions | Action content | ReactNode | - |
| theme | Appearance | outline,filled,borderless | outline |
| shape | Shape | round,square | round |
| children | Detail content | ReactNode | - |
