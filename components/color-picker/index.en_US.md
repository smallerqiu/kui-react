# ColorPicker

Freely output colors.

## When to Use

- When custom colors are needed.

## Examples

[Basic Usage](./demo/basic.tsx)

- Click to open the color panel.

[Size / Disabled](./demo/size.tsx)

- `small` for small size, `large` for large size.

[Custom Trigger](./demo/custom-trigger.tsx)

- Customize the trigger for the color panel.

[Popup Placement](./demo/placement.tsx)

- Supports 6 popup placements. If there is not enough space above, the panel will automatically appear below.

## API

| Property      | Description                                              | Type                        | Default          |
| ------------- | -------------------------------------------------------- | --------------------------- | ---------------- |
| value         | Controlled color value                                   | `string`                    | -                |
| defaultValue  | Initial uncontrolled color value                         | `string`                    | `#000000ff`      |
| open          | Controlled popup visibility                              | `boolean`                   | -                |
| defaultOpen   | Initial popup visibility in uncontrolled mode            | `boolean`                   | `false`          |
| mode          | Color output mode: `hex`, `rgb`, or `hsl`                | `ColorMode`                 | `hex`            |
| presets       | Custom color palette                                     | `string[]`                  | Built-in palette |
| disabledAlpha | Whether alpha editing is disabled                        | `boolean`                   | `false`          |
| disabled      | Whether the picker is disabled                           | `boolean`                   | `false`          |
| readOnly      | Whether the picker is read-only                          | `boolean`                   | `false`          |
| trigger       | Popup trigger mode                                       | `hover \| click`            | `click`          |
| showText      | Whether to display the color text                        | `boolean`                   | `false`          |
| size          | Picker size                                              | `SizeType`                  | -                |
| placement     | Popup placement                                          | `DropPlacementsType`        | `bottom-left`    |
| children      | Custom trigger element                                   | `ReactNode`                 | -                |
| panelOnly     | Render only the color panel, without a trigger or portal | `boolean`                   | false            |
| onUpdateMode  | Called when the color mode changes                       | `(mode: ColorMode) => void` | -                |
| onChange      | Called when the color value changes                      | `(color: string) => void`   | -                |
| onOpenChange  | Called when the popup opens or closes                    | `(open: boolean) => void`   | -                |
