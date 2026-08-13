# Popconfirm

Click an element to pop up a bubble-style confirmation box.

## When to Use

When an operation on a target element requires further user confirmation, a floating layer prompt appears near the target element to ask the user.

Compared to the full-screen centered modal dialog box popped up by 'confirm', the interaction form is lighter.

## Examples

[Basic Usage](./demo/basic.tsx)

- The simplest usage.

[Internationalization](./demo/local.tsx)

- Use `okText` and `cancelText` to customize button text.

[Position](./demo/placement.tsx)

- Control the direction via `placement`, with twelve available positions.

## API

| Property   | Description                                                                                                                                                                                           | Type          | Default |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------- |
| title      | Displayed title                                                                                                                                                                                       | ReactNode     | -       |
| placement  | Position where the tooltip appears, optional values: `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right`, `left`, `left-top`, `left-bottom`, `right`, `right-top`, `right-bottom` | string        | top     |
| width      | Display width, defaults to content area size                                                                                                                                                          | string        | -       |
| okText     | OK button text                                                                                                                                                                                        | string        | OK      |
| cancelText | Cancel button text                                                                                                                                                                                    | string        | Cancel  |
| open       | Controlled visibility                                                                                                                                                                                 | boolean       | -       |
| show       | Deprecated; use `open` instead                                                                                                                                                                        | boolean       | -       |
| defaultOpen | Initial visibility in uncontrolled mode                                                                                                                                                             | boolean       | false   |
| dark       | Whether to display dark theme                                                                                                                                                                         | boolean          | false   |
| onCancel   | Callback when cancel is clicked                                                                                                                                                                       | () => void    | -       |
| onOk       | Callback when OK is clicked                                                                                                                                                                           | () => void    | -       |
| onOpenChange | Called when visibility is requested to change                                                                                                                                                      | (open: boolean) => void | - |
| onShowChange | Deprecated; use `onOpenChange` instead                                                                                                                                                             | (show: boolean) => void | - |
