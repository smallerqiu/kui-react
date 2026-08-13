# QRCode

A component that converts text into QR codes, supporting custom colors and logo configuration.

## When to Use

- Use this component when you need to convert text into a scannable QR code.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage.

[Different states](./demo/status.tsx)

- Control the QR code state via the `status` prop. Supported values: `active`, `expired`, `loading`, and `scanned`.

[Custom Properties](./demo/custom.tsx)

- Customize the QR code display using various configurable properties.

[Cards and Downloads](./demo/download.tsx)

- Display the QR code within a card and enable downloading.

[Custom Status](./demo/custom-status.tsx)

- Customize the display for different status states.

## API

| Property   | Description                                                                                                                                                                                                                               | Type                                              | Default                      |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ | :--------------------------- |
| value      | Text content or redirect URL encoded in the QR code.                                                                                                                                                                                      | `string`                                          | Required                     |
| size       | Side length of the square QR code in `px`. Optimized for high-DPI displays to prevent blurring on large screens.                                                                                                                          | `number`                                          | `160`                        |
| colorDark  | Foreground color (the color of QR code modules). Supports hex, RGB, and CSS variables. Automatically re-renders when the root attribute `theme-mode` changes.                                                                             | `string`                                          | `"var(--kui-color-reverse)"` |
| colorLight | Background color. Supports hex, RGB, and CSS variables. For dark mode, use dark tones and avoid full transparency to ensure scan reliability.                                                                                             | `string`                                          | `"var(--kui-color-bg)"`      |
| bordered   | Whether to display an outer container with a subtle shadow and rounded corners for enhanced visual appeal.                                                                                                                                | `boolean`                                         | `true`                       |
| status     | Current business state of the QR code. Options:<br>• `'active'`: Scannable<br>• `'loading'`: Loading secure link<br>• `'expired'`: Expired (shows refresh button)<br>• `'scanned'`: Successfully scanned (customizable overlay via ReactNode props) | `'active' \| 'loading' \| 'expired' \| 'scanned'` | `'active'`                   |
| logo       | URL (network or Base64) of the logo displayed at the center of the QR code.                                                                                                                                                               | `string`                                          | -                            |
| logoSize   | Size of the centered logo in `px`. If omitted, defaults to 22% of the QR code size.                                                                                                                                                       | `number`                                          | -                            |
| logoRadius | Border radius of the centered logo in `px`.                                                                                                                                                                                               | `number`                                          | `4`                          |
| logoBorder | Whether to add a white protective border around the logo. Prevents visual clutter by separating QR modules from the logo.                                                                                                                 | `boolean`                                         | `true`                       |
| margin     | Quiet zone (white border) width around the QR code matrix, measured in module counts.                                                                                                                                                     | `number`                                          | `0`                          |
| errorLevel | Error correction level. Options: `'L'` (7%), `'M'` (15%), `'Q'` (25%), `'H'` (30%).<br>_Note: When embedding a logo, it is recommended to use `'M'` or `'H'` to ensure reliable scanning even if the center is obscured._                 | `'L' \| 'M' \| 'Q' \| 'H'`                        | `'M'`                        |
| loadingContent | Custom overlay content for the `loading` status. | `ReactNode` | - |
| expiredContent | Custom overlay content for the `expired` status. | `ReactNode` | - |
| scannedContent | Custom overlay content for the `scanned` status. | `ReactNode` | - |
| onRefresh | Called when the `expired` status overlay is clicked. | `() => void` | - |

### Ref

| Method | Description | Type |
| :--- | :--- | :--- |
| download | Downloads the current QR code as a PNG; an optional filename may be supplied. | `(fileName?: string) => void` |
