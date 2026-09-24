# Alert

Warning prompts to display information that needs attention.

## When to Use

- When a page needs to display warning information to the user.
- A non-overlay static display form, always displayed, does not disappear automatically, users can click to close.

## Examples

[Basic Usage](./demo/basic.tsx)

- Control the display type via `type`.

[Icon](./demo/icon.tsx)

- Use `showIcon` to control whether the icon is displayed.

[Closable](./demo/close.tsx)

- Use `closable` to control whether the close button is displayed, with smooth and natural closing animation.

[Custom Icon](./demo/custom-icon.tsx)

- Use `showIcon` to control whether the icon is displayed.

## Closing

Clicking the close button triggers `onClose`. After the exit animation, the content is removed and `onAfterClose` fires.

To unmount the entire component after closing, update the parent state in `onAfterClose` and use conditional rendering.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | Alert type, optional values are `success`, `info`, `warning`, `error` or not set | `"info" \| "success" \| "warning" \| "error"` | warning |
| message | Alert content | `React.ReactNode` | - |
| description | Auxiliary text introduction for the alert | `React.ReactNode` | - |
| showIcon | Whether to show the icon | `boolean` | false |
| closable | Whether to show the close button | `boolean` | false |
| bordered | Whether to display the border | `boolean` | false |
| theme | Theme | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | - |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | - |
| onClose | Triggered when the close button is clicked | `((e: React.MouseEvent<HTMLElement>) => void)` | - |
| onAfterClose | Triggered after the exit animation | `(() => void)` | - |
| icon | Custom icon | `IconType[]` | - |
