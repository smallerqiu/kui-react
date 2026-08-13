# Carousel

A set of rotating/carousel areas.

## When to Use

- When there is a set of peer content.
- When content space is insufficient, it can be accommodated in a carousel form for rotational display.
- Often used for a set of image or card carousels.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage. You can specify the initial value with `defaultValue`.

[Vertical](./demo/vertical.tsx)

- Enable vertical mode by setting `vertical`. In this mode, left and right arrows are hidden.

[Autoplay](./demo/autoplay.tsx)

- Enable timed autoplay by setting `autoplay`. Use `delay` to set the interval. The default is `3000` milliseconds.

## API

| Property   | Description                                                                    | Type    | Default |
| ---------- | ------------------------------------------------------------------------------ | ------- | ------- |
| value      | Controlled slide index, starting from 0                                      | number  | -       |
| defaultValue | Initial slide index in uncontrolled mode                                   | number  | 0       |
| loop       | Whether to enable loop                                                         | boolean    | true    |
| vertical   | Whether to display in vertical mode                                            | boolean    | false   |
| autoplay   | Whether to auto-switch                                                         | boolean    | false   |
| delay      | The time interval for auto-switching, in milliseconds                          | number  | 3000    |
| height     | The height of the slide                                                        | number  | 256(px) |
| dots       | Whether to show the dots at the bottom of the gallery                          | boolean | true    |
| onChange   | Called when the active slide changes                                           | (index: number) => void | - |
