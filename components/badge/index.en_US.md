# Badge

Circular badge number in the upper right corner of an icon.

## When to Use

Generally appears in the upper right corner of notification icons or avatars, used to display the number of messages that need processing, attracting user attention through eye-catching visual forms.

## Examples

[Basic Usage](./demo/basic.tsx)

- Basic usage of `Badge`.

[Dot](./demo/dot.tsx)

- Set `dot` to display a dot.

[Max Value / Custom](./demo/max.tsx)

- Use `max-count` with `count`. In numeric mode, values exceeding the max will be hidden. If `count` is not a number, it will not be calculated.

[Standalone Usage](./demo/mark.tsx)

- Using without wrapping any element makes it standalone and allows custom styling. The badge in the top-right corner is limited to red.

[Controlled](./demo/dynamic.tsx)

- Dynamic control.

[Status Dot](./demo/status.tsx)

- A small dot used to indicate status.

[Colorful Badge](./demo/color.tsx)

- Multiple preset color styles for different scenarios. If presets do not meet your needs, you can set a specific color value.

## API

| Property | Description                                                                           | Type           | Default |
| -------- | ------------------------------------------------------------------------------------- | -------------- | ------- |
| count    | The text to display                                                                   | String，number | -       |
| color    | Badge color                                                                           | string         | -       |
| maxCount | The maximum numeric value to display. Values above this will be shown with a '+' sign | number         | 99      |
| dot      | Do not display the number, only a small red dot                                       | boolean           | false   |
| text     | If status is set, text sets the display text of the status dot                        | string         | ''      |
| status   | Set Badge as a status dot                                                             | string         | ''      |
