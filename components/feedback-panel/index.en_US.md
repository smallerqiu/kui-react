# FeedbackPanel

Presents feedback, supporting details, and follow-up actions.

[Basic](./demo/basic.tsx?show=vertical)

[Kinds](./demo/kinds.tsx?show=vertical)

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| kind | Feedback kind | positive,negative,caution,neutral | neutral |
| heading | Heading | ReactNode | - |
| description | Description | ReactNode | - |
| symbol | Custom icon or content | IconType[],ReactNode | - |
| compact | Compact layout | boolean | false |
| actions | Action content | ReactNode | - |
| children | Detail content | ReactNode | - |
