# Tooltip

Simple text prompt bubble box.

## When to Use

Mouse over to display prompt, disappears when moved away, bubble floating layer does not carry complex text and operations.

Can be used to replace the system default `title` prompt, providing a text explanation for a `button/text/operation`.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage. The size of the floating layer is determined by the content area.

[Position](./demo/placement.tsx)

- Control the direction via `placement`. There are twelve available positions.

[Colorful Text Tips](./demo/color.tsx)

- Multiple preset colors for text tips, used in different scenarios.

## API

| Property     | Description                                                                                                                                                                                       | Type                    | Default |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------- |
| title        | Displayed title                                                                                                                                                                                   | ReactNode               | -       |
| color        | Background color                                                                                                                                                                                  | string                  | -       |
| placement    | Position where tooltip appears, optional values: `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right`, `left`, `left-top`, `left-bottom`, `right`, `right-top`, `right-bottom` | string                  | top     |
| width        | Display width, defaults to content area size                                                                                                                                                      | string                  | -       |
| disabled     | Disabled status                                                                                                                                                                                   | boolean                 | false   |
| panelOnly    | Render only the tooltip itself, without trigger, positioning, or animation                                                                                                                        | boolean                 | false   |
| open         | Controlled visibility                                                                                                                                                                             | boolean                 | -       |
| show         | Deprecated; use `open` instead                                                                                                                                                                    | boolean                 | -       |
| defaultOpen  | Initial visibility in uncontrolled mode                                                                                                                                                           | boolean                 | false   |
| onOpenChange | Called when visibility is requested to change                                                                                                                                                     | (open: boolean) => void | -       |
| onShowChange | Deprecated; use `onOpenChange` instead                                                                                                                                                            | (show: boolean) => void | -       |
