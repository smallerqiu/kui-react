# Avatar

Used to represent users or things, supports image, icon, or character display.

## Examples

[Basic](./demo/basic.tsx)

- Avatars support three sizes and two shapes.

[Types](./demo/types.tsx)

- Three types are supported: Image, Icon, and Text. Icon and Text avatars support custom icon color and background color.

[With logo and grouping](./demo/badge-group.tsx)

- Typically used for message prompts and avatar combination display.

[Auto Font Size Adjustment](./demo/change.tsx)

- For text avatars, when the string is long, the font size automatically adjusts based on the avatar width.

## API

| Property | Description                                     | Type                          | Default |
| -------- | ----------------------------------------------- | ----------------------------- | ------- |
| icon     | Set the icon type for the avatar                | string,number                 | 400     |
| shape    | Specify the shape of the avatar: circle, square | string                        | circle  |
| size     | Set the size of the avatar                      | large, small, default, number | default |
| src      | Resource address for image avatar               | string                        | -       |

## AvatarGroup API

| Property | Description                         | Type   | Default |
| -------- | ----------------------------------- | ------ | ------- |
| maxCount | Maximum number of images to display | NUmber | -       |
