# Image

Previewable images.

## When to Use

- Use when you need to display images.
- Display loading or error handling when loading large images.

## Examples

[Basic Usage](./demo/basic.tsx)

- Simple display.

[Error Handling](./demo/errors.tsx)

- Show an image placeholder on load failure.

[Photo Wall](./demo/group.tsx)

- Click the left/right buttons to preview multiple images.

[Extension](./demo/extra.tsx)

- Can extend custom tools and panels.

## Image API

| Property    | Description                                            | Type                    | Default |
| ----------- | ------------------------------------------------------ | ----------------------- | ------- |
| width       | The width of the component                             | [string, number]        | -       |
| height      | The height of the component                            | [string, number]        | -       |
| src         | The default address of the image to display            | string                  | -       |
| alt         | Alternative text for the image                         | string                  | -       |
| data        | Preview image list                                     | string[]                | -       |
| type        | Make Preview display video tag, values ['img','media'] | string                  | img     |
| origin      | The large image displayed when clicking the image      | string                  | -       |
| placeholder | The placeholder displayed when the image fails to load | string                  | -       |
| imgStyle    | The style of the image                                 | Object                  | -       |
| showPanel   | Whether to display the extension panel by default      | boolean                    | false   |
| onClose     | Close trigger event                                    | () => void              | -       |
| onSwitch    | Multi-image switch callback                            | (index: number) => void | -       |
| theme       | Theme                                                  | ThemeType               | -       |
| shape       | Shape                                                  | ShapeType               | -       |
| tools       | Custom toolbar buttons                                 | ReactNode               | -       |
| panel       | Custom extension panel                                 | ReactNode                    | -       |

## ImageGroup API

| Property | Description | Type     | Default |
| -------- | ----------- | -------- | ------- |
| data     | Image data  | string[] | -       |
